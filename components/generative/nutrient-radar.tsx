"use client";

import { motion } from "framer-motion";
import { Hexagon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface NutrientRadarProps {
    data: {
        protein: number;
        satiety: number;
        micro: number; // micronutrients
        processing: number; // Low is good, but for radar we usually map High = Bad or Good? Let's say High = Good Quality (so Low Processing)
        toxicity: number; // High = Low Toxicity (Safe)
    }
}

export function NutrientRadar({ data }: NutrientRadarProps) {
    // 5 Axes Radar Chart
    // Points calculation (assuming 100 is max radius)
    const scale = 0.8; // fit within 100x100
    const center = 50;

    // Helper to get coordinates
    const getPoint = (value: number, index: number, total: number) => {
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2; // Start at top
        const r = (value / 100) * 50 * scale; // Radius
        const x = center + Math.cos(angle) * r;
        const y = center + Math.sin(angle) * r;
        return `${x},${y}`;
    };

    const values = [data.protein, data.satiety, data.micro, data.processing, data.toxicity];
    const points = values.map((v, i) => getPoint(v, i, 5)).join(" ");
    const fullPoints = values.map((_, i) => getPoint(100, i, 5)).join(" ");

    const labels = ["Protein", "Satiety", "Micros", "Clean", "Safe"];

    return (
        <Card className="p-6 flex items-center gap-6 bg-[#0F1014] border-white/5">
            <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                    {/* Background Grid (Pentagon) */}
                    <polygon points={fullPoints} fill="none" stroke="#333" strokeWidth="1" />
                    <polygon points={values.map((_, i) => getPoint(60, i, 5)).join(" ")} fill="none" stroke="#222" strokeWidth="1" strokeDasharray="2 2" />

                    {/* Data Polygon */}
                    <motion.polygon
                        points={points}
                        fill="rgba(59, 130, 246, 0.2)"
                        stroke="#60a5fa"
                        strokeWidth="2"
                        initial={{ opacity: 0, scale: 0, transformOrigin: "center" }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, type: "spring" }}
                    />

                    {/* Axis Labels */}
                    {labels.map((label, i) => {
                        const [x, y] = getPoint(120, i, 5).split(",").map(Number);
                        return (
                            <text
                                key={i}
                                x={x}
                                y={y + 2} // visual adjustment
                                fontSize="6"
                                fill="#666"
                                textAnchor="middle"
                                className="uppercase font-mono tracking-wider"
                            >
                                {label}
                            </text>
                        );
                    })}
                </svg>
            </div>

            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider text-xs">
                    <Hexagon className="w-3 h-3 text-blue-500" /> Nutrient Density
                </div>
                <p className="text-sm text-muted-foreground leading-snug">
                    Score reflects a balance of macronutrients and absence of inflammatory additives.
                </p>
                <div className="text-2xl font-black text-blue-400">
                    {Math.round(values.reduce((a, b) => a + b, 0) / 5)}<span className="text-xs text-muted-foreground font-normal">/100</span>
                </div>
            </div>
        </Card>
    );
}
