/**
 * Unit Tests for CurrencyPractice
 * Tests currency listening practice functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import CurrencyPractice from '../js/CurrencyPractice.js';

describe('CurrencyPractice - Core Functionality', () => {
  let app;
  let consoleLogSpy;

  beforeEach(() => {
    // Setup minimal DOM required for tests
    document.body.innerHTML = `
      <input id="answer-input" class="answer-input" type="text" disabled />
      <button id="replay-btn" disabled></button>
      <button id="show-answer-btn"></button>
      <button id="reset-btn"></button>
      <div id="input-hint">💡 Play the audio first!</div>
      <div id="feedback"></div>
      <div id="correct-count">0</div>
      <div id="total-count">0</div>
      <div id="accuracy">0%</div>
      <button class="range-btn active" data-range="999"></button>
      <button class="range-btn" data-range="10000"></button>
      <button class="range-btn" data-range="100000"></button>
      <button class="range-btn" data-range="1000000"></button>
    `;

    // Spy on console.log to suppress logs during tests
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    app = new CurrencyPractice();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('Initialization', () => {
    it('should cache all required DOM elements', async () => {
      await app.init();
      
      expect(app.elements.answerInput).toBeTruthy();
      expect(app.elements.rangeBtns).toBeTruthy();
      expect(app.elements.feedback).toBeTruthy();
    });

    it('should start with default range of 999', async () => {
      await app.init();
      expect(app.currentRange).toBe(999);
    });

    it('should generate initial amount', async () => {
      await app.init();
      expect(app.currentAmount).toBeGreaterThanOrEqual(1);
      expect(app.currentAmount).toBeLessThanOrEqual(999);
    });

    it('should instantiate AudioService', () => {
      expect(app.audioService).toBeTruthy();
      expect(app.audioService.playCloudTTS).toBeDefined();
    });
  });

  describe('Range Selection', () => {
    beforeEach(async () => {
      await app.init();
    });

    it('should update currentRange when setRange called', () => {
      // Mock playAmount since setRange calls it
      vi.spyOn(app, 'playAmount').mockResolvedValue();
      
      app.setRange(10000);
      expect(app.currentRange).toBe(10000);
      expect(app.playAmount).toHaveBeenCalled();
    });

    it('should generate new amount in correct range', () => {
      app.setRange(999);
      expect(app.currentAmount).toBeGreaterThanOrEqual(1);
      expect(app.currentAmount).toBeLessThanOrEqual(999);
    });

    it('should call playAmount after range change', () => {
      vi.spyOn(app, 'playAmount').mockResolvedValue();
      
      app.setRange(10000);
      expect(app.playAmount).toHaveBeenCalled();
    });

    it('should clear input value when range changes', () => {
      vi.spyOn(app, 'playAmount').mockResolvedValue();
      
      app.elements.answerInput.value = '500';
      app.setRange(100000);
      expect(app.elements.answerInput.value).toBe('');
    });
  });

  describe('Amount Generation', () => {
    beforeEach(async () => {
      await app.init();
    });

    it('should generate amount within range ¥1-¥999', () => {
      app.currentRange = 999;
      app.generateAmount();
      expect(app.currentAmount).toBeGreaterThanOrEqual(1);
      expect(app.currentAmount).toBeLessThanOrEqual(999);
    });

    it('should generate amount within range ¥1,000-¥10,000', () => {
      app.currentRange = 10000;
      app.generateAmount();
      expect(app.currentAmount).toBeGreaterThanOrEqual(1000);
      expect(app.currentAmount).toBeLessThanOrEqual(10000);
    });

    it('should generate amount within range ¥10,000-¥100,000', () => {
      app.currentRange = 100000;
      app.generateAmount();
      expect(app.currentAmount).toBeGreaterThanOrEqual(10000);
      expect(app.currentAmount).toBeLessThanOrEqual(100000);
    });

    it('should generate amount within range ¥100,000-¥1,000,000', () => {
      app.currentRange = 1000000;
      app.generateAmount();
      expect(app.currentAmount).toBeGreaterThanOrEqual(100000);
      expect(app.currentAmount).toBeLessThanOrEqual(1000000);
    });

    it('should generate unrounded amounts for large ranges', () => {
      app.currentRange = 100000;
      
      // Generate multiple amounts and check for non-rounded values
      const amounts = [];
      for (let i = 0; i < 20; i++) {
        app.generateAmount();
        amounts.push(app.currentAmount);
      }
      
      // At least some amounts should NOT be divisible by 100 (proving no rounding)
      const hasUnroundedAmounts = amounts.some(amt => amt % 100 !== 0);
      expect(hasUnroundedAmounts).toBe(true);
    });

    it('should set maxLength to match range length', () => {
      app.generateAmount();
      const expectedLength = app.currentRange.toString().length;
      expect(app.elements.answerInput.maxLength).toBe(expectedLength);
    });

    it('should reset hasPlayedCurrent flag', () => {
      app.hasPlayedCurrent = true;
      app.generateAmount();
      expect(app.hasPlayedCurrent).toBe(false);
    });

    it('should reset attempt count', () => {
      app.attemptCount = 5;
      app.generateAmount();
      expect(app.attemptCount).toBe(0);
    });
  });

  describe('Answer Checking', () => {
    beforeEach(async () => {
      await app.init();
      app.hasPlayedCurrent = true; // Simulate audio has played
    });

    it('should accept correct answer', () => {
      app.currentAmount = 500;
      app.elements.answerInput.value = '500';
      
      app.checkAnswer();
      
      expect(app.elements.answerInput.classList.contains('correct')).toBe(true);
    });

    it('should reject incorrect answer', () => {
      app.currentAmount = 500;
      app.elements.answerInput.value = '550';
      
      app.checkAnswer();
      
      expect(app.elements.answerInput.classList.contains('incorrect')).toBe(true);
    });

    it('should strip ¥ symbol from input', () => {
      app.currentAmount = 500;
      app.elements.answerInput.value = '¥500';
      
      app.checkAnswer();
      
      expect(app.elements.answerInput.classList.contains('correct')).toBe(true);
    });

    it('should strip commas from input', () => {
      app.currentAmount = 1500;
      app.elements.answerInput.value = '1,500';
      
      app.checkAnswer();
      
      expect(app.elements.answerInput.classList.contains('correct')).toBe(true);
    });

    it('should prevent checking before audio plays', () => {
      app.hasPlayedCurrent = false;
      app.currentAmount = 500;
      app.elements.answerInput.value = '500';
      
      app.checkAnswer();
      
      // Should not check answer
      expect(app.elements.answerInput.classList.contains('correct')).toBe(false);
    });

    it('should increment attempt count', () => {
      app.currentAmount = 500;
      app.elements.answerInput.value = '500';
      
      const initialAttempts = app.attemptCount;
      app.checkAnswer();
      
      expect(app.attemptCount).toBe(initialAttempts + 1);
    });
  });

  describe('Correct Answer Handling', () => {
    beforeEach(async () => {
      await app.init();
      app.hasPlayedCurrent = true;
    });

    it('should increment correct count', () => {
      const initialCorrect = app.statsService.correctCount;
      
      app.handleCorrectAnswer();
      
      expect(app.statsService.correctCount).toBe(initialCorrect + 1);
    });

    it('should increment total count', () => {
      const initialTotal = app.statsService.totalCount;
      
      app.handleCorrectAnswer();
      
      expect(app.statsService.totalCount).toBe(initialTotal + 1);
    });

    it('should apply correct styling', () => {
      app.handleCorrectAnswer();
      
      expect(app.elements.answerInput.classList.contains('correct')).toBe(true);
    });

    it('should display success feedback', () => {
      app.handleCorrectAnswer();
      
      expect(app.elements.feedback.textContent).toContain('Correct');
    });
  });

  describe('Incorrect Answer Handling', () => {
    beforeEach(async () => {
      await app.init();
      app.hasPlayedCurrent = true;
      app.currentAmount = 500;
    });

    it('should increment total count', () => {
      const initialTotal = app.statsService.totalCount;
      
      app.handleIncorrectAnswer();
      
      expect(app.statsService.totalCount).toBe(initialTotal + 1);
    });

    it('should apply incorrect styling', () => {
      app.handleIncorrectAnswer();
      
      expect(app.elements.answerInput.classList.contains('incorrect')).toBe(true);
    });

    it('should display error feedback with answer', () => {
      app.handleIncorrectAnswer();
      
      expect(app.elements.feedback.textContent).toContain('Incorrect');
      expect(app.elements.feedback.textContent).toContain('500');
    });

    it('should show answer button', () => {
      app.handleIncorrectAnswer();
      
      expect(app.elements.showAnswerBtn.classList.contains('visible')).toBe(true);
    });
  });

  describe('Statistics', () => {
    beforeEach(async () => {
      await app.init();
    });

    it('should calculate accuracy correctly', () => {
      app.statsService.correctCount = 7;
      app.statsService.totalCount = 10;
      
      app.updateStats();
      
      expect(app.elements.accuracy.textContent).toBe('70%');
    });

    it('should handle 100% accuracy', () => {
      app.statsService.correctCount = 10;
      app.statsService.totalCount = 10;
      
      app.updateStats();
      
      expect(app.elements.accuracy.textContent).toBe('100%');
    });

    it('should handle 0% accuracy', () => {
      app.statsService.correctCount = 0;
      app.statsService.totalCount = 10;
      
      app.updateStats();
      
      expect(app.elements.accuracy.textContent).toBe('0%');
    });

    it('should handle division by zero', () => {
      app.statsService.correctCount = 0;
      app.statsService.totalCount = 0;
      
      app.updateStats();
      
      expect(app.elements.accuracy.textContent).toBe('0%');
    });

    it('should reset stats correctly', () => {
      app.statsService.correctCount = 5;
      app.statsService.totalCount = 10;
      
      // Mock window.confirm to auto-accept
      global.confirm = () => true;
      
      app.resetStats();
      
      const stats = app.statsService.getStats();
      expect(stats.correct).toBe(0);
      expect(stats.total).toBe(0);
    });
  });

  describe('Audio Integration', () => {
    beforeEach(async () => {
      await app.init();
    });

    it('should call audioService.playCloudTTS with correct format', async () => {
      vi.spyOn(app.audioService, 'playCloudTTS').mockResolvedValue();
      
      app.currentAmount = 500;
      await app.playAmount();
      
      expect(app.audioService.playCloudTTS).toHaveBeenCalledWith('500円');
    });

    it('should enable input after first play', async () => {
      vi.spyOn(app.audioService, 'playCloudTTS').mockResolvedValue();
      
      app.hasPlayedCurrent = false;
      app.elements.answerInput.disabled = true;
      
      await app.playAmount();
      
      expect(app.hasPlayedCurrent).toBe(true);
      expect(app.elements.answerInput.disabled).toBe(false);
    });

    it('should enable replay button after playing', async () => {
      vi.spyOn(app.audioService, 'playCloudTTS').mockResolvedValue();
      
      app.elements.replayBtn.disabled = true;
      await app.playAmount();
      
      expect(app.elements.replayBtn.disabled).toBe(false);
    });

    it('should handle audio errors gracefully', async () => {
      vi.spyOn(app.audioService, 'playCloudTTS').mockRejectedValue(new Error('Audio failed'));
      vi.spyOn(console, 'error').mockImplementation(() => {});
      
      await app.playAmount();
      
      expect(app.elements.feedback.textContent).toContain('Audio failed');
      
      console.error.mockRestore();
    });
  });
});