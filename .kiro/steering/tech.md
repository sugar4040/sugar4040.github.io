# Technology Stack

## Core Technologies

- HTML5 with semantic elements and ARIA labels
- CSS3 with custom properties (CSS variables)
- JavaScript ES6+ modules (type="module")
- JSON for configuration files
- Local Storage API for state persistence

## Dependencies

Zero runtime dependencies - pure vanilla JavaScript, HTML, and CSS.

## Development Dependencies

- vitest (^1.0.0) - Testing framework
- jsdom (^23.0.0) - DOM environment for tests

## Build System

No build step required. The application runs directly in the browser using native ES6 modules.

## Common Commands

```bash
# Run tests once (for CI/CD)
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 8+)

## Testing Configuration

- Test environment: jsdom (simulates browser DOM)
- Test globals enabled (describe, it, expect available without imports)
- Test files: `*.test.js` pattern in `js/` directory
