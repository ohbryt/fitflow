// Community system (localStorage-based)

export type PostCategory = "mate" | "share" | "proof" | "info" | "free";

export interface Post {
  id: number;
  author: string;
  authorEmoji: string;
  category: PostCategory;
  title: string;
  content: string;
  location: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
  liked?: boolean;
}

export interface Comment {
  id: number;
  author: string;
  authorEmoji: string;
  content: string;
  createdAt: string;
}

export const CATEGORIES: Record<PostCategory, { label: string; emoji: string; color: string }> = {
  mate: { label: "운동 메이트", emoji: "🤝", color: "bg-blue-100 text-blue-700" },
  share: { label: "장비 나눔", emoji: "🎁", color: "bg-green-100 text-green-700" },
  proof: { label: "운동 인증", emoji: "💪", color: "bg-orange-100 text-orange-700" },
  info: { label: "정보 공유", emoji: "📢", color: "bg-purple-100 text-purple-700" },
  free: { label: "자유글", emoji: "💬", color: "bg-gray-100 text-gray-700" },
};

const STORAGE_KEY = "fitflow:community";
const LOCATION_KEY = "fitflow:community:location";

const PROFILE_EMOJIS = ["🏋️", "🧘", "🤸", "🏃", "🚴", "⛹️", "🏊", "🥊", "🧗", "🤾"];

export function getRandomEmoji(): string {
  return PROFILE_EMOJIS[Math.floor(Math.random() * PROFILE_EMOJIS.length)];
}

// Sample posts
const SAMPLE_POSTS: Post[] = [
  {
    id: 1, author: "헬린이탈출", authorEmoji: "🏋️", category: "mate",
    title: "같이 헬스 다닐 분 구합니다!", content: "강남역 근처 에니타임피트니스 다니는데 같이 운동할 분 찾아요. 주 4~5회, 저녁 8시 이후 가능합니다. 3분할로 하고 있어요!",
    location: "강남구", likes: 12, comments: [
      { id: 1, author: "근육맨", authorEmoji: "💪", content: "저도 에니타임 다녀요! DM 주세요", createdAt: "2026-03-04T10:30:00" },
      { id: 2, author: "초보러너", authorEmoji: "🏃", content: "초보자도 괜찮을까요?", createdAt: "2026-03-04T11:00:00" },
    ],
    createdAt: "2026-03-04T09:00:00",
  },
  {
    id: 2, author: "요가러버", authorEmoji: "🧘", category: "mate",
    title: "주말 아침 요가 같이 해요~", content: "한강공원에서 주말 아침 7시에 요가해요. 매트만 가져오시면 됩니다. 초보자 환영! 현재 5명이서 하고 있어요.",
    location: "용산구", likes: 24, comments: [
      { id: 3, author: "모닝피플", authorEmoji: "🌅", content: "위치가 정확히 어디인가요?", createdAt: "2026-03-03T20:00:00" },
    ],
    createdAt: "2026-03-03T18:00:00",
  },
  {
    id: 3, author: "장비정리중", authorEmoji: "🎁", category: "share",
    title: "[나눔] 덤벨 세트 10kg/15kg", content: "이사가서 홈짐 정리합니다. 덤벨 10kg 2개, 15kg 2개 무료 나눔해요. 직접 수거 가능하신 분! 상태 좋아요.",
    location: "마포구", likes: 31, comments: [
      { id: 4, author: "홈트족", authorEmoji: "🏠", content: "아직 있나요? 바로 가져갈 수 있어요!", createdAt: "2026-03-04T14:00:00" },
      { id: 5, author: "근력왕", authorEmoji: "🏋️", content: "15kg 혹시 남으면 연락주세요ㅠ", createdAt: "2026-03-04T15:00:00" },
    ],
    createdAt: "2026-03-04T12:00:00",
  },
  {
    id: 4, author: "벤치100도전", authorEmoji: "💪", category: "proof",
    title: "벤치프레스 100kg 달성! 🎉", content: "운동 시작한 지 1년 만에 드디어 벤치 100 찍었습니다! 처음에 40kg도 못 들었는데... 포기하지 마세요 여러분!",
    location: "송파구", likes: 89, comments: [
      { id: 6, author: "화이팅", authorEmoji: "🔥", content: "대박 축하드려요!! 비결이 뭔가요?", createdAt: "2026-03-04T08:00:00" },
      { id: 7, author: "헬린이", authorEmoji: "🐣", content: "동기부여 됩니다ㅠㅠ", createdAt: "2026-03-04T09:30:00" },
      { id: 8, author: "PT쌤", authorEmoji: "👨‍🏫", content: "정말 대단해요! 점진적 과부하가 핵심이죠", createdAt: "2026-03-04T10:00:00" },
    ],
    createdAt: "2026-03-04T07:00:00",
  },
  {
    id: 5, author: "필라퀸", authorEmoji: "🤸", category: "proof",
    title: "필라테스 6개월차 비포/애프터", content: "필라테스 시작하고 체형이 확 바뀌었어요. 거북목이 많이 개선되고, 코어 힘이 엄청 좋아졌습니다. 자세 교정 최고!",
    location: "서초구", likes: 56, comments: [
      { id: 9, author: "자세교정", authorEmoji: "🧘", content: "저도 거북목 심한데 효과 있나요?", createdAt: "2026-03-03T22:00:00" },
    ],
    createdAt: "2026-03-03T19:00:00",
  },
  {
    id: 6, author: "PT쌤", authorEmoji: "👨‍🏫", category: "info",
    title: "초보자 3분할 루틴 추천 (무료)", content: "Day1: 가슴+삼두 (벤치프레스, 인클라인DB, 딥스, 케이블플라이)\nDay2: 등+이두 (데드리프트, 풀업, 바벨로우, 컬)\nDay3: 하체+어깨 (스쿼트, 레그프레스, OHP, 사이드레터럴)\n\n주 3~4일이면 충분합니다!",
    location: "영등포구", likes: 145, comments: [
      { id: 10, author: "헬린이", authorEmoji: "🐣", content: "감사합니다! 저장했어요", createdAt: "2026-03-02T10:00:00" },
      { id: 11, author: "운동초보", authorEmoji: "🏃", content: "세트수는 어떻게 하나요?", createdAt: "2026-03-02T11:00:00" },
    ],
    createdAt: "2026-03-02T08:00:00",
  },
  {
    id: 7, author: "러닝크루장", authorEmoji: "🏃", category: "mate",
    title: "여의도 러닝크루 모집!", content: "매주 화/목 저녁 7시 여의도공원 출발! 5~7km 페이스런 합니다. 초보자 페이스메이커도 있어요. 현재 15명, 5자리 남았습니다!",
    location: "영등포구", likes: 67, comments: [
      { id: 12, author: "달리자", authorEmoji: "👟", content: "페이스가 어느 정도인가요?", createdAt: "2026-03-03T12:00:00" },
      { id: 13, author: "러닝초보", authorEmoji: "🌱", content: "km당 7분도 괜찮나요?", createdAt: "2026-03-03T14:00:00" },
    ],
    createdAt: "2026-03-03T10:00:00",
  },
  {
    id: 8, author: "식단마스터", authorEmoji: "🥗", category: "info",
    title: "벌크업 식단 꿀팁 공유", content: "닭가슴살만 먹지 마세요! 달걀 10개(노른자 3개), 그릭요거트, 고구마, 바나나 쉐이크가 가성비 최고입니다. 단백질 체중x2g 목표!",
    location: "관악구", likes: 98, comments: [
      { id: 14, author: "벌크중", authorEmoji: "🍖", content: "단백질 보충제 추천도 해주세요!", createdAt: "2026-03-01T16:00:00" },
    ],
    createdAt: "2026-03-01T14:00:00",
  },
  {
    id: 9, author: "홈트마니아", authorEmoji: "🏠", category: "share",
    title: "[판매] 폼롤러 + 요가매트 세트 만원", content: "폼롤러(상태 양호) + 요가매트(6mm) 세트로 1만원에 팔아요. 직거래 홍대입구역 근처. 사진은 댓글로 보내드려요!",
    location: "마포구", likes: 8, comments: [],
    createdAt: "2026-03-05T06:00:00",
  },
  {
    id: 10, author: "새벽운동러", authorEmoji: "🌙", category: "free",
    title: "새벽 5시 운동 루틴 공유", content: "6개월째 새벽 운동 중입니다. 처음엔 너무 힘들었는데 이젠 알람 없이도 눈이 떠져요. 저녁에 핸드폰 안 보는 게 핵심!",
    location: "성동구", likes: 43, comments: [
      { id: 15, author: "올빼미", authorEmoji: "🦉", content: "대단하시네요... 저는 아침에 못 일어나요ㅠ", createdAt: "2026-03-04T22:00:00" },
    ],
    createdAt: "2026-03-04T05:30:00",
  },
];

// Location
export function getLocation(): string {
  if (typeof window === "undefined") return "전체";
  return localStorage.getItem(LOCATION_KEY) || "전체";
}

export function setLocation(loc: string): void {
  if (typeof window !== "undefined") localStorage.setItem(LOCATION_KEY, loc);
}

export const LOCATIONS = [
  "전체", "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구",
  "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구",
  "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구",
  "은평구", "종로구", "중구", "중랑구",
];

// Posts CRUD
export function getPosts(): Post[] {
  if (typeof window === "undefined") return SAMPLE_POSTS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    // First time: initialize with samples
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_POSTS));
    return SAMPLE_POSTS;
  } catch {
    return SAMPLE_POSTS;
  }
}

export function savePosts(posts: Post[]): void {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function addPost(post: Omit<Post, "id" | "likes" | "comments" | "createdAt">): Post {
  const posts = getPosts();
  const newPost: Post = {
    ...post,
    id: Date.now(),
    likes: 0,
    comments: [],
    createdAt: new Date().toISOString(),
  };
  posts.unshift(newPost);
  savePosts(posts);
  return newPost;
}

export function toggleLike(postId: number): Post[] {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);
  if (post) {
    if (post.liked) {
      post.likes--;
      post.liked = false;
    } else {
      post.likes++;
      post.liked = true;
    }
  }
  savePosts(posts);
  return posts;
}

export function addComment(postId: number, author: string, authorEmoji: string, content: string): Post[] {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.comments.push({
      id: Date.now(),
      author,
      authorEmoji,
      content,
      createdAt: new Date().toISOString(),
    });
  }
  savePosts(posts);
  return posts;
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
  return date.toLocaleDateString("ko-KR");
}
