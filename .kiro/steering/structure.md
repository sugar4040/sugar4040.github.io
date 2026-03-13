# Project Structure

## Directory Organization

```
kaiyuu-mystery-event-system/
├── index.html              # Main HTML entry point
├── css/
│   ├── styles.css         # Main stylesheet with CSS custom properties
│   └── responsive.css     # Mobile-first responsive design rules
├── js/
│   ├── app.js            # Application entry point (ES6 module)
│   ├── config-loader.js  # Configuration loading and validation
│   ├── state-manager.js  # State management and puzzle progression
│   ├── storage-manager.js # Local storage persistence
│   ├── ui-controller.js  # UI rendering and event handling
│   ├── answer-validator.js # Answer validation logic
│   └── *.test.js         # Test files (co-located with source)
├── config/               # Event configuration JSON files
├── assets/
│   ├── images/          # Puzzle images
│   └── media/           # Audio, video, and other media files
└── .kiro/
    ├── specs/           # Feature specifications
    └── steering/        # AI assistant guidance documents
```

## Module Architecture

The application follows a modular ES6 architecture with clear separation of concerns:

- `app.js` - Entry point that initializes and coordinates all modules
- `config-loader.js` - Handles loading and validating JSON configuration files
- `state-manager.js` - Manages puzzle progression and game state
- `storage-manager.js` - Handles local storage persistence with error handling
- `ui-controller.js` - Manages DOM manipulation and user interactions
- `answer-validator.js` - Validates user answers against puzzle solutions

## File Naming Conventions

- JavaScript modules: kebab-case (e.g., `config-loader.js`)
- Test files: `<module-name>.test.js` (e.g., `config-loader.test.js`)
- CSS files: kebab-case (e.g., `responsive.css`)
- Configuration files: JSON format in `config/` directory

## Code Organization Principles

- ES6 modules with explicit imports/exports
- Class-based architecture for modules
- Test files co-located with source files
- No build step - direct browser execution
- Semantic HTML5 with ARIA labels for accessibility
- CSS custom properties for theming and consistency
