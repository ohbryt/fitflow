import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "fitflow.db");

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    const fs = require("fs");
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initializeDb(db);
  }
  return db;
}

function initializeDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      name_ko TEXT NOT NULL,
      category TEXT NOT NULL,
      muscle_group TEXT NOT NULL,
      equipment TEXT DEFAULT 'none',
      description TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS routines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      day_of_week TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS routine_exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      routine_id INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,
      sets INTEGER DEFAULT 3,
      reps INTEGER DEFAULT 10,
      weight REAL DEFAULT 0,
      rest_seconds INTEGER DEFAULT 60,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS workout_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      routine_id INTEGER,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      finished_at DATETIME,
      notes TEXT,
      FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS workout_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,
      set_number INTEGER NOT NULL,
      reps INTEGER,
      weight REAL,
      completed BOOLEAN DEFAULT 0,
      logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
    );
  `);

  // Seed exercises if empty
  const count = db.prepare("SELECT COUNT(*) as c FROM exercises").get() as { c: number };
  if (count.c === 0) {
    seedExercises(db);
  }
}

function seedExercises(db: Database.Database) {
  const exercises = [
    // 가슴 (Chest)
    { name: "Bench Press", name_ko: "벤치 프레스", category: "strength", muscle_group: "chest", equipment: "barbell" },
    { name: "Incline Bench Press", name_ko: "인클라인 벤치 프레스", category: "strength", muscle_group: "chest", equipment: "barbell" },
    { name: "Dumbbell Fly", name_ko: "덤벨 플라이", category: "strength", muscle_group: "chest", equipment: "dumbbell" },
    { name: "Push Up", name_ko: "푸시업", category: "bodyweight", muscle_group: "chest", equipment: "none" },
    { name: "Cable Crossover", name_ko: "케이블 크로스오버", category: "strength", muscle_group: "chest", equipment: "cable" },
    // 등 (Back)
    { name: "Deadlift", name_ko: "데드리프트", category: "strength", muscle_group: "back", equipment: "barbell" },
    { name: "Pull Up", name_ko: "풀업", category: "bodyweight", muscle_group: "back", equipment: "none" },
    { name: "Barbell Row", name_ko: "바벨 로우", category: "strength", muscle_group: "back", equipment: "barbell" },
    { name: "Lat Pulldown", name_ko: "랫 풀다운", category: "strength", muscle_group: "back", equipment: "machine" },
    { name: "Seated Row", name_ko: "시티드 로우", category: "strength", muscle_group: "back", equipment: "cable" },
    // 어깨 (Shoulders)
    { name: "Overhead Press", name_ko: "오버헤드 프레스", category: "strength", muscle_group: "shoulders", equipment: "barbell" },
    { name: "Lateral Raise", name_ko: "레터럴 레이즈", category: "strength", muscle_group: "shoulders", equipment: "dumbbell" },
    { name: "Front Raise", name_ko: "프론트 레이즈", category: "strength", muscle_group: "shoulders", equipment: "dumbbell" },
    { name: "Face Pull", name_ko: "페이스 풀", category: "strength", muscle_group: "shoulders", equipment: "cable" },
    { name: "Arnold Press", name_ko: "아놀드 프레스", category: "strength", muscle_group: "shoulders", equipment: "dumbbell" },
    // 하체 (Legs)
    { name: "Squat", name_ko: "스쿼트", category: "strength", muscle_group: "legs", equipment: "barbell" },
    { name: "Leg Press", name_ko: "레그 프레스", category: "strength", muscle_group: "legs", equipment: "machine" },
    { name: "Romanian Deadlift", name_ko: "루마니안 데드리프트", category: "strength", muscle_group: "legs", equipment: "barbell" },
    { name: "Leg Extension", name_ko: "레그 익스텐션", category: "strength", muscle_group: "legs", equipment: "machine" },
    { name: "Leg Curl", name_ko: "레그 컬", category: "strength", muscle_group: "legs", equipment: "machine" },
    { name: "Lunge", name_ko: "런지", category: "strength", muscle_group: "legs", equipment: "dumbbell" },
    { name: "Calf Raise", name_ko: "카프 레이즈", category: "strength", muscle_group: "legs", equipment: "machine" },
    // 팔 (Arms)
    { name: "Barbell Curl", name_ko: "바벨 컬", category: "strength", muscle_group: "arms", equipment: "barbell" },
    { name: "Tricep Pushdown", name_ko: "트라이셉 푸시다운", category: "strength", muscle_group: "arms", equipment: "cable" },
    { name: "Hammer Curl", name_ko: "해머 컬", category: "strength", muscle_group: "arms", equipment: "dumbbell" },
    { name: "Skull Crusher", name_ko: "스컬 크러셔", category: "strength", muscle_group: "arms", equipment: "barbell" },
    { name: "Dips", name_ko: "딥스", category: "bodyweight", muscle_group: "arms", equipment: "none" },
    // 코어 (Core)
    { name: "Plank", name_ko: "플랭크", category: "bodyweight", muscle_group: "core", equipment: "none" },
    { name: "Crunch", name_ko: "크런치", category: "bodyweight", muscle_group: "core", equipment: "none" },
    { name: "Russian Twist", name_ko: "러시안 트위스트", category: "bodyweight", muscle_group: "core", equipment: "none" },
    { name: "Leg Raise", name_ko: "레그 레이즈", category: "bodyweight", muscle_group: "core", equipment: "none" },
    { name: "Ab Wheel Rollout", name_ko: "ab 롤아웃", category: "bodyweight", muscle_group: "core", equipment: "ab_wheel" },
    // 유산소 (Cardio)
    { name: "Running", name_ko: "러닝", category: "cardio", muscle_group: "cardio", equipment: "none" },
    { name: "Cycling", name_ko: "사이클링", category: "cardio", muscle_group: "cardio", equipment: "machine" },
    { name: "Jump Rope", name_ko: "줄넘기", category: "cardio", muscle_group: "cardio", equipment: "jump_rope" },
    { name: "Rowing Machine", name_ko: "로잉 머신", category: "cardio", muscle_group: "cardio", equipment: "machine" },
  ];

  const stmt = db.prepare(
    "INSERT INTO exercises (name, name_ko, category, muscle_group, equipment) VALUES (?, ?, ?, ?, ?)"
  );
  const insertMany = db.transaction((items: typeof exercises) => {
    for (const e of items) {
      stmt.run(e.name, e.name_ko, e.category, e.muscle_group, e.equipment);
    }
  });
  insertMany(exercises);
}
