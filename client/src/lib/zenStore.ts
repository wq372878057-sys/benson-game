/**
 * 禅定花园 · 核心数据存储
 * Design Philosophy: 金碧禅境 - 夜空深蓝为底，金箔色系为魂
 * 
 * 核心数据：功德值、境界等级、佛珠样式、修行统计
 */

export interface ZenLevel {
  level: number;
  name: string;
  subtitle: string;
  requiredMerit: number;
  atmosphere: string;
  verse: string;
  sceneImage: string;
  primaryColor: string;
  accentColor: string;
  particleColor: string;
  musicTheme: string;
}

export interface BeadStyle {
  id: 'bodhi' | 'lapis' | 'agate';
  name: string;
  color: string;
  description: string;
  soundFreq: number;
  soundType: 'triangle' | 'sine';
  soundDuration: number;
  unlockMerit: number;
  cssClass: string;
  motherBeadColor: string;
}

export interface ZenState {
  merit: number;
  sessionMerit: number;
  totalBeads: number;
  sessionBeads: number;
  currentLevel: number;
  unlockedLevels: number[];
  selectedBead: 'bodhi' | 'lapis' | 'agate';
  isPremium: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  levelUpHistory: { level: number; timestamp: number }[];
  lastSaved: number;
}

export const ZEN_LEVELS: ZenLevel[] = [
  {
    level: 1,
    name: '破败佛斋',
    subtitle: '荒芜之始',
    requiredMerit: 0,
    atmosphere: '尘埃飞舞，寂静萧索',
    verse: '修行之路，始于足下。',
    sceneImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/gGWAyy2kudWRTnjs9rtz9L/zen-scene-lv1-BbJHCeMSVwEua3iZrqBo7s.webp',
    primaryColor: '#5C4033',
    accentColor: '#8B6914',
    particleColor: '#D4A882',
    musicTheme: 'dawn-bell',
  },
  {
    level: 2,
    name: '修缮茅屋',
    subtitle: '初心萌发',
    requiredMerit: 1000,
    atmosphere: '烛光摇曳，暖意渐生',
    verse: '功德一千，茅屋已修。愿心不退。',
    sceneImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/gGWAyy2kudWRTnjs9rtz9L/zen-scene-lv1-BbJHCeMSVwEua3iZrqBo7s.webp',
    primaryColor: '#7A5C3A',
    accentColor: '#C9A84C',
    particleColor: '#FFD700',
    musicTheme: 'dawn-bell',
  },
  {
    level: 3,
    name: '石基木屋',
    subtitle: '根基稳固',
    requiredMerit: 5000,
    atmosphere: '木香弥漫，经声隐隐',
    verse: '功德五千，石基已成。根基稳固，道心坚定。',
    sceneImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/gGWAyy2kudWRTnjs9rtz9L/zen-scene-lv1-BbJHCeMSVwEua3iZrqBo7s.webp',
    primaryColor: '#8B7355',
    accentColor: '#C9A84C',
    particleColor: '#FFD700',
    musicTheme: 'brahma-chant',
  },
  {
    level: 4,
    name: '清雅禅院',
    subtitle: '庭院深深',
    requiredMerit: 20000,
    atmosphere: '菩提树下，清风徐来',
    verse: '功德两万，禅院初成。菩提树下，静听梵音。',
    sceneImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/gGWAyy2kudWRTnjs9rtz9L/zen-scene-lv4-ecbh4XZYjGcXKZ4aYtucuF.webp',
    primaryColor: '#4A6741',
    accentColor: '#C9A84C',
    particleColor: '#90EE90',
    musicTheme: 'brahma-chant',
  },
  {
    level: 5,
    name: '大殿初成',
    subtitle: '香火渐旺',
    requiredMerit: 100000,
    atmosphere: '香烟袅袅，梵音绕梁',
    verse: '功德十万，大殿初成。香火旺盛，福慧双修。',
    sceneImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/gGWAyy2kudWRTnjs9rtz9L/zen-scene-lv4-ecbh4XZYjGcXKZ4aYtucuF.webp',
    primaryColor: '#8B6914',
    accentColor: '#FFD700',
    particleColor: '#FFD700',
    musicTheme: 'brahma-chant',
  },
  {
    level: 6,
    name: '宏伟寺庙',
    subtitle: '庄严具足',
    requiredMerit: 500000,
    atmosphere: '钟声悠扬，香客如云',
    verse: '功德五十万，宏伟寺庙巍然矗立。庄严具足，功德无量。',
    sceneImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/gGWAyy2kudWRTnjs9rtz9L/zen-scene-lv4-ecbh4XZYjGcXKZ4aYtucuF.webp',
    primaryColor: '#C9A84C',
    accentColor: '#FFD700',
    particleColor: '#FFD700',
    musicTheme: 'lotus-pond',
  },
  {
    level: 7,
    name: '琉璃净土',
    subtitle: '超凡入圣',
    requiredMerit: 2000000,
    atmosphere: '琉璃地面，七宝庄严',
    verse: '功德两百万，琉璃净土现前。七宝庄严，超凡入圣。',
    sceneImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/gGWAyy2kudWRTnjs9rtz9L/zen-scene-lv7-QSvdA5kBPBXEqbxBJAzawu.webp',
    primaryColor: '#1A3A6B',
    accentColor: '#C9A84C',
    particleColor: '#87CEEB',
    musicTheme: 'lotus-pond',
  },
  {
    level: 8,
    name: '莲池海会',
    subtitle: '莲花化生',
    requiredMerit: 10000000,
    atmosphere: '莲花盛开，天乐自鸣',
    verse: '功德一千万，莲池海会。莲花化生，天乐自鸣。',
    sceneImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/gGWAyy2kudWRTnjs9rtz9L/zen-scene-lv7-QSvdA5kBPBXEqbxBJAzawu.webp',
    primaryColor: '#C9A84C',
    accentColor: '#FFD700',
    particleColor: '#FFB6C1',
    musicTheme: 'celestial-music',
  },
  {
    level: 9,
    name: '妙音天国',
    subtitle: '天籁梵音',
    requiredMerit: 50000000,
    atmosphere: '神鸟演法，曼陀罗花雨',
    verse: '功德五千万，妙音天国。神鸟演法，曼陀罗花雨。',
    sceneImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/gGWAyy2kudWRTnjs9rtz9L/zen-scene-lv10-6WtprVhwtJbjq2MheuKFZz.webp',
    primaryColor: '#FFD700',
    accentColor: '#FFD700',
    particleColor: '#FFD700',
    musicTheme: 'celestial-music',
  },
  {
    level: 10,
    name: '西方极乐世界',
    subtitle: '美轮美奂',
    requiredMerit: 100000000,
    atmosphere: '无量光明，极乐庄严',
    verse: '南无阿弥陀佛。功德圆满，往生极乐！',
    sceneImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/gGWAyy2kudWRTnjs9rtz9L/zen-scene-lv10-6WtprVhwtJbjq2MheuKFZz.webp',
    primaryColor: '#FFD700',
    accentColor: '#FFFFFF',
    particleColor: '#FFFFFF',
    musicTheme: 'celestial-music',
  },
];

export const BEAD_STYLES: BeadStyle[] = [
  {
    id: 'bodhi',
    name: '菩提珠',
    color: '#C4A96A',
    description: '天然菩提子，十字刻纹，母珠卍字金光',
    soundFreq: 680,
    soundType: 'triangle',
    soundDuration: 200,
    unlockMerit: 0,
    cssClass: 'bead-bodhi',
    motherBeadColor: '#FFD700',
  },
  {
    id: 'lapis',
    name: '琉璃珠',
    color: '#1A3A6B',
    description: '深蓝琉璃，金线圆环，贵气内敛',
    soundFreq: 1200,
    soundType: 'sine',
    soundDuration: 180,
    unlockMerit: 1000,
    cssClass: 'bead-lapis',
    motherBeadColor: '#C9A84C',
  },
  {
    id: 'agate',
    name: '红玛瑙珠',
    color: '#8B1A1A',
    description: '朱砂红玛瑙，椭圆纹路，庄严厚重',
    soundFreq: 420,
    soundType: 'triangle',
    soundDuration: 220,
    unlockMerit: 5000,
    cssClass: 'bead-agate',
    motherBeadColor: '#FFD700',
  },
];

const STORAGE_KEY = 'zen-garden-state';

const DEFAULT_STATE: ZenState = {
  merit: 0,
  sessionMerit: 0,
  totalBeads: 0,
  sessionBeads: 0,
  currentLevel: 1,
  unlockedLevels: [1],
  selectedBead: 'bodhi',
  isPremium: false,
  musicEnabled: true,
  vibrationEnabled: true,
  levelUpHistory: [],
  lastSaved: Date.now(),
};

export function loadState(): ZenState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_STATE, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return { ...DEFAULT_STATE };
}

export function saveState(state: ZenState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, lastSaved: Date.now() }));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function getCurrentLevel(merit: number): number {
  let level = 1;
  for (const l of ZEN_LEVELS) {
    if (merit >= l.requiredMerit) {
      level = l.level;
    }
  }
  return level;
}

export function getNextLevelMerit(currentLevel: number): number {
  const next = ZEN_LEVELS.find(l => l.level === currentLevel + 1);
  return next ? next.requiredMerit : ZEN_LEVELS[ZEN_LEVELS.length - 1].requiredMerit;
}

export function getCurrentLevelMerit(currentLevel: number): number {
  const current = ZEN_LEVELS.find(l => l.level === currentLevel);
  return current ? current.requiredMerit : 0;
}

export function getLevelProgress(merit: number, currentLevel: number): number {
  if (currentLevel >= 10) return 1;
  const currentMerit = getCurrentLevelMerit(currentLevel);
  const nextMerit = getNextLevelMerit(currentLevel);
  return Math.min((merit - currentMerit) / (nextMerit - currentMerit), 1);
}

export function formatMerit(merit: number): string {
  if (merit >= 100000000) {
    return (merit / 100000000).toFixed(2) + '亿';
  } else if (merit >= 10000) {
    return (merit / 10000).toFixed(1) + '万';
  }
  return merit.toLocaleString();
}

export function getBeadStyle(id: string): BeadStyle {
  return BEAD_STYLES.find(b => b.id === id) || BEAD_STYLES[0];
}

export function getLevelInfo(level: number): ZenLevel {
  return ZEN_LEVELS.find(l => l.level === level) || ZEN_LEVELS[0];
}

// 检查是否需要升级
export function checkLevelUp(merit: number, currentLevel: number): number | null {
  for (let i = currentLevel + 1; i <= 10; i++) {
    const levelInfo = ZEN_LEVELS.find(l => l.level === i);
    if (levelInfo && merit >= levelInfo.requiredMerit) {
      return i;
    } else {
      break;
    }
  }
  return null;
}
