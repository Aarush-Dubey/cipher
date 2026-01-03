"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EnergyWaveProps {
    data: {
        points: number[]; // Array of 0-100 values spread over time
        peakTime: string; // e.g., "45m"
        crashTime: string; // e.g., "2h"
        intensity: 'mild' | 'moderate' | 'extreme';
    }
}

export function EnergyWave({ data }: EnergyWaveProps) {
    // Generate SVG path from points
    // Assume points are [20, 50, 100, 80, ...]
    const height = 100;
    const width = 300;
    const step = width / (data.points.length - 1);

    // Create the smooth curve path
    let pathD = `M 0 ${height}`;
    data.points.forEach((p, i) => {
        const x = i * step;
        const y = height - (p / 100) * height;
        // Simple line for now, or bezier if we wanted to be fancy, but let's stick to L for robustness
        pathD += ` L ${x} ${y}`;
    });
    pathD += ` L ${width} ${height} Z`; // Close the shape

    const gradientId = `energy-gradient-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <Card className="p-6 bg-black/40 border-white/10 relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <Zap className={cn("w-4 h-4",
                        data.intensity === 'extreme' ? "text-purple-400" : "text-blue-400"
                    )} />
                    <h3 className="text-sm font-semibold text-white">Metabolic Forecast</h3>
                </div>
                <div className={cn("px-2 py-0.5 rounded text-[10px] uppercase font-bold border",
                    data.intensity === 'extreme' ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                )}>
                    {data.intensity} Response
                </div>
            </div>

            {/* Graph Container */}
            <div className="h-32 w-full relative">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={data.intensity === 'extreme' ? "#a855f7" : "#3b82f6"} stopOpacity="0.5" />
                            <stop offset="100%" stopColor={data.intensity === 'extreme' ? "#a855f7" : "#3b82f6"} stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* The Area Fill */}
                    <motion.path
                        d={pathD}
                        fill={`url(#${gradientId})`}
                        initial={{ opacity: 0, pathLength: 0 }}
                        animate={{ opacity: 1, pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />

                    {/* The Line Stroke */}
                    <motion.path
                        d={pathD.replace(/ Z$/, "")} // Remove close for stroke
                        fill="none"
                        stroke={data.intensity === 'extreme' ? "#d8b4fe" : "#93c5fd"}
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />

                    {/* Peak Marker */}
                    <motion.circle
                        cx={(data.points.indexOf(Math.max(...data.points)) * step)}
                        cy={height - (Math.max(...data.points) / 100) * height}
                        r="3"
                        fill="white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.5 }}
                    />
                </svg>

                {/* Labels */}
                <div className="absolute top-0 w-full h-full pointer-events-none">
                    <div className="absolute top-[10%] left-[25%] text-[10px] text-white/50 transform -translate-x-1/2">
                        Peak ({data.peakTime})
                    </div>
                    <div className="absolute bottom-[20%] right-[20%] text-[10px] text-red-400/50 transform translate-x-1/2">
                        Crash ({data.crashTime})
                    </div>
                </div>

                {/* X-Axis */}
                <div className="flex justify-between text-[10px] text-muted-foreground mt-2 font-mono">
                    <span>0m</span>
                    <span>1h</span>
                    <span>2h</span>
                    <span>4h</span>
                </div>
            </div>

            {/* Playhead Animation */}
            <motion.div
                className="absolute top-0 bottom-0 w-[1px] bg-white/20 z-0"
                initial={{ left: 0 }}
                animate={{ left: "100%" }}
                transition={{ duration: 4, ease: "linear", repeat: Infinity }}
            />
        </Card>
    );
}
