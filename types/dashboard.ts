export interface BentoComponent {
    id: string;
    zone: "zone_1" | "zone_2" | "zone_3" | "zone_4";
    type: "score_ring" | "text_block" | "stacked_bar" | "equivalence_icon" | "red_flag_list" | "interactive_simulator" | "glucose_graph" | "processing_level";
    data: any;
}

// ... existing interfaces

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
        remove_ingredients?: string[];
        add_vitamins?: string[];
    };
}

export interface BaseStats {
    score: number;
    calories: number;
    sodium_mg: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    ingredients: string[];
}

export interface HealthDashboardData {
    meta: {
        product_name: string;
        analysis_date: string;
        category: string;
    };
    layout_config: {
        theme: "dark_slate" | "neon_red" | "neon_green";
        emphasis: string;
    };
    // The main simulation data might sit at the top level or within the simulator component.
    // The prompt puts it in "product_state" and "modifiers" in the JSON.
    // But the current schema uses `components`. 
    // I will look at where to put `product_state`. 
    // I'll add optional `simulation` field to the root or ensure components carry it. 
    // Actually, the prompt example showed `modifiers` inside the JSON root or inside the component? 
    // The Prompt #2 Example showed: { "product_state": {...}, "modifiers": [...] } at the ROOT.
    // But my Dashboard uses `components` array.
    // I will attach `product_state` to the Root `HealthDashboardData` to be accessible by all components if needed (Context), 
    // OR just put it in the `interactive_simulator` component and pass it up?
    // Passing it up is cleaner for `HealthIntelligenceDashboard` to manage state.
    // Let's add `product_state` to `HealthDashboardData`.
    simulation?: {
        base_stats: BaseStats;
        modifiers: SimulatorModifier[];
        verdicts: {
            default: string;
            improved: string;
            optimized: string;
        };
    };
    components: BentoComponent[];
}

