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
        onClick ? "cursor-pointer hover:bg-bg-card-hover active:scale-[0.97]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

const STAT_GRADIENTS = [
  "from-indigo-500/20 to-purple-500/10",
  "from-amber-500/20 to-orange-500/10",
  "from-emerald-500/20 to-teal-500/10",
  "from-rose-500/20 to-pink-500/10",
  "from-cyan-500/20 to-blue-500/10",
  "from-violet-500/20 to-fuchsia-500/10",
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
  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br ${grad} glass gradient-border`}>
      <div className="relative z-10">
        <div className="text-2xl mb-2">{emoji}</div>
        <div className="text-2xl font-bold tracking-tight">
          {value}
          {unit && <span className="text-sm text-text-muted ml-1 font-medium">{unit}</span>}
        </div>
        <div className="text-xs text-text-muted mt-1 font-medium">{label}</div>
      </div>
      {/* Decorative glow */}
      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/5 blur-xl" />
    </div>
  );
}
