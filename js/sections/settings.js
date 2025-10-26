/**
 * Settings Section Loader
 * App settings and preferences
 */

async function loadSettingsSection(container) {
  container.innerHTML = `
    <div class="section-container">
      <header style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 1.6em; color: var(--text-primary); margin-bottom: 5px;">せってい</div>
        <h1 style="margin: 0;">⚙️ Settings</h1>
      </header>

      <div style="max-width: 400px; margin: 0 auto;">
        <!-- Voice Settings -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: var(--text-primary); margin-bottom: 15px;">🎤 Voice Settings</h3>
          <div style="background: var(--bg-surface); border: 1px solid var(--border-primary); border-radius: 8px; padding: 20px;">
            <label style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
              <span style="color: var(--text-primary);">Voice Type</span>
              <select style="padding: 8px 12px; border-radius: 4px; border: 1px solid var(--border-primary); background: var(--bg-surface); color: var(--text-primary);">
                <option>Cloud TTS (Best)</option>
                <option>Web Speech API</option>
                <option>Random Mix</option>
              </select>
            </label>
          </div>
        </div>

        <!-- Stats Settings -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: var(--text-primary); margin-bottom: 15px;">📊 Statistics</h3>
          <div style="background: var(--bg-surface); border: 1px solid var(--border-primary); border-radius: 8px; padding: 20px;">
            <button style="width: 100%; padding: 12px; background: var(--warning); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
              Reset All Statistics
            </button>
          </div>
        </div>

        <!-- About -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: var(--text-primary); margin-bottom: 15px;">ℹ️ About</h3>
          <div style="background: var(--bg-surface); border: 1px solid var(--border-primary); border-radius: 8px; padding: 20px; color: var(--text-secondary); font-size: 0.9em;">
            <p style="margin: 0 0 10px 0;">Japanese Practice App</p>
            <p style="margin: 0 0 10px 0;">Version: 1.0.0</p>
            <p style="margin: 0;">Built with ❤️ for Japanese learners</p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  console.log('Settings section loaded (placeholder)');
}
