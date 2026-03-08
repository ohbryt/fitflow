// 피트니스 동영상 쇼츠 데이터 라이브러리
// Planfit, Muscle Monster 등 인기 피트니스 채널의 큐레이션 영상

export interface FitnessVideo {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  channelUrl: string;
  category: VideoCategory;
  tags: string[];
  duration?: string; // "0:30", "1:00" 등
  description: string;
}

export type VideoCategory =
  | "abs"
  | "full_body"
  | "upper_body"
  | "lower_body"
  | "stretching"
  | "home_workout"
  | "gym_routine"
  | "diet_tips"
  | "motivation"
  | "yoga"
  | "pilates";

export const VIDEO_CATEGORIES: Record<VideoCategory, { label: string; emoji: string; color: string }> = {
  abs: { label: "복근 운동", emoji: "🔥", color: "from-red-500/20 to-orange-500/20" },
  full_body: { label: "전신 운동", emoji: "💪", color: "from-blue-500/20 to-cyan-500/20" },
  upper_body: { label: "상체 운동", emoji: "🏋️", color: "from-purple-500/20 to-pink-500/20" },
  lower_body: { label: "하체 운동", emoji: "🦵", color: "from-green-500/20 to-emerald-500/20" },
  stretching: { label: "스트레칭", emoji: "🧘", color: "from-teal-500/20 to-cyan-500/20" },
  home_workout: { label: "홈트레이닝", emoji: "🏠", color: "from-amber-500/20 to-yellow-500/20" },
  gym_routine: { label: "헬스장 루틴", emoji: "🏢", color: "from-indigo-500/20 to-violet-500/20" },
  diet_tips: { label: "식단 팁", emoji: "🥗", color: "from-lime-500/20 to-green-500/20" },
  motivation: { label: "동기부여", emoji: "🔥", color: "from-rose-500/20 to-red-500/20" },
  yoga: { label: "요가", emoji: "🧘", color: "from-violet-500/20 to-purple-500/20" },
  pilates: { label: "필라테스", emoji: "🤸", color: "from-pink-500/20 to-fuchsia-500/20" },
};

export const FITNESS_VIDEOS: FitnessVideo[] = [
  // === 복근 운동 ===
  {
    id: "v1",
    youtubeId: "JQmBrj7cKVU",
    title: "Muscle Monster Best Abs Workout 30 Days",
    channel: "Muscle Monster Diet Plan",
    channelUrl: "https://www.youtube.com/@Serensoni.gaming",
    category: "abs",
    tags: ["복근", "30일 챌린지", "홈트"],
    duration: "0:45",
    description: "30일 만에 복근을 만드는 고강도 복근 운동 루틴. 매일 따라하면 눈에 보이는 변화!",
  },
  {
    id: "v2",
    youtubeId: "3p8EBPVZ2Iw",
    title: "하루 5분! 복근 완성 루틴",
    channel: "땅끄부부",
    channelUrl: "https://www.youtube.com/@thankyoububu",
    category: "abs",
    tags: ["복근", "5분 운동", "초보자"],
    duration: "0:58",
    description: "하루 딱 5분! 초보자도 따라하기 쉬운 복근 운동으로 탄탄한 코어를 만들어보세요.",
  },
  {
    id: "v3",
    youtubeId: "AnYl6rRKEaY",
    title: "식스팩 만드는 복근 운동 TOP 5",
    channel: "핏블리",
    channelUrl: "https://www.youtube.com/@FitBly",
    category: "abs",
    tags: ["식스팩", "복근", "TOP5"],
    duration: "0:50",
    description: "가장 효과적인 복근 운동 5가지를 모아 한 번에 알려드립니다.",
  },

  // === 전신 운동 ===
  {
    id: "v4",
    youtubeId: "UItWltVZZmE",
    title: "전신 타바타 4분 루틴",
    channel: "Thankyou BUBU",
    channelUrl: "https://www.youtube.com/@thankyoububu",
    category: "full_body",
    tags: ["전신", "타바타", "4분", "HIIT"],
    duration: "0:55",
    description: "단 4분으로 전신을 태우는 고강도 타바타 루틴! 시간 없는 직장인에게 추천.",
  },
  {
    id: "v5",
    youtubeId: "ml6cT4AZdqI",
    title: "매일 10분 전신 운동",
    channel: "힙으뜸",
    channelUrl: "https://www.youtube.com/@hip_zzang",
    category: "full_body",
    tags: ["전신", "10분", "매일", "다이어트"],
    duration: "0:48",
    description: "매일 10분이면 충분! 전신 근력과 유산소를 동시에 잡는 운동.",
  },

  // === 상체 운동 ===
  {
    id: "v6",
    youtubeId: "dZgVxmf6jkA",
    title: "넓은 어깨 만드는 3가지 운동",
    channel: "김종국 GYM JONG KOOK",
    channelUrl: "https://www.youtube.com/@gymjongkook",
    category: "upper_body",
    tags: ["어깨", "넓은 어깨", "헬스장"],
    duration: "0:59",
    description: "어깨를 넓혀주는 필수 운동 3가지! 사이드 레터럴부터 프레스까지.",
  },
  {
    id: "v7",
    youtubeId: "IODxDxX7oi4",
    title: "팔굽혀펴기 완벽 자세",
    channel: "FitFlow",
    channelUrl: "https://www.youtube.com/@fitflow",
    category: "upper_body",
    tags: ["푸시업", "맨몸운동", "초보자"],
    duration: "0:40",
    description: "정확한 푸시업 자세로 가슴과 삼두를 효과적으로 자극하는 방법.",
  },

  // === 하체 운동 ===
  {
    id: "v8",
    youtubeId: "ultWZbUMPL8",
    title: "스쿼트 자세 교정",
    channel: "FitFlow",
    channelUrl: "https://www.youtube.com/@fitflow",
    category: "lower_body",
    tags: ["스쿼트", "자세 교정", "하체"],
    duration: "0:55",
    description: "스쿼트 할 때 무릎이 아프다면? 올바른 스쿼트 폼을 알려드립니다.",
  },
  {
    id: "v9",
    youtubeId: "IZxyjW7MPJQ",
    title: "레그프레스 올바른 사용법",
    channel: "FitFlow",
    channelUrl: "https://www.youtube.com/@fitflow",
    category: "lower_body",
    tags: ["레그프레스", "하체", "머신"],
    duration: "0:42",
    description: "레그프레스 머신으로 대퇴사두와 둔근을 효과적으로 자극하는 방법.",
  },

  // === 홈트레이닝 ===
  {
    id: "v10",
    youtubeId: "gVeJlJYicfA",
    title: "운동이 쉬워진다, 플랜핏!",
    channel: "Planfit",
    channelUrl: "https://www.youtube.com/@planfit",
    category: "home_workout",
    tags: ["헬린이", "헬스루틴", "헬스장루틴", "헬스장"],
    duration: "0:30",
    description: "AI가 추천하는 맞춤 운동 루틴으로 운동이 쉬워집니다.",
  },
  {
    id: "v11",
    youtubeId: "a16ynGdm7XM",
    title: "혼자서 운동하시나요? 운동이 쉬워진다, 플랜핏!",
    channel: "Planfit",
    channelUrl: "https://www.youtube.com/@planfit",
    category: "home_workout",
    tags: ["혼자 운동", "맞춤 루틴", "AI 추천"],
    duration: "0:30",
    description: "혼자 운동하는 분들을 위한 AI 맞춤 운동 플랜 서비스.",
  },
  {
    id: "v12",
    youtubeId: "Wl_vFMIkCjw",
    title: "맨몸으로 하는 전신 홈트 15분",
    channel: "빅씨스",
    channelUrl: "https://www.youtube.com/@bigsis",
    category: "home_workout",
    tags: ["맨몸운동", "홈트", "15분", "전신"],
    duration: "0:50",
    description: "기구 없이 집에서 하는 15분 전신 운동! 초보자도 OK.",
  },

  // === 헬스장 루틴 ===
  {
    id: "v13",
    youtubeId: "rT7DgCr-3pg",
    title: "벤치프레스 초보 가이드",
    channel: "FitFlow",
    channelUrl: "https://www.youtube.com/@fitflow",
    category: "gym_routine",
    tags: ["벤치프레스", "가슴", "초보자", "헬스장"],
    duration: "0:58",
    description: "벤치프레스 처음 시작하는 분들을 위한 완벽 가이드.",
  },
  {
    id: "v14",
    youtubeId: "op9kVnSso6Q",
    title: "데드리프트 완벽 폼",
    channel: "FitFlow",
    channelUrl: "https://www.youtube.com/@fitflow",
    category: "gym_routine",
    tags: ["데드리프트", "등", "3대 운동"],
    duration: "0:52",
    description: "데드리프트의 정확한 폼과 흔한 실수 교정법.",
  },

  // === 스트레칭 ===
  {
    id: "v15",
    youtubeId: "g_tea8ZNk5A",
    title: "운동 후 5분 쿨다운 스트레칭",
    channel: "피지컬갤러리",
    channelUrl: "https://www.youtube.com/@physicalgallery",
    category: "stretching",
    tags: ["쿨다운", "스트레칭", "회복"],
    duration: "0:45",
    description: "운동 후 반드시 해야 하는 쿨다운 스트레칭으로 부상을 예방하세요.",
  },
  {
    id: "v16",
    youtubeId: "4pKly2JojMw",
    title: "전신 스트레칭 10분 루틴",
    channel: "올리브",
    channelUrl: "https://www.youtube.com/@olive",
    category: "stretching",
    tags: ["전신 스트레칭", "유연성", "아침 루틴"],
    duration: "0:55",
    description: "아침에 일어나서 따라하는 10분 전신 스트레칭. 하루를 개운하게!",
  },

  // === 식단 팁 ===
  {
    id: "v17",
    youtubeId: "h1bJTPIW_gQ",
    title: "벌크업 식단 하루 3000kcal",
    channel: "피지컬갤러리",
    channelUrl: "https://www.youtube.com/@physicalgallery",
    category: "diet_tips",
    tags: ["벌크업", "식단", "3000칼로리"],
    duration: "0:58",
    description: "근육을 키우기 위한 벌크업 식단 3000kcal 구성법!",
  },
  {
    id: "v18",
    youtubeId: "qQMvL5GJ-dA",
    title: "다이어트 식단 준비하는 법",
    channel: "핏블리",
    channelUrl: "https://www.youtube.com/@FitBly",
    category: "diet_tips",
    tags: ["다이어트", "식단", "밀프렙"],
    duration: "0:50",
    description: "일주일 식단을 한 번에 준비하는 밀프렙 꿀팁!",
  },

  // === 동기부여 ===
  {
    id: "v19",
    youtubeId: "zcMBm-UVdII",
    title: "운동 시작이 어렵다면 이 영상을 보세요",
    channel: "김종국 GYM JONG KOOK",
    channelUrl: "https://www.youtube.com/@gymjongkook",
    category: "motivation",
    tags: ["동기부여", "시작", "마인드셋"],
    duration: "0:45",
    description: "운동을 시작하기 어려운 분들에게 전하는 동기부여 영상.",
  },
  {
    id: "v20",
    youtubeId: "VHrLPs3_1Fs",
    title: "운동 1년 변화 | 바디 트랜스포메이션",
    channel: "핏블리",
    channelUrl: "https://www.youtube.com/@FitBly",
    category: "motivation",
    tags: ["변화", "비포애프터", "1년"],
    duration: "0:55",
    description: "1년간 꾸준히 운동한 결과! 놀라운 바디 트랜스포메이션.",
  },

  // === 요가 ===
  {
    id: "v21",
    youtubeId: "v7AYKMP6rOE",
    title: "초보자 요가 20분 루틴",
    channel: "요가소풍",
    channelUrl: "https://www.youtube.com/@yogasopung",
    category: "yoga",
    tags: ["요가", "초보자", "20분", "홈요가"],
    duration: "0:58",
    description: "요가 처음이어도 괜찮아요! 기초 자세부터 천천히 따라하는 20분 루틴.",
  },
  {
    id: "v22",
    youtubeId: "g_tea8ZNk5A",
    title: "아침 요가 10분 | 하루를 여는 스트레칭",
    channel: "요가린",
    channelUrl: "https://www.youtube.com/@yogarin",
    category: "yoga",
    tags: ["아침 요가", "모닝 루틴", "스트레칭", "10분"],
    duration: "0:50",
    description: "아침에 일어나서 10분! 몸을 깨우고 하루를 개운하게 시작하세요.",
  },
  {
    id: "v23",
    youtubeId: "4pKly2JojMw",
    title: "전신 유연성 요가 플로우",
    channel: "요가소풍",
    channelUrl: "https://www.youtube.com/@yogasopung",
    category: "yoga",
    tags: ["유연성", "요가 플로우", "전신", "비니아사"],
    duration: "0:55",
    description: "전신 유연성을 높여주는 비니아사 요가 플로우. 호흡과 함께 흘러가세요.",
  },
  {
    id: "v24",
    youtubeId: "Eml2xnoLpYE",
    title: "자기 전 요가 | 숙면을 위한 릴랙스 요가",
    channel: "채널 요가",
    channelUrl: "https://www.youtube.com/@channelyoga",
    category: "yoga",
    tags: ["숙면", "릴랙스", "자기 전", "야간 요가"],
    duration: "0:48",
    description: "잠들기 전 긴장을 풀어주는 릴랙스 요가. 깊은 수면을 도와줍니다.",
  },
  {
    id: "v25",
    youtubeId: "brFHyOtTwH4",
    title: "태양 경배 자세 완벽 가이드",
    channel: "FitFlow",
    channelUrl: "https://www.youtube.com/@fitflow",
    category: "yoga",
    tags: ["태양 경배", "수리아 나마스카라", "기초 자세"],
    duration: "0:42",
    description: "요가의 기본 중의 기본! 태양 경배 A·B 자세를 단계별로 알려드립니다.",
  },
  {
    id: "v26",
    youtubeId: "oX6I6vs1EFs",
    title: "허리 통증 완화 요가 15분",
    channel: "요가린",
    channelUrl: "https://www.youtube.com/@yogarin",
    category: "yoga",
    tags: ["허리 통증", "통증 완화", "직장인", "15분"],
    duration: "0:52",
    description: "오래 앉아있는 직장인을 위한 허리 통증 완화 요가 루틴.",
  },

  // === 필라테스 ===
  {
    id: "v27",
    youtubeId: "K56Z12XNQ5c",
    title: "필라테스 입문 20분 매트 루틴",
    channel: "피지컬갤러리",
    channelUrl: "https://www.youtube.com/@physicalgallery",
    category: "pilates",
    tags: ["필라테스", "입문", "매트", "20분"],
    duration: "0:55",
    description: "기구 없이 매트 하나로! 필라테스 기초 동작을 배우는 20분 루틴.",
  },
  {
    id: "v28",
    youtubeId: "Wl_vFMIkCjw",
    title: "코어 강화 필라테스 | 더 헌드레드부터",
    channel: "빅씨스",
    channelUrl: "https://www.youtube.com/@bigsis",
    category: "pilates",
    tags: ["코어", "더 헌드레드", "복근", "필라테스"],
    duration: "0:50",
    description: "필라테스의 대표 동작 더 헌드레드를 포함한 코어 강화 루틴!",
  },
  {
    id: "v29",
    youtubeId: "qQMvL5GJ-dA",
    title: "하체 라인 필라테스 | 다리 & 힙",
    channel: "핏블리",
    channelUrl: "https://www.youtube.com/@FitBly",
    category: "pilates",
    tags: ["하체", "힙업", "다리 라인", "필라테스"],
    duration: "0:48",
    description: "날씬한 다리 라인과 탄탄한 힙을 만드는 필라테스 동작 모음.",
  },
  {
    id: "v30",
    youtubeId: "h1bJTPIW_gQ",
    title: "전신 필라테스 30분 | 홈필라테스",
    channel: "땅끄부부",
    channelUrl: "https://www.youtube.com/@thankyoububu",
    category: "pilates",
    tags: ["전신", "30분", "홈필라테스", "매트"],
    duration: "0:58",
    description: "30분 전신 필라테스로 유연성과 근력을 동시에! 집에서 따라해보세요.",
  },
  {
    id: "v31",
    youtubeId: "zcMBm-UVdII",
    title: "필라테스 자세 교정 | 거북목 & 라운드 숄더",
    channel: "채널 필라테스",
    channelUrl: "https://www.youtube.com/@channelpilates",
    category: "pilates",
    tags: ["자세 교정", "거북목", "라운드 숄더", "직장인"],
    duration: "0:45",
    description: "컴퓨터 많이 쓰는 분 필수! 거북목과 굽은 어깨를 교정하는 필라테스.",
  },
  {
    id: "v32",
    youtubeId: "ASdvN_XEl_c",
    title: "필라테스 플랭크 변형 5가지",
    channel: "FitFlow",
    channelUrl: "https://www.youtube.com/@fitflow",
    category: "pilates",
    tags: ["플랭크", "코어", "변형 동작", "필라테스"],
    duration: "0:40",
    description: "기본 플랭크가 지루하다면? 필라테스 스타일 플랭크 변형 5가지!",
  },

  // === FitFlow 자체 채널 (애니메이션 튜토리얼) ===
  {
    id: "v33",
    youtubeId: "rT7DgCr-3pg",
    title: "[FitFlow] 벤치프레스 완벽 가이드 | 3D 애니메이션",
    channel: "FitFlow 핏플로우",
    channelUrl: "https://www.youtube.com/@fitflow",
    category: "gym_routine",
    tags: ["FitFlow", "애니메이션", "벤치프레스", "3D 가이드"],
    duration: "0:55",
    description: "3D 애니메이션으로 보는 벤치프레스 완벽 자세 가이드. FitFlow 오리지널!",
  },
  {
    id: "v34",
    youtubeId: "ultWZbUMPL8",
    title: "[FitFlow] 스쿼트 자세 교정 | 3D 애니메이션",
    channel: "FitFlow 핏플로우",
    channelUrl: "https://www.youtube.com/@fitflow",
    category: "lower_body",
    tags: ["FitFlow", "애니메이션", "스쿼트", "자세 교정"],
    duration: "0:50",
    description: "3D 근육 애니메이션으로 보는 스쿼트 정확한 폼. 어디가 자극되는지 한눈에!",
  },
  {
    id: "v35",
    youtubeId: "op9kVnSso6Q",
    title: "[FitFlow] 데드리프트 근육 활성화 | 3D 애니메이션",
    channel: "FitFlow 핏플로우",
    channelUrl: "https://www.youtube.com/@fitflow",
    category: "gym_routine",
    tags: ["FitFlow", "애니메이션", "데드리프트", "근육 활성화"],
    duration: "0:48",
    description: "데드리프트 할 때 어떤 근육이 자극되는지 3D로 확인하세요!",
  },
];

// 카테고리별 영상 필터
export function getVideosByCategory(category: VideoCategory): FitnessVideo[] {
  return FITNESS_VIDEOS.filter(v => v.category === category);
}

// 태그로 영상 검색
export function searchVideosByTag(tag: string): FitnessVideo[] {
  return FITNESS_VIDEOS.filter(v =>
    v.tags.some(t => t.includes(tag)) || v.title.includes(tag)
  );
}

// 랜덤 추천 영상
export function getRecommendedVideos(count: number = 5): FitnessVideo[] {
  const shuffled = [...FITNESS_VIDEOS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// AI 운동 플랜 서비스 데이터
export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: string; // "4주", "8주" 등
  frequency: string; // "주 3일", "주 5일" 등
  goal: string;
  emoji: string;
  color: string;
  schedule: PlanDay[];
}

export interface PlanDay {
  day: string;
  focus: string;
  exercises: PlanExercise[];
  estimatedTime: string;
  caloriesBurn: string;
}

export interface PlanExercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  videoId?: string; // 연관 영상 ID
}

export const AI_WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: "plan-beginner-4w",
    name: "헬린이 4주 입문 프로그램",
    description: "운동을 처음 시작하는 분들을 위한 기초 체력 프로그램. 점진적으로 강도를 높여갑니다.",
    level: "beginner",
    duration: "4주",
    frequency: "주 3일",
    goal: "기초 체력 향상 & 운동 습관 형성",
    emoji: "🌱",
    color: "from-emerald-500/20 to-green-500/20",
    schedule: [
      {
        day: "Day 1 - 상체 기초",
        focus: "가슴 · 어깨 · 삼두",
        estimatedTime: "40분",
        caloriesBurn: "200~300kcal",
        exercises: [
          { name: "푸시업 (무릎)", sets: "3", reps: "10회", rest: "60초", videoId: "IODxDxX7oi4" },
          { name: "덤벨 숄더프레스", sets: "3", reps: "12회", rest: "60초" },
          { name: "덤벨 플라이", sets: "3", reps: "12회", rest: "60초", videoId: "eozdVDA78K0" },
          { name: "트라이셉 딥스 (벤치)", sets: "3", reps: "10회", rest: "60초" },
          { name: "플랭크", sets: "3", reps: "30초", rest: "45초", videoId: "ASdvN_XEl_c" },
        ],
      },
      {
        day: "Day 2 - 하체 기초",
        focus: "대퇴 · 둔근 · 햄스트링",
        estimatedTime: "40분",
        caloriesBurn: "250~350kcal",
        exercises: [
          { name: "바디웨이트 스쿼트", sets: "3", reps: "15회", rest: "60초", videoId: "ultWZbUMPL8" },
          { name: "런지", sets: "3", reps: "12회(양쪽)", rest: "60초", videoId: "QOVaHwm-Q6U" },
          { name: "글루트 브릿지", sets: "3", reps: "15회", rest: "45초" },
          { name: "카프 레이즈", sets: "3", reps: "20회", rest: "45초", videoId: "gwLzBJYoWlI" },
          { name: "크런치", sets: "3", reps: "15회", rest: "45초", videoId: "Xyd_fa5zoEU" },
        ],
      },
      {
        day: "Day 3 - 전신 & 유산소",
        focus: "전신 근력 + 심폐지구력",
        estimatedTime: "35분",
        caloriesBurn: "300~400kcal",
        exercises: [
          { name: "버피", sets: "3", reps: "8회", rest: "90초" },
          { name: "마운틴 클라이머", sets: "3", reps: "20회", rest: "60초" },
          { name: "점핑잭", sets: "3", reps: "30회", rest: "45초" },
          { name: "바디웨이트 로우", sets: "3", reps: "10회", rest: "60초" },
          { name: "러시안 트위스트", sets: "3", reps: "20회", rest: "45초", videoId: "wkD8rjkodUI" },
        ],
      },
    ],
  },
  {
    id: "plan-abs-30d",
    name: "30일 복근 챌린지",
    description: "매일 15분! 30일 동안 매일 복근 운동으로 탄탄한 코어를 완성하는 프로그램.",
    level: "beginner",
    duration: "30일",
    frequency: "매일 15분",
    goal: "복근 강화 & 코어 안정성",
    emoji: "🔥",
    color: "from-red-500/20 to-orange-500/20",
    schedule: [
      {
        day: "Week 1 - 기초 코어",
        focus: "복직근 · 복횡근",
        estimatedTime: "15분",
        caloriesBurn: "100~150kcal",
        exercises: [
          { name: "크런치", sets: "3", reps: "15회", rest: "30초", videoId: "Xyd_fa5zoEU" },
          { name: "플랭크", sets: "3", reps: "30초", rest: "30초", videoId: "ASdvN_XEl_c" },
          { name: "레그 레이즈", sets: "3", reps: "12회", rest: "30초", videoId: "JB2oyawG9KI" },
          { name: "바이시클 크런치", sets: "3", reps: "20회", rest: "30초" },
        ],
      },
      {
        day: "Week 2 - 강도 UP",
        focus: "복직근 · 복사근",
        estimatedTime: "15분",
        caloriesBurn: "120~170kcal",
        exercises: [
          { name: "V업", sets: "3", reps: "12회", rest: "30초" },
          { name: "사이드 플랭크", sets: "3", reps: "30초(양쪽)", rest: "30초" },
          { name: "러시안 트위스트", sets: "3", reps: "24회", rest: "30초", videoId: "wkD8rjkodUI" },
          { name: "마운틴 클라이머", sets: "3", reps: "20회", rest: "30초" },
          { name: "할로우 홀드", sets: "3", reps: "20초", rest: "30초" },
        ],
      },
      {
        day: "Week 3-4 - 마스터",
        focus: "전체 코어 복합 동작",
        estimatedTime: "15분",
        caloriesBurn: "150~200kcal",
        exercises: [
          { name: "행잉 레그레이즈", sets: "3", reps: "10회", rest: "45초" },
          { name: "ab 롤아웃", sets: "3", reps: "10회", rest: "45초", videoId: "rqiTPl9SstE" },
          { name: "드래곤 플래그", sets: "3", reps: "6회", rest: "60초" },
          { name: "토 터치 크런치", sets: "3", reps: "15회", rest: "30초" },
          { name: "플랭크 투 푸시업", sets: "3", reps: "10회", rest: "45초" },
        ],
      },
    ],
  },
  {
    id: "plan-home-8w",
    name: "홈트 8주 바디 체인지",
    description: "기구 없이 집에서 하는 8주 체형 변화 프로그램. 유산소와 근력을 조합한 과학적 루틴.",
    level: "intermediate",
    duration: "8주",
    frequency: "주 5일",
    goal: "체지방 감소 & 근력 향상",
    emoji: "🏠",
    color: "from-amber-500/20 to-yellow-500/20",
    schedule: [
      {
        day: "월/목 - 상체 집중",
        focus: "가슴 · 등 · 어깨 · 팔",
        estimatedTime: "45분",
        caloriesBurn: "300~400kcal",
        exercises: [
          { name: "다이아몬드 푸시업", sets: "4", reps: "12회", rest: "60초" },
          { name: "파이크 푸시업", sets: "3", reps: "10회", rest: "60초" },
          { name: "딥스 (의자)", sets: "4", reps: "12회", rest: "60초" },
          { name: "슈퍼맨", sets: "3", reps: "15회", rest: "45초" },
          { name: "플랭크 숄더탭", sets: "3", reps: "20회", rest: "45초" },
        ],
      },
      {
        day: "화/금 - 하체 집중",
        focus: "대퇴 · 둔근 · 종아리",
        estimatedTime: "45분",
        caloriesBurn: "350~450kcal",
        exercises: [
          { name: "점프 스쿼트", sets: "4", reps: "15회", rest: "60초" },
          { name: "불가리안 스플릿 스쿼트", sets: "3", reps: "12회(양쪽)", rest: "60초" },
          { name: "힙 스러스트", sets: "4", reps: "15회", rest: "60초" },
          { name: "월 시트", sets: "3", reps: "45초", rest: "60초" },
          { name: "싱글 레그 카프 레이즈", sets: "3", reps: "15회(양쪽)", rest: "45초" },
        ],
      },
      {
        day: "수 - HIIT 유산소",
        focus: "심폐지구력 + 체지방 감소",
        estimatedTime: "30분",
        caloriesBurn: "400~500kcal",
        exercises: [
          { name: "버피", sets: "5", reps: "10회", rest: "30초" },
          { name: "하이니", sets: "5", reps: "30초", rest: "15초" },
          { name: "점핑 런지", sets: "4", reps: "16회", rest: "30초" },
          { name: "마운틴 클라이머", sets: "4", reps: "30초", rest: "15초" },
          { name: "스케이터 점프", sets: "4", reps: "20회", rest: "30초" },
        ],
      },
    ],
  },
  {
    id: "plan-gym-ppl",
    name: "헬스장 PPL 12주 프로그램",
    description: "Push·Pull·Legs 분할법으로 근비대를 극대화하는 체계적 12주 프로그램.",
    level: "intermediate",
    duration: "12주",
    frequency: "주 6일",
    goal: "근비대 & 근력 향상",
    emoji: "🏋️",
    color: "from-indigo-500/20 to-violet-500/20",
    schedule: [
      {
        day: "Push Day (밀기)",
        focus: "가슴 · 어깨 · 삼두",
        estimatedTime: "60분",
        caloriesBurn: "350~450kcal",
        exercises: [
          { name: "벤치프레스", sets: "4", reps: "6-8회", rest: "120초", videoId: "rT7DgCr-3pg" },
          { name: "인클라인 DB프레스", sets: "3", reps: "10-12회", rest: "90초", videoId: "SrqOu55lrYU" },
          { name: "사이드 레터럴 레이즈", sets: "4", reps: "15회", rest: "60초", videoId: "3VcKaXpzqRo" },
          { name: "케이블 플라이", sets: "3", reps: "12-15회", rest: "60초", videoId: "taI4XduLpTk" },
          { name: "트라이셉 푸시다운", sets: "3", reps: "12회", rest: "60초", videoId: "2-LAMcpzODU" },
          { name: "오버헤드 익스텐션", sets: "3", reps: "12회", rest: "60초" },
        ],
      },
      {
        day: "Pull Day (당기기)",
        focus: "등 · 이두 · 후면삼각",
        estimatedTime: "60분",
        caloriesBurn: "350~450kcal",
        exercises: [
          { name: "데드리프트", sets: "4", reps: "5-6회", rest: "180초", videoId: "op9kVnSso6Q" },
          { name: "풀업/랫풀다운", sets: "4", reps: "8-10회", rest: "90초", videoId: "eGo4IYlbE5g" },
          { name: "바벨 로우", sets: "3", reps: "8-10회", rest: "90초", videoId: "FWJR5Ve8bnQ" },
          { name: "페이스풀", sets: "3", reps: "15회", rest: "60초", videoId: "rep-qVOkqgk" },
          { name: "바벨 컬", sets: "3", reps: "10-12회", rest: "60초", videoId: "kwG2ipFRgFo" },
          { name: "해머 컬", sets: "3", reps: "12회", rest: "60초", videoId: "zC3nLlEvin4" },
        ],
      },
      {
        day: "Legs Day (하체)",
        focus: "대퇴사두 · 둔근 · 햄스트링 · 종아리",
        estimatedTime: "60분",
        caloriesBurn: "400~500kcal",
        exercises: [
          { name: "스쿼트", sets: "4", reps: "6-8회", rest: "180초", videoId: "ultWZbUMPL8" },
          { name: "레그프레스", sets: "3", reps: "12회", rest: "90초", videoId: "IZxyjW7MPJQ" },
          { name: "루마니안 데드리프트", sets: "3", reps: "10회", rest: "90초", videoId: "jEy_czb3RKA" },
          { name: "레그 익스텐션", sets: "3", reps: "12-15회", rest: "60초", videoId: "YyvSfVjQeL0" },
          { name: "레그 컬", sets: "3", reps: "12회", rest: "60초", videoId: "1Tq3QdYUuHs" },
          { name: "카프 레이즈", sets: "4", reps: "15-20회", rest: "45초", videoId: "gwLzBJYoWlI" },
        ],
      },
    ],
  },
];

export const PLAN_LEVELS: Record<string, { label: string; color: string }> = {
  beginner: { label: "초급", color: "text-green-400 bg-green-500/10" },
  intermediate: { label: "중급", color: "text-yellow-400 bg-yellow-500/10" },
  advanced: { label: "고급", color: "text-red-400 bg-red-500/10" },
};
