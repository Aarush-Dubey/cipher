"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BetterSwapProps {
    data: {
        current: string;
        better: string;
        reason: string;
        improvement: string; // e.g. "40% Less Sugar"
    }
}

export function BetterSwap({ data }: BetterSwapProps) {
    return (
        <div className="relative h-32 w-full">
            {/* Background Track */}
            <div className="absolute inset-0 flex items-center justify-between px-10">
                <ArrowRight className="text-white/10 w-8 h-8" />
            </div>

            {/* Current Product (Slides Out) */}
            <motion.div
                className="absolute left-0 top-2 bottom-2 w-[45%] bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-center opacity-50 grayscale"
                initial={{ x: 0, scale: 1 }}
                animate={{ x: -20, scale: 0.9, opacity: 0.4 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                <div className="text-[10px] uppercase text-muted-foreground">Current</div>
                <div className="font-semibold text-white/70 line-through decoration-red-500/50">{data.current}</div>
            </motion.div>

            {/* Better Product (Slides In) */}
            <motion.div
                className="absolute right-0 top-0 bottom-0 w-[60%] bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-center shadow-[0_0_30px_rgba(16,185,129,0.1)] backdrop-blur-md z-10"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
            >
                <div className="absolute top-0 right-0 bg-emerald-500 text-emerald-950 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Recommended
                </div>

                <div className="text-[10px] uppercase text-emerald-400 mb-1">Better Choice</div>
                <div className="text-xl font-bold text-white mb-1">{data.better}</div>
                <div className="flex items-center gap-2 text-xs text-emerald-300">
                    <TrendingUp className="w-3 h-3" /> {data.improvement}
                </div>

                {data.reason && (
                    <div className="text-[10px] text-muted-foreground mt-2 border-t border-emerald-500/10 pt-1">
                        "{data.reason}"
                    </div>
                )}
            </motion.div>
        </div>
    );
}
