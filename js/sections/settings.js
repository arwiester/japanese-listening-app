/**
 * Settings Section Loader
 * App settings and preferences
 */

async function loadSettingsSection(container) {
  container.innerHTML = `
    <div class="container">
      <header style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 1.6em; color: var(--text-primary); margin-bottom: 5px;">せってい</div>
        <h1 style="margin: 0;">⚙️ Settings</h1>
      </header>

      <div style="max-width: 600px; margin: 0 auto;">
        
        <!-- Bug Report Section -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: var(--text-primary); margin-bottom: 15px;">🐛 Report a Bug</h3>
          <div style="background: var(--bg-surface); border: 2px solid var(--border-primary); border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <p style="color: var(--text-primary); margin-bottom: 20px; font-size: 0.95em; line-height: 1.5;">
              Found something broken? Help me fix it! Your feedback makes this app better for everyone.
            </p>
            
            <form id="bug-report-form" style="display: flex; flex-direction: column; gap: 16px;">
              <textarea 
                name="message"
                placeholder="Describe what happened... (e.g., 'Audio doesn't play when I click 0-100 range')"
                required
                rows="5"
                style="width: 100%; padding: 14px; border-radius: 8px; border: 3px solid #3498db; background: white; color: #2c3e50; font-family: inherit; font-size: 1em; resize: vertical; line-height: 1.5; outline: none; transition: border-color 0.2s;"
                onfocus="this.style.borderColor='#2980b9'"
                onblur="this.style.borderColor='#3498db'"
              ></textarea>
              
              <input 
                type="email" 
                name="email"
                placeholder="Your email (optional - for follow-up)"
                style="width: 100%; padding: 14px; border-radius: 8px; border: 3px solid #3498db; background: white; color: #2c3e50; font-family: inherit; font-size: 1em; outline: none; transition: border-color 0.2s;"
                onfocus="this.style.borderColor='#2980b9'"
                onblur="this.style.borderColor='#3498db'"
              >
              
              <p style="color: var(--text-secondary); font-size: 0.85em; margin: -8px 0 0 0; line-height: 1.4;">
                🔒 Your email is only used to follow up on your bug report. No spam, no selling, no marketing—ever.
              </p>
              
              <!-- Hidden fields for context -->
              <input type="hidden" name="_subject" value="Japanese App - Bug Report">
              <input type="hidden" name="browser" id="browser-info">
              <input type="hidden" name="url" id="current-url">
              
              <button 
                type="submit"
                style="width: 100%; padding: 16px; background: #3498db; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 1.1em; transition: all 0.2s; box-shadow: 0 4px 6px rgba(52, 152, 219, 0.4); text-transform: uppercase; letter-spacing: 0.5px;"
                onmouseover="this.style.background='#2980b9'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px rgba(52, 152, 219, 0.5)'"
                onmouseout="this.style.background='#3498db'; this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(52, 152, 219, 0.4)'"
              >
                📤 Send Bug Report
              </button>
              
              <div id="form-feedback" style="text-align: center; font-size: 0.95em; font-weight: 600; padding: 14px; border-radius: 8px; display: none;"></div>
            </form>
          </div>
        </div>

        <!-- Stats Settings -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: var(--text-primary); margin-bottom: 15px;">📊 Statistics</h3>
          <div style="background: var(--bg-surface); border: 2px solid var(--border-primary); border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <p style="color: var(--text-primary); margin-bottom: 18px; font-size: 0.95em; font-weight: 500;">
              Reset your practice statistics and start fresh.
            </p>
            <button style="width: 100%; padding: 16px; background: #e74c3c; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 1.1em; transition: all 0.2s; box-shadow: 0 4px 6px rgba(231, 76, 60, 0.4); text-transform: uppercase; letter-spacing: 0.5px;"
                    onmouseover="this.style.background='#c0392b'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px rgba(231, 76, 60, 0.5)'"
                    onmouseout="this.style.background='#e74c3c'; this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(231, 76, 60, 0.4)'">
              🔄 Reset All Statistics
            </button>
          </div>
        </div>

        <!-- About -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: var(--text-primary); margin-bottom: 15px;">ℹ️ About</h3>
          <div style="background: var(--bg-surface); border: 2px solid var(--border-primary); border-radius: 8px; padding: 24px; color: var(--text-primary); font-size: 0.95em; line-height: 1.8; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <p style="margin: 0 0 12px 0; font-weight: 600; font-size: 1.05em;">Japanese Practice App</p>
            <p style="margin: 0 0 12px 0; color: var(--text-secondary);">Version: 1.0.0</p>
            <p style="margin: 0 0 12px 0; color: var(--text-secondary);">Audio powered by Google Cloud Text-to-Speech with 8 natural voice variations</p>
            <p style="margin: 0; color: var(--text-secondary);">Built with ❤️ for Japanese learners</p>
          </div>
        </div>

        <!-- Support Section (LAST - after About) -->
        <div style="margin-bottom: 80px;">
          <h3 style="color: var(--text-primary); margin-bottom: 15px;">☕ Support Development</h3>
          <div style="background: var(--bg-surface); border: 2px solid var(--border-primary); border-radius: 8px; padding: 24px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <p style="color: var(--text-primary); margin-bottom: 18px; font-size: 0.95em; line-height: 1.5;">
              Love the app? Support continued development and help keep it free for everyone!
            </p>
            
            <!-- Ko-fi Button using CDN badge -->
            <a 
              href="https://ko-fi.com/J3J2R8EOV" 
              target="_blank" 
              id="kofi-button"
              style="display: inline-block; transition: all 0.2s ease; text-decoration: none;"
            >
              <img 
                src="https://storage.ko-fi.com/cdn/kofi3.png?v=3" 
                alt="Support this project at ko-fi.com" 
                id="kofi-image"
                style="height: 36px; border: 0; transition: transform 0.2s ease;"
              >
            </a>
            
            <p style="color: var(--text-secondary); margin: 16px 0 0 0; font-size: 0.85em; line-height: 1.4;">
              100% of tips go to development • No fees • Completely optional
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Handle bug report form submission
  const form = document.getElementById('bug-report-form');
  const feedback = document.getElementById('form-feedback');
  
  // Set browser context automatically
  document.getElementById('browser-info').value = navigator.userAgent;
  document.getElementById('current-url').value = window.location.href;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Disable button and show loading
    submitButton.disabled = true;
    submitButton.style.opacity = '0.6';
    submitButton.style.cursor = 'not-allowed';
    submitButton.textContent = '⏳ Sending...';
    feedback.style.display = 'none';
    
    try {
      const response = await fetch('https://formspree.io/f/xqagazve', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        // Success!
        feedback.style.display = 'block';
        feedback.style.background = '#d4edda';
        feedback.style.color = '#155724';
        feedback.style.border = '3px solid #28a745';
        feedback.textContent = '✅ Thank you! Bug report sent successfully.';
        form.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          feedback.style.display = 'none';
        }, 5000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      // Error handling
      feedback.style.display = 'block';
      feedback.style.background = '#f8d7da';
      feedback.style.color = '#721c24';
      feedback.style.border = '3px solid #dc3545';
      feedback.textContent = '❌ Oops! Something went wrong. Please try again.';
      console.error('Bug report error:', error);
    } finally {
      // Re-enable button
      submitButton.disabled = false;
      submitButton.style.opacity = '1';
      submitButton.style.cursor = 'pointer';
      submitButton.textContent = '📤 Send Bug Report';
    }
  });
  
  // Add Ko-fi button hover animation
  const kofiButton = document.getElementById('kofi-button');
  const kofiImage = document.getElementById('kofi-image');
  
  kofiButton.addEventListener('mouseenter', () => {
    kofiImage.style.transform = 'scale(1.1) translateY(-2px)';
  });
  
  kofiButton.addEventListener('mouseleave', () => {
    kofiImage.style.transform = 'scale(1) translateY(0)';
  });
  
  console.log('Settings section loaded');
}