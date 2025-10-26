/**
 * Statistics Service - Handles persistent stats
 */

import { STORAGE_KEYS } from './config.js';
import { calculateAccuracy } from './utils.js';

class StatsService {
  constructor() {
    this.correctCount = 0;
    this.totalCount = 0;
  }

  /**
   * Load stats from localStorage
   */
  loadStats() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      if (saved) {
        const data = JSON.parse(saved);
        this.correctCount = data.correct || 0;
        this.totalCount = data.total || 0;
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      this.correctCount = 0;
      this.totalCount = 0;
    }
  }

  /**
   * Save stats to localStorage
   */
  saveStats() {
    try {
      const data = {
        correct: this.correctCount,
        total: this.totalCount
      };
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  }

  /**
   * Increment correct count
   */
  incrementCorrect() {
    this.correctCount++;
    this.totalCount++;
    this.saveStats();
  }

  /**
   * Increment total count only (for wrong/skipped answers)
   */
  incrementTotal() {
    this.totalCount++;
    this.saveStats();
  }

  /**
   * Get current stats object
   */
  getStats() {
    return {
      correct: this.correctCount,
      total: this.totalCount,
      accuracy: calculateAccuracy(this.correctCount, this.totalCount)
    };
  }

  /**
   * Reset all stats
   */
  resetStats() {
    this.correctCount = 0;
    this.totalCount = 0;
    this.saveStats();
  }
}

export default StatsService;
