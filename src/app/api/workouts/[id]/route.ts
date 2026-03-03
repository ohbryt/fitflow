import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const session = db.prepare(`
    SELECT ws.*, r.name as routine_name
    FROM workout_sessions ws
    LEFT JOIN routines r ON ws.routine_id = r.id
    WHERE ws.id = ?
  `).get(id);
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const logs = db.prepare(`
    SELECT wl.*, e.name as exercise_name, e.name_ko as exercise_name_ko
    FROM workout_logs wl
    JOIN exercises e ON wl.exercise_id = e.id
    WHERE wl.session_id = ?
    ORDER BY wl.exercise_id, wl.set_number
  `).all(id);

  return NextResponse.json({ ...session, logs });
}

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const body = await _req.json();

  if (body.finish) {
    db.prepare("UPDATE workout_sessions SET finished_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
  }
  if (body.notes !== undefined) {
    db.prepare("UPDATE workout_sessions SET notes = ? WHERE id = ?").run(body.notes, id);
  }
  return NextResponse.json({ success: true });
}
