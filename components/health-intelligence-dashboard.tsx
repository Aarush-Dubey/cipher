"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    HealthDashboardData,
    BentoComponent,
    BaseStats
} from "@/types/dashboard";
import { AlertTriangle, Activity, Zap, ShieldAlert, FlaskConical, Gauge, ChefHat, Check, Minus, ArrowRight } from "lucide-react";

// --- Logic Hook ---

function useSimulation(data: HealthDashboardData) {
    const [activeMods, setActiveMods] = useState<Set<string>>(new Set());

    const stats = useMemo(() => {
        if (!data.simulation) return null;
        const base = data.simulation.base_stats;

        // Clone base
        let current = {
            ...base,
            removedIngredients: new Set<string>()
        };

        activeMods.forEach(modId => {
            const mod = data.simulation!.modifiers.find(m => m.id === modId);
            if (mod) {
                current.score += (mod.impact.score_impact || 0);
                current.calories += (mod.impact.calories || 0);
                current.sodium_mg += (mod.impact.sodium_mg || 0);
                current.protein_g += (mod.impact.protein_g || 0);
                current.carbs_g += (mod.impact.carbs_g || 0);
                current.fat_g += (mod.impact.fat_g || 0);

                if (mod.impact.remove_ingredients) {
                    mod.impact.remove_ingredients.forEach(i => current.removedIngredients.add(i));
                }
            }
        });

        // Clamp score 0-100
        current.score = Math.min(100, Math.max(0, current.score));
        return current;
    }, [data, activeMods]);

    const toggleMod = (id: string) => {
        setActiveMods(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return { stats, activeMods, toggleMod };
}

// --- Sub-Components ---

function ScoreRing({ data, stats }: { data: any, stats?: BaseStats | null }) {
    const score = stats ? stats.score : (data.score || 0);
    const isDanger = score < 40;
    const isGreat = score > 75;
    const colorClass = isDanger ? "text-red-500" : isGreat ? "text-emerald-500" : "text-amber-500";

    return (
        <div className="flex items-center gap-6 h-full p-6">
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#334155" strokeWidth="8" />
                    <motion.circle
                        cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8"
                        className={colorClass}
                        strokeDasharray="283"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{ strokeDashoffset: 283 - (283 * score / 100) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn("text-4xl font-black tabular-nums", colorClass)}>
                        {Math.round(score)}
                    </span>
                </div>
            </div>
            <div className="flex-1 space-y-2">
                <div className={cn("inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-widest transition-colors duration-500",
                    isDanger ? "bg-red-500/10 text-red-500" : isGreat ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                )}>
                    {isGreat ? "Tier A: Optimized" : isDanger ? "Tier D: Warning" : "Tier C: Moderate"}
                </div>
                <h3 className="text-xl font-bold text-white leading-tight">
                    {isGreat ? "Wellness Approved" : isDanger ? data.label : "Needs Improvement"}
                </h3>
                {isDanger && !isGreat && (
                    <div className="flex items-center gap-2 text-xs text-red-500 animate-pulse">
                        <AlertTriangle className="w-4 h-4" /> High Risk Profile
                    </div>
                )}
            </div>
        </div>
    );
}

function NarrativeSummary({ data, simulation }: { data: any, simulation?: any }) {
    // Dynamic text based on verdicts if available
    let body = data.body;
    let headline = data.headline;

    if (simulation && simulation.stats && simulation.verdicts) {
        const s = simulation.stats.score;
        if (s > 75) body = simulation.verdicts.optimized;
        else if (s > 50) body = simulation.verdicts.improved;
        else body = simulation.verdicts.default;

        if (s > 75) headline = "Optimized Nutrition";
    }

    return (
        <div className="h-full flex flex-col justify-center p-6 space-y-4">
            <h2 className="text-2xl font-serif text-white leading-tight">{headline}</h2>
            <AnimatePresence mode="wait">
                <motion.p
                    key={body}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-slate-400 leading-relaxed text-sm md:text-base"
                >
                    {body}
                </motion.p>
            </AnimatePresence>
        </div>
    );
}

function MacroStack({ data, stats }: { data: any, stats?: BaseStats | null }) {
    const segments = data.segments.map((seg: any) => {
        if (!stats) return seg;
        const label = seg.label.toLowerCase();
        if (label.includes("prot")) return { ...seg, value: stats.protein_g };
        if (label.includes("carb")) return { ...seg, value: stats.carbs_g };
        if (label.includes("fat")) return { ...seg, value: stats.fat_g };
        return seg;
    });

    const total = segments.reduce((acc: number, s: any) => acc + s.value, 0) || 1;

    return (
        <div className="p-6 h-full flex flex-col justify-center">
            <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-6">Macronutrient Profile</h3>
            <div className="flex h-12 w-full rounded-full overflow-hidden mb-6 bg-slate-900 border border-slate-700">
                {segments.map((seg: any, i: number) => (
                    <motion.div
                        key={i}
                        initial={{ width: 0 }}
                        animate={{ width: `${(seg.value / total) * 100}%` }}
                        transition={{ type: "spring", stiffness: 50 }}
                        className={cn("h-full relative group min-w-[2%]",
                            seg.color === 'purple' ? 'bg-purple-500' :
                                seg.color === 'yellow' ? 'bg-yellow-500' : 'bg-blue-500'
                        )}
                    >
                        {seg.value > 0 && (
                            <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none transition-opacity z-10 border border-slate-700">
                                {seg.label}: {Math.round(seg.value)}{seg.unit}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
            <div className="flex justify-between text-xs text-slate-400 px-1">
                {segments.map((seg: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full",
                            seg.color === 'purple' ? 'bg-purple-500' :
                                seg.color === 'yellow' ? 'bg-yellow-500' : 'bg-blue-500'
                        )} />
                        <span>{Math.round(seg.value)}g {seg.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function EquivalenceIcon({ data, stats }: { data: any, stats?: BaseStats | null }) {
    const val = stats ? `${Math.round(stats.sodium_mg)}mg` : data.value;

    return (
        <div className="p-6 h-full flex flex-col items-center justify-center text-center">
            <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-4">Sodium Visualizer</h3>
            <div className="flex items-center gap-4 text-white">
                <div className="text-3xl font-black tabular-nums">{val}</div>
                <div className="text-xl text-slate-500">=</div>
                <div className="flex flex-col items-center">
                    <div className="flex gap-1 mb-2">
                        {Array.from({ length: Math.min(data.comparison_count, 5) }).map((_, i) => (
                            <span key={i} className="text-2xl">🍟</span>
                        ))}
                    </div>
                    <div className="text-sm text-slate-400">
                        {data.comparison_count}x {data.comparison_item}
                    </div>
                </div>
            </div>
        </div>
    );
}

function RedFlagList({ data, stats }: { data: any, stats?: any }) {
    const removedSet = stats?.removedIngredients || new Set();

    return (
        <div className="p-6 h-full overflow-y-auto custom-scrollbar">
            <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500" /> Detected Risks
            </h3>
            <div className="space-y-3">
                {data.flags.map((flag: any, i: number) => {
                    const isRemoved = removedSet.has(flag.name) || removedSet.has(flag.name.split(" ")[0]);

                    return (
                        <div key={i} className={cn("group relative bg-slate-900/50 border rounded-lg p-3 transition-all",
                            isRemoved ? "opacity-40 border-slate-800" : "hover:bg-red-500/10 border-slate-700 hover:border-red-500/30"
                        )}>
                            <div className="flex justify-between items-center mb-1">
                                <span className={cn("font-mono text-sm font-bold", isRemoved ? "text-slate-500 line-through" : "text-red-400")}>
                                    {flag.name}
                                </span>
                                {!isRemoved && (
                                    <span className="text-[10px] uppercase bg-red-500/20 text-red-400 px-2 py-0.5 rounded">{flag.risk_level}</span>
                                )}
                            </div>
                            {!isRemoved && (
                                <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{flag.description}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function InteractiveSimulator({ data, simulationCtx }: { data: any, simulationCtx: any }) {
    const modifiers = simulationCtx.allModifiers || data.modifiers || [];

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-emerald-500" /> Meal Optimizer
                </h3>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Model
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                {/* Controls */}
                <div className="space-y-4">
                    {modifiers.map((mod: any, i: number) => {
                        const isActive = simulationCtx.activeMods.has(mod.id);
                        return (
                            <div
                                key={i}
                                onClick={() => simulationCtx.toggleMod(mod.id)}
                                className={cn("flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all select-none group",
                                    isActive ? "bg-emerald-500/10 border-emerald-500/50" : "bg-slate-900/50 border-slate-700 hover:border-slate-500"
                                )}
                            >
                                <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                    isActive ? "bg-emerald-500 border-emerald-500 text-black" : "border-slate-600 bg-slate-800"
                                )}>
                                    {isActive && <Check className="w-3.5 h-3.5 stroke-[4]" />}
                                </div>
                                <div>
                                    <div className={cn("text-sm font-medium transition-colors", isActive ? "text-emerald-400" : "text-slate-200")}>
                                        {mod.label}
                                    </div>
                                    <div className="text-xs text-slate-500 group-hover:text-slate-400">
                                        {mod.impact.sodium_mg ? (mod.impact.sodium_mg > 0 ? "+" : "") + mod.impact.sodium_mg + "mg Na" : ""}
                                        {mod.impact.score_impact ? " • Score +" + mod.impact.score_impact : ""}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Outcome Viz */}
                <div className="bg-slate-900/50 rounded-lg p-4 flex flex-col items-center justify-center text-center border border-slate-700 border-dashed relative overflow-hidden">
                    {/* Background Glow */}
                    {simulationCtx.stats && simulationCtx.stats.score > 75 && (
                        <div className="absolute inset-0 bg-emerald-500/5 blur-xl pointer-events-none" />
                    )}

                    <div className={cn("mb-2 transition-colors",
                        simulationCtx.stats?.score > 75 ? "text-emerald-500" : "text-slate-500"
                    )}>
                        <Activity className="w-8 h-8 mx-auto" />
                    </div>
                    <div className="text-sm text-slate-400">Projected Health Score</div>
                    <motion.div
                        key={simulationCtx.stats?.score}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-5xl font-black text-white mt-2 tabular-nums"
                    >
                        {Math.round(simulationCtx.stats?.score || 0)}
                    </motion.div>
                    <div className="text-xs mt-1 font-mono text-slate-500">
                        BASE: {Math.round(simulationCtx.baseScore || 0)} <ArrowRight className="w-3 h-3 inline mx-1" /> CURRENT
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Main Layout Component ---

export function HealthIntelligenceDashboard({ data }: { data: HealthDashboardData }) {
    if (!data) return null;

    // Initialize Simulation Logic
    const { stats, activeMods, toggleMod } = useSimulation(data);
    const hasSimulation = !!data.simulation;

    // Component Render Helper
    const getComponent = (c: BentoComponent) => {
        // Prepare props
        const props = {
            data: c.data,
            stats: hasSimulation ? stats : null, // Pass live stats
            simulationCtx: hasSimulation ? {
                activeMods,
                toggleMod,
                allModifiers: data.simulation?.modifiers,
                baseScore: data.simulation?.base_stats.score,
                stats,
                verdicts: data.simulation?.verdicts
            } : null,
            simulation: hasSimulation ? { stats, verdicts: data.simulation?.verdicts } : undefined
        };

        switch (c.type) {
            case "score_ring": return <ScoreRing {...props} />;
            case "text_block": return <NarrativeSummary {...props} />;
            case "stacked_bar": return <MacroStack {...props} />;
            case "equivalence_icon": return <EquivalenceIcon {...props} />;
            case "red_flag_list": return <RedFlagList {...props} />;
            case "interactive_simulator": return <InteractiveSimulator {...props} />;
            default: return <div className="p-4 text-xs text-slate-500">Unknown Widget: {c.type}</div>;
        }
    };

    // Filter by zones
    const zone1 = data.components.filter(c => c.zone === "zone_1");
    const zone2 = data.components.filter(c => c.zone === "zone_2");
    const zone3 = data.components.filter(c => c.zone === "zone_3");
    const zone4 = data.components.filter(c => c.zone === "zone_4");

    return (
        <div className="w-full max-w-[1440px] mx-auto p-4 md:p-10 space-y-6 text-slate-200 font-sans">

            {/* Zone 1: Executive Summary */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[250px]">
                {zone1.map((c, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className={cn("bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl",
                            c.type === "score_ring" ? "md:col-span-4" : "md:col-span-8"
                        )}
                    >
                        {getComponent(c)}
                    </motion.div>
                ))}
            </div>

            {/* Zone 2 & 3: Middle Layer */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[300px]">
                {/* Zone 2: Nutritional Forensics */}
                <div className="md:col-span-7 flex flex-col gap-6">
                    {zone2.map((c, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl flex-1"
                        >
                            {getComponent(c)}
                        </motion.div>
                    ))}
                </div>

                {/* Zone 3: Risk Analysis */}
                <div className="md:col-span-5 flex flex-col gap-6">
                    {zone3.map((c, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl flex-1"
                        >
                            {getComponent(c)}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Zone 4: Action Layer */}
            <div className="grid grid-cols-1">
                {zone4.map((c, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl min-h-[300px]"
                    >
                        {getComponent(c)}
                    </motion.div>
                ))}
            </div>

        </div>
    );
}
