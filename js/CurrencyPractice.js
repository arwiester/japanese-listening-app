/**
 * Currency Practice Module
 * Practice listening to Japanese currency amounts (円)
 */

import { getRandomNumber } from './utils.js';
import AudioService from './audioService.js';

export default class CurrencyPractice {
  constructor() {
    this.currentAmount = 0;
    this.currentRange = 999; // Start with convenience store range
    this.audioService = new AudioService(); // Instantiate audio service
    this.hasPlayedCurrent = false;
    this.attemptCount = 0;
    this.stats = {
      correct: 0,
      total: 0
    };
    this.elements = {};
  }

  /**
   * Initialize the currency practice
   */
  async init() {
    await this.audioService.initWebSpeechVoices(); // Initialize voices
    this.cacheElements();
    this.attachEventListeners();
    this.generateAmount();
    console.log('Currency Practice initialized');
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      answerInput: document.getElementById('answer-input'),
      rangeBtns: document.querySelectorAll('.range-btn'),
      feedback: document.getElementById('feedback'),
      replayBtn: document.getElementById('replay-btn'),
      showAnswerBtn: document.getElementById('show-answer-btn'),
      resetBtn: document.getElementById('reset-btn'),
      correctCount: document.getElementById('correct-count'),
      totalCount: document.getElementById('total-count'),
      accuracy: document.getElementById('accuracy'),
      inputHint: document.getElementById('input-hint')
    };
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Range selection
    this.elements.rangeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const range = parseInt(btn.dataset.range);
        this.setRange(range);
      });
    });

    // Auto-check on input
    this.elements.answerInput.addEventListener('input', () => {
      const value = this.elements.answerInput.value;
      if (value.length >= this.currentAmount.toString().length) {
        this.checkAnswer();
      }
    });

    // Replay button
    this.elements.replayBtn.addEventListener('click', () => {
      this.playAmount();
    });

    // Show answer button
    this.elements.showAnswerBtn.addEventListener('click', () => {
      this.showAnswerAndContinue();
    });

    // Reset stats
    this.elements.resetBtn.addEventListener('click', () => {
      this.resetStats();
    });
  }

  /**
   * Set currency range
   */
  setRange(range) {
    this.currentRange = range;
    
    // Update active button
    this.elements.rangeBtns.forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.range) === range);
    });
    
    // Generate new amount and auto-play
    this.generateAmount();
    this.playAmount();
  }

  /**
   * Generate random currency amount
   */
  generateAmount() {
    // Generate realistic amounts based on range
    if (this.currentRange === 999) {
      // ¥1-¥999 - convenience store transactions (any total possible)
      this.currentAmount = getRandomNumber(1, 999);
    } else {
      const min = Math.floor(this.currentRange / 10);
      this.currentAmount = getRandomNumber(min, this.currentRange);
      
      // Round to realistic amounts for larger ranges
      if (this.currentRange >= 10000) {
        this.currentAmount = Math.round(this.currentAmount / 100) * 100;
      } else if (this.currentRange >= 1000) {
        this.currentAmount = Math.round(this.currentAmount / 10) * 10;
      }
    }
    
    this.hasPlayedCurrent = false;
    this.attemptCount = 0;
    
    // Reset input
    this.elements.answerInput.value = '';
    this.elements.answerInput.className = 'answer-input';
    this.elements.answerInput.maxLength = this.currentRange.toString().length;
    
    // Hide show answer button
    this.elements.showAnswerBtn.classList.remove('visible');
    
    // Reset focus
    this.elements.answerInput.focus();
    
    console.log('Generated amount:', this.currentAmount, '円');
  }

  /**
   * Play currency amount audio
   */
  async playAmount() {
    if (!this.currentAmount) return;
    
    const text = `${this.currentAmount}円`; // Add 円 for "en"
    
    try {
      await this.audioService.playCloudTTS(text);
      
      // Enable input after first play
      if (!this.hasPlayedCurrent) {
        this.hasPlayedCurrent = true;
        this.elements.answerInput.disabled = false;
        this.elements.answerInput.focus();
        this.elements.inputHint.textContent = '💡 Type the amount';
      }
      
      // Enable replay button
      this.elements.replayBtn.disabled = false;
      
    } catch (error) {
      console.error('Audio playback failed:', error);
      this.elements.feedback.textContent = '⚠️ Audio failed. Try again.';
      this.elements.feedback.className = 'feedback incorrect';
    }
  }

  /**
   * Check user's answer
   */
  checkAnswer() {
    if (!this.hasPlayedCurrent) return;
    
    // Get user input and strip any ¥ symbol or commas
    const userAnswer = this.elements.answerInput.value.replace(/[¥,]/g, '').trim();
    const userNumber = parseInt(userAnswer);
    
    this.attemptCount++;
    
    if (userNumber === this.currentAmount) {
      // Correct!
      this.handleCorrectAnswer();
    } else if (userAnswer.length >= this.currentAmount.toString().length) {
      // Wrong length = wrong answer
      this.handleIncorrectAnswer();
    }
  }

  /**
   * Handle correct answer
   */
  handleCorrectAnswer() {
    this.stats.correct++;
    this.stats.total++;
    
    this.elements.answerInput.className = 'answer-input correct';
    this.elements.feedback.textContent = '✓ Correct!';
    this.elements.feedback.className = 'feedback correct';
    
    this.updateStats();
    
    // Auto-advance after delay
    setTimeout(() => {
      this.generateAmount();
      this.playAmount();
      this.elements.feedback.textContent = '';
    }, 1500);
  }

  /**
   * Handle incorrect answer
   */
  handleIncorrectAnswer() {
    this.stats.total++;
    
    this.elements.answerInput.className = 'answer-input incorrect';
    this.elements.feedback.textContent = `✗ Incorrect. The answer was ¥${this.currentAmount.toLocaleString()}`;
    this.elements.feedback.className = 'feedback incorrect';
    
    this.updateStats();
    
    // Show answer button
    this.elements.showAnswerBtn.classList.add('visible');
  }

  /**
   * Show answer and continue
   */
  showAnswerAndContinue() {
    this.elements.answerInput.value = this.currentAmount;
    this.elements.answerInput.className = 'answer-input';
    
    setTimeout(() => {
      this.generateAmount();
      this.playAmount();
      this.elements.feedback.textContent = '';
      this.elements.showAnswerBtn.classList.remove('visible');
    }, 1000);
  }

  /**
   * Update statistics display
   */
  updateStats() {
    this.elements.correctCount.textContent = this.stats.correct;
    this.elements.totalCount.textContent = this.stats.total;
    
    const accuracy = this.stats.total > 0 
      ? Math.round((this.stats.correct / this.stats.total) * 100)
      : 0;
    this.elements.accuracy.textContent = `${accuracy}%`;
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = { correct: 0, total: 0 };
    this.updateStats();
    this.elements.feedback.textContent = '';
  }
}