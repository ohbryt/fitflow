"use client";

import { useState } from "react";
import Link from "next/link";
import { GYM_EQUIPMENT, EQUIPMENT_CATEGORIES } from "@/lib/equipment-data";
import type { Equipment } from "@/lib/equipment-data";

export default function EquipmentPage() {
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Equipment | null>(null);

  const filtered = filter === "all" ? GYM_EQUIPMENT : GYM_EQUIPMENT.filter(e => e.category === filter);

  // === DETAIL VIEW ===
  if (selected) {
    const diffLabel = { beginner: "초급", intermediate: "중급", advanced: "고급" }[selected.difficulty];
    const diffColor = { beginner: "text-green-600 bg-green-100", intermediate: "text-yellow-600 bg-yellow-100", advanced: "text-red-600 bg-red-100" }[selected.difficulty];
    return (
      <div className="space-y-5 animate-slide-up">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-text-muted hover:text-primary font-medium">
          ← 목록으로
        </button>

        {/* Video */}
        <div className="rounded-2xl overflow-hidden glass gradient-border">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${selected.youtubeId}?rel=0`}
              title={selected.nameKo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Title & meta */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${diffColor}`}>{diffLabel}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
              {EQUIPMENT_CATEGORIES[selected.category]?.emoji} {EQUIPMENT_CATEGORIES[selected.category]?.label}
            </span>
          </div>
          <h1 className="text-xl font-black">{selected.emoji} {selected.nameKo}</h1>
          <p className="text-xs text-text-muted mt-0.5">{selected.name}</p>
        </div>

        {/* Target muscles */}
        <div className="flex flex-wrap gap-1.5">
          {selected.targetMuscles.map(m => (
            <span key={m} className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700">{m}</span>
          ))}
        </div>

        {/* Description */}
        <div className="glass rounded-2xl p-4">
          <p className="text-sm text-text leading-relaxed">{selected.description}</p>
        </div>

        {/* How to use */}
        <div className="glass rounded-2xl p-4">
          <h3 className="text-sm font-bold mb-3">📖 사용 방법</h3>
          <ol className="space-y-2">
            {selected.howTo.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-sm">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-text leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Tips */}
        <div className="glass rounded-2xl p-4">
          <h3 className="text-sm font-bold mb-3">💡 꿀팁</h3>
          <ul className="space-y-1.5">
            {selected.tips.map((tip, i) => (
              <li key={i} className="text-sm text-text flex gap-2">
                <span className="text-primary shrink-0">✓</span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Common mistakes */}
        <div className="glass rounded-2xl p-4">
          <h3 className="text-sm font-bold mb-3">⚠️ 흔한 실수</h3>
          <ul className="space-y-1.5">
            {selected.commonMistakes.map((m, i) => (
              <li key={i} className="text-sm text-text flex gap-2">
                <span className="text-red-500 shrink-0">✗</span>
                <span className="leading-relaxed">{m}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-8" />
      </div>
    );
  }

  // === LIST VIEW ===
  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/" className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-orange-50">
          <span className="text-lg">←</span>
        </Link>
        <div>
          <h1 className="text-xl font-black">헬스장 기구 가이드</h1>
          <p className="text-xs text-text-muted">{GYM_EQUIPMENT.length}개 기구 · 사용법 · 영상</p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        <button onClick={() => setFilter("all")}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filter === "all" ? "bg-primary text-white shadow" : "glass hover:bg-orange-50"}`}>
          전체
        </button>
        {Object.entries(EQUIPMENT_CATEGORIES).map(([key, cat]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filter === key ? "bg-primary text-white shadow" : "glass hover:bg-orange-50"}`}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Equipment grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {filtered.map(eq => {
          const diffColor = { beginner: "text-green-500", intermediate: "text-yellow-500", advanced: "text-red-500" }[eq.difficulty];
          const diffLabel = { beginner: "초급", intermediate: "중급", advanced: "고급" }[eq.difficulty];
          return (
            <button key={eq.id} onClick={() => setSelected(eq)}
              className="text-left glass gradient-border rounded-2xl p-4 hover:bg-orange-50/60 active:scale-[0.97] group">
              <div className="text-2xl mb-2 group-hover:animate-float">{eq.emoji}</div>
              <p className="font-bold text-sm">{eq.nameKo}</p>
              <p className="text-[10px] text-text-muted mt-0.5 truncate">{eq.targetMuscles.join(" · ")}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`text-[10px] font-bold ${diffColor}`}>{diffLabel}</span>
                <span className="text-[10px] text-text-muted">· 🎬 영상</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="h-8" />
    </div>
  );
}
