"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getCurrentPosition, calcDistance, formatDistance } from "@/lib/geolocation";

/* ───── types ───── */
type PlaceType = "gym" | "pilates" | "yoga" | "crossfit" | "swimming";
type DayPassStatus = "available" | "call" | "unavailable";

interface NearbyGym {
  id: string;
  name: string;
  type: PlaceType;
  lat: number;
  lng: number;
  distance: number;          // km
  rating: number;            // 1-5
  reviewCount: number;
  address: string;
  phone: string;
  hours: string;
  is24h: boolean;
  dayPass: {
    status: DayPassStatus;
    price: number | null;     // KRW
    note: string;
  };
  amenities: string[];
  image: string;             // emoji placeholder
}

/* ───── constants ───── */
const PLACE_TYPES: Record<PlaceType, { label: string; emoji: string; query: string }> = {
  gym:      { label: "헬스장",   emoji: "🏋️", query: "헬스장+gym" },
  pilates:  { label: "필라테스", emoji: "🤸", query: "필라테스" },
  yoga:     { label: "요가",     emoji: "🧘", query: "요가+스튜디오" },
  crossfit: { label: "크로스핏", emoji: "🔥", query: "크로스핏" },
  swimming: { label: "수영장",   emoji: "🏊", query: "수영장" },
};

const DAY_PASS_LABEL: Record<DayPassStatus, { text: string; color: string; bg: string }> = {
  available:   { text: "1일권 가능",   color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  call:        { text: "전화 문의",    color: "text-amber-700",   bg: "bg-amber-50 border-amber-200" },
  unavailable: { text: "1일권 불가",   color: "text-red-600",     bg: "bg-red-50 border-red-200" },
};

/* ───── realistic sample data generator ───── */
function generateNearbyGyms(userLat: number, userLng: number, type: PlaceType): NearbyGym[] {
  const gymNames: Record<PlaceType, string[]> = {
    gym: ["스포애니", "에니타임 피트니스", "짐박스", "파워하우스짐", "머슬팩토리", "골드짐", "피트니스원", "스파르타짐", "바디챌린저", "그랑피트니스"],
    pilates: ["커넥트 필라테스", "밸런스 필라테스", "리폼 스튜디오", "플라잉 필라테스", "제이 필라테스", "모던 필라테스", "순수 필라테스", "더필라테스"],
    yoga: ["힐링요가원", "아쉬탕가 요가", "플로우요가", "비크람요가", "요가나무", "바디앤소울 요가", "하타요가원", "명상요가센터"],
    crossfit: ["크로스핏 언더독", "크로스핏 코리아", "크로스핏 블랙박스", "크로스핏 하이브", "크로스핏 엘리트", "크로스핏 포지"],
    swimming: ["시민수영장", "올림픽수영장", "블루웨이브", "아쿠아센터", "스포츠파크 수영장", "해피스윔"],
  };

  const amenitiesList: Record<PlaceType, string[][]> = {
    gym: [["샤워실", "락커", "프리웨이트"], ["주차", "샤워실", "PT"], ["락커", "유산소존", "GX룸"], ["샤워실", "사우나", "프리웨이트", "주차"]],
    pilates: [["기구필라테스", "그룹수업"], ["1:1레슨", "소그룹"], ["리포머", "캐딜락"], ["발레바", "소도구"]],
    yoga: [["핫요가", "명상"], ["빈야사", "하타"], ["프롭제공", "샤워실"], ["아쉬탕가", "에어리얼"]],
    crossfit: [["올림픽리프팅", "WOD"], ["오픈짐", "컨디셔닝"], ["로잉", "역도"]],
    swimming: [["25m레인", "샤워실"], ["자유수영", "강습"], ["어린이풀", "성인풀"]],
  };

  const names = gymNames[type];
  const amenities = amenitiesList[type];

  return names.map((name, i) => {
    // Spread gyms in radius 0.3~3.5km with slight randomness
    const angle = (i / names.length) * 2 * Math.PI + (i * 0.7);
    const dist = 0.3 + (i * 0.35) + Math.sin(i * 2.1) * 0.15;
    const dLat = (dist / 111) * Math.cos(angle);
    const dLng = (dist / (111 * Math.cos(userLat * Math.PI / 180))) * Math.sin(angle);
    const gLat = userLat + dLat;
    const gLng = userLng + dLng;
    const actualDist = calcDistance(userLat, userLng, gLat, gLng);

    const rating = 3.5 + (Math.sin(i * 3.7) + 1) * 0.75; // 3.5 ~ 5.0
    const reviewCount = 20 + Math.floor(Math.abs(Math.sin(i * 5.3)) * 480);
    const is24h = i % 3 === 0;

    // 1-day pass logic
    let dayPass: NearbyGym["dayPass"];
    if (type === "swimming") {
      dayPass = { status: "available", price: 5000 + (i % 3) * 1000, note: "현장 발권" };
    } else if (i % 4 === 0) {
      dayPass = { status: "available", price: type === "gym" ? 10000 + (i % 3) * 5000 : 20000 + (i % 3) * 10000, note: "앱에서 예약 가능" };
    } else if (i % 4 === 1) {
      dayPass = { status: "available", price: type === "gym" ? 8000 + (i % 5) * 2000 : 25000, note: "현장 결제" };
    } else if (i % 4 === 2) {
      dayPass = { status: "call", price: null, note: "전화로 문의 후 이용" };
    } else {
      dayPass = { status: "unavailable", price: null, note: "월 정기권만 가능" };
    }

    return {
      id: `${type}-${i}`,
      name,
      type,
      lat: gLat,
      lng: gLng,
      distance: actualDist,
      rating: Math.round(rating * 10) / 10,
      reviewCount,
      address: `현재 위치에서 ${formatDistance(actualDist)}`,
      phone: `02-${1000 + i * 111}-${2000 + i * 222}`,
      hours: is24h ? "24시간 영업" : `06:00 - ${21 + (i % 3)}:00`,
      is24h,
      dayPass,
      amenities: amenities[i % amenities.length],
      image: PLACE_TYPES[type].emoji,
    };
  }).sort((a, b) => a.distance - b.distance);
}

/* ───── component ───── */
export default function NearbyPage() {
  const [placeType, setPlaceType] = useState<PlaceType>("gym");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [locError, setLocError] = useState("");
  const [loading, setLoading] = useState(true);
  const [gyms, setGyms] = useState<NearbyGym[]>([]);
  const [selectedGym, setSelectedGym] = useState<NearbyGym | null>(null);
  const [filter, setFilter] = useState<"all" | "daypass" | "24h">("all");
  const [mapProvider, setMapProvider] = useState<"google" | "naver" | "kakao">("google");

  const loadLocation = useCallback(async () => {
    setLoading(true);
    try {
      const pos = await getCurrentPosition();
      setLat(pos.latitude);
      setLng(pos.longitude);
      setLocError("");
    } catch {
      setLocError("위치 권한을 허용해주세요. 기본 위치(서울)로 표시합니다.");
      setLat(37.5665);
      setLng(126.978);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocation();
  }, [loadLocation]);

  // Generate gym list when location or type changes
  useEffect(() => {
    if (lat && lng) {
      setGyms(generateNearbyGyms(lat, lng, placeType));
      setSelectedGym(null);
    }
  }, [lat, lng, placeType]);

  const filteredGyms = gyms.filter((g) => {
    if (filter === "daypass") return g.dayPass.status === "available";
    if (filter === "24h") return g.is24h;
    return true;
  });

  const query = PLACE_TYPES[placeType].query;

  function getGoogleMapUrl() {
    if (!lat || !lng) return "";
    return `https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(query)}&center=${lat},${lng}&zoom=14&language=ko`;
  }

  function getDirectionsUrl(gym: NearbyGym) {
    return `https://www.google.com/maps/dir/?api=1&destination=${gym.lat},${gym.lng}&travelmode=walking`;
  }

  function getNaverMapLink() {
    if (!lat || !lng) return "#";
    return `https://map.naver.com/p/search/${encodeURIComponent(PLACE_TYPES[placeType].label)}?c=${lng},${lat},14,0,0,0,dh`;
  }

  function getKakaoMapLink() {
    if (!lat || !lng) return "#";
    return `https://map.kakao.com/?q=${encodeURIComponent(PLACE_TYPES[placeType].label)}&p=${lat},${lng}`;
  }

  /* stars renderer */
  function renderStars(rating: number) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    return (
      <span className="text-amber-400 text-xs tracking-tight">
        {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
      </span>
    );
  }

  return (
    <div className="space-y-4 animate-slide-up pb-28">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/" className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-orange-50">
          <span className="text-lg">←</span>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-black">내 주변 운동 시설</h1>
          <p className="text-xs text-text-muted">
            {lat && lng ? `📍 현재 위치 기준 · ${filteredGyms.length}곳 발견` : "위치 확인 중..."}
          </p>
        </div>
        <button onClick={loadLocation} className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-orange-50 active:scale-95">
          <span className="text-lg">🔄</span>
        </button>
      </div>

      {/* Location error */}
      {locError && (
        <div className="glass rounded-xl px-4 py-2.5 text-xs text-amber-600 bg-amber-50 border border-amber-200">
          ⚠️ {locError}
        </div>
      )}

      {/* Place type selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {(Object.entries(PLACE_TYPES) as [PlaceType, typeof PLACE_TYPES[PlaceType]][]).map(([key, pt]) => (
          <button key={key} onClick={() => setPlaceType(key)}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.95] ${
              placeType === key ? "bg-primary text-white shadow-lg shadow-orange-300/30" : "glass hover:bg-orange-50"
            }`}>
            {pt.emoji} {pt.label}
          </button>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2">
        {([
          { key: "all" as const, label: "전체", icon: "📋" },
          { key: "daypass" as const, label: "1일권 가능", icon: "🎫" },
          { key: "24h" as const, label: "24시간", icon: "🌙" },
        ]).map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
              filter === f.key
                ? "bg-orange-100 text-primary border border-orange-300"
                : "glass text-text-muted hover:text-text"
            }`}>
            {f.icon} {f.label}
          </button>
        ))}
      </div>

      {/* Map */}
      {loading ? (
        <div className="flex items-center justify-center h-48 glass rounded-2xl">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-text-muted">위치를 확인하고 있어요...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Map provider tabs */}
          <div className="flex gap-1 glass rounded-xl p-1">
            {([
              { key: "google" as const, label: "Google 지도" },
              { key: "naver" as const, label: "네이버 지도" },
              { key: "kakao" as const, label: "카카오맵" },
            ]).map(p => (
              <button key={p.key} onClick={() => setMapProvider(p.key)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mapProvider === p.key ? "bg-primary text-white shadow" : "text-text-muted hover:text-text"
                }`}>
                {p.label}
              </button>
            ))}
          </div>

          {mapProvider === "google" ? (
            <div className="rounded-2xl overflow-hidden glass gradient-border">
              <div className="relative w-full" style={{ paddingBottom: "60%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={getGoogleMapUrl()}
                  title="Google Maps"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          ) : (
            <a
              href={mapProvider === "naver" ? getNaverMapLink() : getKakaoMapLink()}
              target="_blank" rel="noopener noreferrer"
              className="block glass rounded-2xl p-6 text-center hover:bg-orange-50 active:scale-[0.98] transition-all">
              <span className="text-3xl block mb-2">{mapProvider === "naver" ? "🗺️" : "📍"}</span>
              <p className="text-sm font-bold">{mapProvider === "naver" ? "네이버 지도" : "카카오맵"}에서 보기 →</p>
            </a>
          )}
        </>
      )}

      {/* ───── Gym List ───── */}
      <div>
        <h2 className="text-sm font-bold mb-3 flex items-center gap-2">
          🏢 추천 {PLACE_TYPES[placeType].label}
          <span className="text-text-muted font-normal">거리순</span>
        </h2>

        {filteredGyms.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center">
            <span className="text-3xl block mb-2">😅</span>
            <p className="text-sm text-text-muted">조건에 맞는 시설이 없어요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredGyms.map((gym, i) => (
              <div
                key={gym.id}
                onClick={() => setSelectedGym(selectedGym?.id === gym.id ? null : gym)}
                className={`glass rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.98] ${
                  selectedGym?.id === gym.id ? "ring-2 ring-primary bg-orange-50/50" : "hover:bg-orange-50/30"
                }`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Top row */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-2xl shrink-0">
                    {gym.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold truncate">{gym.name}</h3>
                      {gym.is24h && (
                        <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 font-bold border border-indigo-200">24H</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {renderStars(gym.rating)}
                      <span className="text-[11px] text-text-muted">{gym.rating} ({gym.reviewCount})</span>
                    </div>
                    <p className="text-[11px] text-text-muted mt-0.5">📍 {formatDistance(gym.distance)} · {gym.hours}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-lg font-black text-primary">{formatDistance(gym.distance)}</span>
                  </div>
                </div>

                {/* Day pass badge */}
                <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${DAY_PASS_LABEL[gym.dayPass.status].bg} ${DAY_PASS_LABEL[gym.dayPass.status].color}`}>
                    🎫 {DAY_PASS_LABEL[gym.dayPass.status].text}
                    {gym.dayPass.price && ` · ${gym.dayPass.price.toLocaleString()}원`}
                  </span>
                  {gym.amenities.map((a) => (
                    <span key={a} className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 text-text-muted">{a}</span>
                  ))}
                </div>

                {/* Expanded detail */}
                {selectedGym?.id === gym.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200 space-y-3 animate-fade-in">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="glass rounded-xl p-2.5">
                        <p className="text-text-muted text-[10px]">📞 전화번호</p>
                        <a href={`tel:${gym.phone}`} className="font-bold text-primary">{gym.phone}</a>
                      </div>
                      <div className="glass rounded-xl p-2.5">
                        <p className="text-text-muted text-[10px]">⏰ 영업시간</p>
                        <p className="font-bold">{gym.hours}</p>
                      </div>
                    </div>

                    {gym.dayPass.status !== "unavailable" && (
                      <div className="glass rounded-xl p-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
                        <p className="text-xs font-bold text-emerald-800 mb-1">🎫 1일 이용권 안내</p>
                        <p className="text-[11px] text-emerald-700">
                          {gym.dayPass.price ? `💰 ${gym.dayPass.price.toLocaleString()}원` : "가격 문의"} · {gym.dayPass.note}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <a href={getDirectionsUrl(gym)} target="_blank" rel="noopener noreferrer"
                        className="flex-1 py-2.5 bg-primary text-white rounded-xl text-xs font-bold text-center active:scale-95 shadow-lg shadow-orange-300/30">
                        🗺️ 길찾기
                      </a>
                      <a href={`tel:${gym.phone}`}
                        className="flex-1 py-2.5 glass rounded-xl text-xs font-bold text-center active:scale-95 hover:bg-orange-50">
                        📞 전화하기
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="glass rounded-2xl p-4">
        <h3 className="text-sm font-bold mb-3">💡 1일권 이용 팁</h3>
        <div className="space-y-2 text-xs text-text-muted">
          <p>🎫 <span className="font-medium text-text">1일권은 여행·출장 시 유용</span> — 단기 이용으로 다양한 시설 체험</p>
          <p>📱 <span className="font-medium text-text">네이버/카카오 예약 확인</span> — 앱에서 1일권 사전 예약 가능한 곳도 있어요</p>
          <p>⏰ <span className="font-medium text-text">피크 시간 피하기</span> — 오전 10시~12시, 저녁 7시~9시는 혼잡할 수 있어요</p>
          <p>🧴 <span className="font-medium text-text">개인 용품 챙기기</span> — 수건, 세면도구는 별도 대여가 많아요</p>
          <p>💰 <span className="font-medium text-text">가격 비교</span> — 동일 지역 내 1일권 가격이 최대 2배 차이날 수 있어요</p>
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}
