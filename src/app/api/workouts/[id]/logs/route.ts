import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const body = await req.json();
  const { exercise_id, set_number, reps, weight, completed } = body;

  const result = db.prepare(`
    INSERT INTO workout_logs (session_id, exercise_id, set_number, reps, weight, completed)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, exercise_id, set_number, reps || 0, weight || 0, completed ? 1 : 0);

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const db = getDb();
  const body = await req.json();
  const { log_id, reps, weight, completed } = body;

  db.prepare(`
    UPDATE workout_logs SET reps = ?, weight = ?, completed = ? WHERE id = ?
  `).run(reps, weight, completed ? 1 : 0, log_id);

  return NextResponse.json({ success: true });
}
