export interface BentoComponent {
    id: string;
    zone: "zone_1" | "zone_2" | "zone_3" | "zone_4";
    type: "score_ring" | "text_block" | "stacked_bar" | "equivalence_icon" | "red_flag_list" | "interactive_simulator" | "glucose_graph" | "processing_level";
    data: any;
}

export interface SimulatorModifier {
    id: string;
    label: string;
    type: "addition" | "subtraction";
    impact: {
        calories?: number;
        sodium_mg?: number;
        protein_g?: number;
        carbs_g?: number;
        fat_g?: number;
        score_impact?: number;
        score_delta?: number; // legacy support
        remove_ingredients?: string[];
        add_vitamins?: string[];
    };
}

export interface IngredientAnalysis {
    id: string;
    productName: string;
    healthScore: number;
    aiSummary: string;
    agent_note?: string;
    category: string;
    visualTheme: "neon-red" | "neon-green" | "dark-slate";

    // Detailed Metadata
    metadata?: {
        source: string;
        portion: string;
        caloricDensity: string;
    };

    // Goal Alignment (Radar Data)
    goalAlignment?: {
        muscleGain: number;
        weightLoss: number;
        longevity: number;
        energy: number;
    };

    keyInsights: { icon: string; title: string; description: string; type: 'risk' | 'benefit' | 'warning' | 'neutral' }[];

    simulation?: {
        base_stats?: BaseStats;
        modifiers: SimulatorModifier[];
        verdicts?: any;
    };
    tradeOffs?: { pro: string; con: string }[];
    confidenceScore?: number;
}

export interface BaseStats {
    score: number;
    calories: number;
    sodium_mg: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    magnesium_mg?: number;
    potassium_mg?: number;
    ingredients: string[];
    additives?: {
        is_clean: boolean;
        detected: string[];
    };
}

export interface HealthDashboardData {
    meta: {
        product_name: string;
        analysis_date: string;
        category: string;
        source?: string;
        portion_size?: string;
        caloric_density?: string;
    };
    goal_alignment?: {
        muscle_gain: number;
        weight_loss: number;
        longevity: number;
        energy: number;
    };
    layout_config: {
        theme: "dark_slate" | "neon_red" | "neon_green";
        emphasis: string;
    };
    simulation?: {
        base_stats: BaseStats;
        modifiers: SimulatorModifier[];
        verdicts: {
            default: string;
            improved: string;
            optimized: string;
        };
        additives?: {
            is_clean: boolean;
            detected: string[];
        };
    };
    components: BentoComponent[];
    follow_up_data?: any;
}
