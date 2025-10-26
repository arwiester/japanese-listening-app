/**
 * BasePractice - Shared base class for all practice modules
 */

import AudioService from './audioService.js';
import StatsService from './statsService.js';

class BasePractice {
  constructor() {
    // Shared services
    this.audioService = new AudioService();
    this.statsService = new StatsService();
    
    // Shared state
    this.hasPlayedCurrent = false;
    this.attemptCount = 0;
    this.elements = {};
  }

  /**
   * Initialize shared services
   */
  async initServices() {
    await this.audioService.initWebSpeechVoices();
    this.statsService.loadStats();
  }

  /**
   * Handle audio action with button locking
   * @param {NodeList|Array} buttonGroup - Buttons to disable during action
   * @param {Function} action - Async action to execute
   */
  async handleAudioAction(buttonGroup, action) {
    // Early exit if audio is playing
    if (this.audioService.isPlaying) {
      console.log('Audio playing, ignoring action');
      return;
    }

    // Disable button group
    this.disableButtons(buttonGroup);

    try {
      // Execute the action (async)
      await action();
    } finally {
      // Always re-enable buttons
      this.enableButtons(buttonGroup);
    }
  }

  /**
   * Disable a group of buttons
   */
  disableButtons(buttonGroup) {
    buttonGroup.forEach(btn => btn.disabled = true);
  }

  /**
   * Enable a group of buttons
   */
  enableButtons(buttonGroup) {
    buttonGroup.forEach(btn => btn.disabled = false);
  }

  /**
   * Set active button in a group
   */
  setActiveButton(buttonGroup, activeValue, dataAttribute = 'range') {
    buttonGroup.forEach(btn => {
      const value = parseInt(btn.dataset[dataAttribute]);
      btn.classList.toggle('active', value === activeValue);
    });
  }

  /**
   * Play audio using Cloud TTS or Web Speech API
   */
  async playAudio(text, replay = false, useCloud = true) {
    try {
      if (useCloud) {
        await this.audioService.playCloudTTS(text, replay);
      } else {
        await this.audioService.playWebSpeechAPI(text);
      }
      
      this.hasPlayedCurrent = true;
      
    } catch (error) {
      console.error('Playback error:', error);
      // Fallback to Web Speech API
      console.log('Falling back to Web Speech API');
      await this.audioService.playWebSpeechAPI(text);
      this.hasPlayedCurrent = true;
    }
  }

  /**
   * Show feedback message
   */
  showFeedback(message, type) {
    if (this.elements.feedback) {
      this.elements.feedback.textContent = message;
      this.elements.feedback.className = `feedback ${type}`;
    }
  }

  /**
   * Clear feedback message
   */
  clearFeedback() {
    if (this.elements.feedback) {
      this.elements.feedback.textContent = '';
      this.elements.feedback.className = 'feedback';
    }
  }

  /**
   * Update statistics display
   */
  updateStats() {
    if (!this.elements.correctCount) return;
    
    const stats = this.statsService.getStats();
    this.elements.correctCount.textContent = stats.correct;
    this.elements.totalCount.textContent = stats.total;
    this.elements.accuracy.textContent = stats.accuracy + '%';
  }

  /**
   * Reset statistics
   */
  resetStats() {
    if (confirm('Reset all statistics?')) {
      this.statsService.resetStats();
      this.updateStats();
      this.clearFeedback();
    }
  }
}

export default BasePractice;