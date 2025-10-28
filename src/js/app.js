/**
 * COLLAPSE ARCHETYPE QUIZ - APPLICATION LOGIC
 *
 * Interaction Design Philosophy:
 * - Keyboard-first navigation
 * - Clear state transitions with meaningful feedback
 * - Progressive disclosure (one question at a time)
 * - Graceful error handling
 * - Accessible by default
 */

// ============================================
// IMPORTS
// ============================================

import { scoreQuiz, ARCHETYPE_TRAIT_PROFILES } from './scoring-engine.js';

// ============================================
// STATE MANAGEMENT
// ============================================

const QuizState = {
    currentQuestionIndex: 0,
    responses: [],
    scores: {},
    dimensionalScores: {
        affective: 0,
        cognitive: 0,
        relational: 0,
        temporal: 0,
        behavioral: 0
    },
    quizData: null,
    isLoading: false,
};

// ============================================
// DOM REFERENCES
// ============================================

const DOM = {
    // Screens
    welcomeScreen: null,
    quizScreen: null,
    resultsScreen: null,

    // Welcome elements
    startBtn: null,

    // Quiz elements
    progressFill: null,
    progressText: null,
    questionText: null,
    answersContainer: null,

    // Results elements
    archetypeName: null,
    archetypeImage: null,
    archetypeMeme: null,
    archetypeDescription: null,
    archetypeTraits: null,
    retakeBtn: null,
    shareBtn: null,
};

// ============================================
// INITIALIZATION
// ============================================

async function init() {
    // Cache DOM elements
    cacheDOMElements();

    // Load quiz data
    await loadQuizData();

    // Initialize event listeners
    initEventListeners();

    // Initialize keyboard navigation
    initKeyboardNavigation();

    console.log('Quiz initialized successfully');
}

function cacheDOMElements() {
    // Screens
    DOM.welcomeScreen = document.getElementById('welcomeScreen');
    DOM.quizScreen = document.getElementById('quizScreen');
    DOM.resultsScreen = document.getElementById('resultsScreen');

    // Welcome
    DOM.startBtn = document.getElementById('startBtn');

    // Quiz
    DOM.progressFill = document.getElementById('progressFill');
    DOM.progressText = document.getElementById('progressText');
    DOM.questionText = document.getElementById('questionText');
    DOM.answersContainer = document.getElementById('answersContainer');

    // Results
    DOM.archetypeName = document.getElementById('archetypeName');
    DOM.archetypeImage = document.getElementById('archetypeImage');
    DOM.archetypeMeme = document.getElementById('archetypeMeme');
    DOM.archetypeDescription = document.getElementById('archetypeDescription');
    DOM.archetypeTraits = document.getElementById('archetypeTraits');
    DOM.retakeBtn = document.getElementById('retakeBtn');
    DOM.shareBtn = document.getElementById('shareBtn');
}

async function loadQuizData() {
    try {
        const response = await fetch('src/data/quiz-data.json');
        if (!response.ok) throw new Error('Failed to load quiz data');

        QuizState.quizData = await response.json();

        // Initialize scores for all archetypes
        QuizState.quizData.archetypes.forEach(archetype => {
            QuizState.scores[archetype.id] = 0;
        });
    } catch (error) {
        console.error('Error loading quiz data:', error);
        showError('Failed to load quiz. Please refresh the page.');
    }
}

function initEventListeners() {
    // Welcome screen
    DOM.startBtn.addEventListener('click', startQuiz);

    // Results screen
    DOM.retakeBtn.addEventListener('click', retakeQuiz);
    DOM.shareBtn.addEventListener('click', shareResult);
}

function initKeyboardNavigation() {
    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Enter/Space on focused buttons
        if (e.key === 'Enter' || e.key === ' ') {
            const activeElement = document.activeElement;
            if (activeElement.classList.contains('btn') ||
                activeElement.classList.contains('answer-btn')) {
                e.preventDefault();
                activeElement.click();
            }
        }

        // Arrow keys for answer navigation (when in quiz)
        if (DOM.quizScreen.classList.contains('active')) {
            const answers = Array.from(document.querySelectorAll('.answer-btn'));
            const currentIndex = answers.findIndex(btn => btn === document.activeElement);

            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % answers.length;
                answers[nextIndex]?.focus();
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevIndex = currentIndex <= 0 ? answers.length - 1 : currentIndex - 1;
                answers[prevIndex]?.focus();
            }
        }
    });
}

// ============================================
// SCREEN TRANSITIONS
// ============================================

function showScreen(screen) {
    // Remove active class from all screens
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
    });

    // Add active class to target screen
    screen.classList.add('active');

    // Focus management for accessibility
    setTimeout(() => {
        const firstFocusable = screen.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }, 300);
}

// ============================================
// QUIZ FLOW
// ============================================

function startQuiz() {
    if (!QuizState.quizData) {
        showError('Quiz data not loaded. Please refresh the page.');
        return;
    }

    // Reset state
    QuizState.currentQuestionIndex = 0;
    QuizState.responses = [];

    // Reset scores
    Object.keys(QuizState.scores).forEach(key => {
        QuizState.scores[key] = 0;
    });

    // Reset dimensional scores
    Object.keys(QuizState.dimensionalScores).forEach(key => {
        QuizState.dimensionalScores[key] = 0;
    });

    // Show quiz screen
    showScreen(DOM.quizScreen);

    // Display first question
    displayQuestion();
}

function displayQuestion() {
    const question = QuizState.quizData.questions[QuizState.currentQuestionIndex];

    if (!question) {
        console.error('Question not found');
        return;
    }

    // Update progress
    updateProgress();

    // Update question text
    DOM.questionText.textContent = question.text;

    // Clear previous answers
    DOM.answersContainer.innerHTML = '';

    // Create answer buttons
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer.text;
        button.setAttribute('role', 'radio');
        button.setAttribute('aria-checked', 'false');
        button.setAttribute('tabindex', index === 0 ? '0' : '-1');

        button.addEventListener('click', () => selectAnswer(answer));

        DOM.answersContainer.appendChild(button);
    });

    // Focus first answer
    setTimeout(() => {
        const firstAnswer = DOM.answersContainer.querySelector('.answer-btn');
        if (firstAnswer) firstAnswer.focus();
    }, 100);
}

function selectAnswer(answer) {
    // Store response
    const question = QuizState.quizData.questions[QuizState.currentQuestionIndex];
    QuizState.responses.push({
        questionId: question.id,
        answerId: answer.id,
    });

    // Update archetype scores
    if (answer.archetypeScores) {
        Object.entries(answer.archetypeScores).forEach(([archetypeId, score]) => {
            QuizState.scores[archetypeId] = (QuizState.scores[archetypeId] || 0) + score;
        });
    }

    // Update dimensional scores
    if (answer.dimensionScores) {
        Object.entries(answer.dimensionScores).forEach(([dimension, score]) => {
            QuizState.dimensionalScores[dimension] = (QuizState.dimensionalScores[dimension] || 0) + score;
        });
    }

    // Visual feedback
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(btn => {
        if (btn.textContent === answer.text) {
            btn.classList.add('selected');
        }
    });

    // Proceed to next question or results
    setTimeout(() => {
        QuizState.currentQuestionIndex++;

        if (QuizState.currentQuestionIndex < QuizState.quizData.questions.length) {
            displayQuestion();
        } else {
            showResults();
        }
    }, 400);
}

function updateProgress() {
    const total = QuizState.quizData.questions.length;
    const current = QuizState.currentQuestionIndex + 1;
    const percentage = (current / total) * 100;

    DOM.progressFill.style.width = `${percentage}%`;
    DOM.progressFill.setAttribute('aria-valuenow', percentage);

    const currentSpan = DOM.progressText.querySelector('.current-question');
    const totalSpan = DOM.progressText.querySelector('.total-questions');

    if (currentSpan) currentSpan.textContent = current;
    if (totalSpan) totalSpan.textContent = total;
}

// ============================================
// RESULTS
// ============================================

function showResults() {
    // Calculate dominant archetype
    const dominantArchetype = calculateDominantArchetype();

    if (!dominantArchetype) {
        showError('Unable to calculate results. Please try again.');
        return;
    }

    // Display results
    displayArchetypeResult(dominantArchetype);

    // Show results screen
    showScreen(DOM.resultsScreen);
}

/**
 * Calculates the dominant archetype using the sophisticated scoring-engine.
 * Per SCORING-ENGINE-ASSESSMENT.md, this provides:
 * - Intelligent tie-breaking using cosine similarity in trait space
 * - Confidence scoring for result transparency
 * - Normalized scores for fair comparison
 * - Mathematical rigor with 124 passing tests
 *
 * @returns {Object} Object containing archetype data and scoring metadata
 */
function calculateDominantArchetype() {
    // Use scoring-engine's scoreQuiz function for sophisticated archetype determination
    const result = scoreQuiz(
        QuizState.quizData.questions,
        QuizState.responses,
        {
            tieTolerance: 0.05,
            breakTiesWithTraits: true,
            includeVisualizations: false  // We handle visualization separately for dimensional analysis
        }
    );

    // Log tie information if detected (for debugging)
    if (result.hasTie) {
        console.log('Tie detected between:', result.dominantArchetypes);
        console.log('Resolved to:', result.primary, 'using trait-based similarity');
        console.log('Confidence:', result.confidence.level, `(${(result.confidence.score * 100).toFixed(1)}%)`);
    }

    // Store the full result for potential use in results display
    QuizState.scoringResult = result;

    // Find and return archetype data for the primary (dominant) archetype
    const dominantArchetype = QuizState.quizData.archetypes.find(a => a.id === result.primary);

    if (!dominantArchetype) {
        console.error('Archetype not found:', result.primary);
        return null;
    }

    return dominantArchetype;
}

function displayArchetypeResult(archetype) {
    // Name
    DOM.archetypeName.textContent = archetype.name;

    // Image/Visual (placeholder for now)
    DOM.archetypeImage.innerHTML = `
        <svg width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="80" fill="rgba(198, 123, 92, 0.2)" stroke="rgba(198, 123, 92, 0.6)" stroke-width="2"/>
            <text x="100" y="110" text-anchor="middle" font-size="48" fill="rgba(44, 36, 26, 0.8)">
                ${getArchetypeEmoji(archetype.id)}
            </text>
        </svg>
    `;

    // Meme caption
    DOM.archetypeMeme.textContent = `"${archetype.meme}"`;

    // Description
    DOM.archetypeDescription.innerHTML = `
        <p>${archetype.description}</p>
        ${archetype.extendedDescription ? `<p>${archetype.extendedDescription}</p>` : ''}
    `;

    // Traits
    displayTraits(archetype.traits);

    // Dimensional Analysis
    displayDimensionalAnalysis(archetype);
}

function displayTraits(traits) {
    const traitLabels = {
        awareness: { label: 'Awareness', icon: 'ph-eye' },
        affect: { label: 'Affect', icon: 'ph-heart' },
        agency: { label: 'Agency', icon: 'ph-hand-fist' },
        temporality: { label: 'Temporality', icon: 'ph-clock-clockwise' },
        relationality: { label: 'Relationality', icon: 'ph-users' },
        posture: { label: 'Posture', icon: 'ph-compass' },
    };

    let html = '<p class="trait-label">Dimensional Profile</p><div class="trait-grid">';

    Object.entries(traits).forEach(([key, value]) => {
        const traitInfo = traitLabels[key] || { label: key, icon: 'ph-circle' };
        html += `
            <div class="trait-item">
                <i class="ph ${traitInfo.icon}"></i>
                <strong>${traitInfo.label}:</strong> ${value}
            </div>
        `;
    });

    html += '</div>';

    DOM.archetypeTraits.innerHTML = html;
}

function displayDimensionalAnalysis(archetype) {
    const dimensions = QuizState.quizData.metadata.dimensions;
    const userScores = QuizState.dimensionalScores;

    // Normalize scores to 0-100 scale for visualization
    const normalizedScores = {};
    const maxPossible = 60; // Assuming max score per dimension (20 questions × 3 max points)

    Object.keys(userScores).forEach(dim => {
        // Normalize from [-60, 60] to [0, 100]
        normalizedScores[dim] = ((userScores[dim] + maxPossible) / (maxPossible * 2)) * 100;
    });

    // Render radar chart
    renderRadarChart(dimensions, normalizedScores);

    // Render dimension cards
    renderDimensionCards(dimensions, userScores, normalizedScores);

    // Display theoretical foundations
    if (archetype.theoreticalFoundations) {
        displayTheoreticalFoundations(archetype.theoreticalFoundations);
    }
}

function renderRadarChart(dimensions, scores) {
    const radarPolygon = document.getElementById('radarPolygon');
    const radarAxes = document.getElementById('radarAxes');
    const radarLabels = document.getElementById('radarLabels');
    const radarPoints = document.getElementById('radarPoints');
    const radarLegend = document.getElementById('radarLegend');

    if (!radarPolygon) return;

    const numDimensions = dimensions.length;
    const angleStep = (Math.PI * 2) / numDimensions;
    const radius = 100;

    // Clear previous content
    radarAxes.innerHTML = '';
    radarLabels.innerHTML = '';
    radarPoints.innerHTML = '';

    // Generate polygon points
    const points = [];
    const labelPositions = [];

    dimensions.forEach((dimension, index) => {
        const angle = (index * angleStep) - (Math.PI / 2); // Start from top
        const score = scores[dimension.id] || 50; // Default to center if missing
        const distance = (score / 100) * radius;

        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        points.push(`${x},${y}`);

        // Draw axis line
        const axisX = Math.cos(angle) * radius;
        const axisY = Math.sin(angle) * radius;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', '0');
        line.setAttribute('y1', '0');
        line.setAttribute('x2', axisX);
        line.setAttribute('y2', axisY);
        line.setAttribute('class', 'axis-line');
        line.setAttribute('stroke', '#d4c4a8');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('opacity', '0.3');
        radarAxes.appendChild(line);

        // Add label
        const labelDistance = radius + 25;
        const labelX = Math.cos(angle) * labelDistance;
        const labelY = Math.sin(angle) * labelDistance;

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', labelX);
        text.setAttribute('y', labelY);
        text.setAttribute('class', 'dimension-label');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', 'var(--color-earth-medium)');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', '600');
        text.textContent = dimension.name.replace(' Dimension', '');
        radarLabels.appendChild(text);

        // Add data point
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', 'var(--color-accent)');
        circle.setAttribute('class', 'data-point');
        radarPoints.appendChild(circle);

        labelPositions.push({ dimension: dimension.name, score: Math.round(score) });
    });

    // Set polygon points
    radarPolygon.setAttribute('points', points.join(' '));
    radarPolygon.setAttribute('fill', 'rgba(198, 123, 92, 0.2)');
    radarPolygon.setAttribute('stroke', 'var(--color-accent)');
    radarPolygon.setAttribute('stroke-width', '2');

    // Render legend
    let legendHTML = '<h3 class="legend-title">Your Scores</h3><ul class="legend-list">';
    labelPositions.forEach(item => {
        legendHTML += `<li><strong>${item.dimension}:</strong> ${item.score}/100</li>`;
    });
    legendHTML += '</ul>';
    radarLegend.innerHTML = legendHTML;
}

/**
 * Returns a human-centered, emotionally resonant interpretation for a dimension score.
 * Each dimension has 5 nuanced interpretations across the score range.
 */
function getDimensionInterpretation(dimensionId, normalizedScore) {
    const interpretations = {
        affective: {
            veryLow: "You tend to protect your emotional equilibrium by maintaining distance from overwhelming feelings.",
            low: "You navigate uncertainty with a steady presence, neither dwelling in despair nor floating in transcendence.",
            moderate: "You hold a balanced emotional stance, acknowledging difficulty while preserving your capacity to function.",
            high: "You carry collapse awareness with relative calm, finding sources of steadiness even amid turbulence.",
            veryHigh: "You meet uncertainty with genuine equanimity, grounded in practices or perspectives that sustain inner peace."
        },
        cognitive: {
            veryLow: "You filter the noise of catastrophic information, focusing on what you can see and touch in your immediate world.",
            low: "You acknowledge some signs of instability but don't let them dominate your worldview or daily experience.",
            moderate: "You see the patterns clearly enough to understand what's unfolding without being consumed by every data point.",
            high: "You track systemic fragility closely, integrating uncomfortable evidence into your understanding of the world.",
            veryHigh: "You see the patterns clearly and don't look away, even when it's uncomfortable."
        },
        relational: {
            veryLow: "You ground your responses in personal autonomy, trusting your own judgment and tending to your immediate circle.",
            low: "You balance self-reliance with selective connection, maintaining independence while staying aware of community.",
            moderate: "You navigate between individual agency and collective belonging, drawing on both as circumstances require.",
            high: "You orient strongly toward collective identity and shared struggle, finding strength in solidarity.",
            veryHigh: "You root your sense of self in community and shared purpose, seeing individual and collective fates as inseparable."
        },
        temporal: {
            veryLow: "You hold tight to what came before—traditions, ancestral wisdom, and the grounding weight of history.",
            low: "You draw more from past and present than distant futures, valuing what's proven and what's immediate.",
            moderate: "You balance past wisdom, present reality, and future possibility without being captured by any single timeframe.",
            high: "You lean into what's coming, preparing for or imagining futures that haven't yet arrived.",
            veryHigh: "You live oriented toward the horizon—what's next, what might emerge, what you can shape or prepare for."
        },
        behavioral: {
            veryLow: "You navigate with what energy you have, accepting that agency feels limited given the forces at play.",
            low: "You take action when it feels meaningful but don't carry the weight of trying to fix everything.",
            moderate: "You engage with what's in front of you, taking steps where you can without exhausting yourself with constant intervention.",
            high: "You channel awareness into concrete action, building skills, plans, or movements that feel within your reach.",
            veryHigh: "You embody active preparation and engagement, translating understanding into tangible steps toward resilience."
        }
    };

    // Determine score level
    let level;
    if (normalizedScore < 20) {
        level = 'veryLow';
    } else if (normalizedScore < 40) {
        level = 'low';
    } else if (normalizedScore < 60) {
        level = 'moderate';
    } else if (normalizedScore < 80) {
        level = 'high';
    } else {
        level = 'veryHigh';
    }

    return interpretations[dimensionId]?.[level] || 'Your response to this dimension is unique.';
}

function renderDimensionCards(dimensions, rawScores, normalizedScores) {
    const dimensionCards = document.getElementById('dimensionCards');
    if (!dimensionCards) return;

    let html = '';
    dimensions.forEach(dimension => {
        const rawScore = rawScores[dimension.id] || 0;
        const normalizedScore = Math.round(normalizedScores[dimension.id] || 50);

        // Get human-centered interpretation
        const interpretation = getDimensionInterpretation(dimension.id, normalizedScore);

        html += `
            <div class="dimension-card">
                <h3 class="dimension-name">${dimension.name}</h3>
                <div class="dimension-score-bar">
                    <div class="score-fill" style="width: ${normalizedScore}%"></div>
                    <span class="score-value">${normalizedScore}/100</span>
                </div>
                <p class="dimension-interpretation">${interpretation}</p>
                <p class="dimension-desc">${dimension.description}</p>
                <p class="dimension-theory">
                    <strong>Theoretical Basis:</strong>
                    <a href="theory.html#${dimension.id}" class="theory-text-link" aria-label="Read about ${dimension.theoreticalBasis} in theoretical framework">
                        ${dimension.theoreticalBasis}
                        <i class="ph ph-arrow-right"></i>
                    </a>
                </p>
                <a href="theory.html#${dimension.id}" class="dimension-link" aria-label="Learn more about the ${dimension.name} theoretical foundations">
                    Learn more about ${dimension.name}
                    <i class="ph ph-arrow-right"></i>
                </a>
            </div>
        `;
    });

    dimensionCards.innerHTML = html;
}

function displayTheoreticalFoundations(foundations) {
    // This could be expanded to show the theoretical foundations in a special section
    console.log('Theoretical foundations:', foundations);
}

function getArchetypeEmoji(archetypeId) {
    const emojiMap = {
        'ostrich': '🦩',
        'blissed-out-yogi': '🧘',
        'illusionist': '🎭',
        'normalizer': '📊',
        'prepper': '🏕️',
        'prophet-of-doom': '⚡',
        'alt-right-collapse-bro': '🦅',
        'evangelical-nationalist': '⛪',
        'apocaloptimist': '🌱',
        'trickster': '🃏',
        'woke-lefty-socialist': '✊',
        'salvager': '♻️',
        'sacred-keeper': '🕯️',
        'everyday-hustler': '💼',
        'already-collapsed': '🏚️',
        'extracted': '🏝️',
        'child-witness': '👶',
        'opportunist-elite': '💎',
        'conspiracy-theorist': '🔍',
    };

    return emojiMap[archetypeId] || '⭐';
}

// ============================================
// RETAKE & SHARE
// ============================================

function retakeQuiz() {
    startQuiz();
}

async function shareResult() {
    const archetype = calculateDominantArchetype();

    if (!archetype) return;

    const shareText = `I'm a ${archetype.name}! "${archetype.meme}" - Discover your collapse archetype.`;
    const shareUrl = window.location.href;

    // Web Share API (mobile-friendly)
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'My Collapse Archetype',
                text: shareText,
                url: shareUrl,
            });
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error sharing:', error);
                fallbackShare(shareText, shareUrl);
            }
        }
    } else {
        fallbackShare(shareText, shareUrl);
    }
}

function fallbackShare(text, url) {
    // Copy to clipboard
    const fullText = `${text}\n${url}`;

    navigator.clipboard.writeText(fullText).then(() => {
        showNotification('Link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showNotification('Unable to share. Try copying the URL manually.');
    });
}

// ============================================
// UI FEEDBACK
// ============================================

function showError(message) {
    // Simple error display (could be enhanced with a modal)
    alert(message);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: var(--color-earth-dark);
        color: var(--color-cream);
        padding: 1rem 2rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        animation: slideUp 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations to styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from { transform: translate(-50%, 100px); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    @keyframes slideDown {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, 100px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ============================================
// START APPLICATION
// ============================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for potential testing or module usage
export { QuizState, startQuiz, retakeQuiz, calculateDominantArchetype };
