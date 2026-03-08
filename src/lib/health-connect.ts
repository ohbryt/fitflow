import { Capacitor } from "@capacitor/core";

// Health Connect 플러그인 동적 임포트 (웹에서는 사용 불가)
let HealthConnect: any = null;

async function getPlugin() {
  if (HealthConnect) return HealthConnect;
  if (Capacitor.getPlatform() !== "android") return null;
  try {
    const mod = await import("@devmaxime/capacitor-health-connect");
    HealthConnect = mod.HealthConnect;
    return HealthConnect;
  } catch {
    return null;
  }
}

export type HealthData = {
  steps: number;
  calories: number;
  distance: number;
  heartRate: number | null;
  weight: number | null;
  sleepMinutes: number | null;
  weeklySteps: { date: string; value: number }[];
};

/** Health Connect 사용 가능 여부 확인 */
export async function checkHealthConnect(): Promise<"Available" | "NotSupported" | "NotInstalled" | "Web"> {
  if (Capacitor.getPlatform() !== "android") return "Web";
  const plugin = await getPlugin();
  if (!plugin) return "NotSupported";
  try {
    const { availability } = await plugin.checkAvailability();
    return availability;
  } catch {
    return "NotSupported";
  }
}

/** 권한 요청 */
export async function requestHealthPermissions(): Promise<boolean> {
  const plugin = await getPlugin();
  if (!plugin) return false;
  try {
    const result = await plugin.requestPermissions({
      read: ["Steps", "Weight", "ActivitySession", "SleepSession", "RestingHeartRate"],
      write: [],
    });
    return result.read.length > 0;
  } catch {
    return false;
  }
}

/** 오늘의 건강 데이터 + 주간 걸음수 가져오기 */
export async function fetchHealthData(): Promise<HealthData | null> {
  const plugin = await getPlugin();
  if (!plugin) return null;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const todayEnd = now.toISOString();

  // 7일 전
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekStart = new Date(weekAgo.getFullYear(), weekAgo.getMonth(), weekAgo.getDate()).toISOString();

  try {
    // 병렬로 데이터 가져오기
    const [stepsAgg, caloriesAgg, distanceAgg, heartRateAgg, weightRecords, sleepRecords, weeklyStepsAgg] =
      await Promise.allSettled([
        plugin.aggregateRecords({ start: todayStart, end: todayEnd, type: "Steps" }),
        plugin.aggregateRecords({ start: todayStart, end: todayEnd, type: "TotalCaloriesBurned" }),
        plugin.aggregateRecords({ start: todayStart, end: todayEnd, type: "Distance" }),
        plugin.aggregateRecords({ start: todayStart, end: todayEnd, type: "HeartRate" }),
        plugin.readRecords({ start: weekStart, end: todayEnd, type: "Weight" }),
        plugin.readRecords({ start: todayStart, end: todayEnd, type: "SleepSession" }),
        plugin.aggregateRecords({ start: weekStart, end: todayEnd, type: "Steps", groupBy: "day" }),
      ]);

    const getAggValue = (result: PromiseSettledResult<any>) =>
      result.status === "fulfilled" && result.value.aggregates?.[0]?.value || 0;

    const steps = getAggValue(stepsAgg);
    const calories = Math.round(getAggValue(caloriesAgg));
    const distance = Math.round(getAggValue(distanceAgg));

    const heartRate =
      heartRateAgg.status === "fulfilled" && heartRateAgg.value.aggregates?.[0]?.value
        ? Math.round(heartRateAgg.value.aggregates[0].value)
        : null;

    const weight =
      weightRecords.status === "fulfilled" && weightRecords.value.records?.length > 0
        ? weightRecords.value.records[weightRecords.value.records.length - 1]?.weight ?? null
        : null;

    const sleepMinutes =
      sleepRecords.status === "fulfilled" && sleepRecords.value.records?.length > 0
        ? sleepRecords.value.records.reduce((total: number, r: any) => {
            const start = new Date(r.startTime).getTime();
            const end = new Date(r.endTime).getTime();
            return total + (end - start) / 60000;
          }, 0)
        : null;

    // 주간 걸음수
    const weeklySteps: { date: string; value: number }[] = [];
    if (weeklyStepsAgg.status === "fulfilled" && weeklyStepsAgg.value.aggregates) {
      for (const agg of weeklyStepsAgg.value.aggregates) {
        const date = new Date(agg.startTime);
        weeklySteps.push({
          date: `${date.getMonth() + 1}/${date.getDate()}`,
          value: agg.value || 0,
        });
      }
    }

    return { steps, calories, distance, heartRate, weight, sleepMinutes, weeklySteps };
  } catch {
    return null;
  }
}
