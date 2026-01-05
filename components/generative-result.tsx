"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    AlertTriangle,
    ArrowUp,
    RefreshCcw,
    Sparkles,
    Zap,
    CheckCircle,
    Copy,
    Share2,
    Send
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IngredientAnalysis } from "@/types/dashboard";
import { Biohazard, BrainCircuit, Dna, Leaf, Scale, ShieldAlert, Siren, Microscope, Swords } from "lucide-react";
import { ManufacturingTimeline } from "@/components/generative/manufacturing-timeline";
import { BattleCard } from "@/components/generative/battle-card";
import { useState, useMemo, useEffect, useRef } from "react";

// --- Icons Mapping ---
const iconMap: Record<string, any> = {
    Activity,
    AlertTriangle,
    Bacteria: Biohazard,
    BrainCircuit,
    CheckCircle,
    Dna,
    Leaf,
    Scale,
    ShieldAlert,
    Siren,
    Zap
};

// --- Data Mapper ---
function mapApiToDashboard(apiData: any): IngredientAnalysis {
    const heroComponent = apiData.components?.find((c: any) => c.id === 'hero' || c.type === 'score_ring');
    const summaryComponent = apiData.components?.find((c: any) => c.id === 'summary' || c.type === 'text_block');
    const riskComponent = apiData.components?.find((c: any) => c.id === 'risks' || c.type === 'red_flag_list');

    // Safe extraction of insights
    const insights = (riskComponent?.data?.flags || []).map((flag: any) => ({
        icon: flag.risk_level === 'high' ? 'ShieldAlert' : 'AlertTriangle',
        title: flag.name,
        description: flag.description,
        type: flag.risk_level === 'high' ? 'risk' as const : 'warning' as const
    }));

    return {
        id: apiData.meta?.product_name || 'unknown',
        productName: apiData.meta?.product_name || 'Unknown Product',
        healthScore: apiData.simulation?.base_stats?.score || heroComponent?.data?.grade || 0,
        aiSummary: summaryComponent?.data?.headline || "Analysis complete.",
        agent_note: apiData.agent_note || "Clinical constraints integrated.",
        category: apiData.meta?.category || 'General',
        metadata: {
            source: apiData.meta?.source || "Analyzed Source",
            portion: apiData.meta?.portion_size || "Standard Serving",
            caloricDensity: apiData.meta?.caloric_density || "Medium"
        },
        goalAlignment: {
            muscleGain: apiData.goal_alignment?.muscle_gain || 50,
            weightLoss: apiData.goal_alignment?.weight_loss || 50,
            longevity: apiData.goal_alignment?.longevity || 50,
            energy: apiData.goal_alignment?.energy || 50
        },
        visualTheme: apiData.layout_config?.theme || 'dark-slate',
        keyInsights: insights,
        simulation: apiData.simulation,
        tradeOffs: [],
        confidenceScore: 0.95
    };
}

// --- REDESIGNED: The Obsidian Monolith Dashboard ---
// --- Zone 2: Goal Alignment Radar Chart ---
function RadarChart({ goals }: { goals: any }) {
    // Normalize values to 0-40 radius
    const r = 40;
    const c = 50; // Center
    const p1 = (goals.muscleGain / 100) * r;
    const p2 = (goals.weightLoss / 100) * r;
    const p3 = (goals.longevity / 100) * r;
    const p4 = (goals.energy / 100) * r;

    const path = `M ${c} ${c - p1} L ${c + p2} ${c} L ${c} ${c + p3} L ${c - p4} ${c} Z`;

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Axis Labels */}
            <span className="absolute top-0 text-[8px] text-white/40 uppercase">Muscle</span>
            <span className="absolute right-0 text-[8px] text-white/40 uppercase">Weight</span>
            <span className="absolute bottom-0 text-[8px] text-white/40 uppercase">Long.</span>
            <span className="absolute left-0 text-[8px] text-white/40 uppercase">Energy</span>

            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                {/* Background Grid */}
                <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <polygon points="50,30 70,50 50,70 30,50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                {/* Data Shape */}
                <motion.path
                    d={path}
                    fill="rgba(212, 175, 55, 0.2)"
                    stroke="#D4AF37"
                    strokeWidth="2"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </svg>
        </div>
    );
}

// --- Zone 4: Data Grid Bar ---
function StatBar({ label, value, max, unit, color }: { label: string, value: number, max: number, unit: string, color: string }) {
    const percent = Math.min((value / max) * 100, 100);
    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] uppercase tracking-wider font-mono text-white/60">
                <span>{label}</span>
                <span className={color}>{value}{unit}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    className={`h-full ${color.replace('text-', 'bg-')}`}
                />
            </div>
        </div>
    );
}

function DashboardCard({ data, minimized }: { data: IngredientAnalysis; minimized?: boolean }) {
    const [activeMods, setActiveMods] = useState<Set<string>>(new Set());

    // Calculate Dynamic Stats based on Modifiers
    const currentStats = useMemo(() => {
        let stats = {
            score: data.healthScore,
            sodium: data.simulation?.base_stats?.sodium_mg || 0,
            protein: data.simulation?.base_stats?.protein_g || 0
        };

        if (data.simulation?.modifiers) {
            activeMods.forEach(modId => {
                const mod = data.simulation!.modifiers.find(m => m.id === modId);
                if (mod && mod.impact) {
                    stats.score += (mod.impact.score_delta || mod.impact.score_impact || 0);
                    stats.sodium += (mod.impact.sodium_mg || 0);
                    stats.protein += (mod.impact.protein_g || 0);
                }
            });
        }
        // Cap score at 100
        stats.score = Math.min(100, Math.max(0, stats.score));
        return stats;
    }, [activeMods, data]);

    const toggleMod = (id: string, currentlyActive: boolean) => {
        const next = new Set(activeMods);
        if (currentlyActive) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setActiveMods(next);
    };

    if (minimized) {
        return (
            <div className="max-w-xl p-4 rounded-2xl bg-[#0A0A0F]/80 border border-white/10 text-white/60 text-sm flex justify-between items-center backdrop-blur-md">
                <span>{data.productName}</span>
                <span className="px-2 py-1 bg-white/5 rounded text-white">{currentStats.score}/100</span>
            </div>
        );
    }

    const scoreColor = currentStats.score > 80 ? 'text-emerald-400' : currentStats.score > 50 ? 'text-amber-400' : 'text-red-400';
    const ringColor = currentStats.score > 80 ? 'stroke-emerald-500' : currentStats.score > 50 ? 'stroke-amber-500' : 'stroke-red-500';

    return (
        <motion.div
            className="w-full bg-[#050505]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Ambient Glow */}
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] opacity-10 bg-gradient-to-b ${currentStats.score > 50 ? 'from-[#D4AF37]/50' : 'from-red-500/50'} to-transparent rounded-full blur-[100px] -z-10`} />

            {/* --- ZONE 1 & 2: HEADER & RADAR --- */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-white/5 pb-6 mb-6">
                <div className="flex-1 space-y-4">
                    <div>
                        <h2 className="text-3xl font-light tracking-tight text-white mb-2">{data.productName}</h2>
                        {/* Meta Data Row */}
                        <div className="flex flex-wrap gap-4 text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]/80">
                            <span className="flex items-center gap-1"><span className="w-1 h-1 bg-[#D4AF37] rounded-full" /> {data.metadata?.source || "Source Unknown"}</span>
                            <span className="flex items-center gap-1"><span className="w-1 h-1 bg-[#D4AF37] rounded-full" /> {data.metadata?.portion || "Standard Serving"}</span>
                            <span className="flex items-center gap-1"><span className="w-1 h-1 bg-[#D4AF37] rounded-full" /> {data.metadata?.caloricDensity || "Medium"} Density</span>
                        </div>
                    </div>
                    {/* UI Soundbite */}
                    <div className="relative pl-4 border-l-2 border-[#D4AF37]">
                        <p className="text-sm text-white/80 italic leading-relaxed">"{data.aiSummary}"</p>
                    </div>
                </div>

                {/* Radar + Score */}
                <div className="flex items-center gap-6">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="40" cy="40" r="36" className="fill-none stroke-white/5 stroke-[4]" />
                            <circle
                                cx="40" cy="40" r="36"
                                className={`fill-none ${ringColor} stroke-[4] transition-all duration-1000`}
                                strokeDasharray={226}
                                strokeDashoffset={226 - (currentStats.score / 100) * 226}
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className={`absolute text-2xl font-bold ${scoreColor}`}>{currentStats.score}</span>
                    </div>
                    {/* Radar Chart */}
                    <RadarChart goals={data.goalAlignment || { muscleGain: 50, weightLoss: 50, longevity: 50, energy: 50 }} />
                </div>
            </div>


            {/* --- ZONES 3 & 4: INSIGHTS & DATA GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

                {/* Vertical Analysis Log (Zone 3) */}
                <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-2">Analysis Log</h3>

                    {/* Primary Alert (Red) */}
                    <div className="bg-red-500/5 border-l-2 border-red-500 p-4 rounded-r-xl">
                        <div className="flex items-center gap-2 text-red-400 mb-1">
                            <ShieldAlert className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Critical Flag</span>
                        </div>
                        <p className="text-sm text-white/80">{data?.keyInsights?.[0]?.description || "High Sodium content detected relative to daily limits."}</p>
                    </div>

                    {/* Bio Flag (Yellow) */}
                    <div className="bg-amber-500/5 border-l-2 border-amber-500 p-4 rounded-r-xl">
                        <div className="flex items-center gap-2 text-amber-400 mb-1">
                            <Leaf className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Bio-Availability</span>
                        </div>
                        <p className="text-sm text-white/80">{data?.keyInsights?.[1]?.description || "Nutrients may have reduced absorption rates."}</p>
                    </div>

                    {/* Benefit (Green) */}
                    <div className="bg-emerald-500/5 border-l-2 border-emerald-500 p-4 rounded-r-xl">
                        <div className="flex items-center gap-2 text-emerald-400 mb-1">
                            <Zap className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Asset Discovered</span>
                        </div>
                        <p className="text-sm text-white/80">{data?.keyInsights?.[2]?.description || "Contains beneficial micronutrients for energy."}</p>
                    </div>
                </div>

                {/* Molecular Grid (Zone 4) */}
                <div className="space-y-6">
                    <h3 className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-2">Molecular Profile</h3>

                    {/* Macros */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <StatBar label="Protein" value={currentStats.protein} max={50} unit="g" color="text-emerald-400" />
                        <StatBar label="Sodium" value={currentStats.sodium} max={2500} unit="mg" color="text-red-400" />
                        <StatBar label="Carbs" value={data.simulation?.base_stats?.carbs_g || 0} max={100} unit="g" color="text-blue-400" />
                        <StatBar label="Fats" value={data.simulation?.base_stats?.fat_g || 0} max={40} unit="g" color="text-yellow-400" />
                    </div>

                    {/* Micros & Clean Label */}
                    <div className="pt-4 border-t border-white/5 space-y-3">
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-md text-emerald-400"><Leaf className="w-4 h-4" /></div>
                                <div>
                                    <div className="text-xs text-white/50 uppercase">Magnesium</div>
                                    <div className="text-sm font-medium">{data.simulation?.base_stats?.magnesium_mg || 0}mg <span className="text-white/30 text-[10px] ml-1">High</span></div>
                                </div>
                            </div>
                            <div className="h-full w-px bg-white/10 mx-2" />
                            <div className="flex items-center gap-3">
                                <div>
                                    <div className="text-xs text-white/50 uppercase">Potassium</div>
                                    <div className="text-sm font-medium text-right">{data.simulation?.base_stats?.potassium_mg || 0}mg</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-sm text-white/60">Artificial Preservatives</span>
                            {data.simulation?.base_stats?.additives?.is_clean ? (
                                <span className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase"><CheckCircle className="w-4 h-4" /> None Detected</span>
                            ) : (
                                <span className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase"><AlertTriangle className="w-4 h-4" /> Detected</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ZONE 5: SIMULATION ENGINE --- */}
            <div className="bg-black/40 -mx-6 -mb-8 p-6 border-t border-white/10">
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-sm font-medium text-[#D4AF37] uppercase tracking-widest flex items-center gap-2"><BrainCircuit className="w-4 h-4" /> Active Optimization Protocol</h3>
                    <div className="text-right">
                        <span className="text-xs text-white/40 block mb-1">Projected Score</span>
                        <span className={`text-2xl font-bold ${scoreColor} transition-all`}>{currentStats.score} <span className="text-xs text-white/30 font-normal">/ 100</span></span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(data.simulation?.modifiers || []).slice(0, 4).map((mod) => (
                        <div key={mod.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                            <div className="flex gap-3 items-center">
                                {/* Custom Toggle Switch */}
                                <button
                                    onClick={() => toggleMod(mod.id, activeMods.has(mod.id))}
                                    className={`w-10 h-6 rounded-full p-1 transition-all duration-300 ${activeMods.has(mod.id) ? 'bg-[#D4AF37]' : 'bg-white/20'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${activeMods.has(mod.id) ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>

                                <div>
                                    <div className={`text-sm font-medium transition-colors ${activeMods.has(mod.id) ? 'text-white' : 'text-white/60'}`}>{mod.label}</div>
                                    <div className="text-[10px] text-emerald-400 font-mono">
                                        {mod.impact.protein_g ? `+${mod.impact.protein_g}g Pro ` : ''}
                                        {mod.impact.sodium_mg ? `${mod.impact.sodium_mg}mg Sod ` : ''}
                                        {(mod.impact.score_delta || 0) > 0 && `+${mod.impact.score_delta} Score`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

// --- Main Chat & Result Component ---

interface MessageItem {
    id: string;
    role: 'user' | 'ai';
    type: string;
    data: any;
}

import { HealthIntelligenceDashboard } from "@/components/health-intelligence-dashboard";
import { useUserProfile } from "@/context/user-profile-context";
import { ConflictGuard } from "@/components/bio-sync-drawer";

export function GenerativeResult({ query, userContext, onReset, onAnalysisComplete }: { query: string; userContext?: string; onReset: () => void; onAnalysisComplete?: (note: string) => void }) {
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { profile } = useUserProfile();

    // Initial Load
    useEffect(() => {
        const generateDashboard = async () => {
            setIsThinking(true);
            try {
                const res = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query,
                        userContext,
                        userProfile: profile
                    })
                });

                if (!res.ok) throw new Error("Analysis failed");
                const rawData = await res.json();
                const processedData = mapApiToDashboard(rawData);
                setMessages([{ id: 'init', role: 'ai', type: 'dashboard', data: processedData }]);
                if (onAnalysisComplete && processedData.agent_note) {
                    onAnalysisComplete(processedData.agent_note);
                }
                setIsThinking(false);

            } catch (error) {
                console.warn("Analysis mode unavailable (API Error), switching to simulation.", error);
                // Fallback to ensure Dashboard Grid appears
                // Fallback to ensure Dashboard Grid appears with Rich Dummy Data
                const fallbackData: IngredientAnalysis = {
                    id: "fallback-dummy",
                    productName: query || "Dark Matter Sample",
                    healthScore: 72,
                    aiSummary: "Oops, API failed. Generating simulation based on standard biological baselines.",
                    agent_note: "System Alert: Neural Link Unstable. Using cached heuristic model.",
                    category: "Simulation",
                    metadata: { source: "Cached Protocol", portion: "Unknown", caloricDensity: "Medium" },
                    goalAlignment: { muscleGain: 45, weightLoss: 55, longevity: 65, energy: 60 },
                    visualTheme: "dark-slate",
                    keyInsights: [
                        { icon: "ShieldAlert", title: "Data Stream Interrupted", description: "Real-time analysis failed. Showing projected molecular values.", type: "warning" },
                        { icon: "Zap", title: "Energy Potential", description: "Estimated moderate energy release based on category averages.", type: "benefit" },
                        { icon: "Scale", title: "Balance Check", description: "Macronutrient ratio appears balanced in this simulation.", type: "warning" }
                    ],
                    simulation: {
                        base_stats: { score: 72, calories: 250, sodium_mg: 400, protein_g: 15, carbs_g: 30, fat_g: 8, magnesium_mg: 40, potassium_mg: 150, ingredients: ["Simulated Protein", "Virtual Fiber"] },
                        modifiers: [
                            { id: "mod1", label: "Theoretical Optimization", type: "addition", impact: { score_delta: 10, protein_g: 5 } }
                        ],
                        verdicts: { default: "Simulated", improved: "Optimized", optimized: "Ideal" }
                    },
                    confidenceScore: 0
                };
                setMessages([{ id: 'error', role: 'ai', type: 'dashboard', data: fallbackData }]);
                if (onAnalysisComplete) onAnalysisComplete("System Error: API Failed. Displaying Simulation.");
            }
        };

        if (messages.length === 0) generateDashboard();
    }, [query, userContext, profile, messages.length]);

    // Handle Follow-up Chat
    const handleSend = async (forcedInput?: string) => {
        const inputText = forcedInput || input;
        if (!inputText.trim()) return;

        // Visual Optimistic Update
        const userMsg = { id: Date.now().toString(), role: 'user' as const, type: 'text', data: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsThinking(true);

        // Get Context from previous dashboard
        const lastDashboard = [...messages].reverse().find(m => m.type === 'dashboard')?.data as IngredientAnalysis;
        const contextQuery = lastDashboard
            ? `Original Product: "${lastDashboard.productName}". User Request: "${inputText}"`
            : inputText;

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: contextQuery,
                    userContext: `User is asking a follow-up about ${lastDashboard?.productName || "a product"}.`,
                    userProfile: profile
                })
            });

            if (!res.ok) throw new Error("Analysis failed");
            const rawData = await res.json();

            // Check for Specialized Follow-up Data
            if (rawData.follow_up_data?.type === 'battle') {
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: 'ai',
                    type: 'battle',
                    data: rawData.follow_up_data.battle
                }]);
            } else if (rawData.follow_up_data?.type === 'manufacturing') {
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: 'ai',
                    type: 'manufacturing',
                    data: rawData.follow_up_data.manufacturing
                }]);
            } else {
                // Default to text response (extracting headline or summary)
                const summary = rawData.components?.find((c: any) => c.id === 'summary')?.data?.headline
                    || rawData.components?.find((c: any) => c.id === 'risks')?.data?.flags?.[0]?.description
                    || "I've analyzed that for you. Please check the dashboard.";

                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: 'ai',
                    type: 'text',
                    data: summary
                }]);
            }

            setIsThinking(false);

        } catch (error) {
            console.error(error);
            setIsThinking(false);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', type: 'text', data: "I'm having trouble analyzing that right now." }]);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-32">
            {/* Messages Feed */}
            {messages.map((msg, idx) => (
                <div key={msg.id} className={cn("w-full transition-all duration-500", msg.role === 'user' ? 'flex justify-end' : '')}>
                    {msg.type === 'dashboard' ? (
                        <DashboardCard data={msg.data} minimized={idx < messages.length - 1} />
                    ) : msg.type === 'manufacturing' ? (
                        <div className="w-full h-[600px] relative">
                            <ManufacturingTimeline data={msg.data} />
                        </div>
                    ) : msg.type === 'battle' ? (
                        <div className="w-full relative">
                            <BattleCard data={msg.data} />
                        </div>
                    ) : (
                        <div className={cn(
                            "max-w-xl p-4 rounded-2xl backdrop-blur-md border",
                            msg.role === 'user' ? "bg-white/10 border-white/20 text-white" : "bg-[#0A0A0F]/80 border-[#D4AF37]/30 text-white/80"
                        )}>
                            {msg.data}
                        </div>
                    )}
                </div>
            ))}

            {isThinking && (
                <div className="flex items-center gap-2 text-white/40 text-sm animate-pulse">
                    <BrainCircuit className="w-4 h-4" /> Calculating biological impact...
                </div>
            )}

            {/* Sticky Bottom Input Bar & Chips */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-50">
                <div className="max-w-3xl mx-auto flex flex-col gap-3">
                    {/* Quick Chips */}
                    <div className="flex items-center justify-end gap-2 overflow-x-auto no-scrollbar px-1">
                        <button onClick={() => handleSend("Show Manufacturing Process")} className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-xs hover:bg-[#D4AF37]/20 transition-all text-nowrap">
                            <Microscope className="w-3 h-3" /> Manufacturing Process
                        </button>
                        <button onClick={() => handleSend("Compare vs. Alternative / Battle")} className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-xs hover:bg-[#D4AF37]/20 transition-all text-nowrap">
                            <Swords className="w-3 h-3" /> Battle Mode
                        </button>
                        <button onClick={() => handleSend("Optimize this for Muscle Gain")} className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-xs hover:bg-[#D4AF37]/20 transition-all text-nowrap">
                            <Dna className="w-3 h-3" /> Optimize
                        </button>
                    </div>

                    {/* Input Area */}
                    <div className="relative flex gap-2 w-full">
                        <Input
                            id="demo-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-0 backdrop-blur-md"
                            placeholder="Ask about toxicity, safe limits, better alternatives..."
                        />
                        <button
                            id="demo-send-btn"
                            onClick={() => handleSend()}
                            disabled={!input.trim()}
                            className="h-12 w-12 rounded-xl bg-[#D4AF37] text-black flex items-center justify-center hover:bg-[#D4AF37]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

