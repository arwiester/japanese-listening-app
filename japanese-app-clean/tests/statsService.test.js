/**
 * Unit Tests for StatsService
 */

import { describe, it, expect, beforeEach } from 'vitest';
import StatsService from '../js/statsService.js';

describe('StatsService', () => {
  let statsService;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    statsService = new StatsService();
  });

  describe('initialization', () => {
    it('should start with zero stats', () => {
      const stats = statsService.getStats();
      expect(stats.correct).toBe(0);
      expect(stats.total).toBe(0);
      expect(stats.accuracy).toBe(0);
    });
  });

  describe('incrementCorrect', () => {
    it('should increment both correct and total', () => {
      statsService.incrementCorrect();
      const stats = statsService.getStats();
      expect(stats.correct).toBe(1);
      expect(stats.total).toBe(1);
      expect(stats.accuracy).toBe(100);
    });

    it('should handle multiple correct answers', () => {
      statsService.incrementCorrect();
      statsService.incrementCorrect();
      statsService.incrementCorrect();
      const stats = statsService.getStats();
      expect(stats.correct).toBe(3);
      expect(stats.total).toBe(3);
    });
  });

  describe('incrementTotal', () => {
    it('should increment only total (wrong answer)', () => {
      statsService.incrementTotal();
      const stats = statsService.getStats();
      expect(stats.correct).toBe(0);
      expect(stats.total).toBe(1);
      expect(stats.accuracy).toBe(0);
    });
  });

  describe('accuracy calculation', () => {
    it('should calculate correct accuracy', () => {
      statsService.incrementCorrect(); // 1/1 = 100%
      expect(statsService.getStats().accuracy).toBe(100);

      statsService.incrementTotal(); // 1/2 = 50%
      expect(statsService.getStats().accuracy).toBe(50);

      statsService.incrementCorrect(); // 2/3 = 67%
      expect(statsService.getStats().accuracy).toBe(67);
    });

    it('should round properly', () => {
      statsService.incrementCorrect();
      statsService.incrementTotal();
      statsService.incrementTotal(); // 1/3 = 33.33...
      expect(statsService.getStats().accuracy).toBe(33);
    });
  });

  describe('persistence', () => {
    it('should save stats to localStorage', () => {
      statsService.incrementCorrect();
      statsService.incrementCorrect();
      statsService.saveStats();

      const stored = JSON.parse(localStorage.getItem('japanese-numbers-stats'));
      expect(stored.correct).toBe(2);
      expect(stored.total).toBe(2);
    });

    it('should load stats from localStorage', () => {
      localStorage.setItem('japanese-numbers-stats', JSON.stringify({
        correct: 5,
        total: 10
      }));

      const newStatsService = new StatsService();
      newStatsService.loadStats();
      const stats = newStatsService.getStats();

      expect(stats.correct).toBe(5);
      expect(stats.total).toBe(10);
      expect(stats.accuracy).toBe(50);
    });

    it('should handle missing localStorage data', () => {
      const newStatsService = new StatsService();
      newStatsService.loadStats();
      const stats = newStatsService.getStats();

      expect(stats.correct).toBe(0);
      expect(stats.total).toBe(0);
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('japanese-numbers-stats', 'invalid json');
      
      const newStatsService = new StatsService();
      newStatsService.loadStats();
      const stats = newStatsService.getStats();

      expect(stats.correct).toBe(0);
      expect(stats.total).toBe(0);
    });
  });

  describe('resetStats', () => {
    it('should reset all stats to zero', () => {
      statsService.incrementCorrect();
      statsService.incrementCorrect();
      statsService.incrementTotal();

      statsService.resetStats();
      const stats = statsService.getStats();

      expect(stats.correct).toBe(0);
      expect(stats.total).toBe(0);
      expect(stats.accuracy).toBe(0);
    });

    it('should save reset stats to localStorage', () => {
      statsService.incrementCorrect();
      statsService.saveStats();

      statsService.resetStats();

      const stored = JSON.parse(localStorage.getItem('japanese-numbers-stats'));
      expect(stored.correct).toBe(0);
      expect(stored.total).toBe(0);
    });
  });

  describe('getStats', () => {
    it('should return stats object with all properties', () => {
      const stats = statsService.getStats();
      expect(stats).toHaveProperty('correct');
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('accuracy');
    });

    it('should return current stats values', () => {
      statsService.correctCount = 7;
      statsService.totalCount = 10;
      
      const stats = statsService.getStats();
      expect(stats.correct).toBe(7);
      expect(stats.total).toBe(10);
      expect(stats.accuracy).toBe(70);
    });
  });
});
