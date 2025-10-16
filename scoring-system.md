# Collapse Archetype Quiz: Mathematical Scoring System Design

## Executive Summary

This document defines the mathematical foundation for the Collapse Archetype Quiz scoring system. The system aggregates user responses across multiple questions to determine which of the 19 collapse archetypes best matches the respondent's perspective and behavioral patterns.

---

## 1. Core Mathematical Model

### 1.1 Fundamental Scoring Equation

The total score for archetype `A` after `n` questions is:

```
S(A) = Σ(i=1 to n) w_i × p_i(A)
```

Where:
- `S(A)` = Total score for archetype A
- `w_i` = Weight of question i (default = 1.0)
- `p_i(A)` = Points awarded to archetype A from answer selected for question i
- `n` = Total number of questions

### 1.2 Score Normalization

To enable comparison across quizzes with different numbers of questions:

```
S_norm(A) = S(A) / Σ(i=1 to n) w_i
```

This produces a normalized score representing average points per weighted question.

---

## 2. Dominant Archetype Determination

### 2.1 Primary Algorithm

**Step 1: Calculate all archetype scores**
```
For each archetype A in ARCHETYPES:
    S(A) = Σ points from user answers
```

**Step 2: Identify maximum score**
```
S_max = max{S(A) | A ∈ ARCHETYPES}
```

**Step 3: Determine tie threshold**
```
τ = S_max × (1 - ε)
```
Where `ε` (epsilon) is the tie tolerance (recommended: 0.05 for 5% tolerance)

**Step 4: Collect dominant archetypes**
```
DOMINANT = {A | S(A) ≥ τ}
```

### 2.2 Tie-Breaking Strategies

#### Strategy A: Multiple Dominant Archetypes (Recommended)
When `|DOMINANT| > 1`, present all tied archetypes to the user, acknowledging complexity:

```
"You exhibit characteristics of multiple collapse archetypes:
 1. [Archetype A] (Score: X)
 2. [Archetype B] (Score: Y)
 3. [Archetype C] (Score: Z)"
```

**Rationale:** Human psychology rarely fits perfectly into single categories. Multiple matches reflect genuine complexity.

#### Strategy B: Secondary Trait Differentiation
If a single result is required, differentiate using the 6-dimensional trait system:

```
1. Calculate trait dimension scores for each tied archetype
2. Compare user's implicit trait profile against archetype profiles
3. Select archetype with highest cosine similarity in trait space
```

#### Strategy C: Lexicographic Ordering
As a fallback, use deterministic alphabetical ordering by archetype ID:

```
RESULT = min{A.id | A ∈ DOMINANT} (alphabetically first)
```

---

## 3. Six-Dimensional Trait System

### 3.1 Trait Dimensions

Each archetype maps to a profile across these dimensions:

1. **Awareness** (A): Recognition of collapse realities
   - Scale: Low (0.0) → High (1.0)

2. **Affect** (Af): Emotional valence toward collapse
   - Scale: Negative (-1.0) → Neutral (0.0) → Positive (1.0)

3. **Agency** (Ag): Perceived capacity to act
   - Scale: Low (0.0) → High (1.0)

4. **Time Orientation** (T): Temporal focus
   - Values: Past (-1.0) | Present (0.0) | Future (1.0)

5. **Relationality** (R): Social context orientation
   - Values: Individual (0.0) | Group (1.0)

6. **Posture** (P): Behavioral stance
   - Values: Passive (0.0) | Active (1.0)

### 3.2 Archetype Trait Profiles

Encoding from spec.md table:

```
ostrich: {A: 0.2, Af: 0.0, Ag: 0.2, T: 0.0, R: 0.0, P: 0.0}
blissed-out-yogi: {A: 0.9, Af: 0.8, Ag: 0.5, T: 0.0, R: 0.0, P: 0.0}
illusionist: {A: 0.5, Af: 0.0, Ag: 0.9, T: 0.0, R: 1.0, P: 1.0}
normalizer: {A: 0.2, Af: 0.0, Ag: 0.5, T: 0.0, R: 1.0, P: 0.0}
prepper: {A: 0.9, Af: 0.0, Ag: 0.9, T: 1.0, R: 0.0, P: 1.0}
prophet-of-doom: {A: 0.9, Af: -0.7, Ag: 0.5, T: 1.0, R: 0.0, P: 1.0}
alt-right-collapse-bro: {A: 0.5, Af: -0.7, Ag: 0.9, T: 1.0, R: 1.0, P: 1.0}
evangelical-nationalist: {A: 0.9, Af: 0.8, Ag: 0.5, T: 1.0, R: 1.0, P: 1.0}
apocaloptimist: {A: 0.9, Af: 0.8, Ag: 0.9, T: 1.0, R: 0.0, P: 1.0}
trickster: {A: 0.5, Af: 0.0, Ag: 0.9, T: 0.0, R: 0.0, P: 1.0}
woke-lefty-socialist: {A: 0.9, Af: -0.7, Ag: 0.9, T: 1.0, R: 1.0, P: 1.0}
salvager: {A: 0.5, Af: 0.0, Ag: 0.9, T: 0.0, R: 0.0, P: 1.0}
sacred-keeper: {A: 0.9, Af: 0.8, Ag: 0.5, T: -1.0, R: 1.0, P: 0.0}
everyday-hustler: {A: 0.5, Af: 0.0, Ag: 0.9, T: 0.0, R: 0.0, P: 1.0}
already-collapsed: {A: 0.9, Af: -0.7, Ag: 0.2, T: 0.0, R: 0.0, P: 0.0}
extracted: {A: 0.2, Af: 0.0, Ag: 0.2, T: 0.0, R: 0.0, P: 0.0}
child-witness: {A: 0.2, Af: 0.0, Ag: 0.2, T: 0.0, R: 0.0, P: 0.0}
opportunist-elite: {A: 0.9, Af: 0.0, Ag: 0.9, T: 1.0, R: 0.0, P: 1.0}
conspiracy-theorist: {A: 0.5, Af: -0.7, Ag: 0.5, T: 0.0, R: 0.0, P: 0.0}
```

### 3.3 Trait-Based Similarity Metric (Secondary Differentiation)

When using Strategy B for tie-breaking, compute cosine similarity between user's inferred trait vector and archetype trait vectors:

```
similarity(U, A) = (U · A) / (||U|| × ||A||)
```

Where:
- `U` = User's 6-dimensional trait vector (inferred from answers)
- `A` = Archetype's trait profile vector
- `·` = Dot product
- `||·||` = Euclidean norm

**Expanded formula:**
```
similarity(U, A) =
    (U_A × A_A + U_Af × A_Af + U_Ag × A_Ag + U_T × A_T + U_R × A_R + U_P × A_P) /
    sqrt(U_A² + U_Af² + U_Ag² + U_T² + U_R² + U_P²) × sqrt(A_A² + A_Af² + A_Ag² + A_T² + A_R² + A_P²)
```

---

## 4. Implementation Considerations

### 4.1 Data Structures

**Archetype Scores Object:**
```javascript
{
  "ostrich": 8,
  "blissed-out-yogi": 3,
  "prepper": 12,
  ...
}
```

**Trait Profile Object:**
```javascript
{
  "awareness": 0.9,
  "affect": 0.0,
  "agency": 0.9,
  "time": 1.0,
  "relationality": 0.0,
  "posture": 1.0
}
```

### 4.2 Performance Optimization

**Time Complexity:**
- Score aggregation: O(n × m) where n = questions, m = average answers per question
- Dominant archetype determination: O(k) where k = number of archetypes (19)
- Overall: O(n × m + k) → Linear in quiz length

**Space Complexity:**
- O(k) for archetype scores
- O(k × 6) for trait profiles
- Overall: O(k) → Constant for fixed archetype set

**Optimization Techniques:**
1. Pre-compute archetype trait profile norms during initialization
2. Use hash maps for O(1) score lookup
3. Early termination if dominant archetype emerges with >50% of remaining points impossible for others
4. Cache normalized scores if recalculation is needed

### 4.3 Edge Cases and Boundary Conditions

**Case 1: Zero Variance (All Scores Equal)**
```
IF max(S) - min(S) < δ THEN
    RETURN "Balanced Profile" archetype or prompt user for clarification questions
```
Where δ is a minimum variance threshold (e.g., 0.1)

**Case 2: No Scores Recorded**
```
IF all S(A) = 0 THEN
    RETURN error: "No valid answers recorded"
```

**Case 3: Single Question Quiz**
```
Valid scenario: Return archetypes with any points from the single answer
```

**Case 4: Negative Scores (if using negative scoring)**
```
S_adjusted(A) = max(0, S(A))  // Floor at zero
```

### 4.4 Validation and Testing

**Unit Test Cases:**
1. Perfect match: All answers point to single archetype
2. Exact tie: Two archetypes with identical scores
3. Near tie: Scores within 5% of each other
4. Dominant winner: One archetype with >2x score of others
5. Uniform distribution: Equal scores across all archetypes
6. Edge values: Zero scores, maximum possible scores
7. Single question: Quiz with only one question
8. Empty quiz: No questions answered

**Invariants to Verify:**
- `Σ S(A) = Σ Σ points from all answers` (conservation of points)
- `S_norm(A) ≥ 0` for all A (non-negativity)
- `|DOMINANT| ≥ 1` (at least one dominant archetype)
- `max{S(A)} ∈ DOMINANT` (maximum score always included)

---

## 5. Visualization Support

### 5.1 Radar Chart Calculation

For displaying results as a radar/spider chart with 6 dimensions:

**Step 1: Calculate archetype trait profile** (already defined in 3.2)

**Step 2: Transform to polar coordinates** (for each of 6 axes):
```
For dimension d ∈ {1, 2, 3, 4, 5, 6}:
    θ_d = (d - 1) × (2π / 6)  // Angle in radians
    r_d = trait_value_d         // Radius (normalized 0-1)

    x_d = r_d × cos(θ_d)
    y_d = r_d × sin(θ_d)
```

**Step 3: Calculate polygon area** (for visual comparison):
```
Area = (1/2) × |Σ(i=1 to 6) (x_i × y_{i+1} - x_{i+1} × y_i)|
```
Where indices wrap: x_7 = x_1, y_7 = y_1

### 5.2 Score Distribution Bar Chart

Calculate percentages for each archetype:
```
percentage(A) = (S(A) / Σ S(all)) × 100
```

Sort archetypes by score descending for display.

---

## 6. Confidence Scoring (Optional Enhancement)

Measure certainty of archetype match:

```
confidence = (S_max - S_second) / S_max
```

Where:
- `S_max` = Highest archetype score
- `S_second` = Second-highest archetype score

**Interpretation:**
- confidence ≥ 0.5: Strong match (>50% separation)
- 0.2 ≤ confidence < 0.5: Moderate match
- confidence < 0.2: Weak match (consider multiple archetypes)

---

## 7. Mathematical Verification

### 7.1 Worked Example

**Quiz Setup:**
- 5 questions
- Each answer awards 1 point to one archetype
- User answers: Q1→A1(ostrich), Q2→A2(prepper), Q3→A1(prepper), Q4→A3(prepper), Q5→A2(ostrich)

**Score Calculation:**
```
S(ostrich) = 1 + 0 + 0 + 0 + 1 = 2
S(prepper) = 0 + 1 + 1 + 1 + 0 = 3
S(all others) = 0
```

**Dominant Archetype:**
```
S_max = 3
τ = 3 × (1 - 0.05) = 2.85
DOMINANT = {prepper} (only archetype ≥ 2.85)
```

**Confidence:**
```
confidence = (3 - 2) / 3 = 0.333 (moderate match)
```

### 7.2 Tie Example

**User answers award:**
```
S(prepper) = 5
S(apocaloptimist) = 5
S(opportunist-elite) = 4.9
S(all others) < 4
```

**With ε = 0.05:**
```
S_max = 5
τ = 5 × 0.95 = 4.75
DOMINANT = {prepper, apocaloptimist, opportunist-elite}
```

**Result:** Display all three as co-dominant archetypes, or use trait-based differentiation if single result required.

---

## 8. Extensibility

### 8.1 Question Weighting

To implement variable importance for questions:

```javascript
questions: [
  {id: 1, weight: 1.0, ...},
  {id: 2, weight: 1.5, ...},  // 50% more important
  {id: 3, weight: 0.5, ...}   // Half as important
]
```

Update scoring:
```
S(A) = Σ(i=1 to n) w_i × p_i(A)
```

### 8.2 Dynamic Archetypes

System supports adding/removing archetypes without algorithm changes:
- Archetype scores stored in dynamic dictionary
- Only archetypes with points > 0 need consideration
- No hardcoded archetype lists in core logic

### 8.3 Multi-Answer Questions

Support questions where multiple answers can be selected:

```
S(A) = Σ(i=1 to n) w_i × Σ(j in selected_answers_i) p_ij(A)
```

---

## 9. Implementation Checklist

- [ ] Core scoring aggregation function
- [ ] Dominant archetype determination with tie handling
- [ ] Archetype trait profile data structure
- [ ] Cosine similarity calculation for trait-based differentiation
- [ ] Score normalization function
- [ ] Confidence metric calculation
- [ ] Radar chart coordinate transformation
- [ ] Input validation and error handling
- [ ] Unit tests for all edge cases
- [ ] Performance benchmarking
- [ ] Documentation of mathematical decisions

---

## 10. References and Assumptions

**Key Assumptions:**
1. Point values are non-negative integers or floats
2. At least one answer per question awards non-zero points
3. Archetype IDs are unique and consistent across data structures
4. Trait dimensions are independent (orthogonal in conceptual space)
5. Users answer all questions (no partial quiz handling in basic version)

**Recommended Constants:**
- Tie tolerance (ε): 0.05 (5%)
- Minimum variance threshold (δ): 0.1
- Default question weight: 1.0
- Confidence thresholds: [0.2, 0.5] for [weak, moderate, strong]

---

## Conclusion

This scoring system provides a mathematically rigorous, transparent, and extensible foundation for the Collapse Archetype Quiz. The algorithm balances simplicity for maintainability with sophistication for accurate psychological profiling. Tie-handling embraces the complexity of human psychology while providing clear fallback mechanisms when single results are required.

The six-dimensional trait system adds depth without complicating the core scoring logic, enabling rich visualizations and secondary differentiation when needed.

All mathematical operations are computationally efficient (linear time complexity), ensuring responsive performance even with large question sets.
