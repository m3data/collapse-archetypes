/**
 * COLLAPSE ARCHETYPE QUIZ - SCORING ENGINE TESTS
 *
 * Comprehensive test suite verifying mathematical accuracy and edge case handling.
 * Tests cover all core functionality including scoring, tie-breaking, trait analysis,
 * and visualization calculations.
 *
 * Run with: node scoring-engine.test.js
 */

const {
  calculateArchetypeScores,
  determineDominantArchetypes,
  calculateConfidence,
  normalizeScores,
  inferUserTraitVector,
  calculateCosineSimilarity,
  calculateVectorNorm,
  breakTieWithTraits,
  calculateRadarChartCoordinates,
  calculateRadarChartArea,
  calculateScoreDistribution,
  scoreQuiz,
  validateQuizData,
  validateUserResponses,
  ARCHETYPE_TRAIT_PROFILES
} = require('./scoring-engine.js');

// ============================================================================
// TEST UTILITIES
// ============================================================================

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    testsFailed++;
    return false;
  } else {
    console.log(`✓ PASSED: ${message}`);
    testsPassed++;
    return true;
  }
}

function assertAlmostEqual(actual, expected, tolerance, message) {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    console.error(`❌ FAILED: ${message}`);
    console.error(`   Expected: ${expected}, Got: ${actual}, Diff: ${diff}`);
    testsFailed++;
    return false;
  } else {
    console.log(`✓ PASSED: ${message}`);
    testsPassed++;
    return true;
  }
}

function assertArrayAlmostEqual(actual, expected, tolerance, message) {
  if (actual.length !== expected.length) {
    console.error(`❌ FAILED: ${message} - Array lengths differ`);
    testsFailed++;
    return false;
  }
  for (let i = 0; i < actual.length; i++) {
    if (Math.abs(actual[i] - expected[i]) > tolerance) {
      console.error(`❌ FAILED: ${message}`);
      console.error(`   At index ${i}: Expected ${expected[i]}, Got ${actual[i]}`);
      testsFailed++;
      return false;
    }
  }
  console.log(`✓ PASSED: ${message}`);
  testsPassed++;
  return true;
}

function printTestSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total tests: ${testsPassed + testsFailed}`);
  console.log(`Passed: ${testsPassed}`);
  console.log(`Failed: ${testsFailed}`);
  console.log('='.repeat(60));

  if (testsFailed === 0) {
    console.log('✓ ALL TESTS PASSED');
  } else {
    console.log(`❌ ${testsFailed} TESTS FAILED`);
  }
}

// ============================================================================
// TEST DATA
// ============================================================================

const mockQuestions = [
  {
    id: 1,
    text: 'How do you view collapse?',
    weight: 1.0,
    answers: [
      { id: 'a', text: 'What collapse?', archetypeScores: { ostrich: 3 } },
      { id: 'b', text: 'It is serious', archetypeScores: { prepper: 2, 'prophet-of-doom': 2 } },
      { id: 'c', text: 'Opportunity', archetypeScores: { apocaloptimist: 3 } }
    ]
  },
  {
    id: 2,
    text: 'What is your response?',
    weight: 1.5,
    answers: [
      { id: 'a', text: 'Prepare', archetypeScores: { prepper: 2 } },
      { id: 'b', text: 'Warn others', archetypeScores: { 'prophet-of-doom': 2 } },
      { id: 'c', text: 'Stay calm', archetypeScores: { 'blissed-out-yogi': 2 } }
    ]
  },
  {
    id: 3,
    text: 'Who do you trust?',
    weight: 1.0,
    answers: [
      { id: 'a', text: 'Myself', archetypeScores: { prepper: 1, ostrich: 1 } },
      { id: 'b', text: 'Community', archetypeScores: { 'sacred-keeper': 2 } },
      { id: 'c', text: 'No one', archetypeScores: { 'conspiracy-theorist': 3 } }
    ]
  }
];

// ============================================================================
// CORE SCORING TESTS
// ============================================================================

function testCalculateArchetypeScores() {
  console.log('\n--- Testing calculateArchetypeScores ---');

  // Test 1: Perfect single archetype match
  const responses1 = [
    { questionId: 1, answerId: 'a' },
    { questionId: 2, answerId: 'a' },
    { questionId: 3, answerId: 'a' }
  ];
  const scores1 = calculateArchetypeScores(mockQuestions, responses1);
  // Q1a: ostrich gets 3 points
  // Q2a: prepper gets 2 points, weighted by 1.5 = 3 points
  // Q3a: prepper gets 1 point, ostrich gets 1 point
  assert(scores1.ostrich === 4, 'Ostrich should have 4 points (3 + 0 + 1)');
  assert(scores1.prepper === 4, 'Prepper should have 4 points (0 + 3 + 1)');

  // Test 2: Weighted question scoring
  const responses2 = [
    { questionId: 2, answerId: 'a' } // Weight 1.5, gives prepper 2 points
  ];
  const scores2 = calculateArchetypeScores(mockQuestions, responses2);
  assertAlmostEqual(scores2.prepper, 3.0, 0.01, 'Weighted score should be 1.5 × 2 = 3.0');

  // Test 3: Multiple archetypes from single answer
  const responses3 = [
    { questionId: 1, answerId: 'b' } // Gives both prepper and prophet-of-doom 2 points
  ];
  const scores3 = calculateArchetypeScores(mockQuestions, responses3);
  assert(scores3.prepper === 2, 'Prepper should get 2 points');
  assert(scores3['prophet-of-doom'] === 2, 'Prophet-of-doom should get 2 points');

  // Test 4: Empty responses
  const scores4 = calculateArchetypeScores(mockQuestions, []);
  assert(scores4.prepper === 0, 'Empty responses should yield zero scores');
}

function testDetermineDominantArchetypes() {
  console.log('\n--- Testing determineDominantArchetypes ---');

  // Test 1: Clear winner
  const scores1 = { ostrich: 2, prepper: 10, apocaloptimist: 3 };
  const result1 = determineDominantArchetypes(scores1, 0.05);
  assert(result1.dominant.length === 1, 'Should have one dominant archetype');
  assert(result1.dominant[0] === 'prepper', 'Prepper should be dominant');
  assert(result1.hasTie === false, 'Should not be a tie');

  // Test 2: Exact tie
  const scores2 = { ostrich: 5, prepper: 5, apocaloptimist: 2 };
  const result2 = determineDominantArchetypes(scores2, 0.05);
  assert(result2.dominant.length === 2, 'Should have two dominant archetypes');
  assert(result2.hasTie === true, 'Should be a tie');
  assert(result2.dominant.includes('ostrich'), 'Should include ostrich');
  assert(result2.dominant.includes('prepper'), 'Should include prepper');

  // Test 3: Near tie within tolerance
  const scores3 = { ostrich: 10, prepper: 9.6, apocaloptimist: 8 };
  const result3 = determineDominantArchetypes(scores3, 0.05);
  // Threshold = 10 × 0.95 = 9.5
  assert(result3.dominant.includes('prepper'), 'Prepper at 9.6 should be included (threshold 9.5)');
  assert(result3.dominant.length === 2, 'Should include both ostrich and prepper');

  // Test 4: Alphabetical sorting for exact ties
  const scores4 = { zebra: 5, aardvark: 5, monkey: 5 };
  const result4 = determineDominantArchetypes(scores4, 0.05);
  assert(result4.dominant[0] === 'aardvark', 'Should sort alphabetically when scores are equal');

  // Test 5: Single archetype with points
  const scores5 = { prepper: 10 };
  const result5 = determineDominantArchetypes(scores5, 0.05);
  assert(result5.dominant.length === 1, 'Should handle single archetype');
  assert(result5.dominant[0] === 'prepper', 'Should return the single archetype');
}

function testCalculateConfidence() {
  console.log('\n--- Testing calculateConfidence ---');

  // Test 1: Strong confidence
  const scores1 = { ostrich: 2, prepper: 10, apocaloptimist: 4 };
  const conf1 = calculateConfidence(scores1);
  assertAlmostEqual(conf1.score, 0.6, 0.01, 'Confidence should be (10-4)/10 = 0.6');
  assert(conf1.level === 'STRONG', 'Should be STRONG confidence (≥0.5)');
  assert(conf1.firstPlace === 'prepper', 'First place should be prepper');
  assert(conf1.secondPlace === 'apocaloptimist', 'Second place should be apocaloptimist');

  // Test 2: Moderate confidence
  const scores2 = { ostrich: 2, prepper: 10, apocaloptimist: 7 };
  const conf2 = calculateConfidence(scores2);
  assertAlmostEqual(conf2.score, 0.3, 0.01, 'Confidence should be (10-7)/10 = 0.3');
  assert(conf2.level === 'MODERATE', 'Should be MODERATE confidence (≥0.2, <0.5)');

  // Test 3: Weak confidence
  const scores3 = { ostrich: 2, prepper: 10, apocaloptimist: 9 };
  const conf3 = calculateConfidence(scores3);
  assertAlmostEqual(conf3.score, 0.1, 0.01, 'Confidence should be (10-9)/10 = 0.1');
  assert(conf3.level === 'WEAK', 'Should be WEAK confidence (<0.2)');

  // Test 4: Perfect confidence (only one archetype with points)
  const scores4 = { prepper: 10, ostrich: 0, apocaloptimist: 0 };
  const conf4 = calculateConfidence(scores4);
  assert(conf4.score === 1.0, 'Perfect confidence should be 1.0');
  assert(conf4.level === 'PERFECT', 'Should be PERFECT confidence');
  assert(conf4.secondPlace === null, 'No second place');
}

function testNormalizeScores() {
  console.log('\n--- Testing normalizeScores ---');

  const scores = { ostrich: 6, prepper: 9, apocaloptimist: 3 };

  // Total weight = 1.0 + 1.5 + 1.0 = 3.5
  const normalized = normalizeScores(scores, mockQuestions);

  assertAlmostEqual(normalized.ostrich, 6 / 3.5, 0.01, 'Normalized ostrich score should be 6/3.5');
  assertAlmostEqual(normalized.prepper, 9 / 3.5, 0.01, 'Normalized prepper score should be 9/3.5');
  assertAlmostEqual(normalized.apocaloptimist, 3 / 3.5, 0.01, 'Normalized apocaloptimist score should be 3/3.5');
}

// ============================================================================
// TRAIT-BASED ANALYSIS TESTS
// ============================================================================

function testCalculateVectorNorm() {
  console.log('\n--- Testing calculateVectorNorm ---');

  const vector1 = [3, 4];
  const norm1 = calculateVectorNorm(vector1);
  assertAlmostEqual(norm1, 5.0, 0.01, 'Norm of [3,4] should be 5.0');

  const vector2 = [1, 0, 0];
  const norm2 = calculateVectorNorm(vector2);
  assertAlmostEqual(norm2, 1.0, 0.01, 'Norm of [1,0,0] should be 1.0');

  const vector3 = [0, 0, 0];
  const norm3 = calculateVectorNorm(vector3);
  assertAlmostEqual(norm3, 0.0, 0.01, 'Norm of zero vector should be 0.0');
}

function testCalculateCosineSimilarity() {
  console.log('\n--- Testing calculateCosineSimilarity ---');

  // Test 1: Identical vectors (perfect alignment)
  const v1 = [1, 2, 3];
  const sim1 = calculateCosineSimilarity(v1, v1);
  assertAlmostEqual(sim1, 1.0, 0.01, 'Identical vectors should have similarity 1.0');

  // Test 2: Orthogonal vectors
  const v2 = [1, 0, 0];
  const v3 = [0, 1, 0];
  const sim2 = calculateCosineSimilarity(v2, v3);
  assertAlmostEqual(sim2, 0.0, 0.01, 'Orthogonal vectors should have similarity 0.0');

  // Test 3: Opposite vectors
  const v4 = [1, 2, 3];
  const v5 = [-1, -2, -3];
  const sim3 = calculateCosineSimilarity(v4, v5);
  assertAlmostEqual(sim3, -1.0, 0.01, 'Opposite vectors should have similarity -1.0');

  // Test 4: Known angle (45 degrees)
  const v6 = [1, 0];
  const v7 = [1, 1];
  const sim4 = calculateCosineSimilarity(v6, v7);
  assertAlmostEqual(sim4, Math.cos(Math.PI / 4), 0.01, '45-degree angle should match cos(π/4)');
}

function testInferUserTraitVector() {
  console.log('\n--- Testing inferUserTraitVector ---');

  // Test 1: Pure prepper (high awareness, neutral affect, high agency, future, individual, active)
  const scores1 = { prepper: 10 };
  const traits1 = inferUserTraitVector(scores1);
  assertAlmostEqual(traits1[0], 0.9, 0.01, 'Pure prepper should have high awareness (0.9)');
  assertAlmostEqual(traits1[1], 0.0, 0.01, 'Pure prepper should have neutral affect (0.0)');
  assertAlmostEqual(traits1[2], 0.9, 0.01, 'Pure prepper should have high agency (0.9)');

  // Test 2: Equal mix of two archetypes
  const scores2 = { ostrich: 5, apocaloptimist: 5 };
  const traits2 = inferUserTraitVector(scores2);
  // Ostrich: [0.2, 0.0, 0.2, 0.0, 0.0, 0.0]
  // Apocaloptimist: [0.9, 0.8, 0.9, 1.0, 0.0, 1.0]
  // Average: [0.55, 0.4, 0.55, 0.5, 0.0, 0.5]
  assertAlmostEqual(traits2[0], 0.55, 0.01, 'Average awareness should be 0.55');
  assertAlmostEqual(traits2[1], 0.4, 0.01, 'Average affect should be 0.4');
  assertAlmostEqual(traits2[2], 0.55, 0.01, 'Average agency should be 0.55');

  // Test 3: Weighted average (different scores)
  const scores3 = { ostrich: 8, apocaloptimist: 2 };
  const traits3 = inferUserTraitVector(scores3);
  // Weighted: (8×0.2 + 2×0.9)/10 = 0.34
  assertAlmostEqual(traits3[0], 0.34, 0.01, 'Weighted awareness should be 0.34');
}

function testBreakTieWithTraits() {
  console.log('\n--- Testing breakTieWithTraits ---');

  // Create a scenario where two archetypes are tied
  // User has high awareness and high agency - should match better with prepper than ostrich
  const scores = {
    ostrich: 5,
    prepper: 5,
    apocaloptimist: 10 // Add this to influence the inferred trait vector
  };

  const tied = ['ostrich', 'prepper'];
  const winner = breakTieWithTraits(tied, scores);

  // The inferred vector will be influenced by apocaloptimist (high awareness, agency)
  // Prepper has high awareness and agency, ostrich has low - so prepper should win
  assert(winner === 'prepper', 'Prepper should win tie break based on trait similarity');
}

// ============================================================================
// VISUALIZATION TESTS
// ============================================================================

function testCalculateRadarChartCoordinates() {
  console.log('\n--- Testing calculateRadarChartCoordinates ---');

  const prepperProfile = ARCHETYPE_TRAIT_PROFILES.prepper;
  const coords = calculateRadarChartCoordinates(prepperProfile);

  assert(coords.length === 6, 'Should have 6 coordinate points');

  // Check first coordinate (awareness)
  assertAlmostEqual(coords[0].angle, 0, 0.01, 'First axis should be at angle 0');
  assertAlmostEqual(coords[0].radius, 0.9, 0.01, 'Prepper awareness radius should be 0.9');
  assertAlmostEqual(coords[0].x, 0.9, 0.01, 'X coordinate at angle 0 should equal radius');
  assertAlmostEqual(coords[0].y, 0, 0.01, 'Y coordinate at angle 0 should be 0');

  // Check second coordinate (affect) - needs normalization from [-1,1] to [0,1]
  // Prepper affect is 0.0, normalized to 0.5
  assertAlmostEqual(coords[1].angle, Math.PI / 3, 0.01, 'Second axis should be at angle π/3');
  assertAlmostEqual(coords[1].radius, 0.5, 0.01, 'Normalized affect radius should be 0.5');
}

function testCalculateRadarChartArea() {
  console.log('\n--- Testing calculateRadarChartArea ---');

  // Test with a regular hexagon (all dimensions = 1.0)
  const regularHexagon = [
    { x: 1, y: 0 },
    { x: 0.5, y: Math.sqrt(3) / 2 },
    { x: -0.5, y: Math.sqrt(3) / 2 },
    { x: -1, y: 0 },
    { x: -0.5, y: -Math.sqrt(3) / 2 },
    { x: 0.5, y: -Math.sqrt(3) / 2 }
  ];
  const area1 = calculateRadarChartArea(regularHexagon);
  // Area of regular hexagon with radius 1: (3√3)/2 ≈ 2.598
  assertAlmostEqual(area1, 2.598, 0.01, 'Regular hexagon area should be ~2.598');

  // Test with all zeros (collapsed to origin)
  const collapsed = Array(6).fill({ x: 0, y: 0 });
  const area2 = calculateRadarChartArea(collapsed);
  assertAlmostEqual(area2, 0, 0.01, 'Collapsed polygon should have area 0');
}

function testCalculateScoreDistribution() {
  console.log('\n--- Testing calculateScoreDistribution ---');

  const scores = {
    ostrich: 2,
    prepper: 10,
    apocaloptimist: 3,
    trickster: 0
  };

  const dist = calculateScoreDistribution(scores);

  // Total = 15, so percentages should be: prepper 66.67%, apocaloptimist 20%, ostrich 13.33%, trickster 0%
  assert(dist.length === 4, 'Should have 4 entries');
  assert(dist[0].archetypeId === 'prepper', 'First should be prepper (highest score)');
  assertAlmostEqual(dist[0].percentage, 66.67, 0.01, 'Prepper percentage should be 66.67%');
  assert(dist[3].archetypeId === 'trickster', 'Last should be trickster (lowest score)');
  assertAlmostEqual(dist[3].percentage, 0, 0.01, 'Trickster percentage should be 0%');
}

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

function testScoreQuizIntegration() {
  console.log('\n--- Testing scoreQuiz (Integration) ---');

  const responses = [
    { questionId: 1, answerId: 'b' }, // prepper: 2, prophet-of-doom: 2
    { questionId: 2, answerId: 'a' }, // prepper: 2 × 1.5 = 3
    { questionId: 3, answerId: 'a' }  // prepper: 1, ostrich: 1
  ];

  const result = scoreQuiz(mockQuestions, responses, {
    tieTolerance: 0.05,
    breakTiesWithTraits: true,
    includeVisualizations: true
  });

  // Prepper should have: 2 + 3 + 1 = 6
  // Prophet-of-doom should have: 2
  // Ostrich should have: 1
  assert(result.allScores.prepper === 6, 'Prepper should have total score of 6');
  assert(result.primary === 'prepper', 'Primary archetype should be prepper');
  assert(result.isComplete === true, 'Quiz should be marked as complete');
  assert(result.questionsAnswered === 3, 'Should record 3 questions answered');
  assert(result.confidence !== undefined, 'Should include confidence metrics');
  assert(result.userTraitProfile !== undefined, 'Should include inferred trait profile');
  assert(result.visualizations !== null, 'Should include visualizations');
  assert(result.visualizations.radarChart !== undefined, 'Should include radar chart data');
}

function testEdgeCases() {
  console.log('\n--- Testing Edge Cases ---');

  // Edge Case 1: Single question quiz
  const singleQ = [mockQuestions[0]];
  const singleR = [{ questionId: 1, answerId: 'a' }];
  const result1 = scoreQuiz(singleQ, singleR);
  assert(result1.primary === 'ostrich', 'Single question should work correctly');

  // Edge Case 2: All tied scores
  const tieScores = { a: 5, b: 5, c: 5 };
  const tieResult = determineDominantArchetypes(tieScores, 0.05);
  assert(tieResult.dominant.length === 3, 'All three should be tied');

  // Edge Case 3: Very close scores (within floating point precision)
  const closeScores = { a: 10.0000001, b: 10.0 };
  const closeResult = determineDominantArchetypes(closeScores, 0.05);
  // These should be treated as equal due to threshold
  assert(closeResult.dominant.length === 2, 'Should treat near-identical scores as tied');

  // Edge Case 4: Zero scores with tie tolerance
  const zeroScores = { a: 0, b: 0 };
  try {
    const zeroResult = determineDominantArchetypes(zeroScores, 0.05);
    assert(false, 'Should throw error for all-zero scores');
  } catch (e) {
    assert(true, 'Should throw error for all-zero scores');
  }
}

// ============================================================================
// VALIDATION TESTS
// ============================================================================

function testValidateQuizData() {
  console.log('\n--- Testing validateQuizData ---');

  // Valid data
  const valid1 = validateQuizData(mockQuestions);
  assert(valid1.valid === true, 'Mock questions should be valid');
  assert(valid1.errors.length === 0, 'Should have no errors');

  // Invalid: missing id
  const invalid1 = [{ text: 'Question', answers: [] }];
  const result1 = validateQuizData(invalid1);
  assert(result1.valid === false, 'Should be invalid without id');

  // Invalid: no answers
  const invalid2 = [{ id: 1, text: 'Question', answers: [] }];
  const result2 = validateQuizData(invalid2);
  assert(result2.valid === false, 'Should be invalid with empty answers');

  // Invalid: not an array
  const result3 = validateQuizData('not an array');
  assert(result3.valid === false, 'Should be invalid if not array');
}

function testValidateUserResponses() {
  console.log('\n--- Testing validateUserResponses ---');

  // Valid responses
  const valid1 = validateUserResponses(mockQuestions, [
    { questionId: 1, answerId: 'a' }
  ]);
  assert(valid1.valid === true, 'Valid response should pass');

  // Invalid: unknown question
  const invalid1 = validateUserResponses(mockQuestions, [
    { questionId: 999, answerId: 'a' }
  ]);
  assert(invalid1.valid === false, 'Should fail with unknown question');

  // Invalid: unknown answer
  const invalid2 = validateUserResponses(mockQuestions, [
    { questionId: 1, answerId: 'z' }
  ]);
  assert(invalid2.valid === false, 'Should fail with unknown answer');
}

// ============================================================================
// MATHEMATICAL INVARIANTS VERIFICATION
// ============================================================================

function testMathematicalInvariants() {
  console.log('\n--- Testing Mathematical Invariants ---');

  const responses = [
    { questionId: 1, answerId: 'b' },
    { questionId: 2, answerId: 'a' },
    { questionId: 3, answerId: 'a' }
  ];

  const scores = calculateArchetypeScores(mockQuestions, responses);

  // Invariant 1: Conservation of points
  // Total points awarded = sum of all archetype scores
  const totalScores = Object.values(scores).reduce((sum, s) => sum + s, 0);
  // Q1b: prepper(2) + prophet(2) = 4
  // Q2a: prepper(2×1.5) = 3
  // Q3a: prepper(1) + ostrich(1) = 2
  // Total = 9
  assertAlmostEqual(totalScores, 9, 0.01, 'Total points should be conserved (9)');

  // Invariant 2: Non-negativity
  Object.values(scores).forEach(score => {
    assert(score >= 0, 'All scores should be non-negative');
  });

  // Invariant 3: Dominant set always includes maximum
  const dominant = determineDominantArchetypes(scores);
  const maxScore = Math.max(...Object.values(scores));
  const maxArchetype = Object.entries(scores).find(([_, s]) => s === maxScore)[0];
  assert(dominant.dominant.includes(maxArchetype), 'Dominant set should include max score archetype');

  // Invariant 4: Normalized scores are bounded [0, 1] for equal-weighted questions
  const equalWeightQuestions = mockQuestions.map(q => ({ ...q, weight: 1.0 }));
  const normalized = normalizeScores(scores, equalWeightQuestions);
  Object.values(normalized).forEach(score => {
    assert(score >= 0, 'Normalized scores should be non-negative');
  });

  // Invariant 5: Cosine similarity is bounded [-1, 1]
  const traitVector = inferUserTraitVector(scores);
  const prepperTraits = Object.values(ARCHETYPE_TRAIT_PROFILES.prepper);
  const similarity = calculateCosineSimilarity(traitVector, prepperTraits);
  assert(similarity >= -1 && similarity <= 1, 'Cosine similarity should be in [-1, 1]');
}

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

function testPerformance() {
  console.log('\n--- Testing Performance ---');

  // Create large quiz (100 questions, 5 answers each)
  const largeQuestions = [];
  for (let i = 0; i < 100; i++) {
    largeQuestions.push({
      id: i,
      text: `Question ${i}`,
      weight: 1.0,
      answers: [
        { id: `${i}a`, text: 'A', archetypeScores: { prepper: 1 } },
        { id: `${i}b`, text: 'B', archetypeScores: { ostrich: 1 } },
        { id: `${i}c`, text: 'C', archetypeScores: { apocaloptimist: 1 } },
        { id: `${i}d`, text: 'D', archetypeScores: { trickster: 1 } },
        { id: `${i}e`, text: 'E', archetypeScores: { prepper: 1, ostrich: 1 } }
      ]
    });
  }

  const largeResponses = largeQuestions.map((q, i) => ({
    questionId: q.id,
    answerId: `${i}${['a', 'b', 'c', 'd', 'e'][i % 5]}`
  }));

  const startTime = Date.now();
  const result = scoreQuiz(largeQuestions, largeResponses);
  const endTime = Date.now();
  const duration = endTime - startTime;

  console.log(`  100-question quiz scored in ${duration}ms`);
  assert(duration < 100, 'Should score 100-question quiz in under 100ms');
  assert(result.primary !== undefined, 'Should produce valid result');
}

// ============================================================================
// RUN ALL TESTS
// ============================================================================

function runAllTests() {
  console.log('='.repeat(60));
  console.log('COLLAPSE ARCHETYPE QUIZ - SCORING ENGINE TEST SUITE');
  console.log('='.repeat(60));

  testCalculateArchetypeScores();
  testDetermineDominantArchetypes();
  testCalculateConfidence();
  testNormalizeScores();
  testCalculateVectorNorm();
  testCalculateCosineSimilarity();
  testInferUserTraitVector();
  testBreakTieWithTraits();
  testCalculateRadarChartCoordinates();
  testCalculateRadarChartArea();
  testCalculateScoreDistribution();
  testScoreQuizIntegration();
  testEdgeCases();
  testValidateQuizData();
  testValidateUserResponses();
  testMathematicalInvariants();
  testPerformance();

  printTestSummary();

  // Exit with appropriate code
  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  assert,
  assertAlmostEqual
};
