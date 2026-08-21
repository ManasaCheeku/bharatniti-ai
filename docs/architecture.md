# BharatNiti AI — Architecture & System Design

## Overview

**BharatNiti AI** is an AI-powered multilingual citizen-development intelligence platform for Digital Public Infrastructure (DPI) & Governance. Built for India and designed according to Digital Public Good principles for BRICS scale adaptation, it converts unstructured citizen requests from Web Text, Voice, and Messaging channels (in English, Kannada, Hindi) into actionable development intelligence, prioritized hotspots, public investment gap metrics, and evidence-backed policy recommendations.

---

## High-Level System Architecture

```text
Citizen Channels
       │
       ├── Text
       ├── Voice
       └── Messaging App (Prototype)
              │
              ↓
          Gemini AI (google-genai / Demo Fallback)
              │
       ┌──────┼─────────┐
       ↓      ↓         ↓
 Citizen  Demographic Infrastructure
 Feedback    Data       Data
       │      │         │
       └──────┼─────────┘
              ↓
      Public Investment Data
              ↓
       Development Gap Matrix
              ↓
       Priority Engine (Deterministic 0-100)
              ↓
       Hotspot Detection
              ↓
      Policy Recommendation Briefs
```

---

## Core Components

1. **Multi-Channel & Multilingual Intake**:
   - Web Text, Web Speech API Voice, and Messaging App Gateway (Simulated Prototype).
   - Uses `google-genai` Python SDK to invoke Gemini models.
   - Detects input language (Kannada, Hindi, English).
   - Translates text to common internal representation while preserving original voice.
   - Classifies domain, subcategory, urgency, infrastructure gap, and estimated population impact.

2. **Transparent Priority Engine**:
   - Computes weighted priority score:
     $$\text{Priority Score} = 0.30 \times \text{Demand} + 0.25 \times \text{Urgency} + 0.20 \times \text{Gap} + 0.15 \times \text{Affected Pop} + 0.10 \times \text{Vulnerability}$$
   - Normalized from 0 to 100.

3. **Public Investment & Development Gap Layer**:
   - Cross-references baseline infrastructure metrics with sectoral public investment coverage (`data/public_investment.json`).
   - Computes Development Gap Score combining Infrastructure Gap and Public Investment Deficits.

4. **Development Hotspot Aggregator**:
   - Aggregates requests by Country, State/Region, District/City, and Category.
   - Ranks high-priority hotspots across India with country-independent BRICS data model support.

5. **AI Policy Brief Studio**:
   - Synthesizes problem summaries, baseline indicators, public investment context, recommended interventions, expected outcomes, risks, and implementation roadmaps.
