"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from "react";

// --- Types ---

export type DemoAction =
    | { type: "director_voice"; text: string }
    | { type: "show_intent"; text: string; duration?: number }
    | { type: "ghost_move"; target: string }
    | { type: "ghost_click"; target: string }
    | { type: "ghost_type"; target: string; text: string; speed?: number }
    | { type: "show_gate" }
    | { type: "hide_gate" }
    | { type: "trigger_ritual" }
    | { type: "set_profile"; height: number; weight: number; age: number; allergy?: string; goal?: string }
    | { type: "complete_ritual" }
    | { type: "retry_query"; query: string }
    | { type: "show_mock_result" }
    | { type: "show_manufacturing" }
    | { type: "show_battle" }
    | { type: "highlight"; target: string; duration?: number }
    | { type: "end_demo" };

export interface DemoStep {
    time: number;
    action: DemoAction;
    phase?: number;
}

// --- Mock LLM Response for Demo ---
export const DEMO_MOCK_RESULT = {
    id: "demo-ramen",
    name: "Spicy Instant Ramen",
    category: "Meal",
    healthScore: 32,
    visualTheme: "neon-red" as const,
    intentInference: "Evaluating post-workout fuel",
    aiSummary: "High sodium content (1800mg) conflicts with muscle recovery goals. Protein insufficient at 5g per serving.",
    keyInsights: [
        { title: "Sodium Overload", type: "risk" as const, description: "1800mg per serving exceeds post-workout limits", icon: "ShieldAlert" },
        { title: "Protein Deficit", type: "warning" as const, description: "Only 5g protein vs 30g target for muscle gain", icon: "Scale" },
        { title: "Quick Energy", type: "benefit" as const, description: "Fast-digesting carbs for glycogen replenishment", icon: "Zap" },
    ],
    tradeOffs: [
        { pro: "Convenient and fast preparation", con: "Nutritionally inadequate for fitness goals" }
    ],
    simulation: {
        base_stats: { score: 32, calories: 380, sodium_mg: 1800, protein_g: 5, carbs_g: 52, fat_g: 14 },
        modifiers: [
            { id: "drain", label: "Drain Noodles", active: false, impact: { score_delta: 15, sodium_mg: -600 } },
            { id: "skip_packet", label: "Skip Flavor Packet", active: false, impact: { score_delta: 20, sodium_mg: -800 } },
            { id: "add_egg", label: "Add Boiled Egg", active: false, impact: { score_delta: 12, protein_g: 6 } },
            { id: "add_spinach", label: "Add Spinach", active: false, impact: { score_delta: 8, protein_g: 2 } },
        ],
        verdicts: { default: "Avoid", improved: "Acceptable", optimized: "Approved Fuel" }
    }
};

export const DEMO_MOCK_MFG = [
    { order: 1, title: "Wheat Harvest", description: "Hard winter wheat harvested in Kansas.", icon: "Wheat", status: "completed" },
    { order: 2, title: "Milling", description: "Processed into refined flour (bran removed).", icon: "Factory", status: "completed" },
    { order: 3, title: "Flash Frying", description: "Deep fried in palm oil at 180°C for shelf stability.", icon: "Flame", status: "warning" },
    { order: 4, title: "Seasoning", description: "MSG and artificial flavors added via spray.", icon: "FlaskConical", status: "warning" },
    { order: 5, title: "Packaging", description: "Sealed in plastic-lined Styrofoam cup.", icon: "Package", status: "completed" }
];

export const DEMO_MOCK_BATTLE = {
    productA: { name: "Instant Ramen", protein: "5g", sodium: "1800mg" },
    productB: { name: "Protein Pasta", protein: "24g", sodium: "120mg" },
    verdict: "Protein Pasta is the superior fuel source for muscle gain."
};

// --- The Full Choreographed Script (v4.5 - Polymorphic) ---

const DEMO_SCRIPT: DemoStep[] = [
    // === PHASE 0: WELCOME (0-5s) ===
    { time: 0, phase: 0, action: { type: "director_voice", text: "Welcome to CIPHER. Let's see what happens when you search without a profile." } },

    // === PHASE 1: THE COLD START (5-20s) ===
    { time: 4000, phase: 1, action: { type: "show_intent", text: "QUERY: \"Is instant ramen healthy?\"", duration: 6000 } },
    { time: 5000, phase: 1, action: { type: "ghost_move", target: "#demo-input" } },
    { time: 7000, phase: 1, action: { type: "ghost_click", target: "#demo-input" } },
    { time: 8000, phase: 1, action: { type: "ghost_type", target: "#demo-input", text: "Is instant ramen healthy?", speed: 80 } },
    { time: 12000, phase: 1, action: { type: "director_voice", text: "Query entered. Now let's submit it..." } },
    { time: 14000, phase: 1, action: { type: "ghost_move", target: "#analyze-btn" } },
    { time: 16000, phase: 1, action: { type: "ghost_click", target: "#analyze-btn" } },

    // === PHASE 2: THE GATE (20-30s) ===
    { time: 18000, phase: 2, action: { type: "show_gate" } },
    { time: 19000, phase: 2, action: { type: "director_voice", text: "The system refuses to guess. To analyze fuel, we must first understand YOUR engine." } },
    { time: 24000, phase: 2, action: { type: "show_intent", text: "ACTION: Initialize Bio-Avatar", duration: 3000 } },
    { time: 25000, phase: 2, action: { type: "ghost_move", target: "#gate-init-btn" } },
    { time: 27000, phase: 2, action: { type: "ghost_click", target: "#gate-init-btn" } },
    { time: 28000, phase: 2, action: { type: "hide_gate" } },
    { time: 28500, phase: 2, action: { type: "trigger_ritual" } },

    // === PHASE 3: THE RITUAL (30-55s) ===
    { time: 30000, phase: 3, action: { type: "director_voice", text: "The Bio-Calibration Ritual. Your unique physiology becomes the analysis lens." } },
    { time: 35000, phase: 3, action: { type: "director_voice", text: "Setting dimensions: 180cm, 80kg. Age: 28." } },
    { time: 37000, phase: 3, action: { type: "set_profile", height: 180, weight: 80, age: 28 } },
    { time: 42000, phase: 3, action: { type: "director_voice", text: "Allergen shield activated: Peanuts. Goal: Muscle Gain." } },
    { time: 44000, phase: 3, action: { type: "set_profile", height: 180, weight: 80, age: 28, allergy: "Peanuts", goal: "muscle_gain" } },
    { time: 50000, phase: 3, action: { type: "director_voice", text: "Profile calibrated. Saving to the neural engine..." } },
    { time: 53000, phase: 3, action: { type: "complete_ritual" } },

    // === PHASE 4: AUTO-RETRY (55-70s) ===
    { time: 55000, phase: 4, action: { type: "director_voice", text: "Context acquired. The system now re-evaluates ramen against YOUR Muscle Gain protocol." } },
    { time: 58000, phase: 4, action: { type: "show_intent", text: "AUTO-RETRY: Re-analyzing with profile context...", duration: 4000 } },
    { time: 60000, phase: 4, action: { type: "retry_query", query: "Is instant ramen healthy?" } },
    { time: 62000, phase: 4, action: { type: "show_mock_result" } },

    // === PHASE 5: THE VERDICT (70-90s) ===
    { time: 65000, phase: 5, action: { type: "director_voice", text: "The verdict: Score 32. High sodium, low protein. Not ideal for muscle recovery." } },
    { time: 70000, phase: 5, action: { type: "highlight", target: "#score-ring", duration: 4000 } },
    { time: 73000, phase: 5, action: { type: "show_intent", text: "STATUS: Mismatch Detected - High Sodium / Low Protein", duration: 4000 } },

    // === NEW PHASE 6: CROSS-EXAMINATION - MANUFACTURING (90-105s) ===
    { time: 78000, phase: 6, action: { type: "ghost_type", target: "#demo-input", text: "How is this made?", speed: 60 } },
    { time: 79500, phase: 6, action: { type: "ghost_click", target: "#demo-send-btn" } },
    { time: 80000, phase: 6, action: { type: "show_manufacturing" } },
    { time: 80500, phase: 6, action: { type: "director_voice", text: "CIPHER is fluid. Ask 'How is this made?' and the interface shapeshifts into a manufacturing timeline." } },
    { time: 80500, phase: 6, action: { type: "show_intent", text: "INTENT: Manufacturing/Traceability Analysis", duration: 3000 } },

    // === NEW PHASE 7: CROSS-EXAMINATION - BATTLE (105-120s) ===
    { time: 88000, phase: 7, action: { type: "ghost_type", target: "#demo-input", text: "Is pasta better for me?", speed: 60 } },
    { time: 89500, phase: 7, action: { type: "ghost_click", target: "#demo-send-btn" } },
    { time: 90000, phase: 7, action: { type: "show_battle" } },
    { time: 90500, phase: 7, action: { type: "director_voice", text: "Ask for a comparison, and it becomes a Head-to-Head Battle Card." } },
    { time: 90500, phase: 7, action: { type: "show_intent", text: "INTENT: Comparative Analysis (vs Pasta)", duration: 3000 } },

    // === PHASE 8: HANDOVER (120s+) ===
    { time: 98000, phase: 8, action: { type: "director_voice", text: "System handover complete. The control is yours. Ready to encode?" } },
    { time: 103000, phase: 8, action: { type: "end_demo" } },
];

const PHASES = ["Welcome", "Cold Start", "The Gate", "Ritual", "Auto-Retry", "Verdict", "Timeline", "Battle", "Handover"];

// --- State Management ---

interface DemoState {
    isActive: boolean;
    currentStep: number;
    currentPhase: number;
    directorText: string;
    intentText: string | null;
    ghostPosition: { x: number; y: number } | null;
    highlightTarget: string | null;
    isTyping: boolean;
    // Demo-specific UI states
    showGate: boolean;
    showRitual: boolean;
    showMockResult: boolean;
    showManufacturing: boolean;
    showBattle: boolean;
    pendingQuery: string | null;
    profileData: {
        height: number;
        weight: number;
        age: number;
        allergies: string[];
        goals: string[];
    };
    timeScale: number;
}

interface DemoContextType extends DemoState {
    startDemo: () => void;
    stopDemo: () => void;
    skipToPhase: (phase: number) => void;
    setTimeScale: (speed: number) => void;
    phases: string[];
    mockResult: typeof DEMO_MOCK_RESULT;
    mockMfg: typeof DEMO_MOCK_MFG;
    mockBattle: typeof DEMO_MOCK_BATTLE;
}

const DemoContext = createContext<DemoContextType | null>(null);

export function useDemoController(): DemoContextType {
    const ctx = useContext(DemoContext);
    if (!ctx) {
        return {
            isActive: false,
            currentStep: 0,
            currentPhase: 0,
            directorText: "",
            intentText: null,
            ghostPosition: null,
            highlightTarget: null,
            isTyping: false,
            showGate: false,
            showRitual: false,
            showMockResult: false,
            showManufacturing: false,
            showBattle: false,
            pendingQuery: null,
            profileData: { height: 170, weight: 70, age: 25, allergies: [], goals: [] },
            startDemo: () => console.warn("DemoProvider not found"),
            stopDemo: () => { },
            skipToPhase: () => { },
            phases: PHASES,
            mockResult: DEMO_MOCK_RESULT,
            mockMfg: DEMO_MOCK_MFG,
            mockBattle: DEMO_MOCK_BATTLE,
            setTimeScale: () => { }
        };
    }
    return ctx;
}

export function DemoProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<DemoState>({
        isActive: false,
        currentStep: 0,
        currentPhase: 0,
        timeScale: 1,
        directorText: "",
        intentText: null,
        ghostPosition: null,
        highlightTarget: null,
        isTyping: false,
        showGate: false,
        showRitual: false,
        showMockResult: false,
        showManufacturing: false,
        showBattle: false,
        pendingQuery: null,
        profileData: { height: 170, weight: 70, age: 25, allergies: [], goals: [] },
    });

    const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const clearTimeouts = useCallback(() => {
        timeoutRefs.current.forEach(clearTimeout);
        timeoutRefs.current = [];
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
        }
    }, []);

    const getElementCenter = useCallback((selector: string) => {
        const el = document.querySelector(selector);
        if (el) {
            const rect = el.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        }
        return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }, []);

    const typeText = useCallback((selector: string, text: string, speed: number = 80) => {
        const input = document.querySelector(selector) as HTMLInputElement;
        if (!input) {
            console.warn("Input not found:", selector);
            return;
        }

        setState(prev => ({ ...prev, isTyping: true }));
        input.focus();
        input.value = "";

        let index = 0;
        typingIntervalRef.current = setInterval(() => {
            if (index < text.length) {
                input.value = text.slice(0, index + 1);
                input.dispatchEvent(new Event('input', { bubbles: true }));
                index++;
            } else {
                if (typingIntervalRef.current) {
                    clearInterval(typingIntervalRef.current);
                    typingIntervalRef.current = null;
                }
                setState(prev => ({ ...prev, isTyping: false }));
            }
        }, speed);
    }, []);

    const executeAction = useCallback((action: DemoAction) => {
        console.log("Demo action:", action.type);

        switch (action.type) {
            case "director_voice":
                setState(prev => ({ ...prev, directorText: action.text }));
                break;

            case "show_intent":
                setState(prev => ({ ...prev, intentText: action.text }));
                if (action.duration) {
                    const t = setTimeout(() => setState(prev => ({ ...prev, intentText: null })), action.duration / state.timeScale);
                    timeoutRefs.current.push(t);
                }
                break;

            case "ghost_move":
                setState(prev => ({ ...prev, ghostPosition: getElementCenter(action.target) }));
                break;

            case "ghost_click":
                const pos = getElementCenter(action.target);
                setState(prev => ({ ...prev, ghostPosition: pos }));
                break;

            case "ghost_type":
                typeText(action.target, action.text, (action.speed || 80) / state.timeScale);
                break;

            case "show_gate":
                setState(prev => ({ ...prev, showGate: true }));
                break;

            case "hide_gate":
                setState(prev => ({ ...prev, showGate: false }));
                break;

            case "trigger_ritual":
                setState(prev => ({ ...prev, showRitual: true }));
                break;

            case "set_profile":
                setState(prev => ({
                    ...prev,
                    profileData: {
                        height: action.height,
                        weight: action.weight,
                        age: action.age,
                        allergies: action.allergy ? [action.allergy] : prev.profileData.allergies,
                        goals: action.goal ? [action.goal] : prev.profileData.goals
                    }
                }));
                break;

            case "complete_ritual":
                setState(prev => ({ ...prev, showRitual: false }));
                break;

            case "retry_query":
                setState(prev => ({ ...prev, pendingQuery: action.query }));
                break;

            case "show_mock_result":
                setState(prev => ({ ...prev, showMockResult: true, showManufacturing: false, showBattle: false }));
                break;

            case "show_manufacturing":
                setState(prev => ({ ...prev, showManufacturing: true, showMockResult: false, showBattle: false }));
                break;

            case "show_battle":
                setState(prev => ({ ...prev, showBattle: true, showManufacturing: false, showMockResult: false }));
                break;

            case "highlight":
                setState(prev => ({ ...prev, highlightTarget: action.target }));
                if (action.duration) {
                    const t = setTimeout(() => setState(prev => ({ ...prev, highlightTarget: null })), action.duration / state.timeScale);
                    timeoutRefs.current.push(t);
                }
                break;

            case "end_demo":
                clearTimeouts();
                setState(prev => ({
                    ...prev,
                    isActive: false,
                    directorText: "",
                    intentText: null,
                    highlightTarget: null,
                    isTyping: false,
                    showGate: false,
                    showRitual: false,
                    showMockResult: false,
                    showManufacturing: false,
                    showBattle: false
                }));
                break;
        }
    }, [getElementCenter, typeText, clearTimeouts]);

    const startDemo = useCallback(() => {
        console.log("Starting CIPHER Royal Demo v4.5...");
        clearTimeouts();
        // Always start at 1x unless specified otherwise, but here keep current or 1? 
        // Let's reset to 1x on full restart? Or keep user preference? 
        // User asked for speed up, implies persistence. Let's keep current state.timeScale
        const speed = state.timeScale;

        setState(prev => ({
            ...prev,
            isActive: true,
            currentStep: 0,
            currentPhase: 0,
            directorText: "",
            intentText: null,
            ghostPosition: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
            highlightTarget: null,
            isTyping: false,
            showGate: false,
            showRitual: false,
            showMockResult: false,
            showManufacturing: false,
            showBattle: false,
            pendingQuery: null,
            profileData: { height: 170, weight: 70, age: 25, allergies: [], goals: [] },
        }));

        DEMO_SCRIPT.forEach((step, index) => {
            const t = setTimeout(() => {
                setState(prev => ({
                    ...prev,
                    currentStep: index,
                    currentPhase: step.phase ?? prev.currentPhase
                }));
                executeAction(step.action);
            }, step.time / speed);
            timeoutRefs.current.push(t);
        });
    }, [clearTimeouts, executeAction, state.timeScale]);

    const stopDemo = useCallback(() => {
        console.log("Demo stopped");
        clearTimeouts();
        setState(prev => ({
            ...prev,
            isActive: false,
            directorText: "",
            intentText: null,
            highlightTarget: null,
            isTyping: false,
            showGate: false,
            showRitual: false,
            showMockResult: false,
            showManufacturing: false,
            showBattle: false
        }));
    }, [clearTimeouts]);

    const skipToPhase = useCallback((phaseIndex: number, speedOverride?: number) => {
        clearTimeouts();
        
        const speed = speedOverride || state.timeScale;

        const phaseStartIndex = DEMO_SCRIPT.findIndex(step => step.phase === phaseIndex);
        if (phaseStartIndex === -1) return;

        const startTime = DEMO_SCRIPT[phaseStartIndex].time;

        setState(prev => ({
            ...prev,
            currentStep: phaseStartIndex,
            currentPhase: phaseIndex,
            // Reset visual flags to prevent stuck overlays
            showGate: false,
            showRitual: false,
            directorText: "",
            intentText: null,
            // Reset Main Views, but ensure context is preserved for specific phases
            showMockResult: phaseIndex === 5, // Phase 5 (Verdict) relies on Result being visible
            showManufacturing: false,
            showBattle: false
        }));

        DEMO_SCRIPT.slice(phaseStartIndex).forEach((step, i) => {
            const t = setTimeout(() => {
                setState(prev => ({
                    ...prev,
                    currentStep: phaseStartIndex + i,
                    currentPhase: step.phase ?? prev.currentPhase
                }));
                executeAction(step.action);
            }, (step.time - startTime) / speed);
            timeoutRefs.current.push(t);
        });
    }, [clearTimeouts, executeAction, state.timeScale]);

    const setTimeScale = useCallback((speed: number) => {
        setState(prev => ({ ...prev, timeScale: speed }));
        skipToPhase(state.currentPhase, speed);
    }, [state.currentPhase, skipToPhase]);

    useEffect(() => {
        return () => clearTimeouts();
    }, [clearTimeouts]);

    return (
        <DemoContext.Provider value={{
            ...state,
            startDemo,
            stopDemo,
            skipToPhase,
            phases: PHASES,
            mockResult: DEMO_MOCK_RESULT,
            mockMfg: DEMO_MOCK_MFG,
            mockBattle: DEMO_MOCK_BATTLE,
            setTimeScale
        }}>
            {children}
        </DemoContext.Provider>
    );
}
