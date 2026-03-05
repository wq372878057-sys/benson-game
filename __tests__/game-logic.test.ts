import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from '../lib/game-engine';
import { LEVELS, GAME_CONFIG, getRandomSkills } from '../lib/game-config';

describe('GameEngine', () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine();
  });

  describe('Enemy Management', () => {
    it('should add enemies correctly', () => {
      const enemy = {
        id: 'test-enemy-1',
        x: 100,
        y: 100,
        health: 20,
        maxHealth: 20,
        speed: 1,
        damage: 5,
      };

      engine.addEnemy(enemy);
      const state = engine.getState();

      expect(state.enemies).toHaveLength(1);
      expect(state.enemies[0].id).toBe('test-enemy-1');
    });

    it('should remove enemies correctly', () => {
      const enemy = {
        id: 'test-enemy-1',
        x: 100,
        y: 100,
        health: 20,
        maxHealth: 20,
        speed: 1,
        damage: 5,
      };

      engine.addEnemy(enemy);
      engine.removeEnemy('test-enemy-1');
      const state = engine.getState();

      expect(state.enemies).toHaveLength(0);
    });

    it('should damage enemies correctly', () => {
      const enemy = {
        id: 'test-enemy-1',
        x: 100,
        y: 100,
        health: 20,
        maxHealth: 20,
        speed: 1,
        damage: 5,
      };

      engine.addEnemy(enemy);
      engine.damageEnemy('test-enemy-1', 10);
      const state = engine.getState();

      expect(state.enemies[0].health).toBe(10);
    });

    it('should not allow health below 0', () => {
      const enemy = {
        id: 'test-enemy-1',
        x: 100,
        y: 100,
        health: 20,
        maxHealth: 20,
        speed: 1,
        damage: 5,
      };

      engine.addEnemy(enemy);
      engine.damageEnemy('test-enemy-1', 30);
      const state = engine.getState();

      expect(state.enemies[0].health).toBe(0);
    });
  });

  describe('Collision Detection', () => {
    it('should detect collision between objects', () => {
      const collision = engine.checkCollision(0, 0, 20, 10, 10, 20);
      expect(collision).toBe(true);
    });

    it('should not detect collision when objects are far apart', () => {
      const collision = engine.checkCollision(0, 0, 20, 100, 100, 20);
      expect(collision).toBe(false);
    });
  });

  describe('Closest Enemy Detection', () => {
    it('should find the closest enemy', () => {
      const enemy1 = {
        id: 'enemy-1',
        x: 100,
        y: 100,
        health: 20,
        maxHealth: 20,
        speed: 1,
        damage: 5,
      };

      const enemy2 = {
        id: 'enemy-2',
        x: 200,
        y: 200,
        health: 20,
        maxHealth: 20,
        speed: 1,
        damage: 5,
      };

      engine.addEnemy(enemy1);
      engine.addEnemy(enemy2);

      const closest = engine.getClosestEnemy(0, 0);
      expect(closest?.id).toBe('enemy-1');
    });

    it('should return null when no enemies exist', () => {
      const closest = engine.getClosestEnemy(0, 0);
      expect(closest).toBeNull();
    });
  });

  describe('Player Damage', () => {
    it('should damage player correctly', () => {
      engine.damagePlayer(10);
      const state = engine.getState();

      expect(state.playerHealth).toBe(90);
    });

    it('should not allow health below 0', () => {
      engine.damagePlayer(150);
      const state = engine.getState();

      expect(state.playerHealth).toBe(0);
    });
  });
});

describe('Game Configuration', () => {
  it('should have valid level configurations', () => {
    expect(LEVELS[1]).toBeDefined();
    expect(LEVELS[2]).toBeDefined();
    expect(LEVELS[1].enemyHealth).toBe(20);
    expect(LEVELS[2].enemyHealth).toBe(30);
  });

  it('should have valid game config constants', () => {
    expect(GAME_CONFIG.TOTAL_WAVES).toBe(10);
    expect(GAME_CONFIG.ENEMIES_PER_WAVE).toBe(10);
    expect(GAME_CONFIG.INITIAL_PLAYER_HEALTH).toBe(100);
  });

  it('should return random skills', () => {
    const skills = getRandomSkills(3);
    expect(skills).toHaveLength(3);
    expect(skills[0]).toHaveProperty('id');
    expect(skills[0]).toHaveProperty('name');
    expect(skills[0]).toHaveProperty('effect');
  });

  it('should not return duplicate skills', () => {
    const skills = getRandomSkills(6);
    const ids = skills.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
