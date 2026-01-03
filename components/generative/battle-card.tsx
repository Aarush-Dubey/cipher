"use client";

import { motion } from "framer-motion";
import { Swords, Trophy } from "lucide-react";

export interface BattleData {
    productA: { name: string; protein: string; sodium: string };
    productB: { name: string; protein: string; sodium: string };
    verdict: string;
}

export function BattleCard({ data }: { data?: BattleData }) {
    if (!data) return null;

    return (
        <div className="w-full bg-[#0A0A0F]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Background VS effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                <h1 className="text-[200px] font-black italic">VS</h1>
            </div>

            <div className="flex items-center justify-between relative z-10 gap-8">
                {/* Contender A (Current) */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex-1 bg-red-500/5 border border-red-500/20 rounded-2xl p-6 text-center"
                >
                    <div className="text-red-400 text-xs font-mono uppercase tracking-widest mb-2">Current Choice</div>
                    <h3 className="text-white text-2xl font-light mb-4">{data.productA.name}</h3>

                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-white/50">Protein</span>
                            <span className="text-red-400 font-bold">{data.productA.protein}</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 w-[20%]" />
                        </div>

                        <div className="flex justify-between text-sm pt-2">
                            <span className="text-white/50">Sodium</span>
                            <span className="text-red-400 font-bold">{data.productA.sodium}</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 w-[80%]" />
                        </div>
                    </div>
                </motion.div>

                {/* VS Badge */}
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] animate-pulse">
                        <Swords className="w-6 h-6 text-black" />
                    </div>
                </div>

                {/* Contender B (Comparison) */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex-1 bg-green-500/5 border border-green-500/20 rounded-2xl p-6 text-center"
                >
                    <div className="text-green-400 text-xs font-mono uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                        <Trophy className="w-3 h-3" /> Alternate
                    </div>
                    <h3 className="text-white text-2xl font-light mb-4">{data.productB.name}</h3>

                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-white/50">Protein</span>
                            <span className="text-green-400 font-bold">{data.productB.protein}</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[60%]" />
                        </div>

                        <div className="flex justify-between text-sm pt-2">
                            <span className="text-white/50">Sodium</span>
                            <span className="text-green-400 font-bold">{data.productB.sodium}</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[10%]" />
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-white/60 text-sm">
                    <span className="text-green-400 font-bold">Verdict:</span> {data.verdict}
                </p>
            </div>
        </div>
    );
}
