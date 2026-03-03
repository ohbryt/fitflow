"use client";

export function Card({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-bg-card rounded-2xl p-4 border border-border ${
        onClick ? "cursor-pointer hover:bg-bg-card-hover active:scale-[0.98]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  unit,
  emoji,
}: {
  label: string;
  value: string | number;
  unit?: string;
  emoji: string;
}) {
  return (
    <Card className="text-center">
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="text-2xl font-bold text-text">
        {value}
        {unit && <span className="text-sm text-text-muted ml-1">{unit}</span>}
      </div>
      <div className="text-xs text-text-muted mt-1">{label}</div>
    </Card>
  );
}
