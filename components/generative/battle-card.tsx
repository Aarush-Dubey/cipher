"use client";

import { motion } from "framer-motion";
import { Swords, Trophy } from "lucide-react";

export interface BattleData {
    productA: { name: string; protein: string; sodium: string; calories?: string; fat?: string; carbs?: string };
    productB: { name: string; protein: string; sodium: string; calories?: string; fat?: string; carbs?: string };
    verdict: string;
}

function StatRow({ label, valueA, valueB, colorA = "text-white", colorB = "text-white" }: { label: string, valueA: string, valueB: string, colorA?: string, colorB?: string }) {
    return (
        <div className="flex justify-between items-center text-sm py-1 border-b border-white/5 last:border-0">
            <span className={`font-mono font-bold ${colorA}`}>{valueA}</span>
            <span className="text-white/30 text-xs uppercase tracking-wider">{label}</span>
            <span className={`font-mono font-bold ${colorB}`}>{valueB}</span>
        </div>
    );
}

export function BattleCard({ data }: { data?: BattleData }) {
    if (!data) return null;

    return (
        <div className="w-full bg-[#0A0A0F]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
            {/* Background VS effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                <h1 className="text-[150px] md:text-[200px] font-black italic bg-gradient-to-r from-transparent via-white to-transparent bg-clip-text text-transparent transform -skew-x-12">VS</h1>
            </div>

            {/* Header */}
            <div className="relative z-10 text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">
                    <Swords className="w-3 h-3" /> Head-to-Head
                </div>
                <h2 className="text-xl md:text-3xl font-light text-white transition-all duration-500">
                    <span className="text-red-400">{data.productA.name}</span> <span className="text-white/20 mx-2 text-lg">vs</span> <span className="text-emerald-400">{data.productB.name}</span>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {/* Contender A (Current) */}
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                    <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-red-400 text-xs font-bold uppercase">Current</span>
                            {data.productA.calories && <span className="text-white/60 text-xs">{data.productA.calories}</span>}
                        </div>
                        {/* Stats Grid */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm"><span className="text-white/50">Protein</span> <span className="text-white font-mono">{data.productA.protein}</span></div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-red-500" style={{ width: '40%' }} /></div>

                            <div className="flex justify-between text-sm"><span className="text-white/50">Sodium</span> <span className="text-red-400 font-mono">{data.productA.sodium}</span></div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-red-500" style={{ width: '80%' }} /></div>

                            {data.productA.fat && (
                                <>
                                    <div className="flex justify-between text-sm"><span className="text-white/50">Fat</span> <span className="text-white font-mono">{data.productA.fat}</span></div>
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-yellow-500/50" style={{ width: '30%' }} /></div>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Contender B (Challenger) */}
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 bg-emerald-500/20 rounded-bl-xl border-l border-b border-emerald-500/20">
                            <Trophy className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-emerald-400 text-xs font-bold uppercase">Upgrade</span>
                            {data.productB.calories && <span className="text-white/60 text-xs">{data.productB.calories}</span>}
                        </div>
                        {/* Stats Grid */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm"><span className="text-white/50">Protein</span> <span className="text-emerald-400 font-mono font-bold">{data.productB.protein}</span></div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: '70%' }} /></div>

                            <div className="flex justify-between text-sm"><span className="text-white/50">Sodium</span> <span className="text-emerald-400 font-mono">{data.productB.sodium}</span></div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: '20%' }} /></div>

                            {data.productB.fat && (
                                <>
                                    <div className="flex justify-between text-sm"><span className="text-white/50">Fat</span> <span className="text-white font-mono">{data.productB.fat}</span></div>
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-yellow-500/50" style={{ width: '10%' }} /></div>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Verdict */}
            <div className="mt-8 text-center relative z-10">
                <div className="inline-block p-[1px] rounded-xl bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent">
                    <div className="bg-[#05050A] rounded-xl px-8 py-4 border border-white/10 backdrop-blur-md">
                        <p className="text-emerald-400 font-medium italic text-lg leading-relaxed">"{data.verdict}"</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
