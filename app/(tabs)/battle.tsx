import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Dimensions, Platform, Pressable, ScrollView, Image, PanResponder } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useGame } from '@/lib/game-context';
import { LEVELS, GAME_CONFIG, SKILLS, getRandomSkills } from '@/lib/game-config';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');
const GAME_WIDTH = width;
const GAME_HEIGHT = height * 0.65;

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

export default function BattleScreen() {
  const { state, dispatch } = useGame();
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [particles, setParticles] = useState<ParticleEffect[]>([]);
  const [battleStarted, setBattleStarted] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<typeof SKILLS>([]);
  const [gameTime, setGameTime] = useState(0);
  const [playerXOffset, setPlayerXOffset] = useState(0); // 主角水平偏移量

  // 如枟当前不是战斗屏幕，不渲染
  if (state.currentScreen !== 'battle') {
    return null;
  }
  
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bulletTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnedCountRef = useRef(0);
  const enemySpawnOrderRef = useRef<string[]>([]);
  const stateRef = useRef(state);

  // 保持状态引用最新
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const levelData = LEVELS[state.selectedLevel || 1];
  const levelConfig = {
    health: levelData.enemyHealth,
    speed: levelData.enemySpeed,
    spawnRate: levelData.spawnRate,
    damage: levelData.enemyDamage,
  };

  const PLAYER_SIZE = 60;
  const ENEMY_SIZE = 50;
  const BULLET_SIZE = 10;
  const BULLET_SPEED = 10;
  const playerX = GAME_WIDTH / 2 - PLAYER_SIZE / 2;
  const playerY = GAME_HEIGHT - PLAYER_SIZE - 30;

  // 初始化战斗
  useEffect(() => {
    if (state.currentScreen === 'battle' && state.selectedLevel && !battleStarted) {
      setBattleStarted(true);
      spawnedCountRef.current = 0;
      enemySpawnOrderRef.current = [];
      setGameTime(0);
      setBullets([]);
      setParticles([]);
    }
  }, [state.selectedLevel, battleStarted, state.currentScreen]);

  // 生成敌人 - 从上方随机位置出现，按顺序生成
  useEffect(() => {
    if (!battleStarted || state.currentScreen !== 'battle') return;

    spawnTimerRef.current = setInterval(() => {
      if (spawnedCountRef.current < GAME_CONFIG.ENEMIES_PER_WAVE) {
        const enemyId = `enemy-${state.currentWave}-${spawnedCountRef.current}-${Date.now()}`;
        const x = Math.random() * (GAME_WIDTH - ENEMY_SIZE);
        const y = 20;

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
  }, [battleStarted, state.currentWave, dispatch, levelConfig, state.currentScreen]);

  // 自动射击逻辑 - 按敌人出现顺序瞄准
  useEffect(() => {
    if (!battleStarted || state.currentScreen !== 'battle') return;

    bulletTimerRef.current = setInterval(() => {
      // 使用ref获取最新的敌人状态
      if (stateRef.current.enemies && stateRef.current.enemies.length > 0) {
        const targetEnemy = stateRef.current.enemies[0];
        if (targetEnemy && targetEnemy.health > 0) {
          const bulletId = `bullet-${Date.now()}-${Math.random()}`;
          setBullets((prev) => [
            ...prev,
            {
              id: bulletId,
              x: playerX + playerXOffset + PLAYER_SIZE / 2,
              y: playerY + PLAYER_SIZE / 2,
              targetId: targetEnemy.id,
            },
          ]);
        }
      }
    }, 500);

    return () => {
      if (bulletTimerRef.current) clearInterval(bulletTimerRef.current);
    };
  }, [battleStarted, state.currentScreen, playerX, playerY, playerXOffset]);

  // 游戏循环 - 更新敌人位置、子弹位置、碰撞检测
  useEffect(() => {
    if (state.currentScreen !== 'battle' || !battleStarted) return;

    gameLoopRef.current = setInterval(() => {
      setGameTime((t) => t + 1);

      // 更新子弹位置并检测碰撞
      setBullets((prevBullets) => {
        const newBullets: Bullet[] = [];

        prevBullets.forEach((bullet) => {
          const target = stateRef.current.enemies.find((e) => e.id === bullet.targetId);
          if (!target || target.health <= 0) {
            return;
          }

          const dx = target.x + ENEMY_SIZE / 2 - bullet.x;
          const dy = target.y + ENEMY_SIZE / 2 - bullet.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < ENEMY_SIZE / 2 + BULLET_SIZE / 2) {
            // 碰撞检测 - 子弹击中敌人
            dispatch({
              type: 'DAMAGE_ENEMY',
              payload: { id: target.id, damage: stateRef.current.damage },
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
            // 子弹继续移动
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

      // 更新敌人位置
      stateRef.current.enemies.forEach((enemy) => {
        const newY = enemy.y + enemy.speed;
        
        // 检查敌人是否到达底部
        if (newY > GAME_HEIGHT) {
          dispatch({ type: 'DAMAGE_PLAYER', payload: enemy.damage });
          dispatch({ type: 'REMOVE_ENEMY', payload: enemy.id });
        } else {
          // 更新敌人位置
          dispatch({
            type: 'UPDATE_ENEMY_POSITION',
            payload: { id: enemy.id, x: enemy.x, y: newY },
          });
        }
      });

      // 移除死亡的敌人并添加粒子效果
      stateRef.current.enemies.forEach((enemy) => {
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
        stateRef.current.enemies.length === 0 &&
        spawnedCountRef.current >= GAME_CONFIG.ENEMIES_PER_WAVE &&
        battleStarted
      ) {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        // 暂停战斗，显示技能选择屏幕
        setBattleStarted(false);
        
        // 检查是否通关
        if (stateRef.current.currentWave >= 10) {
          dispatch({ type: 'VICTORY' });
        } else {
          // 显示技能选择屏幕
          setSelectedSkills(getRandomSkills(3));
          dispatch({ type: 'SET_SCREEN', payload: 'skillSelect' });
        }
      }

      // 检查游戏是否结束
      if (stateRef.current.playerHealth <= 0) {
        dispatch({ type: 'GAME_OVER' });
      }
    }, 1000 / GAME_CONFIG.GAME_LOOP_FPS);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [battleStarted, dispatch, state.currentScreen]);

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

  // 主页面 - 当没有选择关卡时，显示战斗主界面
  if (!state.selectedLevel) {
    return (
      <ScreenContainer className="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
          <View className="flex-1 gap-6 px-6 py-8 items-center justify-center">
            {/* 游戏标题 */}
            <View className="items-center gap-2">
              <Text className="text-5xl font-bold text-primary">生存者传说</Text>
              <Text className="text-lg text-muted">Survivor Rogue</Text>
            </View>

            {/* 主角形象 */}
            <View className="rounded-full w-32 h-32 items-center justify-center border-4 border-primary overflow-hidden">
              <Image
                source={require('@/assets/images/player.jpg')}
                style={{ width: 128, height: 128 }}
                resizeMode="cover"
              />
            </View>

            {/* 游戏信息卡片 */}
            <View className="bg-surface rounded-2xl p-6 w-full max-w-sm border border-border gap-3">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">最高得分</Text>
                <Text className="text-sm font-bold text-success">{state.score}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">等级</Text>
                <Text className="text-sm font-bold text-primary">{state.playerLevel}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">战力值</Text>
                <Text className="text-sm font-bold text-primary">{state.playerPower}</Text>
              </View>
            </View>


          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // 关卡选择页面
  if (true) { // 关卡选择页面
    return (
      <ScreenContainer className="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
          <View className="flex-1 gap-6 px-6 py-8 items-center justify-center">
            <Text className="text-3xl font-bold text-foreground">选择关卡</Text>

            {/* 关卡列表 */}
            <View className="w-full max-w-sm gap-4">
              {[1, 2].map((levelId) => {
                const level = LEVELS[levelId as 1 | 2];
                return (
                  <Pressable
                    key={levelId}
                    onPress={() => {
                      dispatch({ type: 'SELECT_LEVEL', payload: levelId as 1 | 2 });
                      dispatch({ type: 'START_BATTLE' });
                    }}
                    style={({ pressed }) => ({
                      backgroundColor: pressed ? '#0a5a7a' : '#0a7ea4',
                      padding: 20,
                      borderRadius: 12,
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <Text className="text-white font-bold text-lg">{level.name}</Text>
                    <Text className="text-gray-200 text-sm mt-2">
                      敌人生命: {level.enemyHealth} | 速度: {level.enemySpeed}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* 返回按钮 */}
            <Pressable
              onPress={() => {
                dispatch({ type: 'SET_SCREEN', payload: 'battle' });
              }}
              style={({ pressed }) => ({
                marginTop: 20,
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <Text className="text-primary font-bold">← 返回选择关卡</Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // 战斗进行中
  if (state.currentScreen === 'battle' && state.selectedLevel) {
    return (
      <ScreenContainer className="bg-background p-0">
        <View className="flex-1 bg-blue-900 relative">
          {/* HUD 信息 */}
          <View className="bg-black/50 px-4 py-2 flex-row justify-between items-center">
            <View>
              <Text className="text-xs text-yellow-300">第 {state.currentWave} / 10 波</Text>
              <Text className="text-sm font-bold text-white">
                敌人: {state.enemies.length}/10
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-yellow-300">生命值</Text>
              <Text className="text-sm font-bold text-red-400">
                {state.playerHealth}/100
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-xs text-yellow-300">得分</Text>
              <Text className="text-sm font-bold text-green-400">{state.score}</Text>
            </View>
          </View>

          {/* 游戏场景 */}
          <View 
            style={{ 
              width: GAME_WIDTH, 
              height: GAME_HEIGHT,
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: '#1e3a8a'
            }}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderMove={(event) => {
              const touchX = event.nativeEvent.locationX;
              const centerX = GAME_WIDTH / 2;
              const offset = touchX - centerX;
              const maxOffset = (GAME_WIDTH - PLAYER_SIZE) / 2;
              setPlayerXOffset(Math.max(-maxOffset, Math.min(offset, maxOffset)));
            }}
            onResponderRelease={() => {
              setPlayerXOffset((prev) => {
                if (prev > 0) return Math.max(0, prev - 5);
                if (prev < 0) return Math.min(0, prev + 5);
                return 0;
              });
            }}
          >
            {/* 敌人 */}
            {state.enemies.map((enemy) => {
              const healthPercent = Math.max(0, enemy.health / enemy.maxHealth);
              return (
                <View
                  key={enemy.id}
                  style={{
                    position: 'absolute',
                    left: Math.max(0, Math.min(enemy.x, GAME_WIDTH - ENEMY_SIZE)),
                    top: Math.max(0, Math.min(enemy.y, GAME_HEIGHT - ENEMY_SIZE)),
                    width: ENEMY_SIZE,
                    height: ENEMY_SIZE,
                  }}
                >
                  <View style={{
                    flex: 1,
                    backgroundColor: '#ef4444',
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: '#991b1b'
                  }}>
                    <Text style={{ fontSize: 28 }}>👹</Text>
                  </View>
                  <View style={{
                    position: 'absolute',
                    bottom: -6,
                    left: 0,
                    right: 0,
                    height: 4,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}>
                    <View
                      style={{
                        height: '100%',
                        backgroundColor: '#22c55e',
                        width: `${healthPercent * 100}%`
                      }}
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
                  left: Math.max(0, Math.min(bullet.x - BULLET_SIZE / 2, GAME_WIDTH - BULLET_SIZE)),
                  top: Math.max(0, Math.min(bullet.y - BULLET_SIZE / 2, GAME_HEIGHT - BULLET_SIZE)),
                  width: BULLET_SIZE,
                  height: BULLET_SIZE,
                  backgroundColor: '#FFFF00',
                  borderRadius: BULLET_SIZE / 2,
                  borderWidth: 1,
                  borderColor: '#FFD700',
                  shadowColor: '#FFFF00',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 4,
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
                  opacity: Math.max(0, 1 - particle.age / 30),
                }}
              >
                <Text style={{ fontSize: 24 }}>
                  {particle.type === 'hit' ? '💥' : '⭐'}
                </Text>
              </View>
            ))}

            {/* 主角 */}
            <Pressable
              onPress={() => {}}
              style={{
                position: 'absolute',
                left: Math.max(0, Math.min(playerX + playerXOffset, GAME_WIDTH - PLAYER_SIZE)),
                top: playerY,
                width: PLAYER_SIZE,
                height: PLAYER_SIZE,
              }}
            >
              <View style={{
                flex: 1,
                backgroundColor: '#3b82f6',
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: '#1e40af',
                overflow: 'hidden'
              }}>
                <Image
                  source={require('@/assets/images/player.jpg')}
                  style={{ width: PLAYER_SIZE, height: PLAYER_SIZE }}
                  resizeMode="cover"
                />
              </View>
            </Pressable>
          </View>

          {/* 底部控制 */}
          <View className="bg-black/50 px-4 py-3">
            <Pressable
              onPress={() => {
                if (bulletTimerRef.current) clearInterval(bulletTimerRef.current);
                if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
                if (gameLoopRef.current) clearInterval(gameLoopRef.current);
                setBattleStarted(false);
                dispatch({ type: 'SET_SCREEN', payload: 'battle' });
              }}
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#7a2a2a' : '#991b1b',
                padding: 12,
                borderRadius: 8,
                alignItems: 'center',
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text className="text-white font-bold">← 返回选择关卡</Text>
            </Pressable>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  // 技能选择页面
  if (state.currentScreen === 'skillSelect') {
    return (
      <ScreenContainer className="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
          <View className="flex-1 gap-6 px-6 py-8 items-center justify-center">
            <Text className="text-3xl font-bold text-foreground">选择技能</Text>
            <Text className="text-sm text-muted">第 {state.currentWave} / 10 波</Text>

            {/* 技能选择 */}
            <View className="w-full max-w-sm gap-4">
              {selectedSkills.map((skill) => (
                <Pressable
                  key={skill.id}
                  onPress={() => {
                    dispatch({ type: 'APPLY_SKILL', payload: skill.id });
                    dispatch({ type: 'NEXT_WAVE' });
                    setBattleStarted(true);
                    spawnedCountRef.current = 0;
                    enemySpawnOrderRef.current = [];
                    setBullets([]);
                  }}
                  style={({ pressed }) => ({
                    backgroundColor: pressed ? '#0a5a7a' : '#0a7ea4',
                    padding: 16,
                    borderRadius: 12,
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <Text className="text-white font-bold text-base">{skill.name}</Text>
                  <Text className="text-gray-200 text-xs mt-1">{skill.description}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // 通关页面
  if (state.currentScreen === 'victory') {
    return (
      <ScreenContainer className="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
          <View className="flex-1 gap-6 px-6 py-8 items-center justify-center">
            <Text className="text-5xl">🎉</Text>
            <Text className="text-4xl font-bold text-success">通关成功!</Text>
            <Text className="text-2xl font-bold text-primary">{state.score} 分</Text>

            <Pressable
              onPress={() => {
                dispatch({ type: 'RESET_GAME' });
              }}
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#0a5a7a' : '#0a7ea4',
                paddingHorizontal: 40,
                paddingVertical: 16,
                borderRadius: 12,
                marginTop: 20,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text className="text-white font-bold text-lg">返回主页</Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // 失败页面
  if (state.currentScreen === 'gameOver') {
    return (
      <ScreenContainer className="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
          <View className="flex-1 gap-6 px-6 py-8 items-center justify-center">
            <Text className="text-5xl">💀</Text>
            <Text className="text-4xl font-bold text-error">游戏结束</Text>
            <Text className="text-2xl font-bold text-primary">{state.score} 分</Text>

            <Pressable
              onPress={() => {
                dispatch({ type: 'RESET_GAME' });
              }}
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#0a5a7a' : '#0a7ea4',
                paddingHorizontal: 40,
                paddingVertical: 16,
                borderRadius: 12,
                marginTop: 20,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text className="text-white font-bold text-lg">返回主页</Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // 默认返回角色屏幕（当currentScreen不是'battle'时）
  return null;
}
