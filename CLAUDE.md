# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Collapse Archetype Quiz is an interactive web application that helps users identify their archetype based on a series of questions. The quiz calculates scores for 19 different archetypes and displays the dominant archetype result with descriptions and imagery.

## Core Architecture

The application follows a client-side quiz architecture:

1. **Data Layer**: Quiz data (questions, answers, archetypes) loaded from structured format (JSON)
2. **State Management**: Tracks current question, user responses, and archetype scores
3. **Quiz Logic**: Score calculation and dominant archetype determination
4. **UI Flow**: Welcome → Questions (one at a time) → Results → Retake option

### Key Data Structures

- **Question**: `{ id, text, answers: Answer[] }`
- **Answer**: `{ id, text, archetypeScores: { [archetypeId]: scoreIncrement } }`
- **Archetype**: `{ id, name, description, image }` (19 total archetypes)
- **User Response**: `{ questionId, answerId }`

### Archetype Trait System

Each archetype is characterized by 6 dimensions:
- **Awareness**: Low/Medium/High perception of collapse realities
- **Affect**: Positive/Neutral/Negative emotional stance
- **Agency**: Low/Medium/High capacity for action
- **Time Orientation**: Past/Present/Future focus
- **Relationality**: Individual/Group orientation
- **Posture**: Active/Passive engagement style

The 19 archetypes range from "Ostrich" (denial/avoidance) to "Opportunist Elite" (exploitation), each with unique trait combinations that should inform quiz questions and score calculations.

## Development Requirements

### Functional Priorities

1. **Quiz Flow**: Single question display with progress indicator, answer selection, and smooth transitions
2. **Score Calculation**: Aggregate scores from answer selections, identify dominant archetype(s), handle ties gracefully
3. **Result Display**: Show dominant archetype with description, imagery, and retake option
4. **Data Management**: Support easy updates to quiz content without code changes

### Non-Functional Requirements

- Responsive design for desktop and mobile
- Keyboard navigation and ARIA labels for accessibility
- Readable fonts with sufficient color contrast
- Cross-browser compatibility
- Fast load times with smooth animations

### Testing Approach

- Unit tests for quiz logic and score calculation
- Integration tests for complete UI flow
- Accessibility testing (automated tools + manual checks)
- Cross-browser and performance testing on various devices

## Deployment Target

Static site hosting (GitHub Pages, Netlify) with:
- Build tools for minification and bundling
- Continuous integration for automated testing and deployment
- Post-deployment monitoring
