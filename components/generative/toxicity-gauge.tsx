"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ToxicityGaugeProps {
    data: {
        score: number; // 0-100
        label: string;
        unit: string;
        max: number;
    }
}

export function ToxicityGauge({ data }: ToxicityGaugeProps) {
    // Calculate angle for the needle (0 to 180 degrees)
    const percentage = Math.min(data.score / data.max, 1);
    const angle = percentage * 180;
    const isHighRisk = percentage > 0.75;

    return (
        <Card className={cn("p-6 flex flex-col items-center justify-between overflow-hidden relative transition-colors duration-500",
            isHighRisk ? "bg-red-950/20 border-red-500/30" : "bg-secondary/20 border-white/5"
        )}>
            {/* Header */}
            <div className="text-center mb-4 z-10">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground">{data.label}</h3>
                <div className={cn("text-2xl font-black", isHighRisk ? "text-red-400" : "text-white")}>
                    {data.score} <span className="text-xs font-normal text-muted-foreground">{data.unit}</span>
                </div>
            </div>

            {/* Gauge Visual */}
            <div className="relative w-48 h-24 overflow-hidden mt-2">
                {/* Arc Background */}
                <div className="absolute inset-0 w-48 h-48 rounded-full border-[12px] border-white/5 border-b-0" />

                {/* Colored Zones (CSS Conic Gradient trick not easy for arc, using simpler segments) */}
                <div className="absolute bottom-0 left-0 w-full h-full origin-bottom">
                    {/* Safe Zone */}
                    <div className="absolute bottom-0 left-[2px] w-[22px] h-[50px] bg-emerald-500/20 rotate-[15deg] origin-bottom-center transform -translate-y-full" style={{ transformOrigin: "bottom right" }} />
                </div>

                {/* Needle */}
                <motion.div
                    className="absolute bottom-0 left-1/2 w-1 h-24 bg-gradient-to-t from-white to-transparent origin-bottom -ml-0.5 z-20"
                    initial={{ rotate: -90 }}
                    animate={{ rotate: -90 + angle }}
                    transition={{ type: "spring", damping: 10, stiffness: 50, delay: 0.2 }}
                >
                    <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]", isHighRisk ? "bg-red-500" : "bg-emerald-500")} />
                </motion.div>

                {/* Hub */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full translate-y-1/2 z-30" />
            </div>

            {isHighRisk && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 flex items-center gap-2 text-red-400 text-xs font-bold animate-pulse"
                >
                    <AlertCircle className="w-4 h-4" /> HIGH TOXICITY WARNING
                </motion.div>
            )}

            {/* Background red pulse if high risk */}
            {isHighRisk && (
                <motion.div
                    className="absolute inset-0 bg-red-500/5 z-0"
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                />
            )}
        </Card>
    );
}
