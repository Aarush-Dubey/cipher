# CIPHER - AI-Native Food Intelligence

<div align="center">

![CIPHER Logo](https://img.shields.io/badge/CIPHER-AI%20Food%20Intelligence-D4AF37?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNEOEFGMzciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgMnY0Ii8+PHBhdGggZD0iTTEyIDE4djQiLz48cGF0aCBkPSJNNC45MyA0LjkzbDIuODMgMi44MyIvPjxwYXRoIGQ9Ik0xNi4yNCAxNi4yNGwyLjgzIDIuODMiLz48cGF0aCBkPSJNMiAxMmg0Ii8+PHBhdGggZD0iTTE4IDEyaDQiLz48cGF0aCBkPSJNNC45MyAxOS4wN2wyLjgzLTIuODMiLz48cGF0aCBkPSJNMTYuMjQgNy43NmwyLjgzLTIuODMiLz48L3N2Zz4=)

**Decode What You Eat**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11.0-FF0055?style=flat-square&logo=framer)](https://www.framer.com/motion/)

[Live Demo](#royal-autopilot-demo) · [Features](#features) · [Getting Started](#getting-started) · [Architecture](#architecture)

</div>

---

## 🎯 Overview

**CIPHER** is an AI-native food intelligence platform that provides personalized ingredient analysis and health insights based on your unique biological profile. Unlike generic nutrition apps, CIPHER refuses to give generic answers—it analyzes every food through the lens of YOUR specific goals, allergies, and biometrics.

### The Philosophy

> "To judge the fuel, we must first understand the engine."

Standard apps treat everyone the same. CIPHER creates a personalized "health guardian" that:
- **Understands** your unique physiology (height, weight, age, BMI)
- **Guards** against your allergens (Peanuts, Gluten, Dairy, etc.)
- **Aligns** with your goals (Muscle Gain, Weight Loss, Heart Health, etc.)

---

## ✨ Features

### 🧬 Bio-Initialization Ritual
A luxury onboarding experience that captures your biological profile through an elegant, tactile interface.

- **Haptic Scroll Wheels** for height/weight input
- **Allergen Shield** with visual confirmation
- **Goal Protocol Selection** with animated cards

### 📊 Health Intelligence Dashboard
A generative UI that morphs based on the food being analyzed.

- **Hero Score Ring** - Instant health verdict (0-100)
- **Key Insights** - Risk/Warning/Benefit cards with icons
- **Simulation Engine** - "Hack" any recipe to improve its score

### 🤖 Context-Aware AI Analysis
Powered by Groq's LLM API for lightning-fast inference.

- **Intent Recognition** - Understands "post-workout" context
- **Personalized Verdicts** - Tailored to YOUR goals
- **Conflict Detection** - Guards against allergens

### 🎬 Royal Autopilot Demo
A cinematic, 90-second guided tour showcasing the platform's capabilities.

- **Ghost Cursor** - Animated gold orb with comet trail
- **Director's Commentary** - Glassmorphism narration cards
- **The Gate** - "Subject Unidentified" failure animation
- **Cinema Mode** - Dim overlay with scanlines

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Groq API Key (for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/cipher.git

# Navigate to project
cd cipher

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your Groq API key to .env
echo "GROQ_API_KEY=your_api_key_here" >> .env

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Groq API key for LLM inference | Yes |

---

## 🏗️ Architecture

```
cipher/
├── app/
│   ├── api/
│   │   ├── analyze/          # Food analysis endpoint
│   │   └── agent/triage/     # Intent classification
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Main application page
│   └── globals.css           # Design system tokens
├── components/
│   ├── input-hero.tsx        # Search interface
│   ├── generative-result.tsx # Dynamic dashboard
│   ├── bio-initialization.tsx # Profile ritual
│   ├── bio-avatar-button.tsx # Profile indicator
│   ├── bio-sync-drawer.tsx   # Profile editor
│   └── royal-autopilot-demo.tsx # Demo system
├── hooks/
│   ├── use-demo-controller.tsx # Demo state machine
│   └── use-triage-protocol.ts  # API orchestration
├── context/
│   └── user-profile-context.tsx # Global profile state
└── types/
    └── dashboard.ts          # TypeScript interfaces
```

---

## 🎨 Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#050A14` | Deep obsidian base |
| `--primary` | `#D4AF37` | Gold accent |
| `--destructive` | `#EF4444` | Risk indicators |
| `--warning` | `#F59E0B` | Warning indicators |
| `--success` | `#10B981` | Benefit indicators |

### Typography

- **Display**: Geist Sans (Variable)
- **Mono**: Geist Mono (Variable)
- **Tracking**: Wide spacing for uppercase labels

### Animation Principles

- **Luxury Easing**: `[0.16, 1, 0.3, 1]`
- **Spring Physics**: `damping: 20, stiffness: 100`
- **Glassmorphism**: `backdrop-blur-xl` + subtle borders

---

## 🎬 Royal Autopilot Demo

The demo is a 90-second cinematic experience:

| Phase | Time | Description |
|-------|------|-------------|
| Welcome | 0-4s | Introduction |
| Cold Start | 4-18s | Ghost types query, submits |
| The Gate | 18-28s | "Subject Unidentified" popup |
| Ritual | 28-53s | Profile calibration animation |
| Auto-Retry | 53-65s | Query resubmits with context |
| Verdict | 65-85s | Mock dashboard renders |
| Handover | 85-90s | Demo ends |

### Triggering the Demo

Click the **"Experience CIPHER"** button on the home screen.

---

## 🧩 Key Components

### `useDemoController`
React Context + State Machine for orchestrating the demo.

```typescript
const demo = useDemoController();
demo.startDemo();  // Begin the 90s experience
demo.stopDemo();   // Exit immediately
demo.skipToPhase(3); // Jump to specific phase
```

### `RoyalAutopilotDemo`
Visual overlay with Ghost Cursor, Intent Visualizer, Gate, Ritual display, and Mock Dashboard.

### `GenerativeResult`
Dynamic dashboard that renders based on AI analysis response.

### `BioInitializationRitual`
Full-screen profile creation experience with haptic-style inputs.

---

## 📡 API Endpoints

### `POST /api/analyze`
Analyzes food with user profile context.

**Request:**
```json
{
  "query": "Is instant ramen healthy?",
  "userProfile": {
    "height": 180,
    "weight": 80,
    "allergies": ["Peanuts"],
    "goals": ["muscle_gain"]
  }
}
```

### `POST /api/agent/triage`
Classifies user intent and routes to appropriate agent.

---

## 🛣️ Roadmap

- [ ] Real haptic feedback (Web Vibration API)
- [ ] Voice input support
- [ ] Barcode/image scanning
- [ ] Recipe builder with optimization
- [ ] Weekly/monthly health reports
- [ ] Social sharing of "hacked" recipes

---

## 📄 License

MIT © 2024

---

<div align="center">

**Built with obsessive attention to detail.**

*"Decode what you eat."*

</div>
