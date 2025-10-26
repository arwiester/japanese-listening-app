/**
 * CurrencyPractice - Currency listening practice
 */

import BasePractice from './BasePractice.js';
import { getRandomNumber } from './utils.js';

class CurrencyPractice extends BasePractice {
  constructor() {
    super(); // Call parent constructor
    
    // Currency-specific state
    this.currentAmount = 0;
    this.currentRange = 999;
  }

  async init() {
    this.cacheElements();
    await this.initServices(); // From BasePractice
    this.setupEventListeners();
    this.updateStats();
    this.generateAmount();
    
    console.log('Currency Practice initialized');
  }

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

  setupEventListeners() {
    // Range selection with button locking
    this.elements.rangeBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        await this.handleAudioAction(
          this.elements.rangeBtns,
          () => this.setRange(parseInt(e.target.dataset.range))
        );
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
    this.elements.replayBtn.addEventListener('click', () => this.playAmount());

    // Show answer button
    this.elements.showAnswerBtn.addEventListener('click', () => this.showAnswerAndContinue());

    // Reset stats
    this.elements.resetBtn.addEventListener('click', () => this.resetStats());
  }

  async setRange(range) {
    this.currentRange = range;
    this.setActiveButton(this.elements.rangeBtns, range);
    this.generateAmount();
    await this.playAmount();
  }

  /**
   * Generate random currency amount
   */
  generateAmount() {
    // Generate realistic amounts based on range
    if (this.currentRange === 999) {
      // ¥1-¥999 - convenience store transactions
      this.currentAmount = getRandomNumber(1, 999);
    } else {
      const min = Math.floor(this.currentRange / 10);
      this.currentAmount = getRandomNumber(min, this.currentRange);
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
      this.showFeedback('⚠️ Audio failed. Try again.', 'incorrect');
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
      this.handleCorrectAnswer();
    } else if (userAnswer.length >= this.currentAmount.toString().length) {
      this.handleIncorrectAnswer();
    }
  }

  /**
   * Handle correct answer
   */
  handleCorrectAnswer() {
    // Use statsService from base class
    this.statsService.incrementCorrect();
    
    this.elements.answerInput.className = 'answer-input correct';
    this.showFeedback('✓ Correct!', 'correct');
    
    this.updateStats();
    
    // Auto-advance after delay
    setTimeout(() => {
      this.generateAmount();
      this.playAmount();
      this.clearFeedback();
    }, 1500);
  }

  /**
   * Handle incorrect answer
   */
  handleIncorrectAnswer() {
    // Use statsService from base class
    this.statsService.incrementTotal();
    
    this.elements.answerInput.className = 'answer-input incorrect';
    this.showFeedback(
      `✗ Incorrect. The answer was ¥${this.currentAmount.toLocaleString()}`,
      'incorrect'
    );
    
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
      this.clearFeedback();
      this.elements.showAnswerBtn.classList.remove('visible');
    }, 1000);
  }

}

export default CurrencyPractice;