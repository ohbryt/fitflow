import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();

  const totalWorkouts = (db.prepare(
    "SELECT COUNT(*) as c FROM workout_sessions WHERE finished_at IS NOT NULL"
  ).get() as { c: number }).c;

  const totalVolume = (db.prepare(
    "SELECT COALESCE(SUM(weight * reps), 0) as v FROM workout_logs WHERE completed = 1"
  ).get() as { v: number }).v;

  const thisWeekWorkouts = (db.prepare(`
    SELECT COUNT(*) as c FROM workout_sessions
    WHERE finished_at IS NOT NULL
    AND started_at >= date('now', '-7 days')
  `).get() as { c: number }).c;

  // Calculate streak
  const dates = db.prepare(`
    SELECT DISTINCT date(started_at) as d FROM workout_sessions
    WHERE finished_at IS NOT NULL
    ORDER BY d DESC
  `).all() as { d: string }[];

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < dates.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    const expectedStr = expected.toISOString().split("T")[0];
    if (dates[i].d === expectedStr) {
      streak++;
    } else if (i === 0) {
      // Check if yesterday counts (today not worked out yet)
      expected.setDate(expected.getDate() - 1);
      const yesterdayStr = expected.toISOString().split("T")[0];
      if (dates[i].d === yesterdayStr) {
        streak++;
      } else break;
    } else break;
  }

  // Weekly volume chart data (last 8 weeks)
  const weeklyVolume = db.prepare(`
    SELECT
      strftime('%Y-W%W', wl.logged_at) as week,
      COALESCE(SUM(wl.weight * wl.reps), 0) as volume
    FROM workout_logs wl
    WHERE wl.completed = 1 AND wl.logged_at >= date('now', '-56 days')
    GROUP BY week
    ORDER BY week
  `).all();

  // Muscle group distribution
  const muscleDistribution = db.prepare(`
    SELECT e.muscle_group, COUNT(*) as count
    FROM workout_logs wl
    JOIN exercises e ON wl.exercise_id = e.id
    WHERE wl.completed = 1 AND wl.logged_at >= date('now', '-30 days')
    GROUP BY e.muscle_group
    ORDER BY count DESC
  `).all();

  return NextResponse.json({
    totalWorkouts,
    totalVolume: Math.round(totalVolume),
    thisWeekWorkouts,
    streak,
    weeklyVolume,
    muscleDistribution,
  });
}
