# Collapse Archetype Quiz

An interactive, privacy-first web application that helps users discover their collapse archetype and dimensional psychological profile through a theory-grounded assessment of their worldview, values, and responses to uncertainty.

## Overview

The Collapse Archetype Quiz explores **19 distinct archetypes** that represent different patterns of awareness, agency, and response to societal collapse. Beyond simple categorization, the quiz provides a **5-dimensional psychological analysis** grounded in Terror Management Theory, Cognitive Dissonance Theory, Social Identity Theory, and other established frameworks.

From the Ostrich who filters catastrophic information to the Apocaloptimist who finds opportunity in chaos, each archetype reveals deep insights about how we relate to uncertainty and change.

## Features

### Core Functionality
- **19 Unique Archetypes**: Comprehensive coverage of collapse response patterns
- **20 Theory-Grounded Questions**: Questions derived from psychological and sociological research
- **5-Dimensional Analysis**: Affective, Cognitive, Relational, Temporal, and Behavioral dimensions
- **Intelligent Scoring**: Sophisticated tie-breaking using cosine similarity in trait space (124 passing tests)
- **Human-Centered Interpretations**: 25 unique, emotionally resonant explanations for dimensional scores

### User Experience
- **Beautiful UI**: Earthy, grounded design with smooth transitions
- **Interactive Radar Chart**: SVG-based visualization of your dimensional profile
- **Accessible**: WCAG 2.1 AA compliant with full keyboard navigation support
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Share Results**: Easy sharing via Web Share API or clipboard

### Privacy & Ethics
- **Zero Tracking**: No analytics, no cookies, no external requests
- **Self-Hosted Assets**: All fonts and icons served locally (no CDN tracking)
- **Local Processing**: All calculations happen in your browser
- **No Data Storage**: Results aren't saved anywhere (unless you screenshot them)
- **Open Source**: View the source code directly in your browser

## Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local web server (required for ES6 modules)

### Running the Quiz

**Using Python (Recommended):**

```bash
cd /path/to/collapse-archetypes
python3 -m http.server 8000
```

Then open: **http://localhost:8000**

**Other Options:**
- **Node.js**: `npx http-server -p 8000`
- **PHP**: `php -S localhost:8000`
- **VS Code**: Install "Live Server" extension, right-click `index.html` → "Open with Live Server"

## Project Structure

```
collapse-archetypes/
├── index.html                                    # Main entry point
├── privacy.html                                  # Privacy notice page
├── src/
│   ├── css/
│   │   └── styles.css                           # All application styles
│   ├── js/
│   │   ├── app.js                               # Main application (active implementation)
│   │   ├── scoring-engine.js                    # Sophisticated scoring algorithms
│   │   ├── state.js                             # State management module (legacy)
│   │   ├── quiz-logic.js                        # Quiz logic module (legacy)
│   │   └── ui-controller.js                     # UI controller module (legacy)
│   ├── data/
│   │   └── quiz-data.json                       # 20 questions, 19 archetypes, dimensional metadata
│   ├── fonts/
│   │   ├── crimson-pro-*.woff2                  # Self-hosted serif font
│   │   └── inter-*.woff2                        # Self-hosted sans-serif font
│   └── phosphor-icons/
│       ├── phosphor-icons.css                   # Self-hosted icon library
│       └── Phosphor.woff2                       # Icon font file
├── assets/
│   └── images/                                   # Archetype images (placeholder)
├── spec.md                                       # Original feature specification
├── basic-theory.md                               # Theoretical framework documentation
├── SCORING-ENGINE-ASSESSMENT.md                 # Scoring engine integration analysis
├── DIMENSION-INTERPRETATIONS.md                 # Design philosophy for dimensional text
├── DIMENSION-INTERPRETATIONS-REFERENCE.md       # Quick reference for all 25 interpretations
├── INTERPRETATION-EXAMPLES.md                   # Example user profiles
├── scoring-engine.js                             # Root scoring engine (CommonJS for tests)
├── scoring-engine.test.js                       # 124 comprehensive tests
└── README.md                                     # This file
```

## How It Works

### 1. **Take the Quiz**
Answer 20 carefully designed questions about your awareness, emotional responses, social orientation, time perspective, and coping strategies.

### 2. **Sophisticated Scoring**
The scoring engine:
- Calculates weighted scores for all 19 archetypes
- Resolves ties using cosine similarity in 6-dimensional trait space
- Computes confidence metrics (STRONG/MODERATE/WEAK)
- Tracks your scores across 5 theoretical dimensions

### 3. **Receive Your Profile**
Get your results including:
- **Primary Archetype**: Your dominant pattern with confidence score
- **Dimensional Analysis**: Radar chart visualization of 5 dimensions
- **Human-Centered Interpretations**: Warm, relatable explanations of what your scores mean
- **Theoretical Context**: Understanding of the psychological frameworks behind the analysis

## The 5 Dimensions

Each dimension is grounded in established psychological and sociological theory:

### 1. **Affective Dimension**
**Emotional tone and affective responses** - from anxiety and despair to hope and equanimity
- *Theory*: Terror Management Theory, Emotional Regulation, Positive Psychology
- *Interpretation*: How you emotionally process collapse awareness

### 2. **Cognitive Dimension**
**Level of awareness and acknowledgment** - from denial and minimization to full recognition
- *Theory*: Cognitive Dissonance, System Justification Theory
- *Interpretation*: How clearly you see and acknowledge collapse dynamics

### 3. **Relational Dimension**
**Social context and identity** - individual autonomy versus collective belonging
- *Theory*: Social Identity Theory, Cultural Theory of Risk
- *Interpretation*: Whether you orient as an individual or within group identity

### 4. **Temporal Dimension**
**Relationship to time** - past traditions, present moment, or future possibilities
- *Theory*: Holling's Adaptive Cycle, Panarchy
- *Interpretation*: Which timeframe most shapes your responses

### 5. **Behavioral Dimension**
**Agency and coping strategies** - from passive acceptance to active preparation
- *Theory*: Self-Efficacy Theory, Behavioral Adaptation
- *Interpretation*: Your sense of capacity to act and preferred coping style

## The 19 Archetypes

1. **Ostrich** - Filters catastrophic information, focuses on immediate world
2. **Blissed-Out Yogi** - High awareness, positive affect, peaceful acceptance
3. **Illusionist** - Spins narratives to mask collapse realities
4. **Normalizer** - Maintains status quo, downplays systemic risks
5. **Prepper** - High awareness and agency, active future-oriented preparation
6. **Prophet of Doom** - High awareness, negative affect, urgency without agency
7. **Alt-Right Collapse Bro** - Combines collapse awareness with far-right ideology
8. **Evangelical Nationalist** - Sees collapse as divine judgment and spiritual opportunity
9. **Apocaloptimist** - High awareness and agency with positive future orientation
10. **Trickster** - Uses humor and chaos to navigate uncertainty
11. **Woke Lefty Socialist** - Advocates systemic change, collective action orientation
12. **Salvager** - Active agency in reclaiming and repurposing
13. **Sacred Keeper** - Protects past wisdom and sacred knowledge
14. **Everyday Hustler** - Navigates collapse through daily grit and pragmatism
15. **Already Collapsed** - Lives in conditions of ongoing collapse
16. **Extracted** - Insulated from immediate collapse impacts
17. **Child Witness** - Observes with limited agency and understanding
18. **Opportunist Elite** - High awareness and agency used for personal gain
19. **Conspiracy Theorist** - Sees collapse as part of hidden agendas

## Technical Architecture

### Current Implementation
The quiz uses a **monolithic app.js** with integrated scoring-engine module:

- **app.js** (27KB): Main application logic, UI, state management, dimensional analysis
- **scoring-engine.js** (27KB): Sophisticated archetype determination with tie-breaking
- **quiz-data.json** (structured data): Questions, archetypes, dimensional metadata

### Scoring Algorithm

The scoring engine implements:

1. **Weighted Scoring**: `S(A) = Σ(w_i × p_i(A))` where w = question weight, p = points
2. **Tie Detection**: Threshold `τ = S_max × (1 - 0.05)` to identify near-ties
3. **Trait-Based Tie-Breaking**: Cosine similarity in 6D trait space
4. **Confidence Calculation**: `(S_max - S_second) / S_max`
5. **Dimensional Normalization**: Maps raw scores to 0-100 scale

**Test Coverage**: 124 passing tests covering edge cases, mathematical invariants, and integration scenarios

### Data Structure

```json
{
  "metadata": {
    "version": "2.0",
    "dimensions": [
      {
        "id": "affective",
        "name": "Affective Dimension",
        "description": "...",
        "theoreticalBasis": "Terror Management Theory..."
      }
    ]
  },
  "questions": [
    {
      "id": "q1",
      "text": "When confronted with evidence...",
      "dimension": "cognitive",
      "theoreticalFocus": "Cognitive Dissonance...",
      "answers": [
        {
          "text": "I question the data's reliability...",
          "dimensionScores": { "cognitive": -2, "affective": 1 },
          "archetypeScores": { "ostrich": 3, "normalizer": 2 }
        }
      ]
    }
  ],
  "archetypes": [
    {
      "id": "prepper",
      "name": "The Prepper",
      "traits": {
        "awareness": "high",
        "affect": "neutral",
        "agency": "high",
        "temporality": "future",
        "relationality": "individual",
        "posture": "active"
      }
    }
  ]
}
```

## Keyboard Navigation

Fully accessible via keyboard:

- **Tab**: Navigate between elements
- **Enter/Space**: Activate buttons
- **Arrow Keys**: Navigate answer options
- **Escape**: (Future) Close modals

## Development

### Adding Questions

Edit `src/data/quiz-data.json`:

```json
{
  "id": "q21",
  "text": "Your question text?",
  "dimension": "cognitive",
  "theoreticalFocus": "Relevant theory...",
  "answers": [
    {
      "text": "Answer option",
      "theoreticalBasis": "Why this maps to theory...",
      "dimensionScores": { "cognitive": 2, "behavioral": -1 },
      "archetypeScores": { "prepper": 3, "ostrich": -2 }
    }
  ]
}
```

### Customizing Styles

All styles use CSS custom properties for easy theming:

```css
:root {
  --color-earth-dark: #2c241a;
  --color-earth-medium: #6b5d50;
  --color-cream: #faf8f3;
  --color-sage: #8a9a7f;
  --color-accent: #c67b5c;
  --space-xs: 0.25rem;
  /* ... more variables */
}
```

### Running Tests

```bash
# Tests currently require CommonJS version
cd /path/to/collapse-archetypes
node scoring-engine.test.js
```

Output: 124 tests covering mathematical correctness, edge cases, and integration

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

**Requirements**:
- ES6 module support
- Fetch API
- SVG rendering
- CSS Grid and Flexbox

## Privacy Commitment

This quiz is **truly private**:

- ✅ **No external requests**: All assets self-hosted (fonts, icons, scripts)
- ✅ **No tracking**: Zero analytics, cookies, or third-party services
- ✅ **No data collection**: No names, emails, IP addresses, or location data
- ✅ **Local processing**: All calculations happen in your browser via JavaScript
- ✅ **No storage**: Results aren't saved (close the page and they're gone)
- ✅ **Transparent**: View source code directly, verify our claims

See `privacy.html` for complete privacy notice.

## Accessibility

Built with accessibility as a core principle:

- ✅ Semantic HTML5 structure
- ✅ ARIA labels, roles, and landmarks
- ✅ Full keyboard navigation
- ✅ Screen reader compatibility tested
- ✅ WCAG AA color contrast ratios
- ✅ Focus indicators on all interactive elements
- ✅ Reduced motion support (`prefers-reduced-motion`)
- ✅ Progressive enhancement (works without JS for content viewing)

## Documentation

- **spec.md** - Original feature specification
- **basic-theory.md** - Theoretical framework and academic grounding
- **SCORING-ENGINE-ASSESSMENT.md** - Technical analysis of scoring integration
- **DIMENSION-INTERPRETATIONS.md** - Design philosophy for human-centered text
- **CLAUDE.md** - Developer guide for future AI assistance
- **QUICK_REFERENCE.md** - Quick reference for developers

## Credits

- **Design Philosophy**: Earthy, grounded aesthetics with archetypal symbolism
- **Fonts**: Crimson Pro (serif), Inter (sans-serif) - self-hosted
- **Icons**: Phosphor Icons - self-hosted
- **Architecture**: ES6 modules with sophisticated scoring algorithms
- **Development**: Built with Claude Code using specialized agent team
  - code-wizard: Core implementation
  - ux-weaver: Human-centered design
  - logic-alchemist: Mathematical scoring algorithms
  - qa-oracle: Quality assurance and testing
- **Gaia**: All the living systems that inspire this work and make it possible to have digital technology
- **Unacknowledged Workers**: Everyone who has contributed to open source libraries, tools, and frameworks that made this possible
- **Unseen Labor**: The invisible labor of maintaining and supporting the internet infrastructure and LLMs that helped in developing this application

## Disclaimer

This quiz is for **entertainment and self-reflection only**. It is not:
- A clinical assessment
- A diagnostic tool
- Professional psychological evaluation
- Scientific personality measurement

The archetypes are conceptual frameworks for thinking about responses to uncertainty, not scientific categories or personality types.

## License

Created for educational and self-reflection purposes. View source, learn, adapt as Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0).

---

**Note**: This application requires a web server to run due to ES6 module imports and CORS restrictions. Do not open `index.html` directly in a browser - use one of the server options above.

**Privacy**: No data leaves your device. See `privacy.html` for details.
