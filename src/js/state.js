/**
 * State Management Module
 *
 * Manages the application state for the Collapse Archetype Quiz.
 * Follows the Single Responsibility Principle: this module is solely
 * responsible for maintaining quiz state and providing access to it.
 *
 * Per spec.md, the state includes:
 * - Quiz data (questions, answers, archetypes)
 * - Current question index
 * - User responses
 * - Archetype scores
 *
 * State is encapsulated to prevent direct manipulation from outside modules.
 */

/**
 * Quiz application state container
 * @private
 */
const state = {
  // Quiz data loaded from JSON
  archetypes: [],
  questions: [],

  // Current quiz progress
  currentQuestionIndex: 0,

  // User responses: array of { questionId, answerId }
  responses: [],

  // Scores: map of archetypeId -> score
  scores: {},

  // Result after calculation
  dominantArchetype: null,

  // Loading and error states
  isLoading: false,
  error: null
};

/**
 * Initializes the state with quiz data
 *
 * @param {Object} quizData - Quiz data containing archetypes and questions
 * @param {Array} quizData.archetypes - Array of Archetype objects
 * @param {Array} quizData.questions - Array of Question objects
 */
export function initializeState(quizData) {
  state.archetypes = quizData.archetypes || [];
  state.questions = quizData.questions || [];

  // Initialize scores for all archetypes to 0
  state.scores = {};
  state.archetypes.forEach(archetype => {
    state.scores[archetype.id] = 0;
  });

  // Reset progress
  state.currentQuestionIndex = 0;
  state.responses = [];
  state.dominantArchetype = null;
  state.error = null;
}

/**
 * Resets the quiz state to initial values
 * Preserves loaded data but clears progress and responses
 */
export function resetQuiz() {
  state.currentQuestionIndex = 0;
  state.responses = [];
  state.dominantArchetype = null;

  // Reset all scores to 0
  Object.keys(state.scores).forEach(archetypeId => {
    state.scores[archetypeId] = 0;
  });
}

/**
 * Records a user's answer to a question
 * Updates both the responses array and archetype scores
 *
 * @param {string} questionId - ID of the question answered
 * @param {string} answerId - ID of the selected answer
 */
export function recordAnswer(questionId, answerId) {
  // Find the question and answer in the data
  const question = state.questions.find(q => q.id === questionId);
  if (!question) {
    console.error(`Question ${questionId} not found`);
    return;
  }

  const answer = question.answers.find(a => a.id === answerId);
  if (!answer) {
    console.error(`Answer ${answerId} not found in question ${questionId}`);
    return;
  }

  // Record the response
  state.responses.push({ questionId, answerId });

  // Update archetype scores based on the answer
  // Per spec.md, each answer has an archetypeScores map
  if (answer.archetypeScores) {
    Object.entries(answer.archetypeScores).forEach(([archetypeId, points]) => {
      if (state.scores.hasOwnProperty(archetypeId)) {
        state.scores[archetypeId] += points;
      }
    });
  }

  // Move to next question
  state.currentQuestionIndex++;
}

/**
 * Sets the dominant archetype result
 *
 * @param {Object} archetype - The dominant Archetype object
 */
export function setDominantArchetype(archetype) {
  state.dominantArchetype = archetype;
}

/**
 * Sets loading state
 *
 * @param {boolean} isLoading - Whether data is currently loading
 */
export function setLoading(isLoading) {
  state.isLoading = isLoading;
}

/**
 * Sets error state
 *
 * @param {string|null} error - Error message or null to clear error
 */
export function setError(error) {
  state.error = error;
}

// Getters for accessing state (read-only)

/**
 * Gets the current question
 * @returns {Object|null} Current Question object or null if quiz is complete
 */
export function getCurrentQuestion() {
  if (state.currentQuestionIndex >= state.questions.length) {
    return null;
  }
  return state.questions[state.currentQuestionIndex];
}

/**
 * Gets the current question index
 * @returns {number} Zero-based index of current question
 */
export function getCurrentQuestionIndex() {
  return state.currentQuestionIndex;
}

/**
 * Gets the total number of questions
 * @returns {number} Total questions in the quiz
 */
export function getTotalQuestions() {
  return state.questions.length;
}

/**
 * Gets all user responses
 * @returns {Array} Array of response objects
 */
export function getResponses() {
  return [...state.responses]; // Return copy to prevent external mutation
}

/**
 * Gets current archetype scores
 * @returns {Object} Map of archetype IDs to scores
 */
export function getScores() {
  return { ...state.scores }; // Return copy
}

/**
 * Gets all archetypes
 * @returns {Array} Array of Archetype objects
 */
export function getArchetypes() {
  return [...state.archetypes]; // Return copy
}

/**
 * Gets the dominant archetype result
 * @returns {Object|null} Dominant Archetype object or null if not calculated
 */
export function getDominantArchetype() {
  return state.dominantArchetype;
}

/**
 * Checks if quiz is complete
 * @returns {boolean} True if all questions have been answered
 */
export function isQuizComplete() {
  return state.currentQuestionIndex >= state.questions.length;
}

/**
 * Gets loading state
 * @returns {boolean} Whether data is loading
 */
export function isLoading() {
  return state.isLoading;
}

/**
 * Gets error state
 * @returns {string|null} Current error message or null
 */
export function getError() {
  return state.error;
}

/**
 * Gets the entire state object (for debugging purposes)
 * @returns {Object} Copy of the entire state
 */
export function getState() {
  return {
    ...state,
    archetypes: [...state.archetypes],
    questions: [...state.questions],
    responses: [...state.responses],
    scores: { ...state.scores }
  };
}
