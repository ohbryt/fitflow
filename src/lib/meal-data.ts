// ========== 1주일 식단 데이터 ==========

export interface Meal {
  name: string;
  desc: string;
  calories: number;
  protein: number;  // g
  carbs: number;    // g
  fat: number;      // g
  ingredients: string[];
}

export interface DayMeals {
  day: string;
  dayLabel: string;
  breakfast: Meal;
  snack1: Meal;
  lunch: Meal;
  snack2: Meal;
  dinner: Meal;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  targetCalories: string;
  targetProtein: string;
  ratio: string; // 탄:단:지
  icon: string;
  color: string;
  tips: string[];
  days: DayMeals[];
}

function calcTotals(meals: Omit<DayMeals, "totalCalories" | "totalProtein" | "totalCarbs" | "totalFat">): DayMeals {
  const all = [meals.breakfast, meals.snack1, meals.lunch, meals.snack2, meals.dinner];
  return {
    ...meals,
    totalCalories: all.reduce((s, m) => s + m.calories, 0),
    totalProtein: all.reduce((s, m) => s + m.protein, 0),
    totalCarbs: all.reduce((s, m) => s + m.carbs, 0),
    totalFat: all.reduce((s, m) => s + m.fat, 0),
  };
}

// ===== 근력 향상 식단 (벌크업) =====
export const BULK_PLAN: MealPlan = {
  id: "bulk",
  name: "근력 향상 식단",
  description: "근성장을 위한 고단백 · 고탄수 식단 (벌크업)",
  targetCalories: "2,800~3,200 kcal/일",
  targetProtein: "체중(kg) × 1.6~2.2g",
  ratio: "탄 40 : 단 35 : 지 25",
  icon: "💪",
  color: "from-indigo-500/20 to-violet-500/10",
  tips: [
    "운동 후 30분 이내 단백질 + 탄수화물 섭취 (골든타임)",
    "하루 5~6끼로 나누어 꾸준히 영양 공급",
    "단백질은 매 끼니 30~40g씩 분배하여 섭취",
    "수분 섭취: 하루 2.5~3L 이상",
    "수면 전 카제인 단백질(우유, 치즈) 섭취하면 야간 근합성에 도움",
    "주 1회 치팅 데이로 정신적 스트레스 해소",
  ],
  days: [
    calcTotals({ day: "mon", dayLabel: "월요일", breakfast: { name: "오트밀 + 계란 + 바나나", desc: "오트밀 80g, 계란 3개, 바나나 1개, 우유 200ml", calories: 650, protein: 35, carbs: 78, fat: 18, ingredients: ["오트밀 80g", "계란 3개", "바나나 1개", "우유 200ml"] }, snack1: { name: "그릭요거트 + 견과류", desc: "그릭요거트 200g, 아몬드 30g, 블루베리", calories: 320, protein: 22, carbs: 28, fat: 14, ingredients: ["그릭요거트 200g", "아몬드 30g", "블루베리 50g"] }, lunch: { name: "닭가슴살 도시락", desc: "현미밥 250g, 닭가슴살 200g, 브로콜리, 고구마", calories: 780, protein: 55, carbs: 95, fat: 12, ingredients: ["현미밥 250g", "닭가슴살 200g", "브로콜리 100g", "고구마 100g"] }, snack2: { name: "프로틴 쉐이크 + 빵", desc: "프로틴 파우더 1스쿱, 통밀빵 2장, 땅콩버터", calories: 420, protein: 35, carbs: 42, fat: 14, ingredients: ["프로틴 파우더 1스쿱", "통밀빵 2장", "땅콩버터 15g"] }, dinner: { name: "소고기 스테이크 + 감자", desc: "소고기 안심 200g, 감자 200g, 샐러드", calories: 720, protein: 48, carbs: 55, fat: 28, ingredients: ["소고기 안심 200g", "감자 200g", "믹스 샐러드 100g", "올리브유 1큰술"] } }),
    calcTotals({ day: "tue", dayLabel: "화요일", breakfast: { name: "스크램블 에그 + 토스트", desc: "계란 4개, 통밀토스트 2장, 아보카도 반개", calories: 620, protein: 32, carbs: 48, fat: 30, ingredients: ["계란 4개", "통밀식빵 2장", "아보카도 1/2개"] }, snack1: { name: "바나나 프로틴 스무디", desc: "바나나 1개, 프로틴 1스쿱, 우유, 꿀", calories: 380, protein: 30, carbs: 48, fat: 6, ingredients: ["바나나 1개", "프로틴 파우더 1스쿱", "우유 300ml", "꿀 1큰술"] }, lunch: { name: "연어 포케 볼", desc: "현미밥 200g, 연어 150g, 아보카도, 에다마메", calories: 750, protein: 45, carbs: 72, fat: 28, ingredients: ["현미밥 200g", "연어 150g", "아보카도 1/4개", "에다마메 50g", "간장 소스"] }, snack2: { name: "삶은 계란 + 고구마", desc: "삶은 계란 2개, 찐 고구마 150g", calories: 340, protein: 18, carbs: 48, fat: 10, ingredients: ["삶은 계란 2개", "고구마 150g"] }, dinner: { name: "돼지 안심 볶음 + 잡곡밥", desc: "돼지 안심 200g, 잡곡밥 250g, 채소 볶음", calories: 700, protein: 50, carbs: 80, fat: 16, ingredients: ["돼지 안심 200g", "잡곡밥 250g", "파프리카, 양파 볶음"] } }),
    calcTotals({ day: "wed", dayLabel: "수요일", breakfast: { name: "팬케이크 + 과일", desc: "통밀 팬케이크 3장, 메이플시럽, 딸기, 계란 2개", calories: 580, protein: 28, carbs: 72, fat: 18, ingredients: ["통밀 팬케이크 믹스 100g", "계란 2개", "딸기 100g", "메이플시럽 1큰술"] }, snack1: { name: "참치 마요 삼각김밥 2개", desc: "편의점 삼각김밥 2개", calories: 420, protein: 18, carbs: 62, fat: 12, ingredients: ["참치마요 삼각김밥 2개"] }, lunch: { name: "소고기 덮밥", desc: "흰쌀밥 250g, 소불고기 200g, 반찬 3종", calories: 820, protein: 48, carbs: 90, fat: 24, ingredients: ["쌀밥 250g", "소불고기 200g", "김치", "시금치나물", "콩나물"] }, snack2: { name: "코티지 치즈 + 과일", desc: "코티지 치즈 150g, 파인애플 100g", calories: 250, protein: 22, carbs: 20, fat: 6, ingredients: ["코티지 치즈 150g", "파인애플 100g"] }, dinner: { name: "닭다리살 구이 + 파스타", desc: "닭다리살 200g, 통밀 파스타 100g, 토마토소스", calories: 780, protein: 50, carbs: 75, fat: 26, ingredients: ["닭다리살 200g", "통밀 파스타 100g", "토마토소스 100g", "올리브유 1큰술"] } }),
    calcTotals({ day: "thu", dayLabel: "목요일", breakfast: { name: "두부 스크램블 + 잡곡밥", desc: "두부 200g, 잡곡밥 200g, 김, 계란 2개", calories: 600, protein: 35, carbs: 68, fat: 18, ingredients: ["두부 200g", "잡곡밥 200g", "구운김 2장", "계란 2개"] }, snack1: { name: "프로틴바 + 오렌지주스", desc: "프로틴바 1개, 오렌지주스 200ml", calories: 350, protein: 25, carbs: 40, fat: 10, ingredients: ["프로틴바 1개", "오렌지주스 200ml"] }, lunch: { name: "제육볶음 정식", desc: "현미밥 250g, 제육볶음 200g, 된장찌개, 반찬", calories: 800, protein: 45, carbs: 88, fat: 26, ingredients: ["현미밥 250g", "돼지목살 200g", "된장찌개", "상추", "반찬 3종"] }, snack2: { name: "삶은 달걀 + 호밀빵", desc: "삶은 달걀 3개, 호밀빵 1장", calories: 360, protein: 24, carbs: 28, fat: 16, ingredients: ["삶은 달걀 3개", "호밀빵 1장"] }, dinner: { name: "연어 스테이크 + 감자", desc: "연어 200g, 구운 감자 200g, 아스파라거스", calories: 680, protein: 45, carbs: 52, fat: 28, ingredients: ["연어 200g", "감자 200g", "아스파라거스 100g", "레몬버터"] } }),
    calcTotals({ day: "fri", dayLabel: "금요일", breakfast: { name: "그래놀라 볼", desc: "그래놀라 80g, 우유 300ml, 바나나, 호두", calories: 580, protein: 22, carbs: 78, fat: 20, ingredients: ["그래놀라 80g", "우유 300ml", "바나나 1개", "호두 15g"] }, snack1: { name: "닭가슴살 랩", desc: "또띠아 1장, 닭가슴살 100g, 채소, 소스", calories: 380, protein: 30, carbs: 35, fat: 12, ingredients: ["통밀 또띠아 1장", "닭가슴살 100g", "양상추", "토마토", "머스타드"] }, lunch: { name: "비빔밥 + 계란프라이", desc: "현미밥 250g, 각종 나물, 고추장, 계란 2개, 소고기", calories: 780, protein: 40, carbs: 92, fat: 22, ingredients: ["현미밥 250g", "소고기 100g", "시금치", "콩나물", "당근", "계란 2개", "고추장"] }, snack2: { name: "프로틴 쉐이크", desc: "프로틴 1스쿱, 바나나, 땅콩버터, 우유", calories: 400, protein: 35, carbs: 38, fat: 14, ingredients: ["프로틴 파우더 1스쿱", "바나나 1/2개", "땅콩버터 15g", "우유 250ml"] }, dinner: { name: "삼겹살 + 쌈", desc: "삼겹살 200g, 쌈채소, 된장, 잡곡밥 200g", calories: 750, protein: 38, carbs: 60, fat: 38, ingredients: ["삼겹살 200g", "쌈채소 모듬", "된장", "잡곡밥 200g"] } }),
    calcTotals({ day: "sat", dayLabel: "토요일", breakfast: { name: "에그 베네딕트", desc: "잉글리시 머핀, 수란 2개, 홀란다이즈, 햄", calories: 620, protein: 30, carbs: 42, fat: 34, ingredients: ["잉글리시 머핀 1개", "계란 2개", "햄 50g", "홀란다이즈 소스"] }, snack1: { name: "그릭요거트 + 그래놀라", desc: "그릭요거트 200g, 그래놀라 40g, 꿀", calories: 340, protein: 24, carbs: 38, fat: 10, ingredients: ["그릭요거트 200g", "그래놀라 40g", "꿀 1작은술"] }, lunch: { name: "불고기 김밥 + 된장국", desc: "불고기 김밥 2줄, 된장국", calories: 820, protein: 35, carbs: 110, fat: 22, ingredients: ["불고기 김밥 2줄", "된장국 1그릇"] }, snack2: { name: "에너지볼 + 아메리카노", desc: "에너지볼 3개, 아메리카노", calories: 280, protein: 12, carbs: 30, fat: 14, ingredients: ["오트밀 에너지볼 3개", "아메리카노 1잔"] }, dinner: { name: "치킨 스테이크 + 리조또", desc: "닭다리살 200g, 버섯 리조또 200g", calories: 780, protein: 48, carbs: 70, fat: 28, ingredients: ["닭다리살 200g", "쌀 100g", "버섯 모듬", "파마산 치즈 20g"] } }),
    calcTotals({ day: "sun", dayLabel: "일요일 (치팅데이)", breakfast: { name: "브런치 플레이트", desc: "팬케이크 2장, 베이컨, 스크램블에그, 과일", calories: 700, protein: 32, carbs: 68, fat: 32, ingredients: ["팬케이크 2장", "베이컨 3줄", "계란 3개", "과일 모듬"] }, snack1: { name: "프로틴 스무디", desc: "프로틴 1스쿱, 딸기, 블루베리, 우유", calories: 320, protein: 28, carbs: 32, fat: 6, ingredients: ["프로틴 파우더 1스쿱", "딸기 50g", "블루베리 50g", "우유 250ml"] }, lunch: { name: "자유 식사 (치팅)", desc: "원하는 메뉴 자유롭게! 단, 단백질은 꼭 포함", calories: 900, protein: 35, carbs: 100, fat: 38, ingredients: ["자유 선택 (피자, 햄버거, 초밥 등)", "단백질 반찬 포함"] }, snack2: { name: "과일 + 치즈", desc: "사과 1개, 체다치즈 30g", calories: 250, protein: 8, carbs: 30, fat: 10, ingredients: ["사과 1개", "체다치즈 30g"] }, dinner: { name: "삼계탕", desc: "삼계탕 1인분, 잡곡밥", calories: 750, protein: 50, carbs: 65, fat: 28, ingredients: ["삼계탕 1인분 (영계 1마리)", "찹쌀", "인삼", "대추"] } }),
  ],
};

// ===== 체중 관리 식단 (다이어트) =====
export const CUT_PLAN: MealPlan = {
  id: "cut",
  name: "체중 관리 식단",
  description: "체지방 감량 · 건강한 다이어트 식단",
  targetCalories: "1,600~1,800 kcal/일",
  targetProtein: "체중(kg) × 1.6~2.0g",
  ratio: "탄 35 : 단 40 : 지 25",
  icon: "🔥",
  color: "from-emerald-500/20 to-teal-500/10",
  tips: [
    "하루 500~700kcal 적자를 유지 (주 0.5~1kg 감량 목표)",
    "단백질을 충분히 섭취하여 근손실 방지",
    "복합 탄수화물 위주로 섭취 (현미, 고구마, 귀리)",
    "채소를 많이 먹어 포만감 유지 + 식이섬유 확보",
    "수분 섭취: 하루 2L 이상 (공복에 물 한 잔 습관)",
    "가공식품, 설탕, 야식 최소화",
    "저녁은 가볍게, 취침 3시간 전 식사 마무리",
  ],
  days: [
    calcTotals({ day: "mon", dayLabel: "월요일", breakfast: { name: "오트밀 + 삶은 달걀", desc: "오트밀 50g, 삶은 달걀 2개, 블루베리", calories: 350, protein: 22, carbs: 40, fat: 10, ingredients: ["오트밀 50g", "삶은 달걀 2개", "블루베리 50g"] }, snack1: { name: "사과 + 아몬드", desc: "사과 1개, 아몬드 10알", calories: 180, protein: 5, carbs: 25, fat: 7, ingredients: ["사과 1개", "아몬드 10알"] }, lunch: { name: "닭가슴살 샐러드", desc: "닭가슴살 150g, 믹스 샐러드, 현미밥 150g", calories: 480, protein: 42, carbs: 48, fat: 10, ingredients: ["닭가슴살 150g", "믹스 샐러드 150g", "현미밥 150g", "발사믹 드레싱 1큰술"] }, snack2: { name: "그릭요거트", desc: "무지방 그릭요거트 150g", calories: 130, protein: 18, carbs: 8, fat: 2, ingredients: ["무지방 그릭요거트 150g"] }, dinner: { name: "두부 스테이크 + 채소", desc: "두부 200g, 구운 채소, 잡곡밥 100g", calories: 380, protein: 28, carbs: 35, fat: 14, ingredients: ["두부 200g", "브로콜리 100g", "파프리카 50g", "잡곡밥 100g"] } }),
    calcTotals({ day: "tue", dayLabel: "화요일", breakfast: { name: "통밀토스트 + 계란", desc: "통밀식빵 1장, 스크램블에그 2개, 토마토", calories: 320, protein: 20, carbs: 30, fat: 12, ingredients: ["통밀식빵 1장", "계란 2개", "토마토 1/2개"] }, snack1: { name: "바나나 1개", desc: "바나나 1개", calories: 100, protein: 1, carbs: 25, fat: 0, ingredients: ["바나나 1개"] }, lunch: { name: "연어 포케볼 (라이트)", desc: "현미밥 130g, 연어 120g, 채소, 에다마메", calories: 520, protein: 38, carbs: 50, fat: 16, ingredients: ["현미밥 130g", "연어 120g", "오이", "당근", "에다마메 30g"] }, snack2: { name: "삶은 달걀 2개", desc: "삶은 달걀 2개", calories: 140, protein: 12, carbs: 0, fat: 10, ingredients: ["삶은 달걀 2개"] }, dinner: { name: "닭가슴살 볶음 + 곤약밥", desc: "닭가슴살 150g, 곤약밥 150g, 채소 볶음", calories: 350, protein: 38, carbs: 28, fat: 8, ingredients: ["닭가슴살 150g", "곤약밥 150g", "양파, 파프리카 볶음"] } }),
    calcTotals({ day: "wed", dayLabel: "수요일", breakfast: { name: "그래놀라 볼 (라이트)", desc: "그래놀라 40g, 저지방우유 200ml, 딸기", calories: 280, protein: 12, carbs: 42, fat: 6, ingredients: ["그래놀라 40g", "저지방우유 200ml", "딸기 50g"] }, snack1: { name: "당근 스틱 + 허무스", desc: "당근 100g, 허무스 30g", calories: 120, protein: 4, carbs: 16, fat: 5, ingredients: ["당근 100g", "허무스 30g"] }, lunch: { name: "소고기 미역국 정식", desc: "현미밥 150g, 소고기 미역국, 반찬 2종", calories: 500, protein: 32, carbs: 55, fat: 14, ingredients: ["현미밥 150g", "소고기 미역국", "김치", "나물"] }, snack2: { name: "프로틴 쉐이크", desc: "프로틴 파우더 1스쿱, 물", calories: 120, protein: 25, carbs: 3, fat: 1, ingredients: ["프로틴 파우더 1스쿱", "물 300ml"] }, dinner: { name: "새우 샐러드", desc: "새우 150g, 믹스 그린, 아보카도 1/4, 현미밥 100g", calories: 420, protein: 35, carbs: 32, fat: 16, ingredients: ["새우 150g", "믹스 그린 100g", "아보카도 1/4개", "현미밥 100g"] } }),
    calcTotals({ day: "thu", dayLabel: "목요일", breakfast: { name: "고구마 + 달걀", desc: "찐 고구마 150g, 삶은 달걀 2개, 우유", calories: 380, protein: 20, carbs: 50, fat: 10, ingredients: ["고구마 150g", "삶은 달걀 2개", "저지방우유 200ml"] }, snack1: { name: "견과류 믹스", desc: "혼합 견과류 20g", calories: 120, protein: 4, carbs: 5, fat: 10, ingredients: ["혼합 견과류 20g"] }, lunch: { name: "제육 쌈밥", desc: "돼지 안심 150g, 쌈채소, 현미밥 150g", calories: 520, protein: 38, carbs: 52, fat: 16, ingredients: ["돼지 안심 150g", "쌈채소 모듬", "현미밥 150g", "쌈장"] }, snack2: { name: "키위 1개", desc: "키위 1개", calories: 60, protein: 1, carbs: 14, fat: 0, ingredients: ["키위 1개"] }, dinner: { name: "닭가슴살 수프", desc: "닭가슴살 120g, 각종 채소, 감자 50g", calories: 320, protein: 32, carbs: 28, fat: 8, ingredients: ["닭가슴살 120g", "양파", "당근", "셀러리", "감자 50g"] } }),
    calcTotals({ day: "fri", dayLabel: "금요일", breakfast: { name: "스무디 볼", desc: "냉동 아사이 100g, 바나나, 그래놀라 30g", calories: 310, protein: 8, carbs: 55, fat: 6, ingredients: ["냉동 아사이 100g", "바나나 1/2개", "그래놀라 30g", "꿀 1작은술"] }, snack1: { name: "삶은 달걀 + 오이", desc: "삶은 달걀 2개, 오이 1/2개", calories: 160, protein: 13, carbs: 4, fat: 10, ingredients: ["삶은 달걀 2개", "오이 1/2개"] }, lunch: { name: "참치 김밥 + 미소국", desc: "참치 김밥 1줄, 미소국", calories: 480, protein: 22, carbs: 62, fat: 14, ingredients: ["참치 김밥 1줄", "미소국 1그릇"] }, snack2: { name: "프로틴바", desc: "프로틴바 1개", calories: 200, protein: 20, carbs: 18, fat: 8, ingredients: ["프로틴바 1개"] }, dinner: { name: "구운 가지 + 닭가슴살", desc: "가지 구이 150g, 닭가슴살 130g, 퀴노아 80g", calories: 380, protein: 38, carbs: 32, fat: 10, ingredients: ["가지 150g", "닭가슴살 130g", "퀴노아 80g", "올리브유 1작은술"] } }),
    calcTotals({ day: "sat", dayLabel: "토요일", breakfast: { name: "에그 오픈 샌드위치", desc: "호밀빵 1장, 계란 2개, 아보카도 1/4, 토마토", calories: 340, protein: 18, carbs: 28, fat: 16, ingredients: ["호밀빵 1장", "계란 2개", "아보카도 1/4개", "방울토마토 5개"] }, snack1: { name: "그릭요거트 + 꿀", desc: "무지방 그릭요거트 150g, 꿀 1작은술", calories: 150, protein: 18, carbs: 14, fat: 2, ingredients: ["무지방 그릭요거트 150g", "꿀 1작은술"] }, lunch: { name: "잡곡밥 + 된장찌개 정식", desc: "잡곡밥 150g, 된장찌개, 생선구이, 나물", calories: 520, protein: 35, carbs: 55, fat: 14, ingredients: ["잡곡밥 150g", "된장찌개", "고등어 구이 1토막", "시금치나물"] }, snack2: { name: "방울토마토", desc: "방울토마토 10개", calories: 50, protein: 2, carbs: 10, fat: 0, ingredients: ["방울토마토 10개"] }, dinner: { name: "곤약 파스타 + 새우", desc: "곤약면 200g, 새우 120g, 토마토소스", calories: 300, protein: 28, carbs: 30, fat: 8, ingredients: ["곤약면 200g", "새우 120g", "토마토소스 80g", "마늘"] } }),
    calcTotals({ day: "sun", dayLabel: "일요일 (리필데이)", breakfast: { name: "팬케이크 (라이트)", desc: "오트밀 팬케이크 2장, 요거트, 과일", calories: 380, protein: 18, carbs: 52, fat: 10, ingredients: ["오트밀 50g", "계란 1개", "요거트 50g", "과일 모듬"] }, snack1: { name: "프로틴 스무디", desc: "프로틴 1스쿱, 딸기, 저지방우유", calories: 200, protein: 28, carbs: 18, fat: 3, ingredients: ["프로틴 파우더 1스쿱", "딸기 50g", "저지방우유 200ml"] }, lunch: { name: "자유 식사 (리필)", desc: "평소 먹고 싶던 메뉴 (탄수화물 리필)", calories: 700, protein: 30, carbs: 85, fat: 22, ingredients: ["자유 선택", "가능하면 단백질 포함"] }, snack2: { name: "귤 2개", desc: "귤 2개", calories: 80, protein: 1, carbs: 18, fat: 0, ingredients: ["귤 2개"] }, dinner: { name: "닭가슴살 카레 (저칼로리)", desc: "닭가슴살 150g, 현미밥 130g, 카레소스", calories: 420, protein: 38, carbs: 48, fat: 8, ingredients: ["닭가슴살 150g", "현미밥 130g", "저지방 카레소스", "감자 50g"] } }),
  ],
};

export const MEAL_PLANS = [BULK_PLAN, CUT_PLAN];

// ========== 음식 칼로리 DB (사진 인식 보조) ==========
export const COMMON_FOODS: Record<string, { calories: number; protein: number; carbs: number; fat: number; serving: string }> = {
  "흰쌀밥": { calories: 300, protein: 5, carbs: 65, fat: 1, serving: "1공기 (200g)" },
  "현미밥": { calories: 280, protein: 6, carbs: 58, fat: 2, serving: "1공기 (200g)" },
  "잡곡밥": { calories: 290, protein: 7, carbs: 60, fat: 2, serving: "1공기 (200g)" },
  "닭가슴살": { calories: 165, protein: 31, carbs: 0, fat: 4, serving: "100g" },
  "삶은 달걀": { calories: 70, protein: 6, carbs: 0, fat: 5, serving: "1개" },
  "고구마": { calories: 130, protein: 2, carbs: 30, fat: 0, serving: "중 1개 (150g)" },
  "바나나": { calories: 93, protein: 1, carbs: 24, fat: 0, serving: "1개" },
  "그릭요거트": { calories: 100, protein: 17, carbs: 6, fat: 1, serving: "150g" },
  "프로틴 쉐이크": { calories: 120, protein: 25, carbs: 3, fat: 1, serving: "1스쿱" },
  "아보카도": { calories: 160, protein: 2, carbs: 9, fat: 15, serving: "1/2개" },
  "연어": { calories: 208, protein: 20, carbs: 0, fat: 13, serving: "100g" },
  "소고기 안심": { calories: 250, protein: 26, carbs: 0, fat: 15, serving: "100g" },
  "삼겹살": { calories: 330, protein: 18, carbs: 0, fat: 28, serving: "100g" },
  "두부": { calories: 80, protein: 8, carbs: 2, fat: 5, serving: "100g" },
  "김치": { calories: 15, protein: 1, carbs: 2, fat: 0, serving: "1접시 (50g)" },
  "브로콜리": { calories: 35, protein: 3, carbs: 7, fat: 0, serving: "100g" },
  "아메리카노": { calories: 5, protein: 0, carbs: 1, fat: 0, serving: "1잔" },
};
