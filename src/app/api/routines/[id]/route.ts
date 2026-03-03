import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const routine = db.prepare("SELECT * FROM routines WHERE id = ?").get(id);
  if (!routine) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const exercises = db.prepare(`
    SELECT re.*, e.name, e.name_ko, e.muscle_group, e.equipment
    FROM routine_exercises re
    JOIN exercises e ON re.exercise_id = e.id
    WHERE re.routine_id = ?
    ORDER BY re.sort_order
  `).all(id);

  return NextResponse.json({ ...routine, exercises });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  db.prepare("DELETE FROM routines WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
