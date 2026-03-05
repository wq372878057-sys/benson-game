import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type GameScreen = 'battle' | 'character' | 'backpack' | 'shop' | 'levelSelect' | 'skillSelect' | 'victory' | 'gameOver';

export interface Equipment {
  id: string;
  name: string;
  type: 'helmet' | 'armor' | 'gloves' | 'pants' | 'boots' | 'bracers';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  level: number;
  attack: number;
  defense: number;
  icon: string;
}

export interface BackpackItem {
  id: string;
  name: string;
  type: 'equipment' | 'gem' | 'fragment' | 'coin';
  quantity: number;
  icon: string;
  rarity?: string;
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
}

export interface GameState {
  currentScreen: GameScreen;
  selectedLevel: 1 | 2 | null;
  currentWave: number;
  totalWaves: number;
  playerHealth: number;
  playerMaxHealth: number;
  playerLevel: number;
  playerPower: number;
  score: number;
  damage: number;
  fireRate: number;
  enemies: Enemy[];
  
  // 装备系统
  equippedItems: {
    helmet: Equipment | null;
    armor: Equipment | null;
    gloves: Equipment | null;
    pants: Equipment | null;
    boots: Equipment | null;
    bracers: Equipment | null;
  };
  
  // 背包系统
  backpack: BackpackItem[];
  
  // 货币
  coins: number;
  gems: Record<string, number>;
}

type GameAction =
  | { type: 'SET_SCREEN'; payload: GameScreen }
  | { type: 'SELECT_LEVEL'; payload: 1 | 2 }
  | { type: 'START_BATTLE' }
  | { type: 'ADD_ENEMY'; payload: Enemy }
  | { type: 'REMOVE_ENEMY'; payload: string }
  | { type: 'UPDATE_ENEMY_POSITION'; payload: { id: string; x: number; y: number } }
  | { type: 'DAMAGE_ENEMY'; payload: { id: string; damage: number } }
  | { type: 'DAMAGE_PLAYER'; payload: number }
  | { type: 'ADD_SCORE'; payload: number }
  | { type: 'NEXT_WAVE' }
  | { type: 'APPLY_SKILL'; payload: string }
  | { type: 'RESET_GAME' }
  | { type: 'GAME_OVER' }
  | { type: 'VICTORY' }
  | { type: 'EQUIP_ITEM'; payload: { slot: keyof GameState['equippedItems']; item: Equipment } }
  | { type: 'ADD_BACKPACK_ITEM'; payload: BackpackItem }
  | { type: 'REMOVE_BACKPACK_ITEM'; payload: string }
  | { type: 'ADD_COINS'; payload: number }
  | { type: 'ADD_GEMS'; payload: { type: string; quantity: number } };

const initialState: GameState = {
  currentScreen: 'character',
  selectedLevel: null,
  currentWave: 1,
  totalWaves: 10,
  playerHealth: 100,
  playerMaxHealth: 100,
  playerLevel: 1,
  playerPower: 100,
  score: 0,
  damage: 10,
  fireRate: 1,
  enemies: [],
  equippedItems: {
    helmet: null,
    armor: null,
    gloves: null,
    pants: null,
    boots: null,
    bracers: null,
  },
  backpack: [],
  coins: 5000,
  gems: {
    blue: 10,
    green: 10,
    red: 10,
    purple: 10,
    yellow: 10,
    crystal: 5,
  },
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | undefined>(undefined);

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, currentScreen: action.payload };
    case 'SELECT_LEVEL':
      return { ...state, selectedLevel: action.payload };
    case 'START_BATTLE':
      return {
        ...state,
        currentScreen: 'battle',
        currentWave: 1,
        playerHealth: state.playerMaxHealth,
        score: 0,
        enemies: [],
      };
    case 'ADD_ENEMY':
      return { ...state, enemies: [...state.enemies, action.payload] };
    case 'REMOVE_ENEMY':
      return {
        ...state,
        enemies: state.enemies.filter((e) => e.id !== action.payload),
      };
    case 'UPDATE_ENEMY_POSITION':
      return {
        ...state,
        enemies: state.enemies.map((e) =>
          e.id === action.payload.id
            ? { ...e, x: action.payload.x, y: action.payload.y }
            : e
        ),
      };
    case 'DAMAGE_ENEMY': {
      return {
        ...state,
        enemies: state.enemies.map((e) =>
          e.id === action.payload.id
            ? { ...e, health: Math.max(0, e.health - action.payload.damage) }
            : e
        ),
      };
    }
    case 'DAMAGE_PLAYER':
      return {
        ...state,
        playerHealth: Math.max(0, state.playerHealth - action.payload),
      };
    case 'ADD_SCORE':
      return { ...state, score: state.score + action.payload };
    case 'NEXT_WAVE':
      if (state.currentWave >= state.totalWaves) {
        return { ...state, currentScreen: 'victory' };
      }
      return {
        ...state,
        currentWave: state.currentWave + 1,
        currentScreen: 'battle',
        enemies: [],
      };
    case 'APPLY_SKILL':
      return {
        ...state,
        currentScreen: 'battle',
      };
    case 'RESET_GAME':
      return {
        ...initialState,
        currentScreen: 'battle',
        coins: state.coins,
        gems: state.gems,
        equippedItems: state.equippedItems,
      };
    case 'GAME_OVER':
      return { ...state, currentScreen: 'gameOver' };
    case 'VICTORY':
      return { ...state, currentScreen: 'victory' };
    case 'EQUIP_ITEM':
      return {
        ...state,
        equippedItems: {
          ...state.equippedItems,
          [action.payload.slot]: action.payload.item,
        },
      };
    case 'ADD_BACKPACK_ITEM':
      return {
        ...state,
        backpack: [...state.backpack, action.payload],
      };
    case 'REMOVE_BACKPACK_ITEM':
      return {
        ...state,
        backpack: state.backpack.filter((item) => item.id !== action.payload),
      };
    case 'ADD_COINS':
      return { ...state, coins: state.coins + action.payload };
    case 'ADD_GEMS':
      return {
        ...state,
        gems: {
          ...state.gems,
          [action.payload.type]: (state.gems[action.payload.type] || 0) + action.payload.quantity,
        },
      };
    default:
      return state;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
