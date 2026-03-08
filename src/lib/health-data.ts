// ========== 건강 관리 데이터 ==========

// BMI 카테고리
export const BMI_CATEGORIES = [
  { min: 0, max: 18.5, label: "저체중", color: "text-blue-400", bg: "bg-blue-500/10", advice: "체중 증가를 위한 고칼로리 식단과 근력 운동을 추천합니다." },
  { min: 18.5, max: 23, label: "정상", color: "text-emerald-400", bg: "bg-emerald-500/10", advice: "건강한 체중입니다! 현재 생활 습관을 유지하세요." },
  { min: 23, max: 25, label: "과체중", color: "text-amber-400", bg: "bg-amber-500/10", advice: "식단 조절과 유산소 운동을 시작해보세요." },
  { min: 25, max: 30, label: "비만 1단계", color: "text-orange-400", bg: "bg-orange-500/10", advice: "체중 감량을 위한 식단 관리와 규칙적인 운동이 필요합니다." },
  { min: 30, max: 100, label: "비만 2단계", color: "text-red-400", bg: "bg-red-500/10", advice: "전문의 상담을 권장합니다. 체계적인 관리가 필요합니다." },
];

export function getBmiCategory(bmi: number) {
  return BMI_CATEGORIES.find(c => bmi >= c.min && bmi < c.max) || BMI_CATEGORIES[BMI_CATEGORIES.length - 1];
}

// ========== 유전자 검사 항목 ==========
export interface GeneticTrait {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  levels: string[];  // low, normal, high risk
  recommendations: Record<string, string[]>;
}

export const GENETIC_CATEGORIES = [
  { id: "body", label: "체질/체형", icon: "🧬", color: "from-indigo-500/20 to-violet-500/10" },
  { id: "nutrition", label: "영양소", icon: "💊", color: "from-emerald-500/20 to-teal-500/10" },
  { id: "fitness", label: "운동능력", icon: "🏋️", color: "from-amber-500/20 to-orange-500/10" },
  { id: "skin", label: "피부/노화", icon: "✨", color: "from-rose-500/20 to-pink-500/10" },
  { id: "health", label: "건강위험", icon: "❤️", color: "from-red-500/20 to-rose-500/10" },
];

export const GENETIC_TRAITS: GeneticTrait[] = [
  {
    id: "obesity", name: "비만 유전자 (FTO)", category: "body", icon: "⚖️",
    description: "FTO 유전자 변이는 식욕 조절과 지방 축적에 영향을 줍니다.",
    levels: ["낮은 위험", "보통 위험", "높은 위험"],
    recommendations: {
      "낮은 위험": ["일반적인 식단 관리로 충분합니다", "규칙적인 운동 습관 유지"],
      "보통 위험": ["탄수화물 섭취량을 모니터링하세요", "주 3~4회 유산소 운동 추천", "간식 섭취 주의"],
      "높은 위험": ["엄격한 칼로리 관리가 필요합니다", "고강도 인터벌 운동(HIIT) 추천", "정제 탄수화물 최소화", "식이섬유 풍부한 식단 구성"],
    },
  },
  {
    id: "muscle", name: "근육 발달 (ACTN3)", category: "fitness", icon: "💪",
    description: "ACTN3 유전자는 속근(파워) vs 지근(지구력) 비율에 영향을 줍니다.",
    levels: ["지구력형 (RR)", "균형형 (RX)", "파워형 (XX)"],
    recommendations: {
      "지구력형 (RR)": ["마라톤, 수영, 자전거 등 지구력 운동에 유리", "고반복 저중량 트레이닝 추천", "유산소 운동 능력이 뛰어남"],
      "균형형 (RX)": ["다양한 운동 유형에 적응력이 좋음", "근력+유산소 균형 잡힌 프로그램 추천"],
      "파워형 (XX)": ["단거리, 역도, 크로스핏 등 파워 운동에 유리", "저반복 고중량 트레이닝 추천", "폭발적 힘 발휘에 강점"],
    },
  },
  {
    id: "vitaminD", name: "비타민D 대사", category: "nutrition", icon: "☀️",
    description: "비타민D 합성 및 흡수 효율에 관여하는 유전자입니다.",
    levels: ["정상 대사", "약간 저하", "대사 저하"],
    recommendations: {
      "정상 대사": ["일반적인 야외 활동으로 충분", "균형 잡힌 식단 유지"],
      "약간 저하": ["하루 15~20분 햇빛 노출 권장", "비타민D 함유 식품 섭취 (연어, 달걀 등)"],
      "대사 저하": ["비타민D 보충제 복용 추천 (1000~2000IU/일)", "정기적 혈중 농도 검사", "칼슘 흡수 저하 주의"],
    },
  },
  {
    id: "caffeine", name: "카페인 대사", category: "nutrition", icon: "☕",
    description: "CYP1A2 유전자는 카페인 분해 속도를 결정합니다.",
    levels: ["빠른 대사 (Fast)", "보통 대사", "느린 대사 (Slow)"],
    recommendations: {
      "빠른 대사 (Fast)": ["운동 전 카페인 섭취가 퍼포먼스 향상에 효과적", "하루 3~4잔까지 무리 없음"],
      "보통 대사": ["하루 2잔 이내 권장", "오후 3시 이후 섭취 자제"],
      "느린 대사 (Slow)": ["카페인에 민감, 수면 영향 큼", "하루 1잔 이내, 오전에만 섭취", "디카페인 대체 추천"],
    },
  },
  {
    id: "collagen", name: "콜라겐 분해 (MMP1)", category: "skin", icon: "✨",
    description: "피부 콜라겐 분해 속도와 노화 진행에 관여합니다.",
    levels: ["느린 분해 (유리)", "보통", "빠른 분해 (주의)"],
    recommendations: {
      "느린 분해 (유리)": ["기본 자외선 차단제 사용", "균형 잡힌 항산화 식품 섭취"],
      "보통": ["SPF30+ 자외선 차단제 매일 사용", "비타민C 세럼 추천"],
      "빠른 분해 (주의)": ["SPF50+ 자외선 차단 필수", "콜라겐 보충제 섭취 추천", "레티놀, 비타민C 적극 활용", "항산화 식품 (베리류, 녹차) 다량 섭취"],
    },
  },
  {
    id: "bloodSugar", name: "혈당 관리 (TCF7L2)", category: "health", icon: "🩸",
    description: "인슐린 분비와 혈당 조절 능력에 영향을 미치는 유전자입니다.",
    levels: ["정상", "주의", "고위험"],
    recommendations: {
      "정상": ["일반적인 균형 식단으로 충분", "정기 건강검진 시 혈당 체크"],
      "주의": ["정제 탄수화물/당 섭취 제한", "식사 후 가벼운 산책 습관화", "혈당 지수(GI) 낮은 식품 선택"],
      "고위험": ["저탄수화물 식단 적극 고려", "식후 혈당 정기 모니터링", "고강도 보다 꾸준한 중강도 운동 추천", "3~6개월 주기 공복 혈당 검사"],
    },
  },
  {
    id: "lactose", name: "유당불내증", category: "nutrition", icon: "🥛",
    description: "유제품 소화 능력에 관여하는 LCT 유전자입니다.",
    levels: ["유당 분해 가능", "부분 분해", "유당불내증"],
    recommendations: {
      "유당 분해 가능": ["우유, 요거트 등 자유롭게 섭취 가능"],
      "부분 분해": ["발효 유제품(요거트, 치즈)은 소화 가능", "우유는 소량씩 섭취"],
      "유당불내증": ["유당 제거 우유 또는 두유 대체", "칼슘 보충제 별도 섭취 권장", "발효 유제품은 소량 가능할 수 있음"],
    },
  },
  {
    id: "hairloss", name: "탈모 위험 (AR)", category: "body", icon: "💇",
    description: "안드로겐 수용체 유전자로 남성형 탈모 위험도를 나타냅니다.",
    levels: ["낮은 위험", "보통 위험", "높은 위험"],
    recommendations: {
      "낮은 위험": ["기본 두피 관리로 충분"],
      "보통 위험": ["두피 건강에 신경 쓰기 (비오틴, 아연 섭취)", "스트레스 관리"],
      "높은 위험": ["조기 탈모 예방 관리 시작 추천", "피나스테리드/미녹시딜 전문의 상담", "비오틴, 아연, 철분 충분 섭취"],
    },
  },
];

// ========== 구강 마이크로바이옴 ==========
export interface OralBacteria {
  id: string;
  name: string;
  nameKo: string;
  type: "beneficial" | "harmful" | "neutral";
  icon: string;
  description: string;
  effects: string[];
  management: string[];
}

export const ORAL_BACTERIA: OralBacteria[] = [
  {
    id: "streptococcus_mutans", name: "Streptococcus mutans", nameKo: "스트렙토코커스 뮤탄스",
    type: "harmful", icon: "🦠",
    description: "충치(우식증)의 주요 원인균으로, 당분을 산으로 바꿔 치아 에나멜을 녹입니다.",
    effects: ["충치(치아 우식증) 유발", "치태(플라크) 형성", "산성 환경 조성으로 치아 부식"],
    management: ["설탕/탄수화물 섭취 후 바로 양치", "자일리톨 가글 또는 껌 사용", "불소 치약 사용", "정기 치과 검진 (6개월)"],
  },
  {
    id: "porphyromonas", name: "Porphyromonas gingivalis", nameKo: "포르피로모나스 진지발리스",
    type: "harmful", icon: "🔴",
    description: "치주질환(잇몸병)의 주요 원인균으로, 잇몸 조직을 파괴합니다.",
    effects: ["치주염 유발", "잇몸 출혈 및 퇴축", "치조골 파괴", "구취 유발"],
    management: ["올바른 칫솔질 + 치실 사용", "항균 가글 (클로르헥시딘)", "정기 스케일링 (3~6개월)", "흡연 중단"],
  },
  {
    id: "lactobacillus", name: "Lactobacillus", nameKo: "락토바실러스",
    type: "beneficial", icon: "🟢",
    description: "구강 내 유익균으로 유해균의 증식을 억제합니다.",
    effects: ["유해균 성장 억제", "구강 내 pH 균형 유지", "면역 방어 지원"],
    management: ["프로바이오틱스 함유 식품 섭취", "과도한 항균 가글 자제 (유익균도 제거됨)", "발효 식품 (요거트, 김치) 섭취"],
  },
  {
    id: "fusobacterium", name: "Fusobacterium nucleatum", nameKo: "푸소박테리움 뉴클레아텀",
    type: "harmful", icon: "🟠",
    description: "구강 내 다양한 세균들을 연결하는 '브릿지 세균'으로, 치주질환과 연관됩니다.",
    effects: ["치주질환 진행 촉진", "구취(입냄새) 주요 원인", "전신 염증과 연관 가능성"],
    management: ["혀 클리너 사용 (혀 세균 제거)", "치실 매일 사용", "항산화 식품 섭취 (녹차, 크랜베리)"],
  },
  {
    id: "streptococcus_salivarius", name: "Streptococcus salivarius", nameKo: "스트렙토코커스 살리바리우스",
    type: "beneficial", icon: "🟢",
    description: "구강 내 가장 먼저 정착하는 유익균으로 면역 균형을 돕습니다.",
    effects: ["구취 예방", "유해균 억제 물질 생산", "구강 면역 방어"],
    management: ["구강 프로바이오틱스 보충제 고려", "설탕 과다 섭취 자제", "스트레스 관리 (침 분비 감소 방지)"],
  },
];

export const ORAL_HEALTH_TIPS = [
  { title: "올바른 양치법", desc: "바스법으로 잇몸 경계를 45도 각도로, 2분 이상 양치. 하루 3회.", icon: "🪥" },
  { title: "치실 매일 사용", desc: "치간 세균의 40%는 칫솔로 제거 불가. 치실이나 치간칫솔 필수.", icon: "🧵" },
  { title: "혀 클리닝", desc: "구취의 주 원인은 혀 표면 세균. 혀 클리너로 매일 관리.", icon: "👅" },
  { title: "정기 스케일링", desc: "3~6개월마다 치과 방문. 치석 제거와 구강 건강 점검.", icon: "🏥" },
  { title: "구강 pH 관리", desc: "물 자주 마시기. 산성 음식 후 30분 뒤 양치. 무설탕 껌 활용.", icon: "💧" },
  { title: "금연", desc: "흡연은 구강 마이크로바이옴을 파괴하고 치주질환 위험 3~6배 증가.", icon: "🚭" },
];
