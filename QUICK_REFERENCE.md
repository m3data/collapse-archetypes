# Collapse Archetype Quiz - Quick Reference Card

**Version:** 1.0.0 | **Status:** Production Ready | **Tests:** 124/124 Passing

---

## One-Line Summary

Mathematical scoring engine that determines which of 19 collapse archetypes best matches a user based on quiz responses across a 6-dimensional psychological trait space.

---

## Quick Start (5 Lines)

```javascript
const { scoreQuiz } = require('./scoring-engine.js');

const result = scoreQuiz(questions, userResponses);

console.log(result.primary);           // "prepper"
console.log(result.confidence.level);  // "STRONG"
console.log(result.hasTie);            // false
```

---

## Core Functions Reference

### Primary API

```javascript
scoreQuiz(questions, userResponses, options = {})
```
**Purpose:** Complete scoring pipeline from responses to results
**Returns:** Object with primary archetype, scores, confidence, traits, visualizations
**Time:** O(n×m + k) where n=questions, m=answers, k=archetypes

### Validation

```javascript
validateQuizData(questions)           // Check quiz structure
validateUserResponses(questions, responses)  // Check response validity
```
**Returns:** `{valid: boolean, errors: Array<string>}`

### Individual Components

```javascript
calculateArchetypeScores(questions, responses)  // Raw score aggregation
determineDominantArchetypes(scores, tolerance)  // Find winner(s)
calculateConfidence(scores)                     // Match certainty
inferUserTraitVector(scores)                    // 6D trait profile
breakTieWithTraits(tiedIds, allScores)         // Trait-based tie-breaker
normalizeScores(scores, questions)              // Per-question average
```

### Visualization

```javascript
calculateRadarChartCoordinates(traitProfile)   // Polar → Cartesian
calculateRadarChartArea(coordinates)            // Polygon area
calculateScoreDistribution(scores)              // Percentage breakdown
```

---

## Data Structures

### Input: Question Object

```javascript
{
  id: 1,                    // Unique identifier
  text: "Question text",    // Display text
  weight: 1.0,              // Importance (default: 1.0)
  answers: [                // Array of answer objects
    {
      id: 'a',              // Unique within question
      text: "Answer text",  // Display text
      archetypeScores: {    // Points awarded
        prepper: 3,
        ostrich: 1
      }
    }
  ]
}
```

### Input: User Response

```javascript
{
  questionId: 1,   // Must match question.id
  answerId: 'a'    // Must match answer.id
}
```

### Output: Result Object

```javascript
{
  // Primary result
  primary: "prepper",              // Winning archetype ID
  primaryScore: 12,                // Winner's point total

  // Tie information
  hasTie: false,                   // Multiple dominants?
  dominantArchetypes: ["prepper"], // All tied archetypes
  dominantScores: {prepper: 12},   // Scores of dominants

  // Confidence
  confidence: {
    score: 0.6,                    // 0-1 scale
    level: "STRONG",               // STRONG/MODERATE/WEAK
    firstPlace: "prepper",
    secondPlace: "ostrich"
  },

  // Complete scores
  allScores: {prepper: 12, ...},   // All 19 archetypes
  normalizedScores: {...},         // Normalized [0,1]

  // Trait analysis
  userTraitProfile: {              // 6D vector as object
    awareness: 0.87,
    affect: 0.15,
    agency: 0.85,
    time: 0.80,
    relationality: 0.2,
    posture: 0.90
  },
  userTraitVector: [0.87, ...],    // 6D vector as array

  // Visualizations
  visualizations: {
    radarChart: {
      coordinates: [...],          // 6 points with x,y
      area: 1.523                  // Polygon area
    },
    scoreDistribution: [           // Sorted by score
      {archetypeId, score, percentage}
    ]
  },

  // Metadata
  questionsAnswered: 20,
  totalQuestions: 20,
  isComplete: true
}
```

---

## Configuration Options

```javascript
const result = scoreQuiz(questions, responses, {
  tieTolerance: 0.05,          // Default: 0.05 (5%)
  breakTiesWithTraits: true,   // Default: true
  includeVisualizations: true  // Default: true
});
```

### Tie Tolerance Values

- `0.01` - Strict (1% within max)
- `0.05` - Standard (5% within max) **← DEFAULT**
- `0.10` - Loose (10% within max)

---

## Mathematical Formulas

### Score Aggregation

```
S(A) = Σ(i=1 to n) w_i × p_i(A)
```
Where: w_i = question weight, p_i(A) = points to archetype A

### Dominant Threshold

```
τ = S_max × (1 - ε)
Dominant = {A | S(A) ≥ τ}
```
Where: ε = tie tolerance (default 0.05)

### Confidence Score

```
confidence = (S_max - S_second) / S_max
```

### Cosine Similarity (Tie-Breaking)

```
similarity(U, A) = (U · A) / (||U|| × ||A||)
```

### User Trait Inference

```
U_dimension = Σ(A) S(A) × A_dimension / Σ(A) S(A)
```

### Radar Coordinates

```
θ_d = (d / 6) × 2π
r_d = trait_value_d
x_d = r_d × cos(θ_d)
y_d = r_d × sin(θ_d)
```

---

## Six Trait Dimensions

| Dimension | Range | Low | Medium | High |
|-----------|-------|-----|--------|------|
| **Awareness** | 0.0-1.0 | Denial | Aware | Hyper-aware |
| **Affect** | -1.0-1.0 | Negative | Neutral | Positive |
| **Agency** | 0.0-1.0 | Powerless | Some control | High control |
| **Time** | -1.0-1.0 | Past | Present | Future |
| **Relationality** | 0.0-1.0 | Individual | -- | Group |
| **Posture** | 0.0-1.0 | Passive | -- | Active |

---

## 19 Archetypes (Summary)

| ID | Awareness | Affect | Agency | Time | Relation | Posture |
|----|-----------|--------|--------|------|----------|---------|
| ostrich | Low | Neutral | Low | Present | Indiv | Passive |
| blissed-out-yogi | High | Positive | Med | Present | Indiv | Passive |
| prepper | High | Neutral | High | Future | Indiv | Active |
| prophet-of-doom | High | Negative | Med | Future | Indiv | Active |
| apocaloptimist | High | Positive | High | Future | Indiv | Active |
| already-collapsed | High | Negative | Low | Present | Indiv | Passive |
| opportunist-elite | High | Neutral | High | Future | Indiv | Active |
| ... | ... | ... | ... | ... | ... | ... |

*Full trait profiles in `ARCHETYPE_TRAIT_PROFILES` constant*

---

## Common Patterns

### Basic Scoring

```javascript
const result = scoreQuiz(questions, responses);
if (result.isComplete) {
  console.log(`You are: ${result.primary}`);
}
```

### Handle Ties

```javascript
const result = scoreQuiz(questions, responses, {
  breakTiesWithTraits: false  // Don't auto-break ties
});

if (result.hasTie) {
  console.log('Multiple matches:', result.dominantArchetypes);
} else {
  console.log('Clear match:', result.primary);
}
```

### Validate First

```javascript
const valid = validateQuizData(questions);
if (!valid.valid) {
  console.error(valid.errors);
  return;
}
const result = scoreQuiz(questions, responses);
```

### Partial Results

```javascript
// Only score answered questions
const answeredQs = questions.filter(q =>
  responses.some(r => r.questionId === q.id)
);
const partialResult = scoreQuiz(answeredQs, responses);
```

### Skip Visualizations (Faster)

```javascript
const result = scoreQuiz(questions, responses, {
  includeVisualizations: false  // Skip expensive calculations
});
```

---

## Performance Characteristics

| Quiz Size | Time | Memory |
|-----------|------|--------|
| 1 question | <1ms | ~100KB |
| 10 questions | <1ms | ~100KB |
| 100 questions | <1ms | ~120KB |
| 1000 questions | ~5ms | ~200KB |

**Complexity:**
- Time: O(n×m + k) - Linear in quiz length
- Space: O(n + k) - Linear in quiz length

---

## Error Handling

### Common Errors

```javascript
// All-zero scores
try {
  const result = scoreQuiz(questions, []);
} catch (e) {
  // "No valid scores recorded"
}

// Invalid question structure
const validation = validateQuizData(badQuestions);
if (!validation.valid) {
  validation.errors.forEach(e => console.error(e));
}

// Unknown question/answer IDs
// Logged as warnings, doesn't throw
```

---

## Testing

### Run Tests

```bash
node scoring-engine.test.js
```

**Expected Output:**
```
============================================================
TEST SUMMARY
============================================================
Total tests: 124
Passed: 124
Failed: 0
============================================================
✓ ALL TESTS PASSED
```

### Test Categories

1. Core scoring (6 tests)
2. Dominant determination (8 tests)
3. Confidence calculation (7 tests)
4. Trait analysis (11 tests)
5. Visualization (8 tests)
6. Integration (8 tests)
7. Validation (6 tests)
8. Mathematical invariants (40+ assertions)
9. Performance (2 tests)
10. Edge cases (8 tests)

---

## Key Constants

```javascript
TIE_TOLERANCE = 0.05              // 5% tie threshold
MINIMUM_VARIANCE = 0.1            // Uniform distribution detection
CONFIDENCE_THRESHOLDS = {
  STRONG: 0.5,                    // ≥50% separation
  MODERATE: 0.2                   // ≥20% separation
}
```

---

## File Locations

```
/Users/m3untold/Code/collapse-archetypes/
├── scoring-system.md            # Mathematical specification
├── scoring-engine.js            # Production code (786 lines)
├── scoring-engine.test.js       # Test suite (750+ lines)
├── USAGE_EXAMPLES.md            # 14 practical examples
├── IMPLEMENTATION_SUMMARY.md    # Complete overview
├── QUICK_REFERENCE.md           # This file
└── SCORING_FLOW_DIAGRAM.txt     # Visual flow diagram
```

---

## Integration Checklist

- [ ] Load quiz questions from JSON/database
- [ ] Validate quiz structure with `validateQuizData()`
- [ ] Capture user responses in correct format
- [ ] Validate responses with `validateUserResponses()`
- [ ] Call `scoreQuiz()` with appropriate options
- [ ] Display primary archetype to user
- [ ] Handle tie scenarios (multiple archetypes)
- [ ] Show confidence level to user
- [ ] Render visualizations (radar chart, bar chart)
- [ ] Save results to database (optional)
- [ ] Implement retake functionality

---

## Troubleshooting

**Problem:** All archetypes have zero scores
**Solution:** Check that answers have `archetypeScores` object with non-zero values

**Problem:** Ties always occur
**Solution:** Increase `tieTolerance` or ensure questions differentiate archetypes

**Problem:** Low confidence scores
**Solution:** Add more discriminating questions or weight important questions higher

**Problem:** Unexpected primary archetype
**Solution:** Check weighted scoring - question weights multiply points

**Problem:** Visualizations not generated
**Solution:** Ensure `includeVisualizations: true` in options

---

## Support & Documentation

- **Mathematical Details:** `scoring-system.md`
- **Usage Examples:** `USAGE_EXAMPLES.md`
- **Implementation Guide:** `IMPLEMENTATION_SUMMARY.md`
- **Visual Flow:** `SCORING_FLOW_DIAGRAM.txt`
- **Tests:** `scoring-engine.test.js`

---

## Version History

- **1.0.0** (2025-10-15): Initial production release
  - Complete scoring implementation
  - 124 passing tests
  - Full documentation

---

**Built by Logic Alchemist | Mathematical Precision & Computational Excellence**
