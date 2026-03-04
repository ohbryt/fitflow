"use client";

interface MuscleMapProps {
  primaryMuscles: string[];
  secondaryMuscles: string[];
}

// Mapping Korean muscle names to SVG region IDs
const MUSCLE_TO_REGION: Record<string, string[]> = {
  // 가슴
  "대흉근(중부)": ["chest-l", "chest-r"],
  "대흉근(상부)": ["chest-l", "chest-r"],
  "대흉근(전체)": ["chest-l", "chest-r"],
  "대흉근(하부)": ["chest-l", "chest-r"],
  // 등
  "광배근": ["lats-l", "lats-r"],
  "승모근": ["traps"],
  "척추기립근": ["erector"],
  "능형근": ["rhomboids"],
  "후면 삼각근": ["rear-delt-l", "rear-delt-r"],
  // 어깨
  "전면 삼각근": ["front-delt-l", "front-delt-r"],
  "측면 삼각근": ["side-delt-l", "side-delt-r"],
  "삼각근(전체)": ["front-delt-l", "front-delt-r", "side-delt-l", "side-delt-r", "rear-delt-l", "rear-delt-r"],
  // 팔
  "삼두근": ["tricep-l", "tricep-r"],
  "이두근": ["bicep-l", "bicep-r"],
  "전완근": ["forearm-l", "forearm-r"],
  "상완근": ["bicep-l", "bicep-r"],
  // 하체
  "대퇴사두근": ["quad-l", "quad-r"],
  "햄스트링": ["hamstring-l", "hamstring-r"],
  "둔근": ["glute-l", "glute-r"],
  "비복근": ["calf-l", "calf-r"],
  "가자미근": ["calf-l", "calf-r"],
  "내전근": ["adductor-l", "adductor-r"],
  "고관절 굴곡근": ["hip-flexor-l", "hip-flexor-r"],
  // 코어
  "복직근": ["abs"],
  "복사근": ["oblique-l", "oblique-r"],
  "코어 전체": ["abs", "oblique-l", "oblique-r", "erector"],
  "복횡근": ["abs"],
  // 유산소 - 전신
  "전신": ["chest-l", "chest-r", "abs", "quad-l", "quad-r", "hamstring-l", "hamstring-r", "calf-l", "calf-r", "glute-l", "glute-r"],
  "하체 전체": ["quad-l", "quad-r", "hamstring-l", "hamstring-r", "calf-l", "calf-r", "glute-l", "glute-r"],
};

export function MuscleMap({ primaryMuscles, secondaryMuscles }: MuscleMapProps) {
  const primaryRegions = new Set<string>();
  const secondaryRegions = new Set<string>();

  primaryMuscles.forEach(m => {
    (MUSCLE_TO_REGION[m] || []).forEach(r => primaryRegions.add(r));
  });
  secondaryMuscles.forEach(m => {
    (MUSCLE_TO_REGION[m] || []).forEach(r => {
      if (!primaryRegions.has(r)) secondaryRegions.add(r);
    });
  });

  const getColor = (id: string) => {
    if (primaryRegions.has(id)) return "#6366f1"; // primary - indigo
    if (secondaryRegions.has(id)) return "#6366f1"; // secondary - lighter
    return "#1e293b"; // default dark
  };
  const getOpacity = (id: string) => {
    if (primaryRegions.has(id)) return 0.9;
    if (secondaryRegions.has(id)) return 0.35;
    return 0.4;
  };

  return (
    <div className="flex justify-center gap-6">
      {/* Front View */}
      <div className="text-center">
        <p className="text-[10px] text-text-muted mb-2 font-medium">앞면</p>
        <svg viewBox="0 0 200 400" width="140" height="280" xmlns="http://www.w3.org/2000/svg">
          {/* Head */}
          <ellipse cx="100" cy="30" rx="22" ry="26" fill="#334155" stroke="#475569" strokeWidth="1"/>
          {/* Neck */}
          <rect x="90" y="54" width="20" height="14" rx="4" fill="#334155"/>

          {/* Front Delts */}
          <ellipse id="front-delt-l" cx="62" cy="82" rx="14" ry="16" fill={getColor("front-delt-l")} opacity={getOpacity("front-delt-l")} stroke="#475569" strokeWidth="0.5"/>
          <ellipse id="front-delt-r" cx="138" cy="82" rx="14" ry="16" fill={getColor("front-delt-r")} opacity={getOpacity("front-delt-r")} stroke="#475569" strokeWidth="0.5"/>

          {/* Side Delts */}
          <ellipse id="side-delt-l" cx="52" cy="80" rx="8" ry="14" fill={getColor("side-delt-l")} opacity={getOpacity("side-delt-l")} stroke="#475569" strokeWidth="0.5"/>
          <ellipse id="side-delt-r" cx="148" cy="80" rx="8" ry="14" fill={getColor("side-delt-r")} opacity={getOpacity("side-delt-r")} stroke="#475569" strokeWidth="0.5"/>

          {/* Chest */}
          <ellipse id="chest-l" cx="78" cy="108" rx="22" ry="18" fill={getColor("chest-l")} opacity={getOpacity("chest-l")} stroke="#475569" strokeWidth="0.5"/>
          <ellipse id="chest-r" cx="122" cy="108" rx="22" ry="18" fill={getColor("chest-r")} opacity={getOpacity("chest-r")} stroke="#475569" strokeWidth="0.5"/>

          {/* Biceps */}
          <ellipse id="bicep-l" cx="48" cy="120" rx="10" ry="24" fill={getColor("bicep-l")} opacity={getOpacity("bicep-l")} stroke="#475569" strokeWidth="0.5"/>
          <ellipse id="bicep-r" cx="152" cy="120" rx="10" ry="24" fill={getColor("bicep-r")} opacity={getOpacity("bicep-r")} stroke="#475569" strokeWidth="0.5"/>

          {/* Forearms */}
          <ellipse id="forearm-l" cx="42" cy="168" rx="8" ry="26" fill={getColor("forearm-l")} opacity={getOpacity("forearm-l")} stroke="#475569" strokeWidth="0.5"/>
          <ellipse id="forearm-r" cx="158" cy="168" rx="8" ry="26" fill={getColor("forearm-r")} opacity={getOpacity("forearm-r")} stroke="#475569" strokeWidth="0.5"/>

          {/* Abs */}
          <rect id="abs" x="82" y="130" width="36" height="52" rx="6" fill={getColor("abs")} opacity={getOpacity("abs")} stroke="#475569" strokeWidth="0.5"/>
          {/* Ab lines */}
          <line x1="100" y1="132" x2="100" y2="180" stroke="#475569" strokeWidth="0.5" opacity="0.5"/>
          <line x1="84" y1="145" x2="116" y2="145" stroke="#475569" strokeWidth="0.5" opacity="0.5"/>
          <line x1="84" y1="158" x2="116" y2="158" stroke="#475569" strokeWidth="0.5" opacity="0.5"/>
          <line x1="84" y1="171" x2="116" y2="171" stroke="#475569" strokeWidth="0.5" opacity="0.5"/>

          {/* Obliques */}
          <ellipse id="oblique-l" cx="72" cy="156" rx="10" ry="24" fill={getColor("oblique-l")} opacity={getOpacity("oblique-l")} stroke="#475569" strokeWidth="0.5"/>
          <ellipse id="oblique-r" cx="128" cy="156" rx="10" ry="24" fill={getColor("oblique-r")} opacity={getOpacity("oblique-r")} stroke="#475569" strokeWidth="0.5"/>

          {/* Hip flexors */}
          <ellipse id="hip-flexor-l" cx="82" cy="196" rx="10" ry="10" fill={getColor("hip-flexor-l")} opacity={getOpacity("hip-flexor-l")} stroke="#475569" strokeWidth="0.5"/>
          <ellipse id="hip-flexor-r" cx="118" cy="196" rx="10" ry="10" fill={getColor("hip-flexor-r")} opacity={getOpacity("hip-flexor-r")} stroke="#475569" strokeWidth="0.5"/>

          {/* Quads */}
          <ellipse id="quad-l" cx="80" cy="250" rx="18" ry="42" fill={getColor("quad-l")} opacity={getOpacity("quad-l")} stroke="#475569" strokeWidth="0.5"/>
          <ellipse id="quad-r" cx="120" cy="250" rx="18" ry="42" fill={getColor("quad-r")} opacity={getOpacity("quad-r")} stroke="#475569" strokeWidth="0.5"/>

          {/* Adductors */}
          <ellipse id="adductor-l" cx="92" cy="248" rx="8" ry="30" fill={getColor("adductor-l")} opacity={getOpacity("adductor-l")} stroke="#475569" strokeWidth="0.5"/>
          <ellipse id="adductor-r" cx="108" cy="248" rx="8" ry="30" fill={getColor("adductor-r")} opacity={getOpacity("adductor-r")} stroke="#475569" strokeWidth="0.5"/>

          {/* Calves front */}
          <ellipse id="calf-l" cx="80" cy="332" rx="12" ry="30" fill={getColor("calf-l")} opacity={getOpacity("calf-l")} stroke="#475569" strokeWidth="0.5"/>
          <ellipse id="calf-r" cx="120" cy="332" rx="12" ry="30" fill={getColor("calf-r")} opacity={getOpacity("calf-r")} stroke="#475569" strokeWidth="0.5"/>

          {/* Feet */}
          <ellipse cx="80" cy="375" rx="12" ry="6" fill="#334155" stroke="#475569" strokeWidth="0.5"/>
          <ellipse cx="120" cy="375" rx="12" ry="6" fill="#334155" stroke="#475569" strokeWidth="0.5"/>

          {/* Hands */}
          <ellipse cx="38" cy="200" rx="7" ry="9" fill="#334155" stroke="#475569" strokeWidth="0.5"/>
          <ellipse cx="162" cy="200" rx="7" ry="9" fill="#334155" stroke="#475569" strokeWidth="0.5"/>
        </svg>
      </div>

      {/* Back View */}
      <div className="text-center">
        <p className="text-[10px] text-text-muted mb-2 font-medium">뒷면</p>
        <svg viewBox="0 0 200 400" width="140" height="280" xmlns="http://www.w3.org/2000/svg">
          {/* Head */}
          <ellipse cx="100" cy="30" rx="22" ry="26" fill="#334155" stroke="#475569" strokeWidth="1"/>
          {/* Neck */}
          <rect x="90" y="54" width="20" height="14" rx="4" fill="#334155"/>

          {/* Traps */}
          <path id="traps" d="M72,68 Q100,58 128,68 L122,92 Q100,86 78,92 Z" fill={getColor("traps")} opacity={getOpacity("traps")} stroke="#475569" strokeWidth="0.5"/>

          {/* Rear Delts */}
          <ellipse id="rear-delt-l" cx="60" cy="84" rx="14" ry="14" fill={getColor("rear-delt-l")} opacity={getOpacity("rear-delt-l")} stroke="#475569" strokeWidth="0.5"/>
          <ellipse id="rear-delt-r" cx="140" cy="84" rx="14" ry="14" fill={getColor("rear-delt-r")} opacity={getOpacity("rear-delt-r")} stroke="#475569" strokeWidth="0.5"/>

          {/* Rhomboids */}
          <rect id="rhomboids" x="86" y="90" width="28" height="24" rx="4" fill={getColor("rhomboids")} opacity={getOpacity("rhomboids")} stroke="#475569" strokeWidth="0.5"/>

          {/* Lats */}
          <path id="lats-l" d="M68,96 Q60,130 68,160 L84,150 Q82,120 80,96 Z" fill={getColor("lats-l")} opacity={getOpacity("lats-l")} stroke="#475569" strokeWidth="0.5"/>
          <path id="lats-r" d="M132,96 Q140,130 132,160 L116,150 Q118,120 120,96 Z" fill={getColor("lats-r")} opacity={getOpacity("lats-r")} stroke="#475569" strokeWidth="0.5"/>

          {/* Triceps */}
          <ellipse id="tricep-l" cx="48" cy="118" rx="10" ry="26" fill={getColor("tricep-l")} opacity={getOpacity("tricep-l")} stroke="#475569" strokeWidth="0.5"/>
          <ellipse id="tricep-r" cx="152" cy="118" rx="10" ry="26" fill={getColor("tricep-r")} opacity={getOpacity("tricep-r")} stroke="#475569" strokeWidth="0.5"/>

          {/* Erector spinae */}
          <rect id="erector" x="92" y="116" width="16" height="58" rx="4" fill={getColor("erector")} opacity={getOpacity("erector")} stroke="#475569" strokeWidth="0.5"/>

          {/* Forearms back */}
          <ellipse cx="42" cy="168" rx="8" ry="26" fill={getColor("forearm-l")} opacity={getOpacity("forearm-l")} stroke="#475569" strokeWidth="0.5"/>
          <ellipse cx="158" cy="168" rx="8" ry="26" fill={getColor("forearm-r")} opacity={getOpacity("forearm-r")} stroke="#475569" strokeWidth="0.5"/>

          {/* Glutes */}
          <ellipse id="glute-l" cx="84" cy="198" rx="18" ry="16" fill={getColor("glute-l")} opacity={getOpacity("glute-l")} stroke="#475569" strokeWidth="0.5"/>
          <ellipse id="glute-r" cx="116" cy="198" rx="18" ry="16" fill={getColor("glute-r")} opacity={getOpacity("glute-r")} stroke="#475569" strokeWidth="0.5"/>

          {/* Hamstrings */}
          <ellipse id="hamstring-l" cx="80" cy="256" rx="16" ry="40" fill={getColor("hamstring-l")} opacity={getOpacity("hamstring-l")} stroke="#475569" strokeWidth="0.5"/>
          <ellipse id="hamstring-r" cx="120" cy="256" rx="16" ry="40" fill={getColor("hamstring-r")} opacity={getOpacity("hamstring-r")} stroke="#475569" strokeWidth="0.5"/>

          {/* Calves back */}
          <ellipse cx="80" cy="332" rx="13" ry="32" fill={getColor("calf-l")} opacity={getOpacity("calf-l")} stroke="#475569" strokeWidth="0.5"/>
          <ellipse cx="120" cy="332" rx="13" ry="32" fill={getColor("calf-r")} opacity={getOpacity("calf-r")} stroke="#475569" strokeWidth="0.5"/>

          {/* Feet */}
          <ellipse cx="80" cy="375" rx="12" ry="6" fill="#334155" stroke="#475569" strokeWidth="0.5"/>
          <ellipse cx="120" cy="375" rx="12" ry="6" fill="#334155" stroke="#475569" strokeWidth="0.5"/>

          {/* Hands */}
          <ellipse cx="38" cy="200" rx="7" ry="9" fill="#334155" stroke="#475569" strokeWidth="0.5"/>
          <ellipse cx="162" cy="200" rx="7" ry="9" fill="#334155" stroke="#475569" strokeWidth="0.5"/>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-col justify-center gap-2 text-[10px]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: "#6366f1", opacity: 0.9 }} />
          <span className="text-text-muted">주동근</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: "#6366f1", opacity: 0.35 }} />
          <span className="text-text-muted">보조근</span>
        </div>
      </div>
    </div>
  );
}
