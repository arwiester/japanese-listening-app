/**
 * Numbers Section Loader
 * Loads the numbers practice interface into the SPA
 */

async function loadNumbersSection(container) {
  // Create HTML structure
  container.innerHTML = `
    <div class="container">
      <header style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 1.6em; color: var(--text-primary); margin-bottom: 5px;">すうじ</div>
        <h1 style="margin: 0;">🎧 Numbers</h1>
      </header>

      <!-- Difficulty Selection -->
      <section class="range-selector">
        <button class="range-btn active" data-range="10">▶ 0 — 10</button>
        <button class="range-btn" data-range="100">▶ 0 — 100</button>
        <button class="range-btn" data-range="1000">▶ 0 — 1,000</button>
        <button class="range-btn" data-range="10000">▶ 0 — 10,000</button>
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
          placeholder="Type the number you hear"
          autocomplete="off"
          maxlength="2"
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

  // Dynamically import and initialize NumberPractice
  const { default: NumberPractice } = await import('../NumberPractice.js');
  
  // Initialize the numbers practice app
  const app = new NumberPractice();
  await app.init();
  
  console.log('Numbers section loaded');
  
  // Store instance for cleanup if needed
  return app;
}