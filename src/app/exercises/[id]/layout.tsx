import { EXERCISES } from "@/lib/exercise-data";

export function generateStaticParams() {
  return EXERCISES.map((ex) => ({
    id: String(ex.id),
  }));
}

export default function ExerciseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
