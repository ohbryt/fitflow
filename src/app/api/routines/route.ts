import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const routines = db.prepare(`
    SELECT r.*, COUNT(re.id) as exercise_count
    FROM routines r
    LEFT JOIN routine_exercises re ON r.id = re.routine_id
    GROUP BY r.id
    ORDER BY r.updated_at DESC
  `).all();
  return NextResponse.json(routines);
}

export async function POST(req: NextRequest) {
  const db = getDb();
  const body = await req.json();
  const { name, description, day_of_week, exercises } = body;

  const result = db.prepare(
    "INSERT INTO routines (name, description, day_of_week) VALUES (?, ?, ?)"
  ).run(name, description || null, day_of_week || null);

  const routineId = result.lastInsertRowid;

  if (exercises && exercises.length > 0) {
    const stmt = db.prepare(`
      INSERT INTO routine_exercises (routine_id, exercise_id, sets, reps, weight, rest_seconds, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const insertExercises = db.transaction((items: typeof exercises) => {
      items.forEach((e: any, i: number) => {
        stmt.run(routineId, e.exercise_id, e.sets || 3, e.reps || 10, e.weight || 0, e.rest_seconds || 60, i);
      });
    });
    insertExercises(exercises);
  }

  return NextResponse.json({ id: routineId }, { status: 201 });
}
