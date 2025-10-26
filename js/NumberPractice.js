/**
 * NumberPractice - Numbers listening practice
 */

import BasePractice from './BasePractice.js';
import {
  DIFFICULTY_RANGES,
  ENCOURAGEMENT_MESSAGES,
  VOICE_MODES,
  STORAGE_KEYS,
  DEFAULTS,
  TIMINGS,
  ATTEMPTS_BEFORE_HINT
} from './config.js';
import { getRandomNumber, debounce } from './utils.js';

class NumberPractice extends BasePractice {
  constructor() {
    super(); // Call parent constructor
    
    // Number-specific state
    this.currentNumber = null;
    this.currentRange = DEFAULTS.RANGE;
    this.voiceMode = DEFAULTS.VOICE_MODE;
  }

  async init() {
    this.cacheElements();
    await this.initServices(); // From BasePractice
    this.loadVoiceMode();
    this.setupEventListeners();
    this.updateStats();
    this.setActiveButton(this.elements.rangeBtns, this.currentRange);
    this.setActiveVoiceModeButton(this.voiceMode);
    this.generateNumber();
    
    console.log('Japanese Number Practice initialized');
  }

  cacheElements() {
    this.elements = {
      replayBtn: document.getElementById('replay-btn'),
      showAnswerBtn: document.getElementById('show-answer-btn'),
      resetBtn: document.getElementById('reset-btn'),
      answerInput: document.getElementById('answer-input'),
      inputHint: document.getElementById('input-hint'),
      correctCount: document.getElementById('correct-count'),
      totalCount: document.getElementById('total-count'),
      accuracy: document.getElementById('accuracy'),
      feedback: document.getElementById('feedback'),
      rangeBtns: document.querySelectorAll('.range-btn'),
      voiceModeBtns: document.querySelectorAll('.voice-mode-btn')
    };
  }

  setupEventListeners() {
    // Range selection with button locking - NOW CLEAN
    this.elements.rangeBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        await this.handleAudioAction(
          this.elements.rangeBtns,
          () => this.setRange(parseInt(e.target.dataset.range))
        );
      });
    });
    
    // Voice mode selection
    this.elements.voiceModeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.setVoiceMode(e.target.dataset.mode));
    });
    
    // Play buttons
    this.elements.replayBtn.addEventListener('click', () => this.playNumber(true));
    this.elements.showAnswerBtn.addEventListener('click', () => this.showAnswerAndContinue());
    this.elements.resetBtn.addEventListener('click', () => this.resetStats());
    
    // Input handling with debounce
    this.elements.answerInput.addEventListener('input', debounce(() => {
      const expectedLength = this.currentNumber.toString().length;
      if (this.elements.answerInput.value.length >= expectedLength) {
        this.checkAnswer();
      }
    }, 100));
  }

  async setRange(range) {
    this.currentRange = range;
    this.setActiveButton(this.elements.rangeBtns, range);
    this.generateNumber();
    await this.playNumber();
    this.clearFeedback();
  }

  /**
   * Set active range button
   */
  setActiveRangeButton(range) {
    this.elements.rangeBtns.forEach(btn => {
      if (parseInt(btn.dataset.range) === range) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  /**
   * Set voice mode
   */
  setVoiceMode(mode) {
    this.voiceMode = mode;
    this.setActiveVoiceModeButton(mode);
    this.saveVoiceMode();
  }

  /**
   * Set active voice mode button
   */
  setActiveVoiceModeButton(mode) {
    this.elements.voiceModeBtns.forEach(btn => {
      if (btn.dataset.mode === mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  /**
   * Save voice mode preference
   */
  saveVoiceMode() {
    try {
      localStorage.setItem(STORAGE_KEYS.VOICE_MODE, this.voiceMode);
    } catch (error) {
      console.error('Error saving voice mode:', error);
    }
  }

  /**
   * Load voice mode preference
   */
  loadVoiceMode() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VOICE_MODE);
      if (saved) {
        this.voiceMode = saved;
      }
    } catch (error) {
      console.error('Error loading voice mode:', error);
    }
  }

  /**
   * Generate new random number
   */
  generateNumber() {
    this.currentNumber = getRandomNumber(0, this.currentRange);
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
    
    console.log('Generated number:', this.currentNumber);
  }

  /**
   * Generate next random number (different from current)
   */
  nextRandom() {
    let newNumber;
    do {
      newNumber = getRandomNumber(0, this.currentRange);
    } while (newNumber === this.currentNumber && this.currentRange > 0);
    
    this.currentNumber = newNumber;
    this.hasPlayedCurrent = false;
    this.attemptCount = 0;
    
    this.elements.answerInput.value = '';
    this.elements.answerInput.className = 'answer-input';
    this.elements.answerInput.focus();
    
    this.clearFeedback();
    
    console.log('Next random number:', this.currentNumber);
    
    // Auto-play the new number
    this.playNumber();
  }

  /**
   * Play current number audio
   */
  async playNumber(replay = false) {
    if (this.currentNumber === null) return;
    
    try {
      // Determine which TTS to use
      let useCloud = this.voiceMode === VOICE_MODES.CLOUD_TTS;
      
      if (this.voiceMode === VOICE_MODES.RANDOM) {
        useCloud = Math.random() > 0.5;
      }
      
      if (useCloud) {
        await this.audioService.playCloudTTS(this.currentNumber, replay);
      } else {
        await this.audioService.playWebSpeechAPI(this.currentNumber);
      }
      
      this.hasPlayedCurrent = true;
      this.enableInteractiveElements();
      
    } catch (error) {
      console.error('Playback error:', error);
      // Fallback to Web Speech API
      console.log('Falling back to Web Speech API');
      await this.audioService.playWebSpeechAPI(this.currentNumber);
      this.hasPlayedCurrent = true;
      this.enableInteractiveElements();
    }
  }

  /**
   * Check user's answer
   */
  checkAnswer() {
    const userAnswer = parseInt(this.elements.answerInput.value);
    
    if (!this.elements.answerInput.value) return;
    
    if (!this.hasPlayedCurrent) {
      this.showFeedback('💡 Play the audio first!', 'hint');
      this.elements.answerInput.value = '';
      setTimeout(() => this.clearFeedback(), TIMINGS.FEEDBACK_CLEAR);
      return;
    }
    
    if (userAnswer === this.currentNumber) {
      this.handleCorrectAnswer();
    } else {
      this.handleWrongAnswer();
    }
  }

  /**
   * Handle correct answer
   */
  handleCorrectAnswer() {
    this.elements.answerInput.className = 'answer-input correct';
    this.statsService.incrementCorrect();
    this.updateStats();
    
    // Brief pause for positive feedback, then move on
    setTimeout(() => {
      this.generateNumber();
      this.playNumber();
    }, TIMINGS.SUCCESS_DELAY);
  }

  /**
   * Handle wrong answer
   */
  handleWrongAnswer() {
    this.attemptCount++;
    this.elements.answerInput.className = 'answer-input incorrect';
    
    // Show encouraging feedback
    const message = ENCOURAGEMENT_MESSAGES[
      Math.min(this.attemptCount - 1, ENCOURAGEMENT_MESSAGES.length - 1)
    ];
    this.showFeedback(message, 'incorrect');
    
    // Auto-replay the same audio
    this.playNumber(true);
    
    // Clear input immediately for retry
    this.elements.answerInput.value = '';
    this.elements.answerInput.focus();
    
    // Remove visual feedback after delay
    setTimeout(() => {
      this.elements.answerInput.className = 'answer-input';
      this.clearFeedback();
    }, TIMINGS.INCORRECT_FEEDBACK);
    
    // Show "Show Answer" button after threshold
    if (this.attemptCount >= ATTEMPTS_BEFORE_HINT) {
      this.elements.showAnswerBtn.classList.add('visible');
    }
  }

  /**
   * Show answer and continue to next number
   */
  showAnswerAndContinue() {
    this.statsService.incrementTotal();
    this.updateStats();
    
    this.showFeedback(`The answer was: ${this.currentNumber}`, 'hint');
    
    setTimeout(() => {
      this.generateNumber();
      this.playNumber();
      this.clearFeedback();
    }, TIMINGS.SHOW_ANSWER_DELAY);
  }

  /**
   * Reset statistics
   */
  resetStats() {
    if (confirm('Reset all statistics?')) {
      this.statsService.resetStats();
      this.updateStats();
    }
  }

  /**
   * Update stats display
   */
  updateStats() {
    const stats = this.statsService.getStats();
    this.elements.correctCount.textContent = stats.correct;
    this.elements.totalCount.textContent = stats.total;
    this.elements.accuracy.textContent = stats.accuracy + '%';
  }

  /**
   * Show feedback message
   */
  showFeedback(message, type) {
    this.elements.feedback.textContent = message;
    this.elements.feedback.className = `feedback ${type}`;
  }

  /**
   * Clear feedback message
   */
  clearFeedback() {
    this.elements.feedback.textContent = '';
    this.elements.feedback.className = 'feedback';
  }

  /**
   * Enable interactive elements after audio plays
   */
  enableInteractiveElements() {
    this.elements.answerInput.disabled = false;
    this.elements.answerInput.focus();
    this.elements.replayBtn.disabled = false;
    // this.elements.nextBtn.disabled = false;
    this.elements.inputHint.textContent = 'Answer will auto-check when complete';
  }

  /**
   * Disable interactive elements before audio plays
   */
  disableInteractiveElements() {
    this.elements.answerInput.disabled = true;
    this.elements.replayBtn.disabled = true;
    // this.elements.nextBtn.disabled = true;
    this.elements.inputHint.textContent = '💡 Play the audio first!';
  }
}

export default NumberPractice;
