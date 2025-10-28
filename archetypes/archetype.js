/**
 * Archetype Detail Page
 * Loads and displays detailed information about a single archetype
 */

// State
let quizData = null;
let currentArchetype = null;
let currentArchetypeIndex = -1;

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const errorScreen = document.getElementById('errorScreen');
const archetypeContent = document.getElementById('archetypeContent');

/**
 * Initialize the page
 */
async function init() {
    try {
        // Get archetype ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const archetypeId = urlParams.get('id');

        if (!archetypeId) {
            showError();
            return;
        }

        // Load quiz data
        const response = await fetch('../src/data/quiz-data.json');
        quizData = await response.json();

        // Find the archetype
        const archetypeIndex = quizData.archetypes.findIndex(a => a.id === archetypeId);
        if (archetypeIndex === -1) {
            showError();
            return;
        }

        currentArchetype = quizData.archetypes[archetypeIndex];
        currentArchetypeIndex = archetypeIndex;

        // Render the page
        renderArchetype();
        hideLoading();

    } catch (error) {
        console.error('Error loading archetype:', error);
        showError();
    }
}

/**
 * Render the archetype content
 */
function renderArchetype() {
    // Update page title
    document.getElementById('pageTitle').textContent = `${currentArchetype.name} | Collapse Archetypes`;

    // Update breadcrumb
    document.getElementById('breadcrumbName').textContent = currentArchetype.name;

    // Header
    document.getElementById('archetypeName').textContent = currentArchetype.name;
    document.getElementById('archetypeMeme').textContent = `"${currentArchetype.meme}"`;

    // Description
    const descSection = document.getElementById('archetypeDescription');
    descSection.innerHTML = `<p class="archetype-description-text">${currentArchetype.description}</p>`;

    const extendedSection = document.getElementById('archetypeExtendedDescription');
    if (currentArchetype.extendedDescription) {
        extendedSection.innerHTML = `<p class="archetype-extended-text">${currentArchetype.extendedDescription}</p>`;
    }

    // Traits
    renderTraits();

    // Dimensional profile
    renderDimensionalProfile();

    // Theoretical foundations
    renderTheory();

    // Navigation
    renderNavigation();
}

/**
 * Render trait profile
 */
function renderTraits() {
    const traitProfile = document.getElementById('traitProfile');
    const traits = currentArchetype.traits;

    const traitIcons = {
        awareness: 'ph-eye',
        affect: 'ph-heart',
        agency: 'ph-hand-fist',
        temporality: 'ph-clock-clockwise',
        relationality: 'ph-users-three',
        posture: 'ph-footprints'
    };

    const traitLabels = {
        awareness: 'Awareness',
        affect: 'Affect',
        agency: 'Agency',
        temporality: 'Time Orientation',
        relationality: 'Social Context',
        posture: 'Engagement Style'
    };

    traitProfile.innerHTML = Object.entries(traits).map(([key, value]) => `
        <div class="trait-row">
            <div class="trait-label">
                <i class="ph ${traitIcons[key]}"></i>
                <span>${traitLabels[key]}</span>
            </div>
            <div class="trait-value trait-${key}-${value.toLowerCase()}">
                ${capitalize(value)}
            </div>
        </div>
    `).join('');
}

/**
 * Render dimensional profile with radar chart
 */
function renderDimensionalProfile() {
    const profile = currentArchetype.dimensionalProfile;
    const dimensions = quizData.metadata.dimensions;

    // Prepare data for radar chart
    const radarData = dimensions.map(dim => ({
        id: dim.id,
        name: dim.name,
        value: profile[dim.id] || 0,
        description: dim.description,
        theory: dim.theoreticalBasis
    }));

    // Render radar chart
    renderRadarChart(radarData);

    // Render dimension details
    const dimensionDetails = document.getElementById('dimensionDetails');
    dimensionDetails.innerHTML = radarData.map(dim => {
        const normalizedScore = normalizeScore(dim.value);
        const interpretation = interpretDimensionScore(dim.id, dim.value);

        return `
            <div class="dimension-detail-card">
                <h3 class="dimension-detail-name">${dim.name}</h3>

                <div class="dimension-score-bar">
                    <div class="score-fill" style="width: ${normalizedScore}%"></div>
                    <span class="score-value">${dim.value > 0 ? '+' : ''}${dim.value}</span>
                </div>

                <p class="dimension-interpretation">${interpretation}</p>
                <p class="dimension-desc">${dim.description}</p>
                <p class="dimension-theory">
                    <i class="ph ph-book-bookmark"></i>
                    <a href="../theory.html#${dim.id}" class="theory-text-link" aria-label="Read about ${dim.theory} in theoretical framework">
                        ${dim.theory}
                        <i class="ph ph-arrow-right"></i>
                    </a>
                </p>
            </div>
        `;
    }).join('');
}

/**
 * Render radar chart
 */
function renderRadarChart(data) {
    const numAxes = data.length;
    const maxValue = 3; // Dimension scores range from -3 to +3
    const angleStep = (2 * Math.PI) / numAxes;

    // Clear existing content
    document.getElementById('radarAxes').innerHTML = '';
    document.getElementById('radarLabels').innerHTML = '';
    document.getElementById('radarPoints').innerHTML = '';

    // Draw axes and labels
    let points = [];
    data.forEach((dim, i) => {
        const angle = angleStep * i - Math.PI / 2; // Start from top
        const x2 = Math.cos(angle) * 100;
        const y2 = Math.sin(angle) * 100;

        // Draw axis line
        const axis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        axis.setAttribute('x1', '0');
        axis.setAttribute('y1', '0');
        axis.setAttribute('x2', x2);
        axis.setAttribute('y2', y2);
        axis.setAttribute('stroke', 'var(--color-border)');
        axis.setAttribute('stroke-width', '1');
        document.getElementById('radarAxes').appendChild(axis);

        // Calculate label position (slightly outside the chart)
        const labelDistance = 115;
        const labelX = Math.cos(angle) * labelDistance;
        const labelY = Math.sin(angle) * labelDistance;

        // Create label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', labelX);
        label.setAttribute('y', labelY);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('dominant-baseline', 'middle');
        label.setAttribute('font-size', '11');
        label.setAttribute('fill', 'var(--color-text-secondary)');
        label.setAttribute('font-weight', '600');
        label.textContent = dim.name.replace(' Dimension', '');
        document.getElementById('radarLabels').appendChild(label);

        // Calculate point position (normalized to -3 to +3 range)
        const normalizedValue = ((dim.value + maxValue) / (maxValue * 2)) * 100;
        const pointX = Math.cos(angle) * normalizedValue;
        const pointY = Math.sin(angle) * normalizedValue;
        points.push(`${pointX},${pointY}`);

        // Draw point
        const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        point.setAttribute('cx', pointX);
        point.setAttribute('cy', pointY);
        point.setAttribute('r', '4');
        point.setAttribute('fill', 'var(--color-accent)');
        point.setAttribute('stroke', 'white');
        point.setAttribute('stroke-width', '2');
        document.getElementById('radarPoints').appendChild(point);
    });

    // Draw polygon
    const polygon = document.getElementById('radarPolygon');
    polygon.setAttribute('points', points.join(' '));
    polygon.setAttribute('fill', 'var(--color-accent)');
    polygon.setAttribute('fill-opacity', '0.2');
    polygon.setAttribute('stroke', 'var(--color-accent)');
    polygon.setAttribute('stroke-width', '2');
}

/**
 * Map theory names to dimension IDs for linking
 */
const theoryToDimension = {
    'Terror Management Theory': 'affective',
    'Positive Psychology': 'affective',
    'System Justification Theory': 'cognitive',
    'Cognitive Dissonance': 'cognitive',
    'Social Identity Theory': 'relational',
    'Cultural Theory of Risk': 'relational',
    "Holling's Adaptive Cycle": 'temporal',
    'Panarchy': 'temporal',
    'Self-Efficacy Theory': 'behavioral',
    'Behavioral Adaptation': 'behavioral'
};

/**
 * Get dimension ID for a theory name
 * Checks for partial matches in theory string
 */
function getDimensionForTheory(theoryString) {
    for (const [theoryName, dimensionId] of Object.entries(theoryToDimension)) {
        if (theoryString.includes(theoryName)) {
            return dimensionId;
        }
    }
    // Default to cognitive if no match found
    return 'cognitive';
}

/**
 * Render theoretical foundations
 */
function renderTheory() {
    const theoryList = document.getElementById('theoryList');
    const foundations = currentArchetype.theoreticalFoundations || [];

    theoryList.innerHTML = foundations.map(theory => {
        const dimensionId = getDimensionForTheory(theory);
        return `
            <li>
                <a href="../theory.html#${dimensionId}" class="theory-list-link" aria-label="Read about ${theory} in theoretical framework">
                    ${theory}
                    <i class="ph ph-arrow-right arrow-icon"></i>
                </a>
            </li>
        `;
    }).join('');

    // Add footer link to full framework
    const theorySection = theoryList.closest('.theory-section');
    if (theorySection && !theorySection.querySelector('.theory-explore-footer')) {
        const footer = document.createElement('div');
        footer.className = 'theory-explore-footer';
        footer.innerHTML = `
            <a href="../theory.html" class="explore-link theory-explore">
                <i class="ph ph-book-open"></i>
                Explore the Full Theoretical Framework
            </a>
        `;
        theorySection.appendChild(footer);
    }
}

/**
 * Render navigation buttons
 */
function renderNavigation() {
    const prevBtn = document.getElementById('prevArchetype');
    const nextBtn = document.getElementById('nextArchetype');

    const totalArchetypes = quizData.archetypes.length;
    const prevIndex = (currentArchetypeIndex - 1 + totalArchetypes) % totalArchetypes;
    const nextIndex = (currentArchetypeIndex + 1) % totalArchetypes;

    const prevArchetype = quizData.archetypes[prevIndex];
    const nextArchetype = quizData.archetypes[nextIndex];

    document.getElementById('prevArchetypeName').textContent = prevArchetype.name;
    document.getElementById('nextArchetypeName').textContent = nextArchetype.name;

    prevBtn.addEventListener('click', () => {
        navigateToArchetype(prevArchetype.id);
    });

    nextBtn.addEventListener('click', () => {
        navigateToArchetype(nextArchetype.id);
    });
}

/**
 * Navigate to a different archetype
 */
function navigateToArchetype(archetypeId) {
    window.location.href = `/archetypes/archetype.html?id=${archetypeId}`;
}

/**
 * Normalize score from -3 to +3 range to 0-100 percentage
 */
function normalizeScore(score) {
    return ((score + 3) / 6) * 100;
}

/**
 * Interpret dimension score in human terms
 */
function interpretDimensionScore(dimensionId, score) {
    const interpretations = {
        affective: {
            high: 'Strong positive emotional stance—hope, equanimity, or energized anticipation',
            moderate: 'Balanced emotional processing with adaptive regulation',
            low: 'Heightened anxiety, distress, or difficulty with emotional overwhelm'
        },
        cognitive: {
            high: 'Clear recognition and acknowledgment of collapse dynamics',
            moderate: 'Selective or context-dependent awareness',
            low: 'Active filtering or denial of destabilizing information'
        },
        relational: {
            high: 'Strong collective identity and group-oriented responses',
            moderate: 'Balanced individual and communal engagement',
            low: 'Primarily individualistic orientation with limited group affiliation'
        },
        temporal: {
            high: 'Future-oriented with planning and anticipation',
            moderate: 'Balanced temporal perspective across past, present, future',
            low: 'Past-oriented or present-focused with limited future projection'
        },
        behavioral: {
            high: 'Strong sense of agency with active coping and preparation',
            moderate: 'Selective action with context-dependent engagement',
            low: 'Limited agency with passive or avoidant coping strategies'
        }
    };

    const category = score > 1 ? 'high' : score < -1 ? 'low' : 'moderate';
    return interpretations[dimensionId]?.[category] || 'Balanced expression of this dimension';
}

/**
 * Utility: Capitalize first letter
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Show error state
 */
function showError() {
    loadingScreen.classList.add('hidden');
    errorScreen.classList.remove('hidden');
}

/**
 * Hide loading state and show content
 */
function hideLoading() {
    loadingScreen.classList.add('hidden');
    archetypeContent.classList.remove('hidden');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
