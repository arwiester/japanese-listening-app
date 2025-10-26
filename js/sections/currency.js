/**
 * Currency Section Loader
 * Practice Japanese currency amounts (円)
 */

async function loadCurrencySection(container) {
  container.innerHTML = `
    <div class="container">
      <header style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 1.6em; color: var(--text-primary); margin-bottom: 5px;">おかね</div>
        <h1 style="margin: 0;">💴 Currency</h1>
      </header>

      <!-- Currency Range Selection -->
      <section class="range-selector">
        <button class="range-btn active" data-range="999">▶ ¥1 — ¥999</button>
        <button class="range-btn" data-range="10000">▶ ¥1,000 — ¥10,000</button>
        <button class="range-btn" data-range="100000">▶ ¥10,000 — ¥100,000</button>
        <button class="range-btn" data-range="1000000">▶ ¥100,000 — ¥1,000,000</button>
      </section>

      <!-- Answer Input -->
      <section class="input-area">
        <div class="feedback" id="feedback"></div>
        <input 
          type="text" 
          id="answer-input"
          class="answer-input"
          inputmode="numeric" 
          pattern="[0-9]*"
          placeholder="Type the amount you hear"
          autocomplete="off"
          maxlength="7"
          disabled
          aria-label="Answer input"
        >
        <div class="hint" id="input-hint">💡 Play the audio first!</div>
        
        <button class="replay-btn" id="replay-btn" disabled>🔊 Replay Audio</button>
        <button class="show-answer-btn" id="show-answer-btn">💡 Show Answer & Continue</button>
      </section>

      <!-- Statistics -->
      <section class="stats">
        <div class="stat">
          <div class="stat-value" id="correct-count">0</div>
          <div class="stat-label">Correct</div>
        </div>
        <div class="stat">
          <div class="stat-value" id="total-count">0</div>
          <div class="stat-label">Total</div>
        </div>
        <div class="stat">
          <div class="stat-value" id="accuracy">0%</div>
          <div class="stat-label">Accuracy</div>
        </div>
        <button class="reset-btn" id="reset-btn">🔄 Reset Stats</button>
      </section>
    </div>
  `;

  // Dynamically import and initialize CurrencyPractice
  const { default: CurrencyPractice } = await import('../CurrencyPractice.js');
  
  // Initialize the currency practice app
  const app = new CurrencyPractice();
  await app.init();
  
  console.log('Currency section loaded');
  
  // Store instance for cleanup if needed
  return app;
}