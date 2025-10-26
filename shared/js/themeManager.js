/**
 * Global Theme Manager
 * Syncs theme across all sections via localStorage
 */

const THEME_KEY = 'japanese-learning-theme';

class ThemeManager {
  constructor() {
    this.currentTheme = this.loadTheme();
  }

  /**
   * Load theme preference from localStorage
   */
  loadTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === 'dark' ? 'dark' : 'light';
  }

  /**
   * Save theme preference to localStorage
   */
  saveTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    this.currentTheme = theme;
  }

  /**
   * Apply theme to document
   */
  applyTheme(theme = this.currentTheme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  /**
   * Toggle between light and dark mode
   */
  toggle() {
    const next = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.saveTheme(next);
    this.applyTheme(next);
    return next;
  }

  /**
   * Initialize theme system
   */
  init() {
    this.applyTheme();
  }
}

// Export singleton instance
export default new ThemeManager();
