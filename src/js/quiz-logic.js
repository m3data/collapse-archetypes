/**
 * Quiz Logic Module
 *
 * Handles the core business logic for the Collapse Archetype Quiz:
 * - Loading quiz data
 * - Processing user answers
 * - Calculating dominant archetype
 * - Managing quiz flow
 *
 * This module orchestrates state changes but delegates state storage
 * to the state.js module, following separation of concerns.
 */

import * as State from './state.js';

/**
 * Loads quiz data from JSON file
 * Initializes the application state with the loaded data
 *
 * @returns {Promise<void>} Resolves when data is loaded and state initialized
 * @throws {Error} If data loading fails
 */
export async function loadQuizData() {
  State.setLoading(true);
  State.setError(null);

  try {
    const response = await fetch('src/data/quiz-data.json');

    if (!response.ok) {
      throw new Error(`Failed to load quiz data: ${response.statusText}`);
    }

    const quizData = await response.json();

    // Validate the loaded data
    validateQuizData(quizData);

    // Initialize state with the loaded data
    State.initializeState(quizData);

    State.setLoading(false);
  } catch (error) {
    const errorMessage = `Error loading quiz data: ${error.message}`;
    State.setError(errorMessage);
    State.setLoading(false);
    throw error;
  }
}

/**
 * Validates quiz data structure
 * Ensures data conforms to spec.md requirements
 *
 * @param {Object} quizData - Quiz data to validate
 * @throws {Error} If data is invalid
 * @private
 */
function validateQuizData(quizData) {
  if (!quizData) {
    throw new Error('Quiz data is null or undefined');
  }

  if (!Array.isArray(quizData.archetypes) || quizData.archetypes.length === 0) {
    throw new Error('Quiz data must contain an array of archetypes');
  }

  if (!Array.isArray(quizData.questions) || quizData.questions.length === 0) {
    throw new Error('Quiz data must contain an array of questions');
  }

  // Validate each archetype has required fields
  quizData.archetypes.forEach((archetype, index) => {
    if (!archetype.id || !archetype.name || !archetype.description) {
      throw new Error(`Archetype at index ${index} is missing required fields`);
    }
  });

  // Validate each question has required fields
  quizData.questions.forEach((question, index) => {
    if (!question.id || !question.text || !Array.isArray(question.answers)) {
      throw new Error(`Question at index ${index} is missing required fields`);
    }

    if (question.answers.length === 0) {
      throw new Error(`Question at index ${index} has no answers`);
    }
  });
}

/**
 * Processes a user's answer selection
 * Records the answer and updates scores
 *
 * Per spec.md §2.2, this function:
 * - Stores the response
 * - Updates archetype scores
 * - Advances to the next question
 *
 * @param {string} questionId - ID of the current question
 * @param {string} answerId - ID of the selected answer
 */
export function submitAnswer(questionId, answerId) {
  // Validate inputs
  if (!questionId || !answerId) {
    throw new Error('Question ID and Answer ID are required');
  }

  // Record the answer (this also updates scores and advances)
  State.recordAnswer(questionId, answerId);

  // Check if quiz is now complete
  if (State.isQuizComplete()) {
    calculateResult();
  }
}

/**
 * Calculates the dominant archetype based on accumulated scores
 *
 * Per spec.md §3.3, this function:
 * - Aggregates scores
 * - Identifies the archetype(s) with the highest score
 * - Handles ties by selecting the first archetype in declaration order
 *
 * @returns {Object} The dominant Archetype object
 */
export function calculateResult() {
  const scores = State.getScores();
  const archetypes = State.getArchetypes();

  if (archetypes.length === 0) {
    throw new Error('No archetypes available for calculation');
  }

  // Find the maximum score
  let maxScore = -1;
  let dominantArchetypeId = null;

  Object.entries(scores).forEach(([archetypeId, score]) => {
    if (score > maxScore) {
      maxScore = score;
      dominantArchetypeId = archetypeId;
    }
  });

  // If no archetype has any score (edge case), default to first archetype
  if (dominantArchetypeId === null) {
    dominantArchetypeId = archetypes[0].id;
  }

  // Find the full archetype object
  const dominantArchetype = archetypes.find(a => a.id === dominantArchetypeId);

  if (!dominantArchetype) {
    throw new Error(`Archetype ${dominantArchetypeId} not found in data`);
  }

  // Store the result
  State.setDominantArchetype(dominantArchetype);

  return dominantArchetype;
}

/**
 * Resets the quiz to initial state
 * Clears all responses and scores, returns to first question
 *
 * Per spec.md §4, this supports the "retake quiz" functionality
 */
export function restartQuiz() {
  State.resetQuiz();
}

/**
 * Gets the current question for display
 *
 * @returns {Object|null} Current Question object or null if quiz complete
 */
export function getCurrentQuestion() {
  return State.getCurrentQuestion();
}

/**
 * Gets quiz progress information
 *
 * @returns {Object} Progress data: { current, total, percentage }
 */
export function getProgress() {
  const current = State.getCurrentQuestionIndex() + 1; // 1-indexed for display
  const total = State.getTotalQuestions();
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return { current, total, percentage };
}

/**
 * Checks if the quiz is complete
 *
 * @returns {boolean} True if all questions answered
 */
export function isQuizComplete() {
  return State.isQuizComplete();
}

/**
 * Gets the final result
 *
 * @returns {Object|null} Dominant Archetype object or null if not calculated
 */
export function getResult() {
  return State.getDominantArchetype();
}

/**
 * Gets detailed score breakdown for all archetypes
 * Useful for debugging or displaying detailed results
 *
 * @returns {Array} Array of { archetype, score } sorted by score descending
 */
export function getScoreBreakdown() {
  const scores = State.getScores();
  const archetypes = State.getArchetypes();

  return archetypes
    .map(archetype => ({
      archetype,
      score: scores[archetype.id] || 0
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * Gets loading state
 *
 * @returns {boolean} True if data is loading
 */
export function isLoading() {
  return State.isLoading();
}

/**
 * Gets error state
 *
 * @returns {string|null} Error message or null
 */
export function getError() {
  return State.getError();
}
