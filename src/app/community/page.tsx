"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CATEGORIES, LOCATIONS,
  getPosts, addPost, toggleLike, addComment, timeAgo,
  getLocation, setLocation, getRandomEmoji,
} from "@/lib/community-data";
import type { Post, PostCategory } from "@/lib/community-data";
import { getUser } from "@/lib/auth";

type View = "list" | "detail" | "write";

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [view, setView] = useState<View>("list");
  const [filter, setFilter] = useState<PostCategory | "all">("all");
  const [myLocation, setMyLocation] = useState("전체");
  const [showLocPicker, setShowLocPicker] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmoji, setUserEmoji] = useState("🏋️");

  // Write form
  const [wCategory, setWCategory] = useState<PostCategory>("free");
  const [wTitle, setWTitle] = useState("");
  const [wContent, setWContent] = useState("");

  useEffect(() => {
    setPosts(getPosts());
    setMyLocation(getLocation());
    const u = getUser();
    if (u) setUserName(u.name);
    const saved = localStorage.getItem("fitflow:community:emoji");
    setUserEmoji(saved || getRandomEmoji());
  }, []);

  function openPost(post: Post) {
    setSelectedPost(post);
    setView("detail");
    setCommentText("");
  }

  function handleLike(postId: number) {
    const updated = toggleLike(postId);
    setPosts(updated);
    if (selectedPost?.id === postId) {
      setSelectedPost(updated.find(p => p.id === postId) || null);
    }
  }

  function handleComment() {
    if (!commentText.trim() || !selectedPost) return;
    const name = userName || "익명";
    const updated = addComment(selectedPost.id, name, userEmoji, commentText.trim());
    setPosts(updated);
    setSelectedPost(updated.find(p => p.id === selectedPost.id) || null);
    setCommentText("");
  }

  function handleWrite() {
    if (!wTitle.trim() || !wContent.trim()) return;
    const name = userName || "익명";
    addPost({
      author: name,
      authorEmoji: userEmoji,
      category: wCategory,
      title: wTitle.trim(),
      content: wContent.trim(),
      location: myLocation === "전체" ? "서울" : myLocation,
    });
    setPosts(getPosts());
    setWTitle("");
    setWContent("");
    setView("list");
  }

  function changeLocation(loc: string) {
    setMyLocation(loc);
    setLocation(loc);
    setShowLocPicker(false);
  }

  const filtered = posts.filter(p => {
    if (filter !== "all" && p.category !== filter) return false;
    if (myLocation !== "전체" && p.location !== myLocation) return false;
    return true;
  });

  // === DETAIL VIEW ===
  if (view === "detail" && selectedPost) {
    const cat = CATEGORIES[selectedPost.category];
    return (
      <div className="space-y-4 animate-slide-up">
        <button onClick={() => setView("list")} className="flex items-center gap-2 text-sm text-text-muted hover:text-primary font-medium">
          ← 목록으로
        </button>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cat.color}`}>{cat.emoji} {cat.label}</span>
            <span className="text-[10px] text-text-muted">📍 {selectedPost.location}</span>
          </div>
          <h2 className="text-lg font-black mb-2">{selectedPost.title}</h2>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">{selectedPost.authorEmoji}</span>
            <span className="text-sm font-semibold">{selectedPost.author}</span>
            <span className="text-[10px] text-text-muted">{timeAgo(selectedPost.createdAt)}</span>
          </div>
          <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-text-muted/10">
            <button onClick={() => handleLike(selectedPost.id)}
              className={`flex items-center gap-1 text-sm font-medium transition-all active:scale-[0.95] ${selectedPost.liked ? "text-red-500" : "text-text-muted hover:text-red-400"}`}>
              {selectedPost.liked ? "❤️" : "🤍"} {selectedPost.likes}
            </button>
            <span className="text-sm text-text-muted">💬 {selectedPost.comments.length}</span>
          </div>
        </div>

        {/* Comments */}
        <div>
          <h3 className="text-sm font-bold mb-3">댓글 {selectedPost.comments.length}개</h3>
          <div className="space-y-2">
            {selectedPost.comments.map(c => (
              <div key={c.id} className="glass rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span>{c.authorEmoji}</span>
                  <span className="text-xs font-bold">{c.author}</span>
                  <span className="text-[10px] text-text-muted">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="text-sm text-text">{c.content}</p>
              </div>
            ))}
            {selectedPost.comments.length === 0 && (
              <p className="text-xs text-text-muted text-center py-4">아직 댓글이 없어요. 첫 댓글을 남겨보세요!</p>
            )}
          </div>

          {/* Comment input */}
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleComment()}
              placeholder="댓글을 입력하세요..."
              className="flex-1 px-4 py-2.5 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-text-muted/50"
            />
            <button
              onClick={handleComment}
              disabled={!commentText.trim()}
              className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark active:scale-[0.95] disabled:opacity-40"
            >
              전송
            </button>
          </div>
        </div>

        <div className="h-8" />
      </div>
    );
  }

  // === WRITE VIEW ===
  if (view === "write") {
    return (
      <div className="space-y-5 animate-slide-up">
        <div className="flex items-center justify-between">
          <button onClick={() => setView("list")} className="text-sm text-text-muted hover:text-primary font-medium">← 취소</button>
          <h2 className="text-lg font-black">글쓰기</h2>
          <button onClick={handleWrite} disabled={!wTitle.trim() || !wContent.trim()}
            className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark disabled:opacity-40">
            등록
          </button>
        </div>

        {/* Category selector */}
        <div>
          <label className="text-xs font-semibold text-text-muted mb-2 block">카테고리</label>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(CATEGORIES) as [PostCategory, typeof CATEGORIES[PostCategory]][]).map(([key, cat]) => (
              <button key={key} onClick={() => setWCategory(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${wCategory === key ? "bg-primary text-white" : "glass hover:bg-orange-50"}`}>
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-text-muted mb-1 block">제목</label>
          <input type="text" value={wTitle} onChange={e => setWTitle(e.target.value)}
            placeholder="제목을 입력하세요" maxLength={50}
            className="w-full px-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-text-muted/50" />
        </div>

        <div>
          <label className="text-xs font-semibold text-text-muted mb-1 block">내용</label>
          <textarea value={wContent} onChange={e => setWContent(e.target.value)}
            placeholder="내용을 입력하세요..."
            rows={8}
            className="w-full px-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-text-muted/50 resize-none" />
        </div>

        <p className="text-[10px] text-text-muted text-center">📍 위치: {myLocation === "전체" ? "서울" : myLocation}</p>
        <div className="h-8" />
      </div>
    );
  }

  // === LIST VIEW ===
  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowLocPicker(!showLocPicker)}
              className="flex items-center gap-1 hover:text-primary transition-colors">
              <h1 className="text-xl font-black">📍 {myLocation}</h1>
              <span className="text-text-muted text-xs">▼</span>
            </button>
          </div>
          <p className="text-xs text-text-muted mt-0.5">우리 동네 운동 커뮤니티</p>
        </div>
        <button onClick={() => setView("write")}
          className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark active:scale-[0.95] shadow-lg shadow-orange-300/30">
          ✏️ 글쓰기
        </button>
      </div>

      {/* Location picker */}
      {showLocPicker && (
        <div className="glass rounded-2xl p-4 max-h-48 overflow-y-auto">
          <div className="flex flex-wrap gap-1.5">
            {LOCATIONS.map(loc => (
              <button key={loc} onClick={() => changeLocation(loc)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${myLocation === loc ? "bg-primary text-white" : "bg-white/50 hover:bg-orange-50"}`}>
                {loc}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        <button onClick={() => setFilter("all")}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filter === "all" ? "bg-primary text-white shadow" : "glass hover:bg-orange-50"}`}>
          전체
        </button>
        {(Object.entries(CATEGORIES) as [PostCategory, typeof CATEGORIES[PostCategory]][]).map(([key, cat]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filter === key ? "bg-primary text-white shadow" : "glass hover:bg-orange-50"}`}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-2.5">
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm text-text-muted">아직 글이 없어요</p>
            <p className="text-xs text-text-muted/60 mt-1">첫 번째 글을 작성해보세요!</p>
          </div>
        )}
        {filtered.map(post => {
          const cat = CATEGORIES[post.category];
          return (
            <button key={post.id} onClick={() => openPost(post)}
              className="w-full text-left glass rounded-2xl p-4 hover:bg-orange-50/60 active:scale-[0.99] transition-all">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cat.color}`}>{cat.emoji} {cat.label}</span>
                <span className="text-[10px] text-text-muted">📍 {post.location}</span>
              </div>
              <h3 className="font-bold text-sm mb-1 truncate">{post.title}</h3>
              <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{post.content}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{post.authorEmoji}</span>
                  <span className="text-xs font-medium">{post.author}</span>
                  <span className="text-[10px] text-text-muted">{timeAgo(post.createdAt)}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-text-muted">
                  <span>{post.liked ? "❤️" : "🤍"} {post.likes}</span>
                  <span>💬 {post.comments.length}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="h-8" />
    </div>
  );
}
