# 🦅 **CIPHER** - AI-Native Food Intelligence

<div align="center">

![CIPHER Logo](https://img.shields.io/badge/CIPHER-AI%20Food%20Intelligence-D4AF37?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNEOEFGMzciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgMnY0Ii8+PHBhdGggZD0iTTEyIDE4djQiLz48cGF0aCBkPSJNNC45MyA0LjkzbDIuODMgMi44MyIvPjxwYXRoIGQ9Ik0xNi4yNCAxNi4yNGwyLjgzIDIuODMiLz48cGF0aCBkPSJNMiAxMmg0Ii8+PHBhdGggZD0iTTE4IDEyaDQiLz48cGF0aCBkPSJNNC45MyAxOS4wN2wyLjgzLTIuODMiLz48cGF0aCBkPSJNMTYuMjQgNy43NmwyLjgzLTIuODMiLz48L3N2Zz4=)

**"Decode What You Eat"**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Groq](https://img.shields.io/badge/Groq-Llama%203-orange?style=flat-square)](https://groq.com/)
[![Dynamic UI](https://img.shields.io/badge/UI-Polymorphic-purple?style=flat-square)]()

[Live Demo](#royal-autopilot-demo) · [Presentation (PDF)](./presentation.pdf) · [Features](#features) · [Architecture](#architecture)

</div>

---

## ⚡ **What is CIPHER?**

CIPHER is not just a calorie counter. It is an **AI-Native Health Guardian**. 

It analyzes food through the lens of **YOUR unique biology** (Goals, Allergies, Biometrics) and uses a **generative, polymorphic UI** to present insights that matter.

---

## 🎭 **Dynamic UI System**

CIPHER's interface changes shape based on what you ask. It doesn't just show text; it renders **custom UI experiences** on the fly.

### ⚔️ **Battle Mode**
*Ask: "Compare this to RXBar" or simply "Battle Mode"*
- **Visual Face-Off**: A gorgeous "VS" card comparing two products.
- **Competitor Auto-Generation**: If you don't name a rival, AI picks a healthier alternative automatically.
- **Smart Verdicts**: Punchy, marketing-style winners (e.g., "The Superior Fuel").
- **Live Stats**: Dynamic progress bars for Protein, Sodium, and Fat.

### 🧬 **Optimization Protocol**
*Ask: "Optimize for Muscle Gain" or "How to improve this?"*
- **Actionable Plan**: Generates 3 concrete steps (e.g., "Add Spinach", "Drain Broth").
- **Projected Score**: Shows how much the health score increases if you follow the advice.
- **Rich Card**: Beautiful glassmorphism card with step-by-step icons.

### 🏭 **Manufacturing Timeline**
*Ask: "How is it made?"*
- **Visual Journey**: A step-by-step timeline of the industrial process.
- **Risk Analysis**: Highlights which steps introduce health risks (e.g. "High Heat Processing").
- **Traceability**: Visual indicator of data transparency.

---

## ✨ **Core Features**

### 🧬 **Bio-Initialization Ritual**
A luxury onboarding experience.
- **Tactile Inputs**: Haptic-style scroll wheels for biometric data.
- **Allergen Shield**: Visual guard against unsafe ingredients.
- **Goal Alignment**: Select "Muscle Gain", "Longevity", etc.

### 📊 **Health Intelligence Dashboard**
- **Hero Ring**: Instant 0-100 Health Score.
- **Risk Radar**: Scans for "Red Flags" like massive sodium or hidden sugars.
- **Scientific Persona**: The AI speaks like a **Clinical Bio-Analyst**, using precise terms like "osmotic stress" and "bioavailability".

### 🤖 **Context-Aware Chat**
- **Direct Answers**: Ask specific questions ("Safe limit?"), get specific answers.
- **Auto-Scroll**: The chat interface feels alive, sticking to the latest insights.

---

## 🚀 **Getting Started**

### 1. Clone & Install
```bash
git clone https://github.com/Aarush-Dubey/cipher.git
cd cipher
npm install
```

### 2. Setup Env
Create a `.env` file:
```bash
GROQ_API_KEY=your_api_key_here
```

### 3. Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 📂 **Project Structure**

```
cipher/
├── app/api/analyze/      # AI Brain (Llama-3 via Groq)
├── components/
│   ├── generative/       # The Polymorphic UI Components
│   │   ├── battle-card.tsx
│   │   └── manufacturing-timeline.tsx
│   ├── generative-result.tsx # The Rendering Engine
│   └── bio-*.tsx         # The Onboarding Ritual
└── ...
```

---

<div align="center">

**[View Presentation Deck](./presentation.pdf)**

*"To judge the fuel, we must first understand the engine."*

</div>
