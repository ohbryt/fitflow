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
      className={`glass rounded-2xl p-4 ${gradient ? "gradient-border" : ""} ${
        onClick ? "cursor-pointer card-hover active:scale-[0.97]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

const STAT_GRADIENTS = [
  "from-orange-50 to-amber-50/80",
  "from-amber-50 to-yellow-50/80",
  "from-emerald-50 to-green-50/80",
  "from-sky-50 to-blue-50/80",
  "from-rose-50 to-pink-50/80",
  "from-violet-50 to-purple-50/80",
];

const STAT_ACCENTS = [
  "text-orange-600",
  "text-amber-600",
  "text-emerald-600",
  "text-sky-600",
  "text-rose-600",
  "text-violet-600",
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
    <div className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br ${grad} glass gradient-border card-hover`}>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl">{emoji}</span>
          <span className={`text-[10px] font-bold ${accent} badge-primary px-2 py-0.5 rounded-full`}>
            {label}
          </span>
        </div>
        <div className="stat-number text-[28px] leading-none">
          {value}
          {unit && <span className="text-xs text-text-muted ml-1 font-semibold">{unit}</span>}
        </div>
      </div>
      {/* Ambient glow */}
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/30 blur-2xl" />
      <div className="absolute -bottom-4 -left-4 w-14 h-14 rounded-full bg-white/20 blur-xl" />
    </div>
  );
}
