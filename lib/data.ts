export type AnalysisType = 'risk' | 'benefit' | 'neutral' | 'warning';

export interface IngredientAnalysis {
    id: string;
    name: string;
    category: string;
    healthScore: number; // 0-100
    visualTheme: 'neon-red' | 'neon-amber' | 'neon-green' | 'holographic-blue';
    // The "AI-Native" Core
    intentInference: string; // e.g., "You are likely looking for energy but avoiding crash."
    aiSummary: string; // The "Human-level insight" paragraph
    // Dynamic UI Components
    keyInsights: {
        title: string;
        type: AnalysisType;
        description: string;
        icon: string; // Lucide icon name
    }[];
    tradeOffs: {
        pro: string;
        con: string;
    }[];
    // Handling Uncertainty 
    uncertaintyFlags: string[];
    confidenceScore: number; // 0.0 to 1.0

    // GenUI Pre-Computed Data (Optional)
    generativeUI?: {
        compliance?: any;
        marketing_check?: any;
        swap?: any;
        safety?: any;
    };
}

export const MOCK_SCANS: IngredientAnalysis[] = [
    {
        id: "prod_001",
        name: "Hyper-Fuel Energy Drink (Zero Sugar)",
        category: "Beverage",
        healthScore: 42,
        visualTheme: "neon-red",
        intentInference: "Detected high-stimulant profile. You are likely seeking focus, but may be sensitive to jitters.",
        aiSummary: "While this product avoids sugar, it replaces it with a 'chemical cocktail' of artificial sweeteners (Sucralose, Ace-K) and high caffeine. It solves the calorie problem but introduces gut-health risks and potential neuro-excitability.",
        confidenceScore: 0.95,
        uncertaintyFlags: [],
        keyInsights: [
            {
                title: "Cardiac Load",
                type: "risk",
                description: "300mg Caffeine is equivalent to 4 espressos. High risk of anxiety spike.",
                icon: "Activity"
            },
            {
                title: "Gut Disruption",
                type: "warning",
                description: "Sucralose may negatively impact microbiome diversity.",
                icon: "Bacteria"
            },
            {
                title: "Focus Aid",
                type: "benefit",
                description: "Contains L-Theanine which may smooth out the caffeine jitters.",
                icon: "BrainCircuit"
            }
        ],
        tradeOffs: [
            { pro: "Instant alertness & Zero Calorie", con: "Probable afternoon crash & gut irritation" }
        ],
        generativeUI: {
            compliance: {
                overall: 'warn',
                items: [
                    { label: "Dairy Free", status: "safe" },
                    { label: "Red 40", status: "conflict", detail: "Contains artificial dyes" }
                ]
            },
            marketing_check: {
                claim: "No Crash Energy",
                reality: "Biologically impossible with 300mg Caffeine",
                verdict: "False"
            },
            swap: {
                current: "Hyper-Fuel",
                better: "Guayaki Yerba Mate",
                reason: "Natural caffeine sources release slower."
            }
        }
    },
    {
        id: "prod_002",
        name: "Eco-Crunch Protein Bar (Chocolate Sea Salt)",
        category: "Snack",
        healthScore: 78,
        visualTheme: "neon-amber",
        intentInference: "Scanning for a meal replacement. You care about satiety and protein quality.",
        aiSummary: "A generally clean profile with a deceptive texture agent. The protein source is high quality (Pea Isolate), but the 'fiber' comes from Isomalto-oligosaccharides, which mimics sugar in the blood despite being labeled as fiber.",
        confidenceScore: 0.85,
        uncertaintyFlags: ["Natural Flavors origin unknown"],
        keyInsights: [
            {
                title: "False Fiber",
                type: "warning",
                description: "IMO syrup is legally fiber but digests like sugar. Not keto-friendly.",
                icon: "AlertTriangle"
            },
            {
                title: "Clean Protein",
                type: "benefit",
                description: "Uses Pea & Rice blend for a complete amino acid profile.",
                icon: "Dna"
            },
            {
                title: "Low Processing",
                type: "neutral",
                description: "Ingredients list is short and recognizable.",
                icon: "CheckCircle"
            }
        ],
        tradeOffs: [
            { pro: "High satiety & great taste", con: "Blood sugar impact higher than label suggests" }
        ]
    },
    {
        id: "prod_003",
        name: "Zenith Organic Kale Chips",
        category: "Snack",
        healthScore: 94,
        visualTheme: "neon-green",
        intentInference: "Looking for a guilt-free savory snack.",
        aiSummary: "This is a 'Green Light' product. The processing is minimal (air-dried, not fried). The nutritional density is retained, and the fat source (Cashew Butter) offers healthy lipids.",
        confidenceScore: 0.99,
        uncertaintyFlags: [],
        keyInsights: [
            {
                title: "Nutrient Dense",
                type: "benefit",
                description: "Retains 90% of Vitamin K and Magnesium due to low-heat drying.",
                icon: "Leaf"
            },
            {
                title: "Sodium Watch",
                type: "neutral",
                description: "Moderate sodium, but balanced by natural potassium.",
                icon: "Scale"
            }
        ],
        tradeOffs: [
            { pro: "Whole food nutrition", con: "High cost per calorie" }
        ]
    },
    {
        id: "prod_004",
        name: "Mystic Import Spicy Noodles",
        category: "Meal",
        healthScore: 30,
        visualTheme: "holographic-blue",
        intentInference: "Curiosity scan on imported goods. Likely checking for allergens or restricted additives.",
        aiSummary: "Warning: High Uncertainty. Detected additive code 'E102' (Tartrazine) which requires specific labeling in the EU but not everywhere. High sodium content inferred but exact levels are ambiguous due to translation gaps.",
        confidenceScore: 0.45, // Triggers the "Low Confidence" UI
        uncertaintyFlags: ["Translation ambiguous for 'Spicing Agent'", "Exact sodium content unclear"],
        keyInsights: [
            {
                title: "Unknown Additives",
                type: "risk",
                description: "Contains E-numbers associated with hyperactivity in children.",
                icon: "Siren"
            },
            {
                title: "Allergen Risk",
                type: "warning",
                description: "Manufacturing facility status regarding Shellfish is unknown.",
                icon: "ShieldAlert"
            }
        ],
        tradeOffs: [
            { pro: "Authentic flavor profile", con: "Safety profile cannot be fully verified" }
        ]
    }
];
