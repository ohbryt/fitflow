import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // YYYY-MM format

  let query = `
    SELECT ws.*, r.name as routine_name,
      COALESCE(SUM(wl.weight * wl.reps), 0) as total_volume,
      COUNT(DISTINCT CASE WHEN wl.completed = 1 THEN wl.id END) as total_sets
    FROM workout_sessions ws
    LEFT JOIN routines r ON ws.routine_id = r.id
    LEFT JOIN workout_logs wl ON ws.id = wl.session_id
  `;
  const params: string[] = [];

  if (month) {
    query += " WHERE strftime('%Y-%m', ws.started_at) = ?";
    params.push(month);
  }
  query += " GROUP BY ws.id ORDER BY ws.started_at DESC";

  const sessions = db.prepare(query).all(...params);
  return NextResponse.json(sessions);
}

export async function POST(req: NextRequest) {
  const db = getDb();
  const body = await req.json();
  const { routine_id, notes } = body;

  const result = db.prepare(
    "INSERT INTO workout_sessions (routine_id, notes) VALUES (?, ?)"
  ).run(routine_id || null, notes || null);

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}
