# ENCODE: Technical Product Report
**Version 2.1** | Last Updated: January 2026

---

## 1. Executive Summary

**CIPHER** is an AI-native consumer health platform that transforms complex nutritional science into personalized, actionable intelligence. The application features a **"Futuristic Premium Health"** aesthetic with deep obsidian backgrounds, champagne gold accents, and fluid animations.

### Core Philosophy
- **Zero-UI Analysis**: Users input a product name (or scan/paste ingredients) and receive a dynamically generated, personalized health dashboard.
- **Polymorphic Interface**: The UI morphs based on user intent—the same chat input can render 10+ different component types depending on the context.
- **Personalized Health Guardian**: All analyses are tailored to the user's biometrics, goals, allergies, and health conditions.
- **Cinematic Autopilot**: A fully choreographed "Royal Demo" mode that showcases the platform's capabilities without user intervention.

---

## 2. Technical Architecture

### 2.1 Technology Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14+ (App Router) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS v4 + Custom Design System |
| **Animations** | Framer Motion (Luxury Easing Curves) |
| **UI Components** | Shadcn/UI (Radix Primitives) + Custom Generative UI Library |
| **State Management** | React Context (UserProfile, DemoController) + Local State |
| **AI Provider** | Groq Cloud API |
| **AI Model** | `llama-3.3-70b-versatile` (sub-second inference) |
| **SDK** | `groq-sdk` |

### 2.2 Project Structure

```
encode/
├── app/
│   ├── page.tsx                    # Main orchestrator (Triage Protocol)
│   ├── layout.tsx                  # Root layout + Providers
│   ├── globals.css                 # Aurora Design System
│   └── api/
│       ├── agent/
│       │   └── triage/route.ts     # Multi-step agentic analysis flow
│       ├── analyze/route.ts        # Product analysis endpoint
│       └── chat/route.ts           # Intent Router + Chat endpoint
├── components/
│   ├── generative/                 # The Generative UI Library
│   │   ├── battle-card.tsx         # Head-to-head product comparison
│   │   ├── compliance-matrix.tsx   # Diet/Allergy check visualization
│   │   ├── manufacturing-timeline.tsx # Farm-to-Table process flow
│   │   ├── nutrient-radar.tsx      # SVG Radar chart for macro balance
│   │   ├── toxicity-gauge.tsx      # Visual risk assessment
│   │   └── ... (see section 4)
│   ├── input-hero.tsx              # Zero-UI landing (Omni-Input)
│   ├── generative-result.tsx       # Chat feed + Dashboard renderer
│   ├── bio-sync-drawer.tsx         # Profile settings drawer
│   ├── bio-initialization-ritual.tsx # Luxury onboarding flow
│   └── royal-autopilot-demo.tsx    # Cinematic demo overlay system
├── context/
│   ├── user-profile-context.tsx    # Global profile state + calculations
│   └── demo-controller.tsx         # Scripted demo state machine
├── hooks/
│   ├── use-triage-protocol.ts      # State machine for app flow
│   └── use-demo-controller.tsx     # Demo phase orchestration
├── lib/
│   ├── utils.ts                    # Utility functions (cn)
│   └── data.ts                     # Mock data + constants
└── types/
    └── dashboard.ts                # TypeScript interfaces
```

---

## 3. Feature Inventory

### 3.1 Core User Flows

| Flow | Entry Point | Description |
|------|-------------|-------------|
| **Zero-UI Analysis** | `InputHero` | Minimalist landing with pulsating orb and Omni-Input. |
| **Bio-Initialization Ritual** | Auto-triggered | 5-screen luxury onboarding sequence to calibrate user biometrics. |
| **Generative Dashboard** | `GenerativeResult` | AI-synthesized product analysis with simulation engine. |
| **Polymorphic Chat** | Chat Input | Intent-aware responses using the extensive Generative UI library. |
| **Royal Autopilot Demo** | "`Show Me`" Button | A scripted, cinematic tour of the app's features with ghost-interactions. |

### 3.2 User Profile System

**Stored Data (`UserProfile`):**
- **Biometrics**: Height, Weight, Age, Sex calculations (BMI, BMR).
- **Goals**: "Muscle Gain", "Fat Loss", "Heart Health", etc.
- **Constraints**: Allergies, Diets (Keto, Vegan), Medical Conditions.
- **Derived Metrics**: Daily Sodium Cap (dynamic based on condition), Caloric Needs.

**Personalization Logic:**
- **ConflictGuard**: Automatically flags ingredients that violate specific user constraints (e.g., Peanuts for allergy, High Sodium for Hypertension).
- **Goal Alignment**: Scores products based on how well they fit the user's specific fitness goals.

---

## 4. Generative UI System

### 4.1 Component Factory Pattern

The application uses a **Polymorphic Component Factory** to dynamically render React components based on AI response type. The AI determines the best way to visualize information and returns a component type.

### 4.2 Expanded Component Library (`components/generative/`)

| Component | Trigger Context | Visual Description |
|-----------|-----------------|---------------------|
| `compliance_matrix` | "Is this keto?", "Allergies?" | Grid of checks/crosses for diet & allergy safety. |
| `battle_card` | "Compare to X", "vs Y" | Split-screen VS card comparing macros and health score. |
| `manufacturing_timeline` | "How is it made?", "Process" | Horizontal flow showing sourcing, processing, and packaging steps. |
| `toxicity_gauge` | "Is it safe?", "Additives" | Semi-circle gauge showing risk levels of specific ingredients. |
| `nutrient_radar` | General Analysis | Spider chart visualizing protein/fat/carb/sodium balance. |
| `eco_impact` | "Environment", "Sustainable" | Visualization of carbon footprint, water usage, and packaging. |
| `better_swap` | "Healthier alternative" | Recommendation card for a better product match. |
| `molecular_lens` | "Ingredient detail" | Deep dive into a specific chemical compound. |
| `energy_wave` | "Caffeine", "Energy" | Graph showing energy release over time (crash vs sustained). |
| `truth_terminal` | "Marketing claims" | Analysis of package claims vs nutritional reality. |

### 4.3 Rendering Flow

```
User Query → /api/chat → Intent Classification
                               ↓
                      Select Visual Metaphor
                               ↓
              { type: "manufacturing_timeline", data: {...} }
                               ↓
         GenerativeUIPattern → <ManufacturingTimeline data={...} />
```

---

## 5. Royal Autopilot Demo System

A specialized system designed to demonstrate the platform's capabilities without user input. It uses a **Ghost Interaction Engine** to simulate mouse movements, clicks, and typing.

### 5.1 Architecture (`use-demo-controller.tsx`)

- **Script-Driven**: Defined by a chronological array of `DemoAction` objects.
- **Ghost Actions**:
    - `ghost_move`: Smoothly animates a cursor to a target DOM element.
    - `ghost_click`: Simulates a click event and visual ripple.
    - `ghost_type`: Types text into input fields character-by-character.
- **Director Mode**: Overlays "Director's Commentary" explaining the system's actions.
- **Phase Control**: Allows skipping between defined chapters:
    1. **The Cold Start**: Unprofiled query execution.
    2. **The Gate**: System refuses to analyze without context.
    3. **The Ritual**: Automated profile creation.
    4. **Auto-Retry**: Rerunning the query with new context.
    5. **Cross-Examination**: Showcasing dynamic UI (Timeline, Battle Card).

---

## 6. Health Intelligence Dashboard

### 6.1 Simulation Engine

The dashboard includes an interactive **"What If" Simulator** for Recipe Hacking. Users can toggle modifications ("Drain Noodles", "Skip Packet") to see real-time updates to the Health Score and Sodium levels.

### 6.2 Data Model

```typescript
interface SimulationData {
    base_stats: { score: number; calories: number; sodium_mg: number; ... };
    modifiers: Array<{
        id: string;
        label: string;
        active: boolean;
        impact: { score_delta: number; sodium_mg: number; ... };
    }>;
    verdicts: { default: string; improved: string; optimized: string; };
}
```

---

## 7. API Endpoints

### 7.1 `/api/agent/triage`
**Purpose**: The primary entry point for complex analysis. It orchestrates the multi-step reasoning process (Search identifying, Ingredient breakdown, Health Scoring).

### 7.2 `/api/analyze`
**Purpose**: Quick-response product analysis. Accepts `userProfile` and `query` to return `HealthDashboardData`.

### 7.3 `/api/chat`
**Purpose**: Conversational specialized agent. handles follow-up questions and determines which "Generative UI" component to render next.

---

## 8. Design System ("Aurora")

### 8.1 Visual Language
- **Background**: `oklch(0.08 0.01 260)` (Deep Obsidian)
- **Primary**: `oklch(0.75 0.18 160)` (Aurora Teal)
- **Accent**: `oklch(0.65 0.15 280)` (Deep Purple)
- **Glassmorphism**: Heavy use of `backdrop-blur-md` and white/10 borders.

### 8.2 Animation
- **Orchestration**: `Framer Motion` used for all entry/exit animations.
- **Curve**: Custom "Luxury Ease" `[0.16, 1, 0.3, 1]` for premium feel.

---

## 9. Future Roadmap

- [ ] **Vision API Integration**: Scanning physical barcodes/labels via camera.
- [ ] **Voice-to-SQL**: Natural language querying of nutrition databases.
- [ ] **Wearable Sync**: Import real-time biometric data (Apple Health/Oura).
- [ ] **Social Leaderboards**: Gamified health scores vs friends.
- [ ] **Instacart Integration**: One-click ordering of "Better Swaps".

---

*ENCODE — Decode What You Eat™*
