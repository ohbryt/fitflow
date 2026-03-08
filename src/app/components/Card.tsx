"use client";

export function Card({
  children,
  className = "",
  onClick,
  gradient,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  gradient?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-4 bg-white/[0.03] border border-white/[0.06] ${gradient ? "gradient-border" : ""} ${
        onClick ? "cursor-pointer card-hover active:scale-[0.97]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

const STAT_GRADIENTS = [
  "from-orange-500/15 to-amber-500/5",
  "from-cyan-500/15 to-blue-500/5",
  "from-emerald-500/15 to-green-500/5",
  "from-purple-500/15 to-violet-500/5",
  "from-rose-500/15 to-pink-500/5",
  "from-sky-500/15 to-indigo-500/5",
];

const STAT_ACCENTS = [
  "text-orange-400",
  "text-cyan-400",
  "text-emerald-400",
  "text-purple-400",
  "text-rose-400",
  "text-sky-400",
];

export function StatCard({
  label,
  value,
  unit,
  emoji,
  index = 0,
}: {
  label: string;
  value: string | number;
  unit?: string;
  emoji: string;
  index?: number;
}) {
  const grad = STAT_GRADIENTS[index % STAT_GRADIENTS.length];
  const accent = STAT_ACCENTS[index % STAT_ACCENTS.length];

  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br ${grad} border border-white/[0.06] card-hover`}>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl">{emoji}</span>
          <span className={`text-[10px] font-bold ${accent} bg-white/[0.06] px-2 py-0.5 rounded-full border border-white/[0.08]`}>
            {label}
          </span>
        </div>
        <div className="stat-number text-[28px] leading-none text-zinc-100">
          {value}
          {unit && <span className="text-xs text-zinc-500 ml-1 font-semibold">{unit}</span>}
        </div>
      </div>
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/[0.03] blur-2xl" />
    </div>
  );
}
