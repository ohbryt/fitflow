// Workout Music Playlists with YouTube integration

export interface Track {
  title: string;
  artist: string;
  youtubeId: string; // YouTube video ID
  duration: string;  // e.g. "3:45"
  bpm?: number;
}

export interface Playlist {
  id: string;
  name: string;
  nameKo: string;
  emoji: string;
  description: string;
  color: string; // gradient from
  tags: string[];
  tracks: Track[];
}

// Curated workout playlists by category
export const PLAYLISTS: Playlist[] = [
  {
    id: "hiphop-power",
    name: "Hip-Hop Power",
    nameKo: "힙합 파워",
    emoji: "🔥",
    description: "강력한 비트로 중량 운동 집중!",
    color: "from-red-100 to-orange-50",
    tags: ["웨이트", "고강도"],
    tracks: [
      { title: "Lose Yourself", artist: "Eminem", youtubeId: "_Yhyp-_hX2s", duration: "5:26", bpm: 171 },
      { title: "HUMBLE.", artist: "Kendrick Lamar", youtubeId: "tvTRZJ-4EyI", duration: "2:57", bpm: 150 },
      { title: "Stronger", artist: "Kanye West", youtubeId: "PsO6ZnUZI0g", duration: "5:12", bpm: 104 },
      { title: "Power", artist: "Kanye West", youtubeId: "L53gjP-TtGE", duration: "4:52", bpm: 80 },
      { title: "Till I Collapse", artist: "Eminem", youtubeId: "ytQ5CYE1VZw", duration: "4:57", bpm: 171 },
      { title: "DNA.", artist: "Kendrick Lamar", youtubeId: "NLZRYQMLDW4", duration: "3:05", bpm: 140 },
      { title: "Sicko Mode", artist: "Travis Scott", youtubeId: "6ONRf7h3Mdk", duration: "5:12", bpm: 155 },
      { title: "God's Plan", artist: "Drake", youtubeId: "xpVfcZ0ZcFM", duration: "3:19", bpm: 77 },
    ],
  },
  {
    id: "edm-cardio",
    name: "EDM Cardio Blast",
    nameKo: "EDM 카디오",
    emoji: "⚡",
    description: "심박수를 올려줄 EDM 트랙!",
    color: "from-purple-100 to-indigo-50",
    tags: ["유산소", "HIIT"],
    tracks: [
      { title: "Levels", artist: "Avicii", youtubeId: "_ovdm2yX4MA", duration: "3:18", bpm: 126 },
      { title: "Titanium", artist: "David Guetta ft. Sia", youtubeId: "JRfuAukYTKg", duration: "4:05", bpm: 126 },
      { title: "Lean On", artist: "Major Lazer & DJ Snake", youtubeId: "YqeW9_5kURI", duration: "2:56", bpm: 98 },
      { title: "Don't You Worry Child", artist: "Swedish House Mafia", youtubeId: "1y6smkh6c-0", duration: "3:32", bpm: 129 },
      { title: "Wake Me Up", artist: "Avicii", youtubeId: "IcrbM1l_BoI", duration: "4:07", bpm: 124 },
      { title: "Faded", artist: "Alan Walker", youtubeId: "60ItHLz5WEA", duration: "3:32", bpm: 90 },
      { title: "Animals", artist: "Martin Garrix", youtubeId: "gCYcHz2k5x0", duration: "5:04", bpm: 128 },
      { title: "Tremor", artist: "Dimitri Vegas & Like Mike", youtubeId: "9vMh9f41pqE", duration: "3:13", bpm: 128 },
    ],
  },
  {
    id: "rock-beast",
    name: "Rock Beast Mode",
    nameKo: "록 비스트 모드",
    emoji: "🎸",
    description: "강렬한 기타 리프로 한계 돌파!",
    color: "from-gray-100 to-slate-50",
    tags: ["웨이트", "파워"],
    tracks: [
      { title: "Eye of the Tiger", artist: "Survivor", youtubeId: "btPJPFnesV4", duration: "4:05", bpm: 109 },
      { title: "Thunderstruck", artist: "AC/DC", youtubeId: "v2AC41dglnM", duration: "4:52", bpm: 133 },
      { title: "Enter Sandman", artist: "Metallica", youtubeId: "CD-E-LDc384", duration: "5:31", bpm: 123 },
      { title: "Remember the Name", artist: "Fort Minor", youtubeId: "VDvr08sCPOc", duration: "3:50", bpm: 84 },
      { title: "Killing In The Name", artist: "Rage Against the Machine", youtubeId: "bWXazVhlyxQ", duration: "5:13", bpm: 86 },
      { title: "Bodies", artist: "Drowning Pool", youtubeId: "04F4xlWSFh0", duration: "3:22", bpm: 105 },
      { title: "Bulls on Parade", artist: "Rage Against the Machine", youtubeId: "3L4YrGaR8E4", duration: "3:51", bpm: 84 },
      { title: "Seven Nation Army", artist: "The White Stripes", youtubeId: "0J2QdDbelmY", duration: "3:51", bpm: 124 },
    ],
  },
  {
    id: "kpop-energy",
    name: "K-Pop Energy",
    nameKo: "케이팝 에너지",
    emoji: "🇰🇷",
    description: "신나는 K-Pop으로 즐거운 운동!",
    color: "from-pink-100 to-rose-50",
    tags: ["유산소", "댄스"],
    tracks: [
      { title: "Dynamite", artist: "BTS", youtubeId: "gdZLi9oWNZg", duration: "3:19", bpm: 114 },
      { title: "FIRE", artist: "BTS", youtubeId: "4ujQOR2DMFM", duration: "3:24", bpm: 110 },
      { title: "DDU-DU DDU-DU", artist: "BLACKPINK", youtubeId: "IHNzOHi8sJs", duration: "3:28", bpm: 152 },
      { title: "IDOL", artist: "BTS", youtubeId: "pBuZEGYXA6E", duration: "3:43", bpm: 126 },
      { title: "Kill This Love", artist: "BLACKPINK", youtubeId: "2S24-y0Ij3Y", duration: "3:08", bpm: 136 },
      { title: "God's Menu", artist: "Stray Kids", youtubeId: "TQTlCHxyuu8", duration: "3:23", bpm: 128 },
      { title: "FEARLESS", artist: "LE SSERAFIM", youtubeId: "4vbDFu0PUew", duration: "2:48", bpm: 140 },
      { title: "Super", artist: "SEVENTEEN", youtubeId: "x2PiY8OlCAo", duration: "3:04", bpm: 128 },
    ],
  },
  {
    id: "lofi-stretch",
    name: "Lo-Fi Stretch",
    nameKo: "로파이 스트레칭",
    emoji: "🧘",
    description: "쿨다운 & 스트레칭에 딱!",
    color: "from-teal-100 to-emerald-50",
    tags: ["스트레칭", "쿨다운"],
    tracks: [
      { title: "Snowman", artist: "WYS", youtubeId: "p7YXXieghto", duration: "3:00", bpm: 75 },
      { title: "Coffee", artist: "beabadoobee", youtubeId: "DHrPZb3OhKA", duration: "3:28", bpm: 98 },
      { title: "Buttercup", artist: "Jack Stauber", youtubeId: "eYDI8b5Nn5s", duration: "2:49", bpm: 100 },
      { title: "Sunset Lover", artist: "Petit Biscuit", youtubeId: "wuCK-oiE3rM", duration: "4:15", bpm: 85 },
      { title: "Tadow", artist: "Masego & FKJ", youtubeId: "hC8CH0Z3L54", duration: "5:36", bpm: 90 },
      { title: "The Less I Know The Better", artist: "Tame Impala", youtubeId: "O2lzmpEs29M", duration: "3:36", bpm: 116 },
      { title: "Electric Feel", artist: "MGMT", youtubeId: "MmZexg8sxyk", duration: "3:49", bpm: 110 },
      { title: "Do I Wanna Know?", artist: "Arctic Monkeys", youtubeId: "bpOSxM0rNPM", duration: "4:32", bpm: 85 },
    ],
  },
  {
    id: "latin-heat",
    name: "Latin Heat",
    nameKo: "라틴 히트",
    emoji: "💃",
    description: "라틴 비트로 댄스 워크아웃!",
    color: "from-yellow-100 to-orange-50",
    tags: ["유산소", "댄스"],
    tracks: [
      { title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee", youtubeId: "kJQP7kiw5Fk", duration: "4:41", bpm: 89 },
      { title: "Vivir Mi Vida", artist: "Marc Anthony", youtubeId: "YXnjy5YlDwk", duration: "4:11", bpm: 126 },
      { title: "Bailando", artist: "Enrique Iglesias", youtubeId: "NUsoVlDFqZg", duration: "4:03", bpm: 128 },
      { title: "Hips Don't Lie", artist: "Shakira", youtubeId: "DUT5rEU6pqM", duration: "3:38", bpm: 100 },
      { title: "Mi Gente", artist: "J Balvin & Willy William", youtubeId: "wnJ6LuUFpMo", duration: "3:09", bpm: 105 },
      { title: "Danza Kuduro", artist: "Don Omar", youtubeId: "7zp1TbLFPp8", duration: "3:18", bpm: 130 },
      { title: "Taki Taki", artist: "DJ Snake ft. Selena Gomez", youtubeId: "ixkoVwKQaJg", duration: "3:36", bpm: 96 },
      { title: "Con Calma", artist: "Daddy Yankee", youtubeId: "DiItGE3eAyQ", duration: "3:16", bpm: 94 },
    ],
  },
  {
    id: "throwback-90s",
    name: "90s Throwback",
    nameKo: "90년대 레트로",
    emoji: "📼",
    description: "추억의 90년대 히트곡 운동!",
    color: "from-amber-100 to-yellow-50",
    tags: ["올라운드", "펀"],
    tracks: [
      { title: "Gonna Make You Sweat", artist: "C+C Music Factory", youtubeId: "LaTGrV58wec", duration: "4:00", bpm: 120 },
      { title: "Jump Around", artist: "House of Pain", youtubeId: "XhzpxjuwZy0", duration: "3:34", bpm: 107 },
      { title: "Pump Up the Jam", artist: "Technotronic", youtubeId: "9EcjWd-O4jI", duration: "3:30", bpm: 120 },
      { title: "Smells Like Teen Spirit", artist: "Nirvana", youtubeId: "hTWKbfoikeg", duration: "5:01", bpm: 117 },
      { title: "U Can't Touch This", artist: "MC Hammer", youtubeId: "otCpCn0l4Wo", duration: "4:16", bpm: 133 },
      { title: "Sabotage", artist: "Beastie Boys", youtubeId: "z5rRZdiu1UE", duration: "2:58", bpm: 84 },
      { title: "Firestarter", artist: "The Prodigy", youtubeId: "wmin5WkOuPw", duration: "4:42", bpm: 141 },
      { title: "Sandstorm", artist: "Darude", youtubeId: "y6120QOlsfU", duration: "3:45", bpm: 136 },
    ],
  },
];

// Get today's recommended playlist (rotates daily)
export function getTodayPlaylist(): Playlist {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return PLAYLISTS[dayOfYear % PLAYLISTS.length];
}

// Get a shuffled version of tracks (different order each day)
export function getShuffledTracks(playlist: Playlist): Track[] {
  const seed = new Date().toDateString();
  const tracks = [...playlist.tracks];
  // Seeded shuffle based on date string
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  for (let i = tracks.length - 1; i > 0; i--) {
    hash = ((hash << 5) - hash) + i;
    hash |= 0;
    const j = Math.abs(hash) % (i + 1);
    [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
  }
  return tracks;
}

// Get total duration of a playlist
export function getPlaylistDuration(playlist: Playlist): string {
  let totalSeconds = 0;
  playlist.tracks.forEach(t => {
    const parts = t.duration.split(":");
    totalSeconds += parseInt(parts[0]) * 60 + parseInt(parts[1]);
  });
  const min = Math.floor(totalSeconds / 60);
  return `${min}분`;
}
