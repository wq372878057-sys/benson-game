import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Dimensions, Platform, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useGame } from '@/lib/game-context';
import { LEVELS, GAME_CONFIG } from '@/lib/game-config';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const GAME_WIDTH = width;
const GAME_HEIGHT = height - 120;

interface Bullet {
  id: string;
  x: number;
  y: number;
  targetId: string;
}

interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  type: 'hit' | 'kill';
  age: number;
}

export default function BattleArenaScreen() {
  const { state, dispatch } = useGame();
  const router = useRouter();
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [particles, setParticles] = useState<ParticleEffect[]>([]);
  const [battleStarted, setBattleStarted] = useState(false);
  
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bulletTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnedCountRef = useRef(0);
  const enemySpawnOrderRef = useRef<string[]>([]);

  const levelData = LEVELS[state.selectedLevel || 1];
  const levelConfig = {
    health: levelData.enemyHealth,
    speed: levelData.enemySpeed,
    spawnRate: levelData.spawnRate,
    damage: levelData.enemyDamage,
  };

  const PLAYER_SIZE = 50;
  const ENEMY_SIZE = 40;
  const BULLET_SIZE = 8;
  const BULLET_SPEED = 12;
  const playerX = GAME_WIDTH / 2 - PLAYER_SIZE / 2;
  const playerY = GAME_HEIGHT - 80;

  // 初始化战斗
  useEffect(() => {
    if (!battleStarted && state.selectedLevel) {
      setBattleStarted(true);
      spawnedCountRef.current = 0;
      enemySpawnOrderRef.current = [];
    }
  }, [state.selectedLevel, battleStarted]);

  // 生成敌人 - 从上方随机位置出现，按顺序生成
  useEffect(() => {
    if (!battleStarted) return;

    spawnTimerRef.current = setInterval(() => {
      if (spawnedCountRef.current < GAME_CONFIG.ENEMIES_PER_WAVE) {
        const enemyId = `enemy-${state.currentWave}-${spawnedCountRef.current}`;
        const x = Math.random() * (GAME_WIDTH - ENEMY_SIZE);
        const y = 10;

        dispatch({
          type: 'ADD_ENEMY',
          payload: {
            id: enemyId,
            x,
            y,
            health: levelConfig.health,
            maxHealth: levelConfig.health,
            speed: levelConfig.speed,
            damage: levelConfig.damage,
          },
        });
        
        enemySpawnOrderRef.current.push(enemyId);
        spawnedCountRef.current++;
      }
    }, levelConfig.spawnRate);

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [battleStarted, state.currentWave, dispatch, levelConfig]);

  // 自动射击逻辑 - 按敌人出现顺序瞄准
  useEffect(() => {
    if (state.enemies.length === 0 || !battleStarted) return;

    bulletTimerRef.current = setInterval(() => {
      let targetEnemy = null;
      for (const enemyId of enemySpawnOrderRef.current) {
        const enemy = state.enemies.find((e) => e.id === enemyId);
        if (enemy && enemy.health > 0) {
          targetEnemy = enemy;
          break;
        }
      }

      if (targetEnemy) {
        const bulletId = `bullet-${Date.now()}-${Math.random()}`;
        setBullets((prev) => [
          ...prev,
          {
            id: bulletId,
            x: playerX + PLAYER_SIZE / 2,
            y: playerY + PLAYER_SIZE / 2,
            targetId: targetEnemy.id,
          },
        ]);
      }
    }, 1000 / state.fireRate);

    return () => {
      if (bulletTimerRef.current) clearInterval(bulletTimerRef.current);
    };
  }, [state.enemies, state.fireRate, battleStarted, playerX, playerY]);

  // 游戏循环
  useEffect(() => {
    gameLoopRef.current = setInterval(() => {
      const updatedEnemies = state.enemies.map((enemy) => ({
        ...enemy,
        y: enemy.y + enemy.speed,
      }));

      // 检查敌人是否到达底部
      updatedEnemies.forEach((enemy) => {
        if (enemy.y > GAME_HEIGHT - PLAYER_SIZE) {
          dispatch({ type: 'DAMAGE_PLAYER', payload: enemy.damage });
          dispatch({ type: 'REMOVE_ENEMY', payload: enemy.id });
        }
      });

      // 更新子弹位置并检测碰撞
      setBullets((prevBullets) => {
        const newBullets: Bullet[] = [];

        prevBullets.forEach((bullet) => {
          const target = updatedEnemies.find((e) => e.id === bullet.targetId);
          if (!target) return;

          const dx = target.x + ENEMY_SIZE / 2 - bullet.x;
          const dy = target.y + ENEMY_SIZE / 2 - bullet.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < ENEMY_SIZE / 2 + BULLET_SIZE / 2) {
            dispatch({
              type: 'DAMAGE_ENEMY',
              payload: { id: target.id, damage: state.damage },
            });
            setParticles((prev) => [
              ...prev,
              {
                id: `hit-${Date.now()}-${Math.random()}`,
                x: target.x + ENEMY_SIZE / 2,
                y: target.y + ENEMY_SIZE / 2,
                type: 'hit',
                age: 0,
              },
            ]);
          } else {
            const speed = BULLET_SPEED;
            const newX = bullet.x + (dx / dist) * speed;
            const newY = bullet.y + (dy / dist) * speed;

            if (newX > 0 && newX < GAME_WIDTH && newY > 0 && newY < GAME_HEIGHT) {
              newBullets.push({
                ...bullet,
                x: newX,
                y: newY,
              });
            }
          }
        });

        return newBullets;
      });

      // 移除死亡的敌人
      updatedEnemies.forEach((enemy) => {
        if (enemy.health <= 0) {
          dispatch({ type: 'REMOVE_ENEMY', payload: enemy.id });
          dispatch({ type: 'ADD_SCORE', payload: 10 });
          setParticles((prev) => [
            ...prev,
            {
              id: `kill-${Date.now()}-${Math.random()}`,
              x: enemy.x + ENEMY_SIZE / 2,
              y: enemy.y + ENEMY_SIZE / 2,
              type: 'kill',
              age: 0,
            },
          ]);
        }
      });

      // 检查波次是否完成
      if (
        updatedEnemies.length === 0 &&
        spawnedCountRef.current >= GAME_CONFIG.ENEMIES_PER_WAVE &&
        battleStarted
      ) {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        // 检查是否通关
        if (state.currentWave >= 10) {
          dispatch({ type: 'VICTORY' });
          router.push('/victory' as any);
        } else {
          dispatch({ type: 'NEXT_WAVE' });
          router.push('/skill-select' as any);
        }
        
        setBattleStarted(false);
      }

      // 检查游戏是否结束
      if (state.playerHealth <= 0) {
        dispatch({ type: 'GAME_OVER' });
        router.push('/game-over' as any);
      }
    }, 1000 / GAME_CONFIG.GAME_LOOP_FPS);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [state.enemies, state.fireRate, state.damage, state.playerHealth, state.currentWave, battleStarted, dispatch, router]);

  // 更新粒子效果
  useEffect(() => {
    const particleTimer = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, age: p.age + 1 }))
          .filter((p) => p.age < 30)
      );
    }, 50);

    return () => clearInterval(particleTimer);
  }, []);

  const handleReturnToLevelSelect = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  return (
    <ScreenContainer className="bg-background p-0">
      <View className="flex-1 bg-gradient-to-b from-blue-900 to-blue-800 relative">
        {/* HUD 信息 */}
        <View className="bg-black/40 px-4 py-3 flex-row justify-between items-center">
          <View>
            <Text className="text-xs text-muted">第 {state.currentWave} / 10 波</Text>
            <Text className="text-base font-bold text-foreground">
              敌人: {state.enemies.length}/10
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-xs text-muted">生命值</Text>
            <Text className="text-base font-bold text-primary">
              {state.playerHealth}/100
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-xs text-muted">得分</Text>
            <Text className="text-base font-bold text-success">{state.score}</Text>
          </View>
        </View>

        {/* 游戏场景 */}
        <View className="flex-1 relative overflow-hidden" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
          {/* 敌人 */}
          {state.enemies.map((enemy) => {
            const healthPercent = Math.max(0, enemy.health / enemy.maxHealth);
            return (
              <View
                key={enemy.id}
                style={{
                  position: 'absolute',
                  left: enemy.x,
                  top: enemy.y,
                  width: ENEMY_SIZE,
                  height: ENEMY_SIZE,
                }}
              >
                <View className="flex-1 bg-red-500 rounded-lg items-center justify-center border-2 border-red-700">
                  <Text className="text-2xl">👹</Text>
                </View>
                <View className="absolute -bottom-2 left-0 right-0 h-1 bg-black/50 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-green-500"
                    style={{ width: `${healthPercent * 100}%` }}
                  />
                </View>
              </View>
            );
          })}

          {/* 子弹 */}
          {bullets.map((bullet) => (
            <View
              key={bullet.id}
              style={{
                position: 'absolute',
                left: bullet.x - BULLET_SIZE / 2,
                top: bullet.y - BULLET_SIZE / 2,
                width: BULLET_SIZE,
                height: BULLET_SIZE,
                backgroundColor: '#FFD700',
                borderRadius: BULLET_SIZE / 2,
              }}
            />
          ))}

          {/* 粒子效果 */}
          {particles.map((particle) => (
            <View
              key={particle.id}
              style={{
                position: 'absolute',
                left: particle.x - 12,
                top: particle.y - 12,
                opacity: 1 - particle.age / 30,
              }}
            >
              <Text className="text-2xl">
                {particle.type === 'hit' ? '💥' : '⭐'}
              </Text>
            </View>
          ))}

          {/* 主角 */}
          <View
            style={{
              position: 'absolute',
              left: playerX,
              top: playerY,
              width: PLAYER_SIZE,
              height: PLAYER_SIZE,
            }}
            className="items-center justify-center"
          >
            <View className="bg-blue-500 rounded-lg w-full h-full items-center justify-center border-2 border-blue-700">
              <Text className="text-3xl">🧙</Text>
            </View>
          </View>
        </View>

        {/* 底部控制 */}
        <View className="bg-black/40 px-4 py-3">
          <Pressable
            onPress={handleReturnToLevelSelect}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="bg-red-600 py-2 rounded-lg items-center"
          >
            <Text className="text-sm font-bold text-white">返回选择关卡</Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}
