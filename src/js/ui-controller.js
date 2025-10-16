/**
 * UI Controller Module
 *
 * Manages all DOM manipulation and view updates for the quiz application.
 * Follows the separation of concerns principle: this module handles presentation
 * while quiz-logic.js handles business logic.
 *
 * Per spec.md §1, the UI includes:
 * - Welcome screen
 * - Quiz screen with progress indicator
 * - Results screen
 * - Navigation between screens
 *
 * Accessibility features per spec.md §4:
 * - Keyboard navigation
 * - ARIA labels and roles
 * - Screen reader support
 */

import * as QuizLogic from './quiz-logic.js';

// DOM element references (cached for performance)
let elements = {};

/**
 * Initializes the UI controller
 * Caches DOM references and sets up event listeners
 */
export function initialize() {
  cacheElements();
  setupEventListeners();
}

/**
 * Caches references to frequently accessed DOM elements
 * @private
 */
function cacheElements() {
  elements = {
    // Screens
    welcomeScreen: document.getElementById('welcomeScreen'),
    quizScreen: document.getElementById('quizScreen'),
    resultsScreen: document.getElementById('resultsScreen'),

    // Welcome screen
    startBtn: document.getElementById('startBtn'),

    // Quiz screen
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    currentQuestionSpan: document.querySelector('.current-question'),
    totalQuestionsSpan: document.querySelector('.total-questions'),
    questionText: document.getElementById('questionText'),
    answersContainer: document.getElementById('answersContainer'),

    // Results screen
    archetypeName: document.getElementById('archetypeName'),
    archetypeImage: document.getElementById('archetypeImage'),
    archetypeMeme: document.getElementById('archetypeMeme'),
    archetypeDescription: document.getElementById('archetypeDescription'),
    archetypeTraits: document.getElementById('archetypeTraits'),
    retakeBtn: document.getElementById('retakeBtn'),
    shareBtn: document.getElementById('shareBtn')
  };
}

/**
 * Sets up event listeners for user interactions
 * @private
 */
function setupEventListeners() {
  // Start button
  if (elements.startBtn) {
    elements.startBtn.addEventListener('click', handleStartQuiz);
  }

  // Retake button
  if (elements.retakeBtn) {
    elements.retakeBtn.addEventListener('click', handleRetakeQuiz);
  }

  // Share button
  if (elements.shareBtn) {
    elements.shareBtn.addEventListener('click', handleShare);
  }
}

/**
 * Shows a specific screen and hides others
 *
 * @param {string} screenName - Name of screen to show: 'welcome', 'quiz', or 'results'
 */
export function showScreen(screenName) {
  // Hide all screens
  elements.welcomeScreen?.classList.remove('active');
  elements.quizScreen?.classList.remove('active');
  elements.resultsScreen?.classList.remove('active');

  // Show the requested screen
  switch (screenName) {
    case 'welcome':
      elements.welcomeScreen?.classList.add('active');
      elements.startBtn?.focus();
      break;
    case 'quiz':
      elements.quizScreen?.classList.add('active');
      break;
    case 'results':
      elements.resultsScreen?.classList.add('active');
      elements.retakeBtn?.focus();
      break;
  }
}

/**
 * Displays the current question and its answers
 *
 * @param {Object} question - Question object to display
 */
export function displayQuestion(question) {
  if (!question) {
    console.error('No question to display');
    return;
  }

  // Update question text
  elements.questionText.textContent = question.text;

  // Clear previous answers
  elements.answersContainer.innerHTML = '';

  // Create answer buttons
  question.answers.forEach((answer, index) => {
    const button = createAnswerButton(answer, question.id, index);
    elements.answersContainer.appendChild(button);
  });

  // Focus first answer button for keyboard navigation
  const firstButton = elements.answersContainer.querySelector('button');
  if (firstButton) {
    // Delay focus to allow screen transition
    setTimeout(() => firstButton.focus(), 100);
  }
}

/**
 * Creates an answer button element
 *
 * @param {Object} answer - Answer object
 * @param {string} questionId - ID of the parent question
 * @param {number} index - Answer index for keyboard shortcuts
 * @returns {HTMLElement} Button element
 * @private
 */
function createAnswerButton(answer, questionId, index) {
  const button = document.createElement('button');
  button.className = 'answer-btn';
  button.setAttribute('role', 'radio');
  button.setAttribute('aria-checked', 'false');
  button.textContent = answer.text;

  // Add keyboard shortcut hint (1-4)
  if (index < 4) {
    const shortcut = document.createElement('span');
    shortcut.className = 'answer-shortcut';
    shortcut.textContent = `${index + 1}`;
    shortcut.setAttribute('aria-hidden', 'true');
    button.appendChild(shortcut);
  }

  // Handle answer selection
  button.addEventListener('click', () => {
    handleAnswerSelection(questionId, answer.id, button);
  });

  // Keyboard shortcut support (1-4 keys)
  if (index < 4) {
    document.addEventListener('keydown', function keyHandler(e) {
      if (e.key === String(index + 1)) {
        handleAnswerSelection(questionId, answer.id, button);
        // Remove listener after use
        document.removeEventListener('keydown', keyHandler);
      }
    });
  }

  return button;
}

/**
 * Handles answer selection
 * Provides visual feedback and submits answer
 *
 * @param {string} questionId - ID of the question
 * @param {string} answerId - ID of the selected answer
 * @param {HTMLElement} button - The clicked button element
 * @private
 */
function handleAnswerSelection(questionId, answerId, button) {
  // Visual feedback: highlight selected answer
  button.classList.add('selected');
  button.setAttribute('aria-checked', 'true');

  // Disable all answer buttons to prevent double-submission
  const allButtons = elements.answersContainer.querySelectorAll('button');
  allButtons.forEach(btn => {
    btn.disabled = true;
  });

  // Submit answer after brief delay for visual feedback
  setTimeout(() => {
    QuizLogic.submitAnswer(questionId, answerId);

    // Check if quiz is complete
    if (QuizLogic.isQuizComplete()) {
      showResults();
    } else {
      // Display next question
      const nextQuestion = QuizLogic.getCurrentQuestion();
      updateProgress();
      displayQuestion(nextQuestion);
    }
  }, 300);
}

/**
 * Updates the progress indicator
 */
export function updateProgress() {
  const progress = QuizLogic.getProgress();

  // Update progress bar
  if (elements.progressFill) {
    elements.progressFill.style.width = `${progress.percentage}%`;
    elements.progressFill.setAttribute('aria-valuenow', progress.percentage);
  }

  // Update progress text
  if (elements.currentQuestionSpan) {
    elements.currentQuestionSpan.textContent = progress.current;
  }

  if (elements.totalQuestionsSpan) {
    elements.totalQuestionsSpan.textContent = progress.total;
  }
}

/**
 * Displays the quiz results
 */
function showResults() {
  const result = QuizLogic.getResult();

  if (!result) {
    console.error('No result available');
    return;
  }

  // Update archetype name
  elements.archetypeName.textContent = result.name;

  // Update meme caption
  elements.archetypeMeme.textContent = `"${result.memeCaption}"`;

  // Update description
  elements.archetypeDescription.textContent = result.description;

  // Display traits
  displayTraits(result.traits);

  // Update image (if available)
  updateArchetypeImage(result.image, result.name);

  // Show results screen
  showScreen('results');
}

/**
 * Displays archetype traits
 *
 * @param {Object} traits - Traits object from archetype
 * @private
 */
function displayTraits(traits) {
  if (!traits || !elements.archetypeTraits) return;

  const traitsHTML = `
    <div class="traits-grid">
      <div class="trait">
        <span class="trait-label">Awareness</span>
        <span class="trait-value">${capitalize(traits.awareness)}</span>
      </div>
      <div class="trait">
        <span class="trait-label">Affect</span>
        <span class="trait-value">${capitalize(traits.affect)}</span>
      </div>
      <div class="trait">
        <span class="trait-label">Agency</span>
        <span class="trait-value">${capitalize(traits.agency)}</span>
      </div>
      <div class="trait">
        <span class="trait-label">Temporality</span>
        <span class="trait-value">${capitalize(traits.temporality)}</span>
      </div>
      <div class="trait">
        <span class="trait-label">Relationality</span>
        <span class="trait-value">${capitalize(traits.relationality)}</span>
      </div>
      <div class="trait">
        <span class="trait-label">Posture</span>
        <span class="trait-value">${capitalize(traits.posture)}</span>
      </div>
    </div>
  `;

  elements.archetypeTraits.innerHTML = traitsHTML;
}

/**
 * Updates the archetype image display
 *
 * @param {string} imagePath - Path to archetype image
 * @param {string} archetypeName - Name for alt text
 * @private
 */
function updateArchetypeImage(imagePath, archetypeName) {
  if (!elements.archetypeImage) return;

  // For now, create a placeholder visual element
  // The ux-weaver agent can replace this with actual images
  elements.archetypeImage.innerHTML = `
    <div class="archetype-visual">
      <div class="archetype-icon">${archetypeName.charAt(0)}</div>
    </div>
  `;
}

/**
 * Handles start quiz button click
 * @private
 */
function handleStartQuiz() {
  showScreen('quiz');
  const firstQuestion = QuizLogic.getCurrentQuestion();
  updateProgress();
  displayQuestion(firstQuestion);
}

/**
 * Handles retake quiz button click
 * @private
 */
function handleRetakeQuiz() {
  QuizLogic.restartQuiz();
  showScreen('welcome');
}

/**
 * Handles share button click
 * Implements Web Share API with fallback
 * @private
 */
async function handleShare() {
  const result = QuizLogic.getResult();

  if (!result) return;

  const shareData = {
    title: 'My Collapse Archetype',
    text: `I'm "${result.name}" - ${result.memeCaption}`,
    url: window.location.href
  };

  try {
    // Use Web Share API if available
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      const shareText = `${shareData.text}\n${shareData.url}`;
      await navigator.clipboard.writeText(shareText);
      alert('Result copied to clipboard!');
    }
  } catch (err) {
    console.error('Error sharing:', err);
  }
}

/**
 * Utility: Capitalizes first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 * @private
 */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Shows an error message to the user
 *
 * @param {string} message - Error message to display
 */
export function showError(message) {
  // For now, use a simple alert
  // The ux-weaver agent can create a better error UI
  alert(`Error: ${message}`);
}
