import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-6xl mb-4">🏋️</div>
      <h1 className="text-2xl font-bold mb-2">페이지를 찾을 수 없습니다</h1>
      <p className="text-text-muted mb-6">요청하신 페이지가 존재하지 않습니다.</p>
      <Link href="/" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
