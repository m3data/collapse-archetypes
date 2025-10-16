/**
 * COLLAPSE ARCHETYPE QUIZ - SCORING ENGINE
 *
 * Mathematical implementation of the archetype scoring system.
 * This module provides transparent, accurate, and efficient scoring logic
 * for determining user archetypes based on quiz responses.
 *
 * @module scoring-engine
 * @version 1.0.0
 * @see scoring-system.md for mathematical specification
 */

// ============================================================================
// CONFIGURATION CONSTANTS
// ============================================================================

/**
 * Tie tolerance factor (epsilon) for determining multiple dominant archetypes.
 * A value of 0.05 means archetypes within 5% of the maximum score are considered tied.
 *
 * Mathematical definition: τ = S_max × (1 - ε)
 * Archetypes with S(A) ≥ τ are considered co-dominant.
 */
const TIE_TOLERANCE = 0.05;

/**
 * Minimum variance threshold for detecting uniform score distributions.
 * If max(S) - min(S) < MINIMUM_VARIANCE, all archetypes are equally matched.
 */
const MINIMUM_VARIANCE = 0.1;

/**
 * Confidence score thresholds for interpretation.
 * confidence = (S_max - S_second) / S_max
 */
const CONFIDENCE_THRESHOLDS = {
  STRONG: 0.5,   // ≥50% separation from second place
  MODERATE: 0.2  // ≥20% separation from second place
};

// ============================================================================
// ARCHETYPE TRAIT PROFILES
// ============================================================================

/**
 * Six-dimensional trait profiles for all 19 collapse archetypes.
 *
 * Dimensions:
 * - awareness: Recognition of collapse realities [0.0 = Low, 1.0 = High]
 * - affect: Emotional valence [-1.0 = Negative, 0.0 = Neutral, 1.0 = Positive]
 * - agency: Perceived capacity to act [0.0 = Low, 1.0 = High]
 * - time: Temporal orientation [-1.0 = Past, 0.0 = Present, 1.0 = Future]
 * - relationality: Social context [0.0 = Individual, 1.0 = Group]
 * - posture: Behavioral stance [0.0 = Passive, 1.0 = Active]
 *
 * Source: Derived from spec.md archetype table
 */
const ARCHETYPE_TRAIT_PROFILES = {
  'ostrich': {
    awareness: 0.2,
    affect: 0.0,
    agency: 0.2,
    time: 0.0,
    relationality: 0.0,
    posture: 0.0
  },
  'blissed-out-yogi': {
    awareness: 0.9,
    affect: 0.8,
    agency: 0.5,
    time: 0.0,
    relationality: 0.0,
    posture: 0.0
  },
  'illusionist': {
    awareness: 0.5,
    affect: 0.0,
    agency: 0.9,
    time: 0.0,
    relationality: 1.0,
    posture: 1.0
  },
  'normalizer': {
    awareness: 0.2,
    affect: 0.0,
    agency: 0.5,
    time: 0.0,
    relationality: 1.0,
    posture: 0.0
  },
  'prepper': {
    awareness: 0.9,
    affect: 0.0,
    agency: 0.9,
    time: 1.0,
    relationality: 0.0,
    posture: 1.0
  },
  'prophet-of-doom': {
    awareness: 0.9,
    affect: -0.7,
    agency: 0.5,
    time: 1.0,
    relationality: 0.0,
    posture: 1.0
  },
  'alt-right-collapse-bro': {
    awareness: 0.5,
    affect: -0.7,
    agency: 0.9,
    time: 1.0,
    relationality: 1.0,
    posture: 1.0
  },
  'evangelical-nationalist': {
    awareness: 0.9,
    affect: 0.8,
    agency: 0.5,
    time: 1.0,
    relationality: 1.0,
    posture: 1.0
  },
  'apocaloptimist': {
    awareness: 0.9,
    affect: 0.8,
    agency: 0.9,
    time: 1.0,
    relationality: 0.0,
    posture: 1.0
  },
  'trickster': {
    awareness: 0.5,
    affect: 0.0,
    agency: 0.9,
    time: 0.0,
    relationality: 0.0,
    posture: 1.0
  },
  'woke-lefty-socialist': {
    awareness: 0.9,
    affect: -0.7,
    agency: 0.9,
    time: 1.0,
    relationality: 1.0,
    posture: 1.0
  },
  'salvager': {
    awareness: 0.5,
    affect: 0.0,
    agency: 0.9,
    time: 0.0,
    relationality: 0.0,
    posture: 1.0
  },
  'sacred-keeper': {
    awareness: 0.9,
    affect: 0.8,
    agency: 0.5,
    time: -1.0,
    relationality: 1.0,
    posture: 0.0
  },
  'everyday-hustler': {
    awareness: 0.5,
    affect: 0.0,
    agency: 0.9,
    time: 0.0,
    relationality: 0.0,
    posture: 1.0
  },
  'already-collapsed': {
    awareness: 0.9,
    affect: -0.7,
    agency: 0.2,
    time: 0.0,
    relationality: 0.0,
    posture: 0.0
  },
  'extracted': {
    awareness: 0.2,
    affect: 0.0,
    agency: 0.2,
    time: 0.0,
    relationality: 0.0,
    posture: 0.0
  },
  'child-witness': {
    awareness: 0.2,
    affect: 0.0,
    agency: 0.2,
    time: 0.0,
    relationality: 0.0,
    posture: 0.0
  },
  'opportunist-elite': {
    awareness: 0.9,
    affect: 0.0,
    agency: 0.9,
    time: 1.0,
    relationality: 0.0,
    posture: 1.0
  },
  'conspiracy-theorist': {
    awareness: 0.5,
    affect: -0.7,
    agency: 0.5,
    time: 0.0,
    relationality: 0.0,
    posture: 0.0
  }
};

// Pre-computed trait profile norms for optimization
const TRAIT_PROFILE_NORMS = {};
for (const [archetypeId, profile] of Object.entries(ARCHETYPE_TRAIT_PROFILES)) {
  TRAIT_PROFILE_NORMS[archetypeId] = calculateVectorNorm(Object.values(profile));
}

// ============================================================================
// CORE SCORING FUNCTIONS
// ============================================================================

/**
 * Calculates total scores for all archetypes based on user responses.
 *
 * Algorithm:
 * 1. Initialize all archetype scores to 0
 * 2. For each user response:
 *    - Retrieve the selected answer
 *    - Add weighted points to corresponding archetypes
 * 3. Return aggregated score object
 *
 * Mathematical formula:
 * S(A) = Σ(i=1 to n) w_i × p_i(A)
 *
 * Where:
 * - S(A) = Total score for archetype A
 * - w_i = Weight of question i
 * - p_i(A) = Points awarded to archetype A from answer i
 * - n = Number of questions
 *
 * @param {Array<Object>} questions - Array of question objects
 * @param {Array<Object>} userResponses - Array of user response objects
 * @returns {Object} Archetype scores object {archetypeId: score}
 *
 * @example
 * const scores = calculateArchetypeScores(questions, [
 *   {questionId: 1, answerId: 'a'},
 *   {questionId: 2, answerId: 'b'}
 * ]);
 * // Returns: {ostrich: 3, prepper: 5, ...}
 */
function calculateArchetypeScores(questions, userResponses) {
  // Initialize scores for all known archetypes
  const scores = {};
  Object.keys(ARCHETYPE_TRAIT_PROFILES).forEach(archetypeId => {
    scores[archetypeId] = 0;
  });

  // Build question lookup map for O(1) access
  const questionMap = {};
  questions.forEach(q => {
    questionMap[q.id] = q;
  });

  // Aggregate scores from user responses
  userResponses.forEach(response => {
    const question = questionMap[response.questionId];

    if (!question) {
      console.warn(`Question ${response.questionId} not found`);
      return;
    }

    // Find the selected answer
    const selectedAnswer = question.answers.find(a => a.id === response.answerId);

    if (!selectedAnswer) {
      console.warn(`Answer ${response.answerId} not found for question ${response.questionId}`);
      return;
    }

    // Get question weight (default to 1.0 if not specified)
    const weight = question.weight !== undefined ? question.weight : 1.0;

    // Add weighted points to archetype scores
    if (selectedAnswer.archetypeScores) {
      Object.entries(selectedAnswer.archetypeScores).forEach(([archetypeId, points]) => {
        if (scores[archetypeId] !== undefined) {
          scores[archetypeId] += weight * points;
        } else {
          // Handle dynamic archetypes not in profile
          scores[archetypeId] = weight * points;
        }
      });
    }
  });

  return scores;
}

/**
 * Determines the dominant archetype(s) from calculated scores.
 * Handles ties gracefully by identifying all archetypes within tie tolerance.
 *
 * Algorithm:
 * 1. Find maximum score S_max
 * 2. Calculate tie threshold τ = S_max × (1 - ε)
 * 3. Collect all archetypes with S(A) ≥ τ
 * 4. Sort by score descending, then alphabetically by ID
 *
 * @param {Object} scores - Archetype scores object from calculateArchetypeScores
 * @param {number} tieTolerance - Epsilon value for tie detection (default: 0.05)
 * @returns {Object} Result object with dominant archetypes and metadata
 *
 * @example
 * const result = determineDominantArchetypes({
 *   ostrich: 2,
 *   prepper: 10,
 *   apocaloptimist: 9.8
 * });
 * // Returns: {
 * //   dominant: ['prepper', 'apocaloptimist'],
 * //   scores: {prepper: 10, apocaloptimist: 9.8},
 * //   maxScore: 10,
 * //   threshold: 9.5,
 * //   hasTie: true
 * // }
 */
function determineDominantArchetypes(scores, tieTolerance = TIE_TOLERANCE) {
  // Validate input
  if (!scores || Object.keys(scores).length === 0) {
    throw new Error('No archetype scores provided');
  }

  // Find maximum score
  const scoreEntries = Object.entries(scores);
  const maxScore = Math.max(...scoreEntries.map(([_, score]) => score));

  // Check for zero variance (all scores equal or all zero)
  const minScore = Math.min(...scoreEntries.map(([_, score]) => score));
  const variance = maxScore - minScore;

  if (variance < MINIMUM_VARIANCE && maxScore === 0) {
    throw new Error('No valid scores recorded - all archetypes have zero points');
  }

  // Calculate tie threshold
  const threshold = maxScore * (1 - tieTolerance);

  // Collect all archetypes meeting or exceeding threshold
  const dominantEntries = scoreEntries.filter(([_, score]) => score >= threshold);

  // Sort by score descending, then alphabetically for deterministic ties
  dominantEntries.sort((a, b) => {
    const scoreDiff = b[1] - a[1];
    if (Math.abs(scoreDiff) < 0.0001) { // Floating point comparison
      return a[0].localeCompare(b[0]);
    }
    return scoreDiff;
  });

  const dominantArchetypeIds = dominantEntries.map(([id, _]) => id);
  const dominantScores = {};
  dominantEntries.forEach(([id, score]) => {
    dominantScores[id] = score;
  });

  return {
    dominant: dominantArchetypeIds,
    scores: dominantScores,
    maxScore: maxScore,
    threshold: threshold,
    hasTie: dominantArchetypeIds.length > 1,
    variance: variance
  };
}

/**
 * Calculates a confidence score indicating certainty of the dominant archetype match.
 *
 * Formula:
 * confidence = (S_max - S_second) / S_max
 *
 * Interpretation:
 * - confidence ≥ 0.5: Strong match (>50% separation from second place)
 * - 0.2 ≤ confidence < 0.5: Moderate match
 * - confidence < 0.2: Weak match (consider multiple archetypes)
 *
 * @param {Object} scores - Archetype scores object
 * @returns {Object} Confidence metrics
 *
 * @example
 * const confidence = calculateConfidence({ostrich: 2, prepper: 10, trickster: 5});
 * // Returns: {
 * //   score: 0.5,
 * //   level: 'STRONG',
 * //   firstPlace: 'prepper',
 * //   secondPlace: 'trickster'
 * // }
 */
function calculateConfidence(scores) {
  const sortedEntries = Object.entries(scores)
    .filter(([_, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]);

  if (sortedEntries.length === 0) {
    return {
      score: 0,
      level: 'NONE',
      firstPlace: null,
      secondPlace: null
    };
  }

  if (sortedEntries.length === 1) {
    return {
      score: 1.0,
      level: 'PERFECT',
      firstPlace: sortedEntries[0][0],
      secondPlace: null
    };
  }

  const [firstPlace, firstScore] = sortedEntries[0];
  const [secondPlace, secondScore] = sortedEntries[1];

  const confidenceScore = (firstScore - secondScore) / firstScore;

  let level;
  if (confidenceScore >= CONFIDENCE_THRESHOLDS.STRONG) {
    level = 'STRONG';
  } else if (confidenceScore >= CONFIDENCE_THRESHOLDS.MODERATE) {
    level = 'MODERATE';
  } else {
    level = 'WEAK';
  }

  return {
    score: confidenceScore,
    level: level,
    firstPlace: firstPlace,
    secondPlace: secondPlace
  };
}

/**
 * Normalizes archetype scores to average points per weighted question.
 * Enables fair comparison across quizzes of different lengths.
 *
 * Formula:
 * S_norm(A) = S(A) / Σ(i=1 to n) w_i
 *
 * @param {Object} scores - Archetype scores object
 * @param {Array<Object>} questions - Array of question objects
 * @returns {Object} Normalized scores object
 */
function normalizeScores(scores, questions) {
  // Calculate total weight
  const totalWeight = questions.reduce((sum, q) => {
    return sum + (q.weight !== undefined ? q.weight : 1.0);
  }, 0);

  if (totalWeight === 0) {
    throw new Error('Total question weight is zero');
  }

  // Normalize each score
  const normalizedScores = {};
  Object.entries(scores).forEach(([archetypeId, score]) => {
    normalizedScores[archetypeId] = score / totalWeight;
  });

  return normalizedScores;
}

// ============================================================================
// TRAIT-BASED DIFFERENTIATION
// ============================================================================

/**
 * Calculates Euclidean norm (magnitude) of a vector.
 *
 * Formula:
 * ||v|| = sqrt(v₁² + v₂² + ... + vₙ²)
 *
 * @param {Array<number>} vector - Numeric array
 * @returns {number} Vector norm
 */
function calculateVectorNorm(vector) {
  const sumOfSquares = vector.reduce((sum, val) => sum + val * val, 0);
  return Math.sqrt(sumOfSquares);
}

/**
 * Calculates cosine similarity between two vectors.
 * Measures alignment in multi-dimensional trait space.
 *
 * Formula:
 * similarity(U, A) = (U · A) / (||U|| × ||A||)
 *
 * Returns value in [-1, 1]:
 * - 1.0: Perfect alignment
 * - 0.0: Orthogonal (no relationship)
 * - -1.0: Perfect opposition
 *
 * @param {Array<number>} vector1 - First vector
 * @param {Array<number>} vector2 - Second vector
 * @returns {number} Cosine similarity
 */
function calculateCosineSimilarity(vector1, vector2) {
  if (vector1.length !== vector2.length) {
    throw new Error('Vectors must have same dimensionality');
  }

  // Calculate dot product
  const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);

  // Calculate norms
  const norm1 = calculateVectorNorm(vector1);
  const norm2 = calculateVectorNorm(vector2);

  // Handle zero vectors
  if (norm1 === 0 || norm2 === 0) {
    return 0;
  }

  return dotProduct / (norm1 * norm2);
}

/**
 * Breaks ties between dominant archetypes using trait-based similarity.
 * Compares user's inferred trait profile against archetype trait profiles.
 *
 * Algorithm:
 * 1. Infer user's trait vector from their archetype scores
 * 2. Calculate cosine similarity with each tied archetype's trait profile
 * 3. Return archetype with highest similarity
 *
 * @param {Array<string>} tiedArchetypeIds - Array of tied archetype IDs
 * @param {Object} allScores - Complete archetype scores object
 * @returns {string} Single best-matching archetype ID
 */
function breakTieWithTraits(tiedArchetypeIds, allScores) {
  // Infer user's trait vector from weighted average of their scores
  const userTraitVector = inferUserTraitVector(allScores);

  // Calculate similarity with each tied archetype
  const similarities = tiedArchetypeIds.map(archetypeId => {
    const archetypeProfile = ARCHETYPE_TRAIT_PROFILES[archetypeId];
    if (!archetypeProfile) {
      console.warn(`No trait profile for archetype: ${archetypeId}`);
      return { archetypeId, similarity: 0 };
    }

    const archetypeVector = [
      archetypeProfile.awareness,
      archetypeProfile.affect,
      archetypeProfile.agency,
      archetypeProfile.time,
      archetypeProfile.relationality,
      archetypeProfile.posture
    ];

    const similarity = calculateCosineSimilarity(userTraitVector, archetypeVector);

    return { archetypeId, similarity };
  });

  // Sort by similarity descending, then alphabetically
  similarities.sort((a, b) => {
    const simDiff = b.similarity - a.similarity;
    if (Math.abs(simDiff) < 0.0001) {
      return a.archetypeId.localeCompare(b.archetypeId);
    }
    return simDiff;
  });

  return similarities[0].archetypeId;
}

/**
 * Infers user's six-dimensional trait vector from archetype scores.
 * Uses weighted average of archetype trait profiles.
 *
 * Formula:
 * U_dimension = Σ(A) S(A) × A_dimension / Σ(A) S(A)
 *
 * @param {Object} scores - Archetype scores object
 * @returns {Array<number>} Six-dimensional trait vector [A, Af, Ag, T, R, P]
 */
function inferUserTraitVector(scores) {
  const traits = {
    awareness: 0,
    affect: 0,
    agency: 0,
    time: 0,
    relationality: 0,
    posture: 0
  };

  let totalScore = 0;

  // Weighted sum of trait values
  Object.entries(scores).forEach(([archetypeId, score]) => {
    if (score <= 0) return;

    const profile = ARCHETYPE_TRAIT_PROFILES[archetypeId];
    if (!profile) return;

    totalScore += score;
    traits.awareness += score * profile.awareness;
    traits.affect += score * profile.affect;
    traits.agency += score * profile.agency;
    traits.time += score * profile.time;
    traits.relationality += score * profile.relationality;
    traits.posture += score * profile.posture;
  });

  // Normalize by total score
  if (totalScore > 0) {
    Object.keys(traits).forEach(key => {
      traits[key] /= totalScore;
    });
  }

  return [
    traits.awareness,
    traits.affect,
    traits.agency,
    traits.time,
    traits.relationality,
    traits.posture
  ];
}

// ============================================================================
// VISUALIZATION SUPPORT
// ============================================================================

/**
 * Transforms trait profile to radar chart polar coordinates.
 * Converts 6-dimensional profile into x, y coordinates for each axis.
 *
 * Calculation:
 * For dimension d ∈ {0, 1, 2, 3, 4, 5}:
 *   θ_d = d × (2π / 6)  // Angle in radians
 *   r_d = trait_value_d  // Radius (normalized 0-1)
 *   x_d = r_d × cos(θ_d)
 *   y_d = r_d × sin(θ_d)
 *
 * @param {Object} traitProfile - Trait profile object with 6 dimensions
 * @returns {Array<Object>} Array of {dimension, angle, radius, x, y} objects
 */
function calculateRadarChartCoordinates(traitProfile) {
  const dimensions = [
    'awareness',
    'affect',
    'agency',
    'time',
    'relationality',
    'posture'
  ];

  const coordinates = dimensions.map((dimension, index) => {
    // Normalize affect to [0, 1] range for visualization (from [-1, 1])
    let value = traitProfile[dimension];
    if (dimension === 'affect' || dimension === 'time') {
      value = (value + 1) / 2; // Map [-1, 1] to [0, 1]
    }

    const angleRadians = (index / 6) * 2 * Math.PI;
    const radius = value;

    const x = radius * Math.cos(angleRadians);
    const y = radius * Math.sin(angleRadians);

    return {
      dimension: dimension,
      angle: angleRadians,
      angleDegrees: (angleRadians * 180) / Math.PI,
      radius: radius,
      rawValue: traitProfile[dimension],
      x: x,
      y: y
    };
  });

  return coordinates;
}

/**
 * Calculates the area of a radar chart polygon.
 * Uses the shoelace formula for polygon area.
 *
 * Formula:
 * Area = (1/2) × |Σ(i=0 to n-1) (x_i × y_{i+1} - x_{i+1} × y_i)|
 *
 * @param {Array<Object>} coordinates - Output from calculateRadarChartCoordinates
 * @returns {number} Polygon area
 */
function calculateRadarChartArea(coordinates) {
  let area = 0;
  const n = coordinates.length;

  for (let i = 0; i < n; i++) {
    const current = coordinates[i];
    const next = coordinates[(i + 1) % n]; // Wrap around to first

    area += current.x * next.y - next.x * current.y;
  }

  return Math.abs(area) / 2;
}

/**
 * Calculates percentage distribution of scores for bar chart visualization.
 *
 * @param {Object} scores - Archetype scores object
 * @returns {Array<Object>} Array of {archetypeId, score, percentage} sorted by score
 */
function calculateScoreDistribution(scores) {
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

  if (totalScore === 0) {
    return Object.keys(scores).map(id => ({
      archetypeId: id,
      score: 0,
      percentage: 0
    }));
  }

  const distribution = Object.entries(scores).map(([archetypeId, score]) => ({
    archetypeId: archetypeId,
    score: score,
    percentage: (score / totalScore) * 100
  }));

  // Sort by score descending
  distribution.sort((a, b) => b.score - a.score);

  return distribution;
}

// ============================================================================
// HIGH-LEVEL API
// ============================================================================

/**
 * Complete scoring pipeline for the Collapse Archetype Quiz.
 * Orchestrates all scoring, determination, and analysis functions.
 *
 * @param {Array<Object>} questions - Quiz questions with answers
 * @param {Array<Object>} userResponses - User's selected answers
 * @param {Object} options - Configuration options
 * @returns {Object} Complete scoring result with dominant archetype(s) and metadata
 *
 * @example
 * const result = scoreQuiz(questions, userResponses, {
 *   tieTolerance: 0.05,
 *   breakTiesWithTraits: true
 * });
 *
 * console.log(result.primary); // Main archetype ID
 * console.log(result.dominantArchetypes); // All tied archetypes
 * console.log(result.confidence); // Confidence metrics
 * console.log(result.traitProfile); // User's inferred trait vector
 * console.log(result.radarChart); // Visualization data
 */
function scoreQuiz(questions, userResponses, options = {}) {
  const {
    tieTolerance = TIE_TOLERANCE,
    breakTiesWithTraits = true,
    includeVisualizations = true
  } = options;

  // Step 1: Calculate raw archetype scores
  const scores = calculateArchetypeScores(questions, userResponses);

  // Step 2: Determine dominant archetype(s)
  const dominantResult = determineDominantArchetypes(scores, tieTolerance);

  // Step 3: Calculate confidence
  const confidence = calculateConfidence(scores);

  // Step 4: Handle ties if necessary
  let primaryArchetype = dominantResult.dominant[0];
  if (dominantResult.hasTie && breakTiesWithTraits) {
    primaryArchetype = breakTieWithTraits(dominantResult.dominant, scores);
  }

  // Step 5: Calculate normalized scores
  const normalizedScores = normalizeScores(scores, questions);

  // Step 6: Infer user trait profile
  const userTraitVector = inferUserTraitVector(scores);
  const userTraitProfile = {
    awareness: userTraitVector[0],
    affect: userTraitVector[1],
    agency: userTraitVector[2],
    time: userTraitVector[3],
    relationality: userTraitVector[4],
    posture: userTraitVector[5]
  };

  // Step 7: Generate visualizations if requested
  let visualizations = null;
  if (includeVisualizations) {
    const radarCoordinates = calculateRadarChartCoordinates(userTraitProfile);
    visualizations = {
      radarChart: {
        coordinates: radarCoordinates,
        area: calculateRadarChartArea(radarCoordinates)
      },
      scoreDistribution: calculateScoreDistribution(scores),
      primaryArchetypeRadar: {
        coordinates: calculateRadarChartCoordinates(
          ARCHETYPE_TRAIT_PROFILES[primaryArchetype]
        )
      }
    };
  }

  // Step 8: Assemble complete result
  return {
    // Primary result
    primary: primaryArchetype,
    primaryScore: scores[primaryArchetype],

    // All dominant archetypes (for displaying multiple matches)
    dominantArchetypes: dominantResult.dominant,
    dominantScores: dominantResult.scores,
    hasTie: dominantResult.hasTie,
    tieThreshold: dominantResult.threshold,

    // Complete scoring data
    allScores: scores,
    normalizedScores: normalizedScores,
    maxScore: dominantResult.maxScore,
    variance: dominantResult.variance,

    // Confidence metrics
    confidence: confidence,

    // Trait analysis
    userTraitProfile: userTraitProfile,
    userTraitVector: userTraitVector,

    // Visualizations
    visualizations: visualizations,

    // Metadata
    questionsAnswered: userResponses.length,
    totalQuestions: questions.length,
    isComplete: userResponses.length === questions.length
  };
}

// ============================================================================
// VALIDATION AND ERROR HANDLING
// ============================================================================

/**
 * Validates quiz data structure before scoring.
 *
 * @param {Array<Object>} questions - Questions to validate
 * @returns {Object} Validation result {valid: boolean, errors: Array<string>}
 */
function validateQuizData(questions) {
  const errors = [];

  if (!Array.isArray(questions)) {
    errors.push('Questions must be an array');
    return { valid: false, errors };
  }

  if (questions.length === 0) {
    errors.push('Quiz must have at least one question');
  }

  questions.forEach((q, index) => {
    if (!q.id) {
      errors.push(`Question at index ${index} missing id`);
    }
    if (!q.text) {
      errors.push(`Question ${q.id || index} missing text`);
    }
    if (!Array.isArray(q.answers) || q.answers.length === 0) {
      errors.push(`Question ${q.id || index} must have at least one answer`);
    }

    if (q.answers) {
      q.answers.forEach((a, aIndex) => {
        if (!a.id) {
          errors.push(`Answer at index ${aIndex} for question ${q.id || index} missing id`);
        }
        if (!a.archetypeScores || typeof a.archetypeScores !== 'object') {
          errors.push(`Answer ${a.id || aIndex} for question ${q.id || index} missing archetypeScores`);
        }
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates user responses against quiz questions.
 *
 * @param {Array<Object>} questions - Quiz questions
 * @param {Array<Object>} userResponses - User responses to validate
 * @returns {Object} Validation result {valid: boolean, errors: Array<string>}
 */
function validateUserResponses(questions, userResponses) {
  const errors = [];

  if (!Array.isArray(userResponses)) {
    errors.push('User responses must be an array');
    return { valid: false, errors };
  }

  const questionMap = {};
  questions.forEach(q => {
    questionMap[q.id] = q;
  });

  userResponses.forEach((response, index) => {
    if (!response.questionId) {
      errors.push(`Response at index ${index} missing questionId`);
      return;
    }
    if (!response.answerId) {
      errors.push(`Response at index ${index} missing answerId`);
      return;
    }

    const question = questionMap[response.questionId];
    if (!question) {
      errors.push(`Response references unknown question: ${response.questionId}`);
      return;
    }

    const answer = question.answers.find(a => a.id === response.answerId);
    if (!answer) {
      errors.push(`Response references unknown answer: ${response.answerId} for question ${response.questionId}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

// Export all functions for modular usage (ES6 modules)
export {
  // Core scoring
  calculateArchetypeScores,
  determineDominantArchetypes,
  calculateConfidence,
  normalizeScores,

  // Trait analysis
  inferUserTraitVector,
  calculateCosineSimilarity,
  calculateVectorNorm,
  breakTieWithTraits,

  // Visualizations
  calculateRadarChartCoordinates,
  calculateRadarChartArea,
  calculateScoreDistribution,

  // High-level API
  scoreQuiz,

  // Validation
  validateQuizData,
  validateUserResponses,

  // Constants and data
  ARCHETYPE_TRAIT_PROFILES,
  TRAIT_PROFILE_NORMS,
  TIE_TOLERANCE,
  MINIMUM_VARIANCE,
  CONFIDENCE_THRESHOLDS
};
