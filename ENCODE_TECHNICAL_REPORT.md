# ENCODE: Technical Product Report
**Version 2.0** | Last Updated: January 2026

---

## 1. Executive Summary

**ENCODE** is an AI-native consumer health platform that transforms complex nutritional science into personalized, actionable intelligence. The application features a **"Futuristic Premium Health"** aesthetic with deep obsidian backgrounds, champagne gold accents, and fluid animations.

### Core Philosophy
- **Zero-UI Analysis**: Users input a product name (or scan/paste ingredients) and receive a dynamically generated, personalized health dashboard
- **Polymorphic Interface**: The UI morphs based on user intent—the same chat input can render 5+ different component types
- **Personalized Health Guardian**: All analyses are tailored to the user's biometrics, goals, allergies, and health conditions

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
| **State Management** | React Context (UserProfile) + Local State |
| **AI Provider** | Groq Cloud API |
| **AI Model** | `llama-3.3-70b-versatile` (sub-second inference) |
| **SDK** | `groq-sdk` |

### 2.2 Project Structure

```
encode/
├── app/
│   ├── page.tsx                    # Main orchestrator (Triage Protocol)
│   ├── layout.tsx                  # Root layout + ProfileProvider
│   ├── globals.css                 # Aurora Design System
│   └── api/
│       ├── analyze/route.ts        # Initial product analysis endpoint
│       └── chat/route.ts           # Intent Router + Chat endpoint
├── components/
│   ├── input-hero.tsx              # Zero-UI landing (Omni-Input)
│   ├── generative-result.tsx       # Chat feed + Dashboard renderer
│   ├── generative-ui-patterns.tsx  # Polymorphic component factory
│   ├── health-intelligence-dashboard.tsx  # Simulation Engine UI
│   ├── bio-sync-drawer.tsx         # Profile settings drawer
│   ├── bio-initialization-ritual.tsx  # Luxury onboarding flow
│   └── technical-report-view.tsx   # Debug/report view
├── context/
│   └── user-profile-context.tsx    # Global profile state + calculations
├── hooks/
│   └── use-triage-protocol.ts      # State machine for app flow
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
| **Zero-UI Analysis** | `InputHero` | Minimalist landing with pulsating orb and Omni-Input |
| **Bio-Initialization Ritual** | Auto-triggered on first scan | 5-screen luxury onboarding sequence |
| **Generative Dashboard** | `GenerativeResult` | AI-synthesized product analysis with simulation engine |
| **Polymorphic Chat** | Chat input in feed | Intent-aware responses with dynamic UI components |
| **Profile Management** | `BioSyncDrawer` | Settings panel for biometrics, goals, and constraints |

### 3.2 User Profile System

#### Context: `user-profile-context.tsx`

**Stored Data:**
```typescript
interface UserProfile {
    biometrics: {
        weight_kg: number;
        height_cm: number;
        age: number;
        sex: "male" | "female" | "other";
    };
    goals: string[];        // ["fat_loss", "muscle_gain", "heart_health", "maintain"]
    constraints: {
        allergies: string[];  // ["Peanuts", "Gluten", ...]
        diet: string[];       // ["Keto", "Vegan", "Low Sodium", ...]
        conditions: string[]; // ["Hypertension", "Diabetes (Type 2)", ...]
    };
    // Auto-Calculated
    bmr: number;            // Basal Metabolic Rate (Mifflin-St Jeor)
    bmi: number;            // Body Mass Index
    dailySodiumCap: number; // 2300mg standard, 1500mg for hypertension/heart_health
    dailyCalories: number;  // TDEE based on BMR + goal modifier
}
```

**Personalization Logic:**
- Profile data is sent to `/api/analyze` for personalized scoring
- Allergen detection triggers `ConflictGuard` banner
- Heart health goal automatically reduces sodium cap to 1500mg
- AI prompts include profile constraints for biased analysis

---

## 4. Generative UI System

### 4.1 Component Factory Pattern

The application uses a **Polymorphic Component Factory** (`generative-ui-patterns.tsx`) to dynamically render React components based on AI response type.

### 4.2 Available UI Components

#### A. Context-Aware AI Components (Intent-Based)

| Component | Trigger Keywords | Visual Description |
|-----------|------------------|---------------------|
| `compliance_checklist` | "keto", "vegan", "gluten", "diet" | Animated checklist with ✅❌⚠️ badges and expandable reasons |
| `comparison_card` | "compare", "better", "vs", "versus" | Split-screen VS card with gradient winners and stat comparison |
| `process_timeline` | "how", "made", "process", "farm" | Horizontal timeline showing manufacturing stages (Farm→Factory→Plate) |
| `product_carousel` | "swap", "alternative", "instead" | 3-card horizontal carousel with health scores and match percentages |
| `ingredient_deep_dive` | "what is", "ingredient", "chemical" | Periodic-table style grid with molecular data, functions, and safety |

#### B. Legacy/Fallback Components

| Component | Purpose |
|-----------|---------|
| `safety_gauge` | Semi-circle gauge for toxicity levels |
| `regulatory_map` | Geographic legality visualization |
| `energy_graph` | Caffeine/energy curve over time |
| `truth_scanner` | Marketing claim verification |
| `molecular_view` | Chemical structure visualization |
| `text` | Plain AI text response |

### 4.3 Component Rendering Flow

```
User Query → /api/chat → Intent Classification (Keyword-Based)
                              ↓
                      Generate Component JSON
                              ↓
              { type: "compliance_checklist", data: {...} }
                              ↓
         GenerativeUIPattern → Switch(type) → <ComplianceAuditor />
```

---

## 5. Bio-Initialization Ritual

A **5-screen luxury onboarding sequence** that triggers when a user with an empty profile attempts their first scan.

### 5.1 Screen Breakdown

| Screen | Name | Elements |
|--------|------|----------|
| **1** | The Greeting | Welcome message, golden orb, "Begin Calibration" button |
| **2** | The Metrics | Height/Weight dial controls, live BMI calculation |
| **3** | The Constraints | Allergen chip selection, "Shield" list |
| **4** | The Ambition | 4 goal cards with gradient overlays |
| **5** | The Synthesis | Golden ring animation, data stream, "Continue to Analysis" button |

### 5.2 Design Language

- **Background**: Deep Obsidian (`#050A14`)
- **Accents**: Champagne Gold (`#D4AF37`)
- **Typography**: Serif headings, Monospace data
- **Micro-typography**: Spaced uppercase labels (`S T E P  0 1`)
- **Easing**: Luxury cubic-bezier `[0.16, 1, 0.3, 1]`

---

## 6. Health Intelligence Dashboard

### 6.1 Simulation Engine

The dashboard includes an interactive **"What If" Simulator** for Recipe Hacking.

**Schema:**
```typescript
interface SimulationData {
    base_stats: {
        score: number;
        calories: number;
        sodium_mg: number;
        protein_g: number;
        carbs_g: number;
        fat_g: number;
    };
    modifiers: Array<{
        id: string;
        label: string;        // "Drain Noodles"
        active: boolean;
        impact: {
            score_delta: number;
            sodium_mg?: number;
            fat_g?: number;
            // ...other deltas
        };
    }>;
    verdicts: {
        default: string;      // "Poor Choice"
        improved: string;     // "Acceptable"
        optimized: string;    // "Healthier Option"
    };
}
```

### 6.2 Dashboard Components

- **Hero Score Ring**: SVG donut with animated fill
- **Modifier Toggles**: Interactive "Recipe Hacks"
- **Stat Grid**: Real-time stat updates based on modifiers
- **Verdict Badge**: Dynamic recommendation based on state

---

## 7. API Endpoints

### 7.1 `/api/analyze` (POST)

**Purpose**: Generate initial AI analysis for a product.

**Request:**
```json
{
    "query": "Spicy Ramen",
    "userContext": "I'm on a low sodium diet",
    "userProfile": {
        "goals": ["heart_health"],
        "constraints": {
            "allergies": ["Peanuts"],
            "conditions": ["Hypertension"]
        },
        "dailySodiumCap": 1500
    }
}
```

**Response:** Full `HealthDashboardData` JSON including `meta`, `simulation`, and component data.

### 7.2 `/api/chat` (POST)

**Purpose**: Intent Router for follow-up questions.

**Request:**
```json
{
    "message": "Is this keto friendly?",
    "product": "Spicy Ramen",
    "ingredients": ["Wheat Noodles", "MSG", "Palm Oil"]
}
```

**Response:**
```json
{
    "summary": "No, this is not keto. The wheat noodles contain 60g of carbs per serving.",
    "component": {
        "type": "compliance_checklist",
        "data": {
            "title": "Keto Compliance",
            "checks": [
                { "label": "Net Carbs < 20g", "status": "fail", "value": "60g", "reason": "Wheat noodles" },
                { "label": "No Added Sugar", "status": "pass" },
                { "label": "High Fat Ratio", "status": "warning", "reason": "Not balanced" }
            ]
        }
    }
}
```

---

## 8. Design System

### 8.1 Color Palette (Dark Mode)

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `oklch(0.08 0.01 260)` | Page background |
| `--card` | `oklch(0.12 0.015 260)` | Card surfaces |
| `--primary` | `oklch(0.75 0.18 160)` | Aurora teal accent |
| `--accent` | `oklch(0.65 0.15 280)` | Secondary purple |
| `--destructive` | `oklch(0.55 0.22 25)` | Error/danger states |

### 8.2 Animation Tokens

```typescript
const luxuryEase = [0.16, 1, 0.3, 1] as [number, number, number, number];

// Standard transitions
const fadeIn = { opacity: 0 → 1, duration: 0.8 };
const blurExit = { opacity: 0, filter: "blur(20px)" };
const springy = { type: "spring", damping: 25, stiffness: 200 };
```

---

## 9. Error Handling & Fallbacks

| Scenario | Behavior |
|----------|----------|
| API Timeout | Show cached mock data or "System Offline" dashboard |
| Invalid JSON from AI | Fallback to text-only response |
| Missing Profile | Trigger Bio-Initialization Ritual |
| Allergen Detected | Render `ConflictGuard` banner |
| Unknown UI Type | Render placeholder widget |

---

## 10. Environment Variables

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
```

---

## 11. Future Roadmap

- [ ] **Barcode Scanning**: Camera-based UPC lookup
- [ ] **Voice Input**: Whisper-based transcription
- [ ] **Profile Sync**: Cloud persistence with auth
- [ ] **Meal Logging**: Track daily intake against goals
- [ ] **Social Sharing**: Export analysis as shareable cards
- [ ] **Multi-Language**: i18n support for prompts and UI

---

## 12. Component Reference

### Quick Import Map

```typescript
// Core UI
import { InputHero } from "@/components/input-hero";
import { GenerativeResult } from "@/components/generative-result";
import { HealthIntelligenceDashboard } from "@/components/health-intelligence-dashboard";

// Generative UI
import { GenerativeUIPattern } from "@/components/generative-ui-patterns";
// Renders: ComplianceAuditor, ComparisonCard, ProcessTimeline, SwapCarousel, IngredientDeepDive

// Profile System
import { ProfileProvider, useUserProfile } from "@/context/user-profile-context";
import { BioAvatarButton, BioSyncDrawer, ConflictGuard } from "@/components/bio-sync-drawer";
import { BioInitializationRitual } from "@/components/bio-initialization-ritual";

// Hooks
import { useTriageProtocol } from "@/hooks/use-triage-protocol";
```

---

*ENCODE — Decode What You Eat™*
