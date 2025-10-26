/**
 * Audio Service - Handles TTS playback
 */

import { TTS_PROXY_URL, ALL_VOICES } from './config.js';
import { getRandomElement } from './utils.js';

class AudioService {
  constructor() {
    this.audioCache = {};
    this.currentVoiceConfig = null;
    this.japaneseVoices = [];
  }

  /**
   * Initialize Web Speech API voices
   */
  async initWebSpeechVoices() {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        this.japaneseVoices = window.speechSynthesis
          .getVoices()
          .filter(voice => voice.lang.startsWith('ja'));
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      // Wait a bit for voices to load
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Play number using Cloud TTS (Google Neural2)
   */
  async playCloudTTS(number, replay = false) {
    // Use stored voice config for replays, otherwise pick new random voice
    let voiceConfig;
    if (replay && this.currentVoiceConfig) {
      voiceConfig = this.currentVoiceConfig;
    } else {
      voiceConfig = getRandomElement(ALL_VOICES);
      this.currentVoiceConfig = voiceConfig;
    }

    // Create cache key that includes voice config
    const cacheKey = `${number}_${voiceConfig.name}_${voiceConfig.pitch}`;

    // Check cache first
    if (this.audioCache[cacheKey]) {
      await this.playFromCache(cacheKey);
      console.log(`Playing cached: ${voiceConfig.label}`);
      return;
    }

    // Fetch from Cloudflare Worker
    const response = await fetch(TTS_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: number.toString(),
        voiceName: voiceConfig.name,
        rate: voiceConfig.rate,
        pitch: voiceConfig.pitch
      })
    });

    if (!response.ok) {
      throw new Error(`Proxy error: ${response.status}`);
    }

    const data = await response.json();
    const audioUrl = `data:audio/mp3;base64,${data.audioContent}`;

    // Cache the audio
    this.audioCache[cacheKey] = audioUrl;

    // Play the audio
    await this.playAudio(audioUrl);
    
    console.log(`Playing: ${voiceConfig.label} (pitch: ${voiceConfig.pitch}, rate: ${voiceConfig.rate})`);
  }

  /**
   * Play number using Web Speech API
   */
  playWebSpeechAPI(number) {
    return new Promise((resolve, reject) => {
      const synth = window.speechSynthesis;
      synth.cancel(); // Stop any currently playing audio

      const utterance = new SpeechSynthesisUtterance(number.toString());
      utterance.lang = 'ja-JP';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Use random Japanese voice if available
      if (this.japaneseVoices.length > 0) {
        const randomVoice = getRandomElement(this.japaneseVoices);
        utterance.voice = randomVoice;
        console.log('Using voice:', randomVoice.name);
      }

      utterance.onend = resolve;
      utterance.onerror = reject;

      synth.speak(utterance);
    });
  }

  /**
   * Play audio from URL
   */
  playAudio(url) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      audio.onended = resolve;
      audio.onerror = reject;
      audio.play().catch(reject);
    });
  }

  /**
   * Play audio from cache
   */
  playFromCache(cacheKey) {
    return this.playAudio(this.audioCache[cacheKey]);
  }

  /**
   * Clear audio cache
   */
  clearCache() {
    this.audioCache = {};
  }
}

export default AudioService;
