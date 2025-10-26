/**
 * Vocabulary Section Loader
 * Practice Japanese vocabulary listening
 */

async function loadVocabularySection(container) {
  container.innerHTML = `
    <div class="section-container">
      <header style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 1.6em; color: var(--text-primary); margin-bottom: 5px;">たんご</div>
        <h1 style="margin: 0;">📚 Vocabulary</h1>
      </header>

      <div style="text-align: center; padding: 60px 20px;">
        <div style="font-size: 60px; margin-bottom: 20px;">🚧</div>
        <h2 style="color: var(--text-primary); margin-bottom: 10px;">Coming Soon!</h2>
        <p style="color: var(--text-secondary); font-size: 1.1em;">
          Practice listening to Japanese vocabulary
        </p>
        <div style="margin-top: 30px; display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
          <span style="padding: 8px 16px; background: var(--accent-primary-light); border-radius: 20px; color: var(--accent-primary); font-size: 0.9em;">N5</span>
          <span style="padding: 8px 16px; background: var(--accent-primary-light); border-radius: 20px; color: var(--accent-primary); font-size: 0.9em;">N4</span>
          <span style="padding: 8px 16px; background: var(--accent-primary-light); border-radius: 20px; color: var(--accent-primary); font-size: 0.9em;">N3</span>
          <span style="padding: 8px 16px; background: var(--accent-primary-light); border-radius: 20px; color: var(--accent-primary); font-size: 0.9em;">Themed Categories</span>
        </div>
      </div>
    </div>
  `;
  
  console.log('Vocabulary section loaded (placeholder)');
}
