# CIPHER: Technical Presentation Slides
**Target Audience:** Technical Judges (Execution & Methodology)
**Source:** Technical Product Report v2.1

---

## Slide 1: Executive Technical Summary

**Visual Directive:**
A high-fidelity render of the "Zero-UI" landing page (The glowing Omni-Input) against an Obsidian background.

### [Left Column: The Platform]

# **CIPHER**
### **v2.1 // Technical Report**
**Stack:** Next.js 14 (App Router) + Groq Cloud (Llama-3) + Tailwind v4

### [Right Column: Core Philosophy]

*   **Zero-UI Analysis:** We eliminated forms. Input is handled via a single "Omni-Input" that accepts text, barcodes, or natural language.
*   **Polymorphic Interface:** The UI is not static. It is a **Component Factory** that renders 10+ distinct UI types (Battle Cards, Timelines, Radars) based on inferred user intent.
*   **Cinematic Autopilot:** A script-driven "Ghost Engine" that demonstrates the platform capabilities via simulated DOM interactions, eliminating the need for video files.

### [Footer]
*Status: Production Ready | Latency: <800ms*

---

## Slide 2: High-Performance Architecture

**Visual Directive:**
A layered "Tech Stack" diagram. The bottom layer is "Infrastructure," middle is "Logic," top is "Presentation."

### [Layer 1: The Presentation Layer (Aurora System)]
*   **Framework:** Next.js 14+ (React Server Components).
*   **Styling:** Tailwind CSS v4 + `shadcn/ui`.
*   **Motion:** Framer Motion with custom "Luxury Easing" curves `[0.16, 1, 0.3, 1]`.

### [Layer 2: The Orchestration Layer]
*   **State Management:** React Context (`UserProfile`, `DemoController`).
*   **Agentic Routing:** `/api/agent/triage` handles multi-step reasoning (Search -> Breakdown -> Scoring).
*   **Type Safety:** TypeScript Strict Mode.

### [Layer 3: The Intelligence Layer]
*   **Inference Engine:** **Groq Cloud API** running `llama-3.3-70b-versatile`.
*   **Performance:** Sub-second inference allows for real-time "Chat-to-UI" generation.

---

## Slide 3: The Generative UI System

**Visual Directive:**
A grid displaying the **Component Library**. Show small thumbnails of the *Battle Card, Compliance Matrix, and Toxicity Gauge*.

### [Header]
### **Polymorphic Component Factory**
We do not stream text. We stream **Visual Metaphors**.

### [The Rendering Flow]
`User Query` → `Intent Classifier` → `Select Component` → `Render React Node`

### [The Library (components/generative)]
*   **`compliance_matrix`:** Grid visualization for Diet/Allergy safety checks.
*   **`battle_card`:** Split-screen head-to-head macro comparison.
*   **`manufacturing_timeline`:** "Farm-to-Table" process flow visualization.
*   **`toxicity_gauge`:** Visual risk assessment of specific additives.
*   **`truth_terminal`:** Marketing claims vs. Nutritional reality analysis.

> **Key Innovation:** The AI determines the *best way* to visualize the data, giving us an "Infinite Interface."

---

## Slide 4: Personalization & Logic

**Visual Directive:**
A split screen showing the **JSON User Profile** on the left and the **Dashboard** on the right.

### [Left: The Bio-Sync Engine]
**User Profile Context**
*   **Biometrics:** BMI/BMR calculated dynamically from Height/Weight/Age.
*   **ConflictGuard™:** A logic layer that flags ingredients violating specific constraints (e.g., *Peanuts* for Allergies, *High Sodium* for Hypertension).
*   **Goal Alignment:** Products are scored not universally, but based on "Fit" for the user's specific goal (e.g., Muscle Gain vs. Heart Health).

### [Right: The Simulation Engine]
**"What If" Recipe Hacking**
*   **Interactive Toggles:** Users can modify the food in real-time (e.g., "Drain Noodles").
*   **Real-Time Re-Calc:** The dashboard instantly updates the Health Score and Sodium levels based on the active modifiers.

---

## Slide 5: The Royal Autopilot (Demo System)

**Visual Directive:**
A timeline graphic showing the 5 phases of the demo script.

### [Header]
### **Ghost Interaction Engine**
A programmatic demo system, not a video.

### [Architecture: `use-demo-controller.tsx`]
The system uses a chronological array of `DemoAction` objects to drive the UI:
1.  **`ghost_move`:** Smoothly animates a custom cursor to DOM targets.
2.  **`ghost_type`:** Simulates human typing rhythm in input fields.
3.  **`ghost_click`:** Triggers React events and visual ripples.

### [The Script Phases]
1.  **Cold Start:** Unprofiled query execution (Failure State).
2.  **The Ritual:** Automated profile calibration (Bio-Initialization).
3.  **The Auto-Retry:** Rerunning analysis with new context (Success State).
4.  **Cross-Examination:** Showcasing Generative UI (Battle Cards).

---

## Slide 6: API Strategy & Roadmap

**Visual Directive:**
A network diagram showing the flow between the Client, Next.js API Routes, and Groq.

### [API Endpoints]
*   **`/api/agent/triage`:** The "Brain." Orchestrates the Search → Breakdown → Score workflow.
*   **`/api/chat`:** The "Router." Handles follow-up questions and selects Generative UI components.
*   **`/api/analyze`:** Quick-response endpoint for raw product data.

### [Future Roadmap]
*   **[Vision]** Camera-based Label Scanning (OCR to JSON).
*   **[Voice]** Natural Language SQL querying of nutrition databases.
*   **[Sync]** Real-time integration with Apple Health/Oura for dynamic caloric needs.
*   **[Social]** Gamified "Bio-Scores" vs. friends.

### [Footer]
**CIPHER** // *Decode. Transmute. Optimize.*
