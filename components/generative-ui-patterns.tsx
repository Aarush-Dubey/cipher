"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Check, X, AlertTriangle, ArrowRight, Beaker, Clock, ShoppingBag,
    Factory, Leaf, Scale, Info, Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

// --- Types ---

export type GenerativeUIComponent =
    | { type: "compliance_checklist"; data: ComplianceData }
    | { type: "comparison_card"; data: ComparisonData }
    | { type: "process_timeline"; data: TimelineData }
    | { type: "product_carousel"; data: CarouselData }
    | { type: "ingredient_deep_dive"; data: DeepDiveData }
    // Legacy support
    | { type: "text"; data: string }
    | { type: "safety_gauge"; data: any };

interface ComplianceData {
    title: string;
    status: "PASS" | "FAIL" | "WARN";
    items: {
        label: string;
        status: "pass" | "fail" | "warn";
        value?: string;
        reason?: string;
    }[];
}

interface ComparisonData {
    entity_a: string; // The Target
    entity_b: string; // The Benchmark
    rows: {
        metric: string;
        val_a: string;
        val_b: string;
        winner: "a" | "b" | "tie";
    }[];
}

interface TimelineData {
    steps: {
        step: string;
        type: "natural" | "processing" | "ultra" | "chemical";
        note?: string;
    }[];
}

interface CarouselData {
    title: string;
    products: {
        name: string;
        badge: string;
        sodium?: string;
        calories?: string;
    }[];
}

interface DeepDiveData {
    ingredients: {
        name: string;
        type: "base" | "additive_safe" | "additive_risk" | "unknown";
        description?: string;
    }[];
}

// --- Components ---

function ComplianceAuditor({ data }: { data: ComplianceData }) {
    const [expanded, setExpanded] = useState<number | null>(null);

    return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden w-full max-w-md my-4">
            <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-slate-200">{data.title}</h3>
                <span className={cn("px-2 py-1 rounded text-xs font-black uppercase",
                    data.status === "PASS" ? "bg-emerald-500/20 text-emerald-500" :
                        data.status === "FAIL" ? "bg-red-500/20 text-red-500" : "bg-amber-500/20 text-amber-500"
                )}>
                    {data.status}
                </span>
            </div>
            <div className="p-2">
                {data.items.map((item, i) => (
                    <div key={i} className="mb-1">
                        <div
                            onClick={() => setExpanded(expanded === i ? null : i)}
                            className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                        >
                            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 border",
                                item.status === "pass" ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" :
                                    item.status === "fail" ? "bg-red-500/10 border-red-500/50 text-red-500" : "bg-amber-500/10 border-amber-500/50 text-amber-500"
                            )}>
                                {item.status === "pass" && <Check className="w-3.5 h-3.5" />}
                                {item.status === "fail" && <X className="w-3.5 h-3.5" />}
                                {item.status === "warn" && <AlertTriangle className="w-3.5 h-3.5" />}
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-slate-200">{item.label}</div>
                                {item.value && <div className="text-xs text-slate-500">{item.value}</div>}
                            </div>
                            {item.reason && <Info className="w-4 h-4 text-slate-600" />}
                        </div>
                        <AnimatePresence>
                            {expanded === i && item.reason && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-12 pb-3 text-xs text-slate-400 bg-red-500/5 rounded-b-lg -mt-1 pt-2 mx-2">
                                        Why: {item.reason}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ComparisonCard({ data }: { data: ComparisonData }) {
    return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden w-full max-w-lg my-4 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-800 border-2 border-slate-900 rounded-full w-10 h-10 flex items-center justify-center font-black text-xs text-slate-400 italic shadow-xl">
                VS
            </div>

            <div className="grid grid-cols-2 divide-x divide-slate-800 bg-slate-800/50">
                <div className="p-4 text-center">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Target</div>
                    <div className="font-bold text-slate-200 truncate">{data.entity_a}</div>
                </div>
                <div className="p-4 text-center">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Benchmark</div>
                    <div className="font-bold text-emerald-400 truncate">{data.entity_b}</div>
                </div>
            </div>

            <div className="divide-y divide-slate-800/50">
                {data.rows.map((row, i) => (
                    <div key={i} className="grid grid-cols-2 text-sm relative">
                        <div className={cn("p-4 text-center transition-colors", row.winner === 'a' ? "bg-emerald-500/5 text-emerald-400 font-medium" : "text-slate-400")}>
                            {row.val_a}
                            <div className="text-[10px] uppercase text-slate-600 mt-0.5">{row.metric}</div>
                        </div>
                        <div className={cn("p-4 text-center transition-colors border-l border-slate-800", row.winner === 'b' ? "bg-emerald-500/5 text-emerald-400 font-medium" : "text-slate-400")}>
                            {row.val_b}
                            <div className="text-[10px] uppercase text-slate-600 mt-0.5">{row.metric}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-emerald-500/10 p-3 text-center border-t border-emerald-500/20">
                <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">
                    Recommendation: {data.rows.filter(r => r.winner === 'b').length > data.rows.length / 2 ? data.entity_b : data.entity_a}
                </span>
            </div>
        </div>
    );
}

function ProcessTimeline({ data }: { data: TimelineData }) {
    return (
        <div className="w-full overflow-x-auto my-4 pb-4">
            <div className="flex items-start min-w-max gap-0 relative pt-8 px-4">
                {/* Connecting Line */}
                <div className="absolute top-[43px] left-0 right-0 h-0.5 bg-slate-800 -z-10" />

                {data.steps.map((step, i) => {
                    let color = "bg-slate-600";
                    if (step.type === "natural") color = "bg-blue-500";
                    if (step.type === "processing") color = "bg-amber-500";
                    if (step.type === "ultra" || step.type === "chemical") color = "bg-red-500";

                    return (
                        <div key={i} className="flex flex-col items-center w-32 relative group">
                            <div className={cn("w-3 h-3 rounded-full mb-3 ring-4 ring-slate-950", color)} />
                            <div className="text-center px-1">
                                <div className="font-bold text-xs text-slate-300 mb-1">{step.step}</div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{step.type}</div>
                            </div>

                            {/* Hover Note */}
                            {step.note && (
                                <div className="absolute top-0 -translate-y-[120%] bg-slate-800 text-slate-200 text-xs p-2 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-normal w-40 text-center pointer-events-none z-20 shadow-xl">
                                    {step.note}
                                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45 border-r border-b border-slate-700" />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

function SwapCarousel({ data }: { data: CarouselData }) {
    return (
        <div className="my-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> {data.title}
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x pr-4">
                {data.products.map((prod, i) => (
                    <div key={i} className="snap-center min-w-[200px] bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col hover:border-emerald-500/30 transition-colors group cursor-pointer shadow-lg shadow-black/20">
                        <div className="h-24 bg-slate-800 rounded-lg mb-3 flex items-center justify-center text-3xl">
                            🍜
                        </div>
                        <div className="mb-auto">
                            <div className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded inline-block mb-2 font-bold uppercase">
                                {prod.badge}
                            </div>
                            <h4 className="font-bold text-slate-200 leading-tight mb-1">{prod.name}</h4>
                            <div className="text-xs text-slate-500">
                                {prod.sodium && <span>{prod.sodium} Na</span>}
                            </div>
                        </div>
                        <button className="mt-4 w-full py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded hover:bg-emerald-600 hover:text-white transition-colors">
                            Find in Store
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function IngredientDeepDive({ data }: { data: DeepDiveData }) {
    return (
        <div className="my-4 border border-slate-700/50 rounded-xl p-4 bg-slate-900/30 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Beaker className="w-4 h-4" /> Molecular Lens
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {data.ingredients.map((ing, i) => {
                    let style = "bg-slate-800 border-slate-700 text-slate-400";
                    let size = "col-span-1";

                    if (ing.type === "base") {
                        style = "bg-slate-800/80 border-slate-600 text-slate-300";
                        size = "col-span-2 md:col-span-2 row-span-1";
                    }
                    if (ing.type === "additive_risk") {
                        style = "bg-red-900/10 border-red-500/40 text-red-400 font-bold animate-pulse";
                    }
                    if (ing.type === "additive_safe") {
                        style = "bg-blue-900/10 border-blue-500/30 text-blue-400";
                    }

                    return (
                        <div key={i} className={cn("p-2 rounded border text-xs flex items-center justify-center text-center leading-tight transition-all hover:scale-105 cursor-help min-h-[50px]", style, size)} title={ing.description}>
                            {ing.name}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

// --- Main Router ---

export function GenerativeUIPattern({ component }: { component: any }) {
    if (!component) return null;
    const { component_type, data } = component;

    // Normalize type string
    const type = component_type || component.type;

    switch (type) {
        case "compliance_checklist":
            return <ComplianceAuditor data={data} />;
        case "comparison_card":
            return <ComparisonCard data={data} />;
        case "process_timeline":
            return <ProcessTimeline data={data} />;
        case "product_carousel":
            return <SwapCarousel data={data} />;
        case "ingredient_deep_dive":
            return <IngredientDeepDive data={data} />;
        case "text":
            // Plain text from AI
            return <p className="text-slate-200 leading-relaxed text-base whitespace-pre-wrap">{data}</p>;
        case 'safety_gauge':
        // Legacy fallback
        case 'regulatory_map':
        case 'compliance_check':
        case 'energy_graph':
        case 'truth_scanner':
        case 'molecular_view':
        case 'swap_recommendation':
            return <div className="p-4 border border-slate-700 rounded text-xs text-slate-500">Widget: {type}</div>;

        default:
            return null;
    }
}
