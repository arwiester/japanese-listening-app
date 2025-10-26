# Japanese Number Listening Practice

A web-based app for practicing Japanese number listening comprehension using Google Cloud Neural2 text-to-speech voices.

**🎯 [Try it now!](https://arwiester.github.io/japanese-listening-app/japanese-numbers.html)**

## Features

- 🎧 High-quality Neural2 Japanese TTS (8 voice variations)
- 📊 Four difficulty levels: 0-10, 0-100, 0-1000, 0-10000
- 📱 Mobile-optimized with numeric keypad
- ✅ Auto-grading with encouraging feedback
- 💾 Persistent statistics tracking
- 🔊 Audio caching for faster playback
- 🔀 Random number generation
- 🔒 Secure API key handling via Cloudflare Workers

## How to Use

1. **[Open the app](https://arwiester.github.io/japanese-listening-app/japanese-numbers.html)**
2. Select your difficulty level (0-10, 0-100, 0-1000, or 0-10000)
3. Click the play button to hear a random Japanese number
4. Type the number you heard
5. Get instant feedback and move to the next number!

Works on desktop and mobile devices. No installation required!

## For Developers

### Architecture

The app uses a serverless architecture for security:

```
Browser → Cloudflare Worker (proxy) → Google Cloud TTS API
```

The Google Cloud API key is stored securely as an encrypted environment variable in Cloudflare Workers, never exposed to users.

### Local Development

If you want to run this locally:

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

### Tech Stack

- Vanilla JavaScript (no dependencies)
- Google Cloud Text-to-Speech API (Neural2 voices)
- Cloudflare Workers (secure API proxy)
- Responsive CSS with mobile-first design
- LocalStorage for statistics persistence

### Cost

- **Google Cloud TTS Neural2**: 1M free characters/month, then $16/1M
- **Cloudflare Workers**: 100,000 free requests/day
- **For personal use**: ~$0/month (well within free tiers)

## Deployment

This app is deployed via GitHub Pages and uses Cloudflare Workers for secure API proxying.

The Cloudflare Worker code is in `cloudflare-worker.js`.

## Future Enhancements

- [ ] Keyboard shortcuts (Space to replay, N for next)
- [ ] Dark mode toggle
- [ ] Visual progress indicators
- [ ] N5-N3 vocabulary practice
- [ ] Themed word categories (colors, food, etc.)
- [ ] Speech recognition for pronunciation practice
- [ ] Spaced repetition algorithm

## License

This project is for educational purposes. Feel free to fork and adapt for your own language learning projects!

---

Built with ❤️ for Japanese language learners
 
