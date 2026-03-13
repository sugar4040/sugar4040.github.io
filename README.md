# 回遊 (Kaiyuu) Mystery-Solving Event System

An HTML-based mystery-solving event system designed to support interactive puzzle events.

## Project Structure

```
kaiyuu-mystery-event-system/
├── index.html              # Main HTML file with semantic structure
├── css/
│   ├── styles.css         # Main stylesheet with CSS custom properties
│   └── responsive.css     # Responsive design rules (mobile-first)
├── js/
│   ├── app.js            # Application entry point (ES6 module)
│   ├── config-loader.js  # Configuration loading and validation
│   ├── state-manager.js  # State management and puzzle progression
│   ├── storage-manager.js # Local storage persistence
│   ├── ui-controller.js  # UI rendering and event handling
│   └── answer-validator.js # Answer validation logic
├── config/
│   └── (event configuration JSON files)
├── assets/
│   ├── images/           # Puzzle images
│   └── media/            # Audio, video, and other media files
└── README.md             # This file
```

## Features

- **Configuration-driven**: All puzzle content defined in external JSON files
- **Offline-capable**: Client-side operation with local storage persistence
- **Accessible**: WCAG-compliant with semantic HTML5 and ARIA labels
- **Responsive**: Mobile-first design supporting 320px to desktop widths
- **Japanese language support**: UTF-8 encoding with Japanese fonts
- **No dependencies**: Vanilla JavaScript (ES6+), HTML5, and CSS3

## Technology Stack

- HTML5 with semantic elements
- CSS3 with custom properties
- JavaScript ES6+ modules
- JSON for configuration
- Local Storage API for persistence

## Getting Started

1. Place your event configuration JSON file in the `config/` directory
2. Add any puzzle images to `assets/images/`
3. Open `index.html` in a modern web browser
4. The application will load the configuration and initialize the event

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 8+)

## Development Status

This project is currently in development. Core structure and placeholder files have been created.

## License

TBD
