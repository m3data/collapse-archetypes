# Collapse Archetype Quiz Specification

## Feature Overview

The Collapse Archetype Quiz is an interactive web application designed to help users identify their archetype based on a series of questions. The quiz presents users with multiple-choice questions, each linked to different archetypes. Upon completion, the application calculates the user's dominant archetype and displays the result along with a detailed description.

## Functional Requirements

1. **User Interface**
   - Display a welcome screen with a start button.
   - Present one question at a time with multiple-choice answers.
   - Allow users to select an answer and proceed to the next question.
   - Show progress through the quiz (e.g., question number/total).
   - Display the final archetype result with a description and relevant imagery.
   - Provide an option to retake the quiz.

2. **Quiz Logic**
   - Store questions, answers, and associated archetype scores.
   - Calculate scores based on user selections.
   - Determine the dominant archetype after the last question.
   - Handle ties or multiple dominant archetypes gracefully.

3. **Data Management**
   - Load quiz data (questions, answers, archetypes) from a structured format (e.g., JSON).
   - Support easy updates or additions to the quiz content.

4. **Accessibility**
   - Ensure the quiz is navigable via keyboard.
   - Provide appropriate ARIA labels and roles.
   - Use readable fonts and sufficient color contrast.

## Non-Functional Requirements

- Responsive design for desktop and mobile devices.
- Fast load times and smooth transitions.
- Maintainable and modular codebase.
- Secure handling of any user data (if applicable).
- Cross-browser compatibility.

## Data Structures

- **Question Object**
  - `id`: Unique identifier
  - `text`: Question text
  - `answers`: Array of Answer Objects

- **Answer Object**
  - `id`: Unique identifier
  - `text`: Answer text
  - `archetypeScores`: Map of archetype to score increment

- **Archetype Object**
  - `id`: Unique identifier
  - `name`: Archetype name
  - `description`: Detailed description
  - `image`: URL or path to image

- **User Response**
  - `questionId`: ID of the question
  - `answerId`: ID of the selected answer

## Architecture and Flow

1. **Initialization**
   - Load quiz data.
   - Initialize user state and scores.

2. **Quiz Flow**
   - Display question.
   - Capture user answer.
   - Update scores.
   - Move to next question or results.

3. **Result Calculation**
   - Aggregate scores.
   - Identify dominant archetype(s).
   - Display result.

4. **Retake Option**
   - Reset state.
   - Restart quiz.

## Presentation Mapping

- Use semantic HTML elements for structure.
- Style with CSS to reflect archetype themes.
- Use animations for transitions between questions.
- Responsive layouts adapting to screen sizes.
- Visual progress indicators (e.g., progress bar).

## Testing Strategy

- Unit tests for quiz logic and score calculation.
- Integration tests for UI flow.
- Accessibility testing using tools and manual checks.
- Cross-browser testing.
- Performance testing on various devices.

## Deployment

- Host on a static site hosting service (e.g., GitHub Pages, Netlify).
- Use build tools for optimization (e.g., minification, bundling).
- Set up continuous integration for automated testing and deployment.
- Monitor uptime and performance post-deployment.

## Archetypes
| ID                   | Name                   | Description                                    | Meme Caption                     | Traits (A/Af/Ag/T/R/P)                          |
|----------------------|------------------------|------------------------------------------------|---------------------------------|------------------------------------------------|
| ostrich              | Ostrich                | Avoids collapse realities, prefers denial.    | "What collapse? Just sand here."| Low Awareness / Neutral Affect / Low Agency / Present / Individual / Passive |
| blissed-out-yogi     | Blissed-Out Yogi       | Embraces peace and mindfulness amid chaos.    | "Collapse is just an illusion." | High Awareness / Positive Affect / Medium Agency / Present / Individual / Passive |
| illusionist          | Illusionist            | Spins narratives to mask collapse realities.  | "Trust me, it’s all fine."      | Medium Awareness / Neutral Affect / High Agency / Present / Group / Active |
| normalizer           | Normalizer             | Maintains status quo, downplays risks.         | "Business as usual, folks."     | Low Awareness / Neutral Affect / Medium Agency / Present / Group / Passive |
| prepper              | Prepper                | Prepares extensively for collapse scenarios.  | "Got my bunker ready."           | High Awareness / Neutral Affect / High Agency / Future / Individual / Active |
| prophet-of-doom      | Prophet of Doom        | Predicts inevitable collapse with urgency.    | "I told you so."                 | High Awareness / Negative Affect / Medium Agency / Future / Individual / Active |
| alt-right-collapse-bro| Alt-Right Collapse Bro | Combines collapse talk with far-right views.  | "Collapse is coming, stay strong."| Medium Awareness / Negative Affect / High Agency / Future / Group / Active |
| evangelical-nationalist | Evangelical Nationalist | Sees collapse as divine judgment and revival.| "Prepare for the rapture."      | High Awareness / Positive Affect / Medium Agency / Future / Group / Active |
| apocaloptimist        | Apocaloptimist         | Optimistic about post-collapse opportunities. | "Collapse? Bring it on!"         | High Awareness / Positive Affect / High Agency / Future / Individual / Active |
| trickster             | Trickster              | Uses humor and chaos to navigate collapse.    | "Collapse? Let’s prank it."     | Medium Awareness / Neutral Affect / High Agency / Present / Individual / Active |
| woke-lefty-socialist  | Woke Lefty Socialist   | Advocates systemic change amidst collapse.    | "Collapse reveals the system."  | High Awareness / Negative Affect / High Agency / Future / Group / Active |
| salvager              | Salvager               | Repurposes and reclaims in collapse aftermath.| "Trash is treasure now."         | Medium Awareness / Neutral Affect / High Agency / Present / Individual / Active |
| sacred-keeper         | Sacred Keeper          | Protects traditions and sacred knowledge.     | "Guardians of the old ways."    | High Awareness / Positive Affect / Medium Agency / Past / Group / Passive |
| everyday-hustler      | Everyday Hustler       | Navigates collapse through daily grit and grind.| "Hustle never stops."           | Medium Awareness / Neutral Affect / High Agency / Present / Individual / Active |
| already-collapsed     | Already Collapsed      | Lives in conditions of ongoing collapse.      | "Welcome to the new normal."    | High Awareness / Negative Affect / Low Agency / Present / Individual / Passive |
| extracted             | Extracted              | Removed from collapse zones, insulated.       | "Safe and sound, for now."      | Low Awareness / Neutral Affect / Low Agency / Present / Individual / Passive |
| child-witness         | Child Witness          | Observes collapse with innocence and confusion.| "Why is everything breaking?"   | Low Awareness / Neutral Affect / Low Agency / Present / Individual / Passive |
| opportunist-elite     | Opportunist Elite      | Exploits collapse for personal gain.           | "Collapse is just another market."| High Awareness / Neutral Affect / High Agency / Future / Individual / Active |
| conspiracy-theorist   | Conspiracy Theorist    | Sees collapse as part of hidden agendas.      | "They want us to fail."         | Medium Awareness / Negative Affect / Medium Agency / Present / Individual / Passive |
