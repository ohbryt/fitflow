"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PLAYLISTS,
  getTodayPlaylist,
  getShuffledTracks,
  getPlaylistDuration,
} from "@/lib/music-data";
import type { Playlist, Track } from "@/lib/music-data";

export default function MusicPage() {
  const [todayPL, setTodayPL] = useState<Playlist | null>(null);
  const [selectedPL, setSelectedPL] = useState<Playlist | null>(null);
  const [playing, setPlaying] = useState<Track | null>(null);
  const [shuffled, setShuffled] = useState<Track[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const today = getTodayPlaylist();
    setTodayPL(today);
    setSelectedPL(today);
    setShuffled(getShuffledTracks(today));
  }, []);

  function selectPlaylist(pl: Playlist) {
    setSelectedPL(pl);
    setShuffled(getShuffledTracks(pl));
    setPlaying(null);
    setShowAll(false);
  }

  function playTrack(track: Track) {
    setPlaying(playing?.youtubeId === track.youtubeId ? null : track);
  }

  function playNext() {
    if (!playing || !selectedPL) return;
    const idx = shuffled.findIndex(t => t.youtubeId === playing.youtubeId);
    if (idx < shuffled.length - 1) {
      setPlaying(shuffled[idx + 1]);
    }
  }

  if (!todayPL || !selectedPL) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayTracks = showAll ? shuffled : shuffled.slice(0, 5);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/" className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-orange-50">
          <span className="text-lg">←</span>
        </Link>
        <div>
          <h1 className="text-xl font-black">운동 음악</h1>
          <p className="text-xs text-text-muted">매일 새로운 플레이리스트 추천</p>
        </div>
      </div>

      {/* Today's Pick */}
      <div className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${todayPL.color} glass gradient-border`}>
        <div className="relative z-10">
          <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">오늘의 추천</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{todayPL.emoji}</span>
            <div>
              <h2 className="text-lg font-black">{todayPL.nameKo}</h2>
              <p className="text-xs text-text-muted">{todayPL.description}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/60 text-text">
              {todayPL.tracks.length}곡
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/60 text-text">
              {getPlaylistDuration(todayPL)}
            </span>
            {todayPL.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/20 blur-2xl" />
      </div>

      {/* YouTube Player */}
      {playing && (
        <div className="rounded-2xl overflow-hidden glass gradient-border">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${playing.youtubeId}?autoplay=1&rel=0`}
              title={playing.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-3 flex items-center justify-between">
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{playing.title}</p>
              <p className="text-xs text-text-muted truncate">{playing.artist}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={playNext}
                className="px-3 py-1.5 glass rounded-lg text-xs font-semibold hover:bg-orange-50"
              >
                다음 ⏭
              </button>
              <button
                onClick={() => setPlaying(null)}
                className="px-3 py-1.5 glass rounded-lg text-xs font-semibold hover:bg-red-50 text-red-500"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Playlist Selector */}
      <div>
        <h3 className="text-sm font-bold mb-3">플레이리스트 선택</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {PLAYLISTS.map(pl => (
            <button
              key={pl.id}
              onClick={() => selectPlaylist(pl)}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.95] ${
                selectedPL.id === pl.id
                  ? "bg-primary text-white shadow-lg shadow-orange-300/30"
                  : "glass hover:bg-orange-50"
              }`}
            >
              {pl.emoji} {pl.nameKo}
            </button>
          ))}
        </div>
      </div>

      {/* Track List */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold">
            {selectedPL.emoji} {selectedPL.nameKo}
            <span className="text-text-muted font-normal ml-2">{selectedPL.tracks.length}곡</span>
          </h3>
          {/* Play all - opens first track */}
          <button
            onClick={() => { if (shuffled.length > 0) setPlaying(shuffled[0]); }}
            className="text-[10px] bg-primary text-white px-3 py-1 rounded-lg font-bold hover:bg-primary-dark active:scale-[0.95]"
          >
            ▶ 전체 재생
          </button>
        </div>

        <div className="space-y-1.5">
          {displayTracks.map((track, i) => {
            const isPlaying = playing?.youtubeId === track.youtubeId;
            return (
              <button
                key={track.youtubeId}
                onClick={() => playTrack(track)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all active:scale-[0.98] ${
                  isPlaying
                    ? "bg-primary/10 border border-primary/20"
                    : "glass hover:bg-orange-50/60"
                }`}
              >
                {/* Track number or playing indicator */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  isPlaying ? "bg-primary text-white" : "bg-white/50 text-text-muted"
                }`}>
                  {isPlaying ? "♫" : i + 1}
                </div>

                {/* Track info */}
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold truncate ${isPlaying ? "text-primary" : ""}`}>
                    {track.title}
                  </p>
                  <p className="text-[10px] text-text-muted truncate">{track.artist}</p>
                </div>

                {/* BPM & Duration */}
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-text-muted">{track.duration}</p>
                  {track.bpm && (
                    <p className="text-[10px] text-primary/70 font-medium">{track.bpm} BPM</p>
                  )}
                </div>

                {/* Play icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isPlaying ? "bg-primary text-white" : "bg-white/60 text-text-muted"
                }`}>
                  <span className="text-xs">{isPlaying ? "⏸" : "▶"}</span>
                </div>
              </button>
            );
          })}
        </div>

        {shuffled.length > 5 && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full mt-2 py-2.5 glass rounded-xl text-xs font-semibold text-primary hover:bg-orange-50"
          >
            전체 {shuffled.length}곡 보기 ↓
          </button>
        )}
      </div>

      {/* Workout music tips */}
      <div className="glass rounded-2xl p-4">
        <h3 className="text-sm font-bold mb-3">🎧 운동 음악 팁</h3>
        <div className="space-y-2 text-xs text-text-muted">
          <p>💪 <span className="font-medium text-text">웨이트 트레이닝</span> — 120~140 BPM의 힙합·록이 리프팅 템포에 맞아요</p>
          <p>🏃 <span className="font-medium text-text">러닝/유산소</span> — 150+ BPM의 EDM·K-Pop으로 속도를 유지하세요</p>
          <p>🧘 <span className="font-medium text-text">스트레칭/쿨다운</span> — 80~100 BPM의 로파이·칠 음악이 좋아요</p>
          <p>🔊 <span className="font-medium text-text">볼륨 주의</span> — 이어폰 볼륨은 60% 이하로! 청력을 보호하세요</p>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
