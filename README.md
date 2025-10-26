# Japanese Listening Practice App

A modern web app for practicing Japanese listening comprehension with numbers and currency using high-quality Google Cloud Neural2 text-to-speech.

**🎯 [Try it now!](https://arwiester.github.io/japanese-listening-app/)**

## Features

### 🎧 Numbers Practice
- Four difficulty levels: 0-10, 0-100, 0-1,000, 0-10,000
- High-quality Neural2 Japanese TTS voices (8 voice variations)
- Auto-grading with instant feedback
- Real-time statistics tracking

### 💴 Currency Practice
- Four realistic yen ranges:
  - ¥1 - ¥999 (convenience store purchases)
  - ¥1,000 - ¥10,000 (restaurant meals)
  - ¥10,000 - ¥100,000 (electronics, clothing)
  - ¥100,000 - ¥1,000,000 (major purchases)
- Handles ¥ symbols and comma formatting

### 🎨 Modern Design
- Mobile-first responsive design
- Light/dark mode toggle support
- Clean, distraction-free interface
- Built with Pico.css for modern aesthetics
- Calming educational color scheme (research-backed)

### 🔐 Secure & Fast
- Cloudflare Workers proxy for API security
- Audio caching for faster playback
- Persistent statistics with localStorage
- Built with ES6 modules, Pico.css, and Vitest

### 🐛 User Feedback
- In-app bug reporting (powered by Formspree)
- Ko-fi support for continued development
- Privacy-first feedback system

## How to Use

1. **[Open the app](https://arwiester.github.io/japanese-listening-app/)**
2. Choose a section: Numbers or Currency
3. Select your difficulty level
4. Click a range button to hear audio
5. Type what you hear
6. Get instant feedback and continue!

Works perfectly on desktop and mobile devices. No installation required!

## For Developers

### Architecture

**Tech Stack:**
- **Frontend:** Vanilla JavaScript ES6 modules, Pico.css
- **Routing:** Hash-based SPA router
- **Testing:** Vitest (121 tests, 80%+ coverage)
- **TTS:** Google Cloud Neural2 Japanese voices (8 variations)
- **Security:** Cloudflare Workers API proxy
- **Feedback:** Formspree (bug reports), Ko-fi (donations)

**Project Structure:**
```
japanese-listening-app/
├── index.html                 # SPA entry point
├── js/
│   ├── BasePractice.js        # Shared base class
│   ├── NumberPractice.js      # Numbers section logic
│   ├── CurrencyPractice.js    # Currency section logic
│   ├── audioService.js        # TTS integration
│   ├── statsService.js        # Statistics management
│   ├── router.js              # SPA routing
│   ├── config.js              # App configuration
│   ├── utils.js               # Shared utilities
│   └── sections/              # Section loaders
├── css/
│   ├── variables-pico.css     # Design tokens
│   ├── components-pico.css    # Custom components
│   └── navigation-pico.css    # SPA navigation
└── tests/                     # Vitest unit tests
```

### Local Development

**Install dependencies:**
```bash
npm install
```

**Run tests:**
```bash
npm test          # Run once
npm run test:ui   # Interactive UI
```

**Local server:**
```bash
# Python
python3 -m http.server 8000

# Node.js
npx http-server
```

### Testing

The app has comprehensive test coverage (121 tests):
- NumberPractice: 34 tests
- CurrencyPractice: 39 tests
- Router: 18 tests
- Utils: 16 tests
- StatsService: 14 tests

Run `npm test` to verify all functionality.

### Deployment

**GitHub Pages:**
- Automatic deployment on push to main
- Served from root directory
- URL: `https://arwiester.github.io/japanese-listening-app/`

**Cloudflare Worker:**
- Proxy for Google Cloud TTS API
- Encrypted API key in environment variables
- Code in `cloudflare-worker.js`

### Cost

- **Google Cloud TTS Neural2:** 1M free characters/month, then $16/1M
- **Cloudflare Workers:** 100,000 free requests/day
- **GitHub Pages:** Free for public repos
- **Formspree:** 50 submissions/month free
- **Ko-fi:** 0% fees on one-time tips
- **For personal use:** $0/month (within free tiers)

## Roadmap

### ✅ Completed
- ✅ Numbers practice (0-10,000)
- ✅ Dark mode toggle
- ✅ Currency practice (¥1-¥1,000,000)
- ✅ SPA architecture
- ✅ Comprehensive unit tests
- ✅ Mobile-first responsive design
- ✅ In-app bug reporting
- ✅ Ko-fi donation support
- ✅ Refactored to use shared base class

### 🚧 In Progress
- [ ] Vocabulary practice section

### 🔮 Future Ideas
- [ ] N5-N3 vocabulary word lists
- [ ] Themed categories (colors, food, animals)
- [ ] Visual progress indicators
- [ ] Speech recognition for pronunciation practice
- [ ] Spaced repetition algorithm
- [ ] Export/import statistics

## Support Development

Love the app? [Buy me a coffee on Ko-fi](https://ko-fi.com/J3J2R8EOV) to support continued development and new features!

## Contributing

This is a personal learning project, but suggestions and feedback are welcome! Feel free to:
- Report bugs using the in-app bug reporter
- Open issues for feature requests on GitHub
- Fork and adapt for your own language learning
- Share with other Japanese learners

## License

Educational use. Free to fork and adapt for language learning projects!

---

こんにちは！Built with ❤️ for Japanese language learners. がんばってください！ありがとうございます！