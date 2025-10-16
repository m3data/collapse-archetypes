# Dimension Interpretations: Design Philosophy

## Overview

This document explains the human-centered, emotionally resonant interpretations for the 5-dimensional personality analysis in the Collapse Archetype Quiz.

## Design Principles

### 1. Human and Relatable
- Uses "you" language (second person) to create direct connection
- Grounds abstract concepts in lived experience
- Avoids academic jargon and clinical language

### 2. Emotionally Resonant
- Acknowledges the feeling tone of each position
- Meets users where they are without judgment
- Honors the emotional reality of collapse awareness

### 3. Non-Pathologizing
- All scores are valid ways of being
- No position is framed as "right" or "wrong"
- Recognizes both gifts and challenges of each stance

### 4. Dimension-Specific
- Each dimension has unique language reflecting its core meaning
- Interpretations align with the theoretical foundations
- Language matches the archetypal territory each dimension explores

### 5. Nuanced Across Ranges
- Five levels per dimension (0-20, 20-40, 40-60, 60-80, 80-100)
- Each level has distinct meaning, not just intensity
- Progression reflects genuine differences in experience

## The Five Dimensions

### 1. Affective Dimension
**Scale: Fear/Anxiety → Hope/Equanimity**

**Design Intent:** Honor the emotional reality of collapse awareness without pathologizing distress or romanticizing transcendence.

**Score Interpretations:**
- **0-20 (Very Low):** Protection through distance
  - "You tend to protect your emotional equilibrium by maintaining distance from overwhelming feelings."
  - Acknowledges defensive strategy as valid self-preservation

- **20-40 (Low):** Steady presence
  - "You navigate uncertainty with a steady presence, neither dwelling in despair nor floating in transcendence."
  - Honors middle emotional ground

- **40-60 (Moderate):** Balanced functioning
  - "You hold a balanced emotional stance, acknowledging difficulty while preserving your capacity to function."
  - Values pragmatic emotional regulation

- **60-80 (High):** Relative calm
  - "You carry collapse awareness with relative calm, finding sources of steadiness even amid turbulence."
  - Recognizes capacity without claiming perfection

- **80-100 (Very High):** Genuine equanimity
  - "You meet uncertainty with genuine equanimity, grounded in practices or perspectives that sustain inner peace."
  - Honors deep work required for this stance

### 2. Cognitive Dimension
**Scale: Denial → Full Awareness**

**Design Intent:** Respect different levels of engagement with collapse information without shaming avoidance or valorizing obsession.

**Score Interpretations:**
- **0-20 (Very Low):** Focused filtering
  - "You filter the noise of catastrophic information, focusing on what you can see and touch in your immediate world."
  - Reframes denial as protective focus

- **20-40 (Low):** Selective acknowledgment
  - "You acknowledge some signs of instability but don't let them dominate your worldview or daily experience."
  - Values boundary-setting with information

- **40-60 (Moderate):** Clear seeing
  - "You see the patterns clearly enough to understand what's unfolding without being consumed by every data point."
  - Honors discernment

- **60-80 (High):** Close tracking
  - "You track systemic fragility closely, integrating uncomfortable evidence into your understanding of the world."
  - Acknowledges work of staying informed

- **80-100 (Very High):** Unflinching witness
  - "You see the patterns clearly and don't look away, even when it's uncomfortable."
  - Honors courage of sustained attention

### 3. Relational Dimension
**Scale: Individual → Collective**

**Design Intent:** Honor both autonomy and belonging without valorizing individualism or romanticizing collectivism.

**Score Interpretations:**
- **0-20 (Very Low):** Grounded autonomy
  - "You ground your responses in personal autonomy, trusting your own judgment and tending to your immediate circle."
  - Respects self-reliance

- **20-40 (Low):** Balanced independence
  - "You balance self-reliance with selective connection, maintaining independence while staying aware of community."
  - Values strategic relationship

- **40-60 (Moderate):** Fluid navigation
  - "You navigate between individual agency and collective belonging, drawing on both as circumstances require."
  - Honors adaptability

- **60-80 (High):** Collective orientation
  - "You orient strongly toward collective identity and shared struggle, finding strength in solidarity."
  - Recognizes solidarity as resource

- **80-100 (Very High):** Rooted in community
  - "You root your sense of self in community and shared purpose, seeing individual and collective fates as inseparable."
  - Honors deep interdependence

### 4. Temporal Dimension
**Scale: Past-Oriented → Future-Oriented**

**Design Intent:** Honor all temporal orientations as valid stances, from ancestral grounding to future preparation.

**Score Interpretations:**
- **0-20 (Very Low):** Ancestral grounding
  - "You hold tight to what came before—traditions, ancestral wisdom, and the grounding weight of history."
  - Values continuity and lineage

- **20-40 (Low):** Present and proven
  - "You draw more from past and present than distant futures, valuing what's proven and what's immediate."
  - Honors tested knowledge

- **40-60 (Moderate):** Temporal balance
  - "You balance past wisdom, present reality, and future possibility without being captured by any single timeframe."
  - Values fluid temporality

- **60-80 (High):** Forward-leaning
  - "You lean into what's coming, preparing for or imagining futures that haven't yet arrived."
  - Recognizes anticipatory capacity

- **80-100 (Very High):** Horizon-oriented
  - "You live oriented toward the horizon—what's next, what might emerge, what you can shape or prepare for."
  - Honors future focus

### 5. Behavioral Dimension
**Scale: Passive → Active**

**Design Intent:** Validate all levels of agency without shaming low capacity or fetishizing hyperactivity.

**Score Interpretations:**
- **0-20 (Very Low):** Limited energy
  - "You navigate with what energy you have, accepting that agency feels limited given the forces at play."
  - Honors real constraints

- **20-40 (Low):** Selective action
  - "You take action when it feels meaningful but don't carry the weight of trying to fix everything."
  - Values boundary-setting

- **40-60 (Moderate):** Engaged response
  - "You engage with what's in front of you, taking steps where you can without exhausting yourself with constant intervention."
  - Honors sustainable engagement

- **60-80 (High):** Concrete action
  - "You channel awareness into concrete action, building skills, plans, or movements that feel within your reach."
  - Recognizes translation of understanding to practice

- **80-100 (Very High):** Embodied preparation
  - "You embody active preparation and engagement, translating understanding into tangible steps toward resilience."
  - Honors sustained agency

## Implementation Details

### Technical Structure

```javascript
function getDimensionInterpretation(dimensionId, normalizedScore) {
    // Returns human-centered interpretation based on:
    // 1. Dimension ID (affective, cognitive, relational, temporal, behavioral)
    // 2. Normalized score (0-100)

    // Score ranges:
    // 0-20: veryLow
    // 20-40: low
    // 40-60: moderate
    // 60-80: high
    // 80-100: veryHigh
}
```

### Integration with Results Display

The `renderDimensionCards()` function now:
1. Calculates normalized scores (0-100 scale)
2. Calls `getDimensionInterpretation()` for human-centered text
3. Displays interpretation prominently above technical description
4. Maintains theoretical basis for transparency

### Visual Hierarchy

```
Dimension Name
Score Bar (0-100 visual)
→ Human Interpretation (new, prominent)
Technical Description
Theoretical Basis
```

## Writing Style Guidelines

### Voice and Tone
- Second person ("you")
- Warm, honest, grounded
- Wise friend reflecting back, not clinician diagnosing
- 1-2 sentences max per interpretation

### Language Patterns
- Active verbs: navigate, hold, carry, embody, channel
- Concrete imagery: distance, ground, horizon, weight
- Honest acknowledgment: "limited," "protecting," "accepting"
- Non-judgment: "valid," "honors," "acknowledges"

### What to Avoid
- Clinical language: "expression," "manifestation," "presentation"
- Hierarchical framing: "better," "worse," "optimal"
- Absolute statements: "always," "never," "must"
- Pathologizing: "dysfunction," "disorder," "deficit"

## Future Enhancements

### Potential Additions
1. **Archetypal resonance notes:** Brief phrases linking dimension scores to archetype results
2. **Context-sensitive interpretation:** Different language based on combined scores across dimensions
3. **Growth edges:** Gentle suggestions for exploration (optional, user-requested only)
4. **Validation messages:** Additional affirmation for users at extremes

### User Feedback Integration
Monitor for:
- Which interpretations resonate most/least
- Requests for more detail or context
- Emotional responses to language choices
- Accessibility concerns (reading level, clarity)

## Theoretical Alignment

Each interpretation aligns with the theoretical foundations in quiz-data.json:

- **Affective:** Terror Management Theory, Emotional Regulation
- **Cognitive:** Cognitive Dissonance, System Justification
- **Relational:** Social Identity Theory, Cultural Theory of Risk
- **Temporal:** Temporal Psychology, Adaptive Cycle Theory
- **Behavioral:** Self-Efficacy Theory, Coping Theory

The language translates academic frameworks into lived experience while maintaining theoretical integrity.

## Accessibility Notes

### Readability
- Flesch-Kincaid Grade Level: 8-10
- Average sentence length: 12-18 words
- Concrete language over abstract concepts

### Emotional Safety
- Non-triggering language
- Validates all positions
- Offers reflection without prescription
- Maintains user autonomy

### Cultural Sensitivity
- Avoids culturally-specific assumptions
- Honors diverse coping strategies
- Recognizes structural constraints
- Validates marginalized experiences

---

**Last Updated:** 2025-10-16
**Author:** UX Weaver (Claude Code)
**Status:** Implemented in src/js/app.js
