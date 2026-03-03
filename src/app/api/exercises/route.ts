import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const muscle = searchParams.get("muscle");
  const search = searchParams.get("q");

  let query = "SELECT * FROM exercises";
  const conditions: string[] = [];
  const params: string[] = [];

  if (muscle) {
    conditions.push("muscle_group = ?");
    params.push(muscle);
  }
  if (search) {
    conditions.push("(name LIKE ? OR name_ko LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }
  query += " ORDER BY muscle_group, name_ko";

  const exercises = db.prepare(query).all(...params);
  return NextResponse.json(exercises);
}
