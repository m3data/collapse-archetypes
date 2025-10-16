# Collapse Archetype Quiz

An interactive web application that helps users discover their collapse archetype through a series of thought-provoking questions about their worldview, values, and responses to uncertainty.

## Overview

The Collapse Archetype Quiz explores 19 distinct archetypes that represent different patterns of awareness, agency, and response to societal collapse. From the Ostrich who prefers denial to the Apocaloptimist who sees opportunity in chaos, each archetype reveals deep insights about how we relate to uncertainty and change.

## Features

- **19 Unique Archetypes**: Comprehensive coverage of collapse response patterns
- **12 Thoughtful Questions**: Carefully designed to reveal your dominant archetype
- **Beautiful UI**: Clean, accessible design with smooth transitions
- **Fully Accessible**: WCAG 2.1 AA compliant with keyboard navigation support
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Share Results**: Easy sharing via Web Share API or clipboard

## Project Structure

```
collapse-archetypes/
├── index.html                 # Main HTML file
├── src/
│   ├── css/
│   │   └── styles.css        # All application styles
│   ├── js/
│   │   ├── app.js            # Main application logic
│   │   ├── state.js          # State management module (modular architecture)
│   │   ├── quiz-logic.js     # Quiz logic module (modular architecture)
│   │   └── ui-controller.js  # UI controller module (modular architecture)
│   └── data/
│       └── quiz-data.json    # Quiz questions and archetype data
├── assets/
│   └── images/               # Archetype images (placeholder)
├── spec.md                   # Complete feature specification
└── README.md                 # This file
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local web server (required for loading JSON data)

### Option 1: Using Python's Built-in Server (Recommended)

If you have Python installed:

```bash
# Navigate to the project directory
cd /path/to/collapse-archetypes

# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open your browser and navigate to: `http://localhost:8000`

### Option 2: Using Node.js http-server

If you have Node.js installed:

```bash
# Install http-server globally (one time only)
npm install -g http-server

# Navigate to the project directory
cd /path/to/collapse-archetypes

# Start the server
http-server -p 8000
```

Then open your browser and navigate to: `http://localhost:8000`

### Option 3: Using VS Code Live Server Extension

1. Install the "Live Server" extension in VS Code
2. Open the project folder in VS Code
3. Right-click on `index.html`
4. Select "Open with Live Server"

### Option 4: Using PHP's Built-in Server

If you have PHP installed:

```bash
# Navigate to the project directory
cd /path/to/collapse-archetypes

# Start the server
php -S localhost:8000
```

Then open your browser and navigate to: `http://localhost:8000`

## Usage

1. **Start the Quiz**: Click "Begin the Journey" on the welcome screen
2. **Answer Questions**: Select your response to each question (you can use keyboard shortcuts 1-4 or arrow keys for navigation)
3. **View Your Result**: After answering all 12 questions, your dominant archetype will be revealed
4. **Share or Retake**: Share your result with others or take the quiz again

## Keyboard Navigation

The quiz is fully accessible via keyboard:

- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons
- **Arrow Keys**: Navigate between answer options during the quiz
- **1-4 Keys**: Quick select answers (when available)

## Architecture

The application follows a modular architecture with clear separation of concerns:

### Core Modules

1. **state.js** - State Management
   - Manages application state (quiz data, responses, scores)
   - Provides read-only getters for state access
   - Encapsulates state mutations

2. **quiz-logic.js** - Business Logic
   - Loads and validates quiz data
   - Processes user answers
   - Calculates dominant archetype
   - Manages quiz flow

3. **ui-controller.js** - Presentation Layer
   - Handles all DOM manipulation
   - Manages screen transitions
   - Provides user feedback
   - Implements accessibility features

4. **app.js** - Application Coordinator
   - Initializes all modules
   - Orchestrates application startup
   - Handles top-level error management

### Data Structure

Quiz data is stored in JSON format with the following structure:

```json
{
  "archetypes": [
    {
      "id": "archetype-id",
      "name": "Archetype Name",
      "description": "Description text",
      "memeCaption": "Meme caption",
      "traits": {
        "awareness": "high|medium|low",
        "affect": "positive|neutral|negative",
        "agency": "high|medium|low",
        "temporality": "past|present|future",
        "relationality": "individual|group",
        "posture": "active|passive"
      },
      "image": "path/to/image.jpg"
    }
  ],
  "questions": [
    {
      "id": "q1",
      "text": "Question text",
      "answers": [
        {
          "id": "q1a1",
          "text": "Answer text",
          "archetypeScores": {
            "archetype-id": 3
          }
        }
      ]
    }
  ]
}
```

## The 19 Archetypes

1. **Ostrich** - Avoids collapse realities, prefers denial
2. **Blissed-Out Yogi** - Embraces peace and mindfulness amid chaos
3. **Illusionist** - Spins narratives to mask collapse realities
4. **Normalizer** - Maintains status quo, downplays risks
5. **Prepper** - Prepares extensively for collapse scenarios
6. **Prophet of Doom** - Predicts inevitable collapse with urgency
7. **Alt-Right Collapse Bro** - Combines collapse talk with far-right views
8. **Evangelical Nationalist** - Sees collapse as divine judgment and revival
9. **Apocaloptimist** - Optimistic about post-collapse opportunities
10. **Trickster** - Uses humor and chaos to navigate collapse
11. **Woke Lefty Socialist** - Advocates systemic change amidst collapse
12. **Salvager** - Repurposes and reclaims in collapse aftermath
13. **Sacred Keeper** - Protects traditions and sacred knowledge
14. **Everyday Hustler** - Navigates collapse through daily grit and grind
15. **Already Collapsed** - Lives in conditions of ongoing collapse
16. **Extracted** - Removed from collapse zones, insulated
17. **Child Witness** - Observes collapse with innocence and confusion
18. **Opportunist Elite** - Exploits collapse for personal gain
19. **Conspiracy Theorist** - Sees collapse as part of hidden agendas

## Development

### Adding New Questions

Edit `src/data/quiz-data.json` and add new question objects to the `questions` array:

```json
{
  "id": "q13",
  "text": "Your question text here?",
  "answers": [
    {
      "id": "q13a1",
      "text": "Answer option 1",
      "archetypeScores": {
        "archetype-id-1": 3,
        "archetype-id-2": 2
      }
    }
  ]
}
```

### Adding New Archetypes

Edit `src/data/quiz-data.json` and add new archetype objects to the `archetypes` array. Make sure to reference the archetype ID in question answer scores.

### Customizing Styles

All styles are centralized in `src/css/styles.css`. The stylesheet uses CSS custom properties (variables) for easy theming:

```css
:root {
  --color-earth-dark: #2c241a;
  --color-accent: #c67b5c;
  /* ... more variables */
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

This application is built with accessibility as a core principle:

- ✅ Semantic HTML structure
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Sufficient color contrast (WCAG AA)
- ✅ Focus indicators for interactive elements
- ✅ Reduced motion support
- ✅ High contrast mode support

## Future Enhancements

The current implementation provides a solid foundation. Potential enhancements include:

- [ ] Actual archetype images (currently using placeholders)
- [ ] Detailed score breakdown visualization with charts
- [ ] Animation enhancements for screen transitions
- [ ] Result comparison feature
- [ ] Social media integration for sharing
- [ ] Localization/internationalization
- [ ] Result persistence (localStorage)
- [ ] Quiz analytics

## Contributing

This is a demonstration project. For production use, consider:

1. Adding unit tests for quiz logic
2. Implementing end-to-end tests
3. Adding build tools for optimization
4. Implementing proper error boundaries
5. Adding analytics tracking

## License

This project is created for educational and demonstration purposes.

## Credits

- Design Philosophy: Earthy, archetypal symbolism through geometric forms
- Font Families: Crimson Pro (serif), Inter (sans-serif) from Google Fonts
- Architecture: Modular ES6 with separation of concerns

## Support

For issues or questions, please refer to the `spec.md` file for detailed feature specifications.

---

**Note**: This application requires a web server to run due to CORS restrictions on loading local JSON files. Do not simply open `index.html` directly in a browser - use one of the server options above.
