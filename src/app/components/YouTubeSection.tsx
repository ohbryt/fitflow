"use client";

import { useState } from "react";

interface YouTubeSectionProps {
  exerciseNameKo: string;
  exerciseName: string;
  youtubeId?: string;
}

// Curated YouTube video IDs for exercises
const YOUTUBE_IDS: Record<string, string> = {
  "벤치 프레스": "rT7DgCr-3pg",
  "인클라인 벤치 프레스": "SrqOu55lrYU",
  "덤벨 플라이": "eozdVDA78K0",
  "푸시업": "IODxDxX7oi4",
  "케이블 크로스오버": "taI4XduLpTk",
  "데드리프트": "op9kVnSso6Q",
  "풀업": "eGo4IYlbE5g",
  "바벨 로우": "FWJR5Ve8bnQ",
  "랫 풀다운": "CAwf7n6Luuc",
  "시티드 로우": "GZbfZ033f74",
  "오버헤드 프레스": "_RlRDWO2jfg",
  "레터럴 레이즈": "3VcKaXpzqRo",
  "프론트 레이즈": "gzDRaW-_Wrg",
  "페이스 풀": "rep-qVOkqgk",
  "아놀드 프레스": "6Z15_WdXmVw",
  "스쿼트": "ultWZbUMPL8",
  "레그 프레스": "IZxyjW7MPJQ",
  "루마니안 데드리프트": "jEy_czb3RKA",
  "레그 익스텐션": "YyvSfVjQeL0",
  "레그 컬": "1Tq3QdYUuHs",
  "런지": "QOVaHwm-Q6U",
  "카프 레이즈": "gwLzBJYoWlI",
  "바벨 컬": "kwG2ipFRgFo",
  "트라이셉 푸시다운": "2-LAMcpzODU",
  "해머 컬": "zC3nLlEvin4",
  "스컬 크러셔": "d_KZxkY_0cM",
  "딥스": "2z8JmcrW-As",
  "플랭크": "ASdvN_XEl_c",
  "크런치": "Xyd_fa5zoEU",
  "러시안 트위스트": "wkD8rjkodUI",
  "레그 레이즈": "JB2oyawG9KI",
  "ab 롤아웃": "rqiTPl9SstE",
  "러닝": "brFHyOtTwH4",
  "사이클링": "4ssLDk1eX9w",
  "줄넘기": "FJmRQ5iTXKE",
  "로잉 머신": "sP_4vybjVJs",
};

export function YouTubeSection({ exerciseNameKo, exerciseName, youtubeId }: YouTubeSectionProps) {
  const [showVideo, setShowVideo] = useState(false);
  const videoId = youtubeId || YOUTUBE_IDS[exerciseNameKo];
  const searchQuery = encodeURIComponent(`${exerciseNameKo} 운동 자세 튜토리얼`);
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

  return (
    <div className="bg-bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-5">
        <h3 className="font-semibold flex items-center gap-2 mb-3">
          🎬 운동 영상
        </h3>

        {videoId && !showVideo && (
          <button
            onClick={() => setShowVideo(true)}
            className="relative w-full aspect-video rounded-xl overflow-hidden group"
          >
            <img
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt={`${exerciseNameKo} 튜토리얼`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-[10px] text-white">
              YouTube
            </div>
          </button>
        )}

        {videoId && showVideo && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={`${exerciseNameKo} 튜토리얼`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        )}

        {!videoId && (
          <div className="w-full aspect-video rounded-xl bg-white/5 flex flex-col items-center justify-center gap-3">
            <div className="text-4xl">🎬</div>
            <p className="text-sm text-text-muted">영상을 검색해보세요</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="px-5 pb-4 flex gap-2">
        <a
          href={videoId ? `https://www.youtube.com/watch?v=${videoId}` : youtubeSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl text-sm font-medium transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
            <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#fff"/>
          </svg>
          YouTube에서 보기
        </a>
        <a
          href={youtubeSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-text-muted rounded-xl text-sm font-medium transition-colors"
        >
          🔍 더 찾기
        </a>
      </div>
    </div>
  );
}
