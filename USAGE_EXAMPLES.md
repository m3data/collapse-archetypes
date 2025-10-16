# Collapse Archetype Quiz - Usage Examples

This document provides practical examples for implementing and using the scoring engine.

---

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [Advanced Scenarios](#advanced-scenarios)
3. [Visualization Integration](#visualization-integration)
4. [Error Handling](#error-handling)
5. [Performance Optimization](#performance-optimization)
6. [Frontend Integration](#frontend-integration)

---

## Basic Usage

### Example 1: Simple Quiz Scoring

```javascript
const { scoreQuiz } = require('./scoring-engine.js');

// Define your quiz questions
const questions = [
  {
    id: 1,
    text: 'How do you view the future?',
    weight: 1.0,
    answers: [
      {
        id: 'optimistic',
        text: 'Full of opportunity',
        archetypeScores: { apocaloptimist: 3, 'blissed-out-yogi': 1 }
      },
      {
        id: 'pessimistic',
        text: 'Inevitable decline',
        archetypeScores: { 'prophet-of-doom': 3, 'already-collapsed': 1 }
      },
      {
        id: 'prepared',
        text: 'Manageable with preparation',
        archetypeScores: { prepper: 3, 'everyday-hustler': 1 }
      }
    ]
  },
  {
    id: 2,
    text: 'What is your primary concern?',
    weight: 1.0,
    answers: [
      {
        id: 'survival',
        text: 'Personal survival',
        archetypeScores: { prepper: 2, ostrich: 1 }
      },
      {
        id: 'community',
        text: 'Community resilience',
        archetypeScores: { 'sacred-keeper': 3, 'woke-lefty-socialist': 2 }
      },
      {
        id: 'profit',
        text: 'Economic opportunities',
        archetypeScores: { 'opportunist-elite': 3, salvager: 1 }
      }
    ]
  }
];

// User's answers
const userResponses = [
  { questionId: 1, answerId: 'prepared' },
  { questionId: 2, answerId: 'survival' }
];

// Score the quiz
const result = scoreQuiz(questions, userResponses);

console.log('Primary Archetype:', result.primary);
console.log('Score:', result.primaryScore);
console.log('Confidence:', result.confidence.level);
console.log('All Scores:', result.allScores);
```

**Expected Output:**
```
Primary Archetype: prepper
Score: 5
Confidence: STRONG
All Scores: { prepper: 5, 'everyday-hustler': 1, ostrich: 1, ... }
```

---

### Example 2: Handling Multiple Dominant Archetypes

```javascript
const { scoreQuiz } = require('./scoring-engine.js');

// User answers that create a tie
const userResponses = [
  { questionId: 1, answerId: 'optimistic' },
  { questionId: 2, answerId: 'community' }
];

const result = scoreQuiz(questions, userResponses, {
  tieTolerance: 0.05,
  breakTiesWithTraits: false // Don't automatically break ties
});

if (result.hasTie) {
  console.log('You match multiple archetypes:');
  result.dominantArchetypes.forEach(archetypeId => {
    console.log(`- ${archetypeId}: ${result.dominantScores[archetypeId]} points`);
  });
} else {
  console.log('Your archetype:', result.primary);
}
```

**Expected Output:**
```
You match multiple archetypes:
- apocaloptimist: 3 points
- sacred-keeper: 3 points
- blissed-out-yogi: 1 points
```

---

## Advanced Scenarios

### Example 3: Using Weighted Questions

```javascript
// Create a quiz where some questions are more important
const weightedQuestions = [
  {
    id: 1,
    text: 'Core values question',
    weight: 2.0, // Double importance
    answers: [
      { id: 'a', text: 'Answer A', archetypeScores: { prepper: 2 } },
      { id: 'b', text: 'Answer B', archetypeScores: { ostrich: 2 } }
    ]
  },
  {
    id: 2,
    text: 'Minor preference question',
    weight: 0.5, // Half importance
    answers: [
      { id: 'a', text: 'Answer A', archetypeScores: { prepper: 2 } },
      { id: 'b', text: 'Answer B', archetypeScores: { ostrich: 2 } }
    ]
  }
];

const responses = [
  { questionId: 1, answerId: 'a' }, // prepper gets 2 × 2.0 = 4 points
  { questionId: 2, answerId: 'b' }  // ostrich gets 2 × 0.5 = 1 point
];

const result = scoreQuiz(weightedQuestions, responses);

console.log('Weighted Scores:');
console.log('- Prepper:', result.allScores.prepper); // 4
console.log('- Ostrich:', result.allScores.ostrich); // 1
```

---

### Example 4: Trait-Based Tie Breaking

```javascript
const { scoreQuiz, breakTieWithTraits } = require('./scoring-engine.js');

const result = scoreQuiz(questions, userResponses, {
  tieTolerance: 0.05,
  breakTiesWithTraits: true // Automatically resolve ties using traits
});

console.log('Primary archetype (after tie-breaking):', result.primary);
console.log('User trait profile:', result.userTraitProfile);
console.log('Dominant archetypes before tie-breaking:', result.dominantArchetypes);
```

---

### Example 5: Custom Tie Tolerance

```javascript
// Use stricter tie detection (only ties within 1%)
const strictResult = scoreQuiz(questions, userResponses, {
  tieTolerance: 0.01
});

// Use looser tie detection (ties within 10%)
const looseResult = scoreQuiz(questions, userResponses, {
  tieTolerance: 0.10
});

console.log('Strict ties:', strictResult.dominantArchetypes.length);
console.log('Loose ties:', looseResult.dominantArchetypes.length);
```

---

## Visualization Integration

### Example 6: Generate Radar Chart Data

```javascript
const { scoreQuiz } = require('./scoring-engine.js');

const result = scoreQuiz(questions, userResponses, {
  includeVisualizations: true
});

// Extract radar chart coordinates
const radarData = result.visualizations.radarChart;

console.log('Radar chart coordinates:');
radarData.coordinates.forEach(coord => {
  console.log(`${coord.dimension}: ${coord.radius.toFixed(2)} at ${coord.angleDegrees.toFixed(0)}°`);
  console.log(`  Cartesian: (${coord.x.toFixed(2)}, ${coord.y.toFixed(2)})`);
});

console.log('Polygon area:', radarData.area.toFixed(3));

// Use with chart library (example for Chart.js)
const chartData = {
  labels: radarData.coordinates.map(c => c.dimension),
  datasets: [{
    label: 'Your Profile',
    data: radarData.coordinates.map(c => c.radius),
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderColor: 'rgb(75, 192, 192)'
  }]
};
```

**Expected Output:**
```
Radar chart coordinates:
awareness: 0.87 at 0°
  Cartesian: (0.87, 0.00)
affect: 0.40 at 60°
  Cartesian: (0.20, 0.35)
agency: 0.85 at 120°
  Cartesian: (-0.43, 0.74)
...
Polygon area: 1.523
```

---

### Example 7: Score Distribution Bar Chart

```javascript
const result = scoreQuiz(questions, userResponses, {
  includeVisualizations: true
});

const distribution = result.visualizations.scoreDistribution;

console.log('Top 5 Archetypes:');
distribution.slice(0, 5).forEach((item, index) => {
  console.log(`${index + 1}. ${item.archetypeId}: ${item.percentage.toFixed(1)}%`);

  // Create ASCII bar chart
  const barLength = Math.round(item.percentage / 2);
  const bar = '█'.repeat(barLength);
  console.log(`   ${bar}`);
});
```

**Expected Output:**
```
Top 5 Archetypes:
1. prepper: 45.5%
   ██████████████████████
2. apocaloptimist: 27.3%
   █████████████
3. everyday-hustler: 9.1%
   ████
4. ostrich: 9.1%
   ████
5. blissed-out-yogi: 9.1%
   ████
```

---

## Error Handling

### Example 8: Validation Before Scoring

```javascript
const { validateQuizData, validateUserResponses, scoreQuiz } = require('./scoring-engine.js');

// Validate quiz structure
const quizValidation = validateQuizData(questions);
if (!quizValidation.valid) {
  console.error('Invalid quiz data:');
  quizValidation.errors.forEach(err => console.error('- ', err));
  process.exit(1);
}

// Validate user responses
const responseValidation = validateUserResponses(questions, userResponses);
if (!responseValidation.valid) {
  console.error('Invalid responses:');
  responseValidation.errors.forEach(err => console.error('- ', err));
  process.exit(1);
}

// Safe to score
const result = scoreQuiz(questions, userResponses);
```

---

### Example 9: Graceful Error Recovery

```javascript
function scoreQuizSafely(questions, userResponses) {
  try {
    // Validate data first
    const quizValidation = validateQuizData(questions);
    if (!quizValidation.valid) {
      return {
        success: false,
        error: 'Invalid quiz structure',
        details: quizValidation.errors
      };
    }

    const responseValidation = validateUserResponses(questions, userResponses);
    if (!responseValidation.valid) {
      return {
        success: false,
        error: 'Invalid user responses',
        details: responseValidation.errors
      };
    }

    // Score the quiz
    const result = scoreQuiz(questions, userResponses);

    return {
      success: true,
      data: result
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      stack: error.stack
    };
  }
}

// Usage
const outcome = scoreQuizSafely(questions, userResponses);
if (outcome.success) {
  console.log('Result:', outcome.data.primary);
} else {
  console.error('Error:', outcome.error);
  console.error('Details:', outcome.details);
}
```

---

## Performance Optimization

### Example 10: Partial Results (Progressive Quiz)

```javascript
// For multi-page quizzes where you want intermediate results
function getIntermediateResults(questions, partialResponses) {
  // Only analyze questions that have been answered
  const answeredQuestionIds = partialResponses.map(r => r.questionId);
  const answeredQuestions = questions.filter(q => answeredQuestionIds.includes(q.id));

  if (answeredQuestions.length === 0) {
    return null;
  }

  const result = scoreQuiz(answeredQuestions, partialResponses, {
    includeVisualizations: false // Skip expensive visualizations for intermediate results
  });

  return {
    currentLeader: result.primary,
    progress: (partialResponses.length / questions.length) * 100,
    topThree: result.visualizations.scoreDistribution.slice(0, 3).map(d => d.archetypeId)
  };
}

// Usage: After each answer
const partialResult = getIntermediateResults(questions, [
  { questionId: 1, answerId: 'prepared' }
]);

console.log(`Progress: ${partialResult.progress}%`);
console.log('Current leader:', partialResult.currentLeader);
```

---

### Example 11: Caching for Repeated Calculations

```javascript
// Cache archetype profiles for faster trait-based calculations
const profileCache = new Map();

function getCachedTraitProfile(archetypeId) {
  if (!profileCache.has(archetypeId)) {
    const profile = ARCHETYPE_TRAIT_PROFILES[archetypeId];
    const normalized = calculateRadarChartCoordinates(profile);
    profileCache.set(archetypeId, { profile, normalized });
  }
  return profileCache.get(archetypeId);
}

// Usage in batch processing
const results = [];
for (let i = 0; i < 1000; i++) {
  const result = scoreQuiz(questions, generateRandomResponses());
  results.push(result);
}

console.log(`Processed ${results.length} quizzes`);
```

---

## Frontend Integration

### Example 12: React Component Integration

```javascript
import { useState, useEffect } from 'react';
import { scoreQuiz } from './scoring-engine.js';

function QuizComponent({ questions }) {
  const [responses, setResponses] = useState([]);
  const [result, setResult] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswer = (questionId, answerId) => {
    const newResponses = [...responses, { questionId, answerId }];
    setResponses(newResponses);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz complete, calculate result
      const quizResult = scoreQuiz(questions, newResponses, {
        includeVisualizations: true
      });
      setResult(quizResult);
    }
  };

  if (result) {
    return (
      <div className="quiz-result">
        <h2>Your Archetype: {result.primary}</h2>
        <p>Score: {result.primaryScore}</p>
        <p>Confidence: {result.confidence.level}</p>

        {result.hasTie && (
          <div className="tie-notice">
            <p>You also match these archetypes:</p>
            <ul>
              {result.dominantArchetypes.map(id => (
                <li key={id}>{id}: {result.dominantScores[id]} points</li>
              ))}
            </ul>
          </div>
        )}

        {/* Render radar chart using result.visualizations.radarChart */}
        <RadarChart data={result.visualizations.radarChart} />
      </div>
    );
  }

  return (
    <div className="quiz-question">
      <h3>{questions[currentQuestion].text}</h3>
      {questions[currentQuestion].answers.map(answer => (
        <button
          key={answer.id}
          onClick={() => handleAnswer(questions[currentQuestion].id, answer.id)}
        >
          {answer.text}
        </button>
      ))}
      <p>Question {currentQuestion + 1} of {questions.length}</p>
    </div>
  );
}
```

---

### Example 13: Express API Endpoint

```javascript
const express = require('express');
const { scoreQuiz, validateQuizData, validateUserResponses } = require('./scoring-engine.js');

const app = express();
app.use(express.json());

// Load questions from database or file
const questions = loadQuestions();

app.post('/api/quiz/score', (req, res) => {
  const { responses } = req.body;

  // Validate input
  const responseValidation = validateUserResponses(questions, responses);
  if (!responseValidation.valid) {
    return res.status(400).json({
      error: 'Invalid responses',
      details: responseValidation.errors
    });
  }

  try {
    // Score the quiz
    const result = scoreQuiz(questions, responses, {
      tieTolerance: 0.05,
      breakTiesWithTraits: true,
      includeVisualizations: true
    });

    // Return result
    res.json({
      success: true,
      data: {
        primary: result.primary,
        score: result.primaryScore,
        confidence: result.confidence,
        hasTie: result.hasTie,
        dominantArchetypes: result.dominantArchetypes,
        traitProfile: result.userTraitProfile,
        visualizations: result.visualizations
      }
    });

  } catch (error) {
    console.error('Scoring error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to score quiz',
      message: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('Quiz API running on port 3000');
});
```

---

### Example 14: Save Results to Database

```javascript
const { scoreQuiz } = require('./scoring-engine.js');

async function saveQuizResult(userId, questions, responses) {
  // Score the quiz
  const result = scoreQuiz(questions, responses);

  // Prepare data for database
  const quizResult = {
    userId: userId,
    timestamp: new Date(),
    primaryArchetype: result.primary,
    primaryScore: result.primaryScore,
    allScores: result.allScores,
    confidence: result.confidence.score,
    confidenceLevel: result.confidence.level,
    hasTie: result.hasTie,
    dominantArchetypes: result.dominantArchetypes,
    traitProfile: result.userTraitProfile,
    questionsAnswered: result.questionsAnswered,
    isComplete: result.isComplete
  };

  // Save to database
  await db.collection('quiz_results').insertOne(quizResult);

  return quizResult;
}

// Usage
const savedResult = await saveQuizResult('user123', questions, userResponses);
console.log('Saved result ID:', savedResult._id);
```

---

## Summary

These examples demonstrate:

1. **Basic Usage**: Simple scoring scenarios
2. **Advanced Features**: Weighted questions, tie-breaking, custom tolerances
3. **Visualizations**: Radar charts and score distributions
4. **Error Handling**: Validation and graceful recovery
5. **Performance**: Caching and optimization techniques
6. **Integration**: Frontend components and API endpoints

For more detailed mathematical specifications, see `scoring-system.md`.
For implementation details, see `scoring-engine.js`.
For test cases, see `scoring-engine.test.js`.
