# Japanese Number Listening Practice

A web-based app for practicing Japanese number listening comprehension using Google Cloud Neural2 text-to-speech voices.

## Features

- 🎧 High-quality Neural2 Japanese TTS (3 voices)
- 📊 Four difficulty levels: 0-10, 0-100, 0-1000, 0-10000
- 📱 Mobile-optimized with numeric keypad
- ✅ Auto-grading when answer is complete
- 💾 Persistent statistics tracking
- 🔊 Audio caching for faster playback
- 🔀 Random number generation

## Setup

### Prerequisites

- Google Cloud account with Text-to-Speech API enabled
- API key with Cloud Text-to-Speech API access

### Local Development

**Option 1: Python Server**
```bash
python3 serve.py
# Open http://localhost:8000/japanese-numbers.html
```

**Option 2: Node.js Server**
```bash
npx http-server
# Open http://localhost:8080/japanese-numbers.html
```

### GitHub Pages Deployment

1. Go to repository Settings → Pages
2. Source: Deploy from branch `main`
3. Folder: `/` (root)
4. Save
5. Access at: `https://yourusername.github.io/japanese-listening-app/japanese-numbers.html`

## Configuration

Replace the API key in `japanese-numbers.html`:
```javascript
const GOOGLE_TTS_API_KEY = 'YOUR_API_KEY_HERE';
```

**⚠️ Security Note:** For public deployment, use a serverless proxy to hide your API key.

## Usage

1. Select difficulty level (0-10, 0-100, etc.)
2. Click play button to hear a random number
3. Type the number you heard
4. Answer auto-submits when complete
5. Click "Next Random Number" for continuous practice

## Tech Stack

- Vanilla JavaScript (no dependencies)
- Google Cloud Text-to-Speech API (Neural2 voices)
- Responsive CSS with mobile-first design
- LocalStorage for statistics persistence

## Cost

- Google Cloud TTS Neural2: 1M free characters/month, then $16/1M
- For personal use: ~$0/month (well within free tier)

## Future Enhancements

- [ ] N5-N3 vocabulary practice
- [ ] Themed word categories (colors, food, etc.)
- [ ] Speech recognition for pronunciation practice
- [ ] Spaced repetition algorithm
- [ ] Progress tracking over time

## License

Private - Personal Use Only
