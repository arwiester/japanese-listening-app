/**
 * Configuration Constants
 */

// Cloudflare Worker Proxy URL (API key is server-side)
export const TTS_PROXY_URL = 'https://japanese-tts-proxy.arwiester.workers.dev';

// Voice configurations - 8 variations for natural variety
export const ALL_VOICES = [
  // Young voices
  { name: 'ja-JP-Neural2-B', pitch: 3.25, rate: 1.05, label: 'Female Young' },
  { name: 'ja-JP-Neural2-C', pitch: 7.00, rate: 1.05, label: 'Male Young' },
  { name: 'ja-JP-Neural2-D', pitch: 7.0, rate: 0.90, label: 'Male Young' },
  
  // Adult voices
  { name: 'ja-JP-Neural2-B', pitch: 0, rate: 1.0, label: 'Female Adult' },
  { name: 'ja-JP-Neural2-C', pitch: 0, rate: 1.0, label: 'Male Adult' },
  { name: 'ja-JP-Neural2-D', pitch: 0, rate: 1.0, label: 'Male Adult' },
  
  // Older voices
  { name: 'ja-JP-Neural2-C', pitch: -4.5, rate: 0.89, label: 'Male Older' },
  { name: 'ja-JP-Neural2-D', pitch: -5.0, rate: 0.89, label: 'Male Older' }
];

// Voice mode options
export const VOICE_MODES = {
  CLOUD_TTS: 'cloud',
  WEB_SPEECH: 'web',
  RANDOM: 'random'
};

// Difficulty ranges
export const DIFFICULTY_RANGES = [10, 100, 1000, 10000];

// Encouraging feedback messages for wrong attempts
export const ENCOURAGEMENT_MESSAGES = [
  '🤔 Try again!',
  '💪 Keep going!',
  '👂 Listen carefully and try once more!'
];

// LocalStorage keys
export const STORAGE_KEYS = {
  STATS: 'japanese-numbers-stats',
  VOICE_MODE: 'japanese-numbers-voice-mode'
};

// Default settings
export const DEFAULTS = {
  RANGE: 10,
  VOICE_MODE: VOICE_MODES.CLOUD_TTS
};

// Timing constants (in milliseconds)
export const TIMINGS = {
  SUCCESS_DELAY: 400,
  SHOW_ANSWER_DELAY: 2000,
  FEEDBACK_CLEAR: 1500,
  INCORRECT_FEEDBACK: 1200
};

// Number of attempts before showing "Show Answer" button
export const ATTEMPTS_BEFORE_HINT = 2;
