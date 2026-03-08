"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FITNESS_VIDEOS,
  VIDEO_CATEGORIES,
  type VideoCategory,
  type FitnessVideo,
} from "@/lib/video-data";

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | "all">("all");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  // localStorage에서 좋아요 불러오기
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fitflow_liked_videos");
      if (saved) setLikedVideos(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  const toggleLike = (videoId: string) => {
    setLikedVideos(prev => {
      const next = new Set(prev);
      if (next.has(videoId)) next.delete(videoId);
      else next.add(videoId);
      try { localStorage.setItem("fitflow_liked_videos", JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  const filteredVideos = selectedCategory === "all"
    ? FITNESS_VIDEOS
    : FITNESS_VIDEOS.filter(v => v.category === selectedCategory);

  const categories = Object.entries(VIDEO_CATEGORIES) as [VideoCategory, typeof VIDEO_CATEGORIES[VideoCategory]][];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 glass-dark">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🎬</span>
            <div>
              <h1 className="text-2xl font-black">피트니스 쇼츠</h1>
              <p className="text-white/50 text-xs mt-0.5">인기 운동 영상을 한눈에</p>
            </div>
          </div>
          <p className="text-white/60 text-sm mt-3">
            Planfit, Muscle Monster 등 인기 채널의 운동 영상을 모아봤어요.
          </p>
        </div>
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-primary/15 blur-3xl" />
      </div>

      {/* Category Filter */}
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedCategory === "all"
              ? "bg-primary text-white shadow-lg shadow-primary/30"
              : "glass text-text-secondary hover:bg-white/10"
          }`}
        >
          🎯 전체 ({FITNESS_VIDEOS.length})
        </button>
        {categories.map(([key, { label, emoji }]) => {
          const count = FITNESS_VIDEOS.filter(v => v.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === key
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "glass text-text-secondary hover:bg-white/10"
              }`}
            >
              {emoji} {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Video Grid */}
      <div className="space-y-4">
        {filteredVideos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            isPlaying={playingId === video.id}
            isLiked={likedVideos.has(video.id)}
            onPlay={() => setPlayingId(playingId === video.id ? null : video.id)}
            onLike={() => toggleLike(video.id)}
          />
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🎬</p>
          <p className="text-text-muted text-sm">이 카테고리에는 아직 영상이 없어요</p>
        </div>
      )}

      {/* CTA - AI 플랜 연결 */}
      <Link href="/plans">
        <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-primary/20 to-accent/20 glass gradient-border group hover:from-primary/30 hover:to-accent/30 transition-all">
          <div className="flex items-center gap-4 relative z-10">
            <span className="text-4xl group-hover:animate-float">🤖</span>
            <div className="flex-1">
              <h3 className="font-bold text-sm">AI 맞춤 운동 플랜</h3>
              <p className="text-xs text-text-muted mt-1">
                영상만 보지 말고, 나만의 체계적인 운동 프로그램을 시작하세요!
              </p>
            </div>
            <span className="text-text-muted text-lg">→</span>
          </div>
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-primary/10 blur-xl" />
        </div>
      </Link>

      <div className="h-8" />
    </div>
  );
}

function VideoCard({
  video,
  isPlaying,
  isLiked,
  onPlay,
  onLike,
}: {
  video: FitnessVideo;
  isPlaying: boolean;
  isLiked: boolean;
  onPlay: () => void;
  onLike: () => void;
}) {
  const catInfo = VIDEO_CATEGORIES[video.category];

  return (
    <div className="glass rounded-2xl overflow-hidden gradient-border">
      {/* Video Thumbnail / Player */}
      <div className="relative w-full aspect-video">
        {!isPlaying ? (
          <button onClick={onPlay} className="relative w-full h-full group">
            <img
              src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            {/* Duration badge */}
            {video.duration && (
              <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-white font-mono">
                {video.duration}
              </div>
            )}
            {/* Category badge */}
            <div className={`absolute top-2 left-2 bg-gradient-to-r ${catInfo.color} backdrop-blur-sm px-2.5 py-1 rounded-lg`}>
              <span className="text-[10px] font-bold text-white">{catInfo.emoji} {catInfo.label}</span>
            </div>
          </button>
        ) : (
          <div className="relative w-full h-full">
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm leading-snug line-clamp-2">{video.title}</h3>
            <a
              href={video.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-primary/80 hover:text-primary mt-1 inline-block font-medium"
            >
              {video.channel}
            </a>
          </div>
          <button
            onClick={onLike}
            className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isLiked ? "bg-red-500/20 text-red-400 scale-110" : "bg-white/5 text-text-muted hover:bg-white/10"
            }`}
          >
            {isLiked ? "❤️" : "🤍"}
          </button>
        </div>
        <p className="text-xs text-text-muted mt-2 leading-relaxed line-clamp-2">
          {video.description}
        </p>
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {video.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-text-muted font-medium">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-3 flex gap-2">
        <a
          href={`https://www.youtube.com/shorts/${video.youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-600/15 hover:bg-red-600/25 text-red-400 rounded-xl text-xs font-medium transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
            <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#fff"/>
          </svg>
          YouTube에서 보기
        </a>
        <button
          onClick={onPlay}
          className="flex items-center justify-center gap-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-text-muted rounded-xl text-xs font-medium transition-colors"
        >
          {isPlaying ? "⏹ 닫기" : "▶️ 재생"}
        </button>
      </div>
    </div>
  );
}
