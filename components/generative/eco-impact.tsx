"use client";

import { motion } from "framer-motion";
import { Leaf, Droplets, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EcoImpactProps {
    data: {
        packaging: number; // 0-100 (100 is best)
        carbon: number;
        water: number;
        grade: string; // A, B, C, D, E
    }
}

export function EcoImpact({ data }: EcoImpactProps) {
    const categories = [
        { label: "Packaging", icon: Package, value: data.packaging, color: "bg-amber-400" },
        { label: "Carbon Footprint", icon: Leaf, value: data.carbon, color: "bg-emerald-400" },
        { label: "Water Usage", icon: Droplets, value: data.water, color: "bg-blue-400" },
    ];

    return (
        <Card className="p-6 bg-[#05100a] border-emerald-500/20 relative overflow-hidden">
            {/* Background Rings Effect */}
            <div className="absolute -right-20 -top-20 w-64 h-64 border-[20px] border-emerald-900/10 rounded-full" />
            <div className="absolute -right-10 -top-10 w-48 h-48 border-[20px] border-emerald-900/10 rounded-full" />

            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="space-y-1">
                    <h3 className="font-bold text-emerald-100">Planetary Impact</h3>
                    <div className="text-xs text-muted-foreground">Lifecycle Analysis</div>
                </div>
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-black border",
                    data.grade === 'A' ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                        data.grade === 'B' || data.grade === 'C' ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                            "bg-red-500/20 text-red-400 border-red-500/30"
                )}>
                    {data.grade}
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                {categories.map((cat, i) => (
                    <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <div className="flex items-center gap-2 text-white/70">
                                <cat.icon className="w-3 h-3" /> {cat.label}
                            </div>
                            <span className="font-mono text-white/50">{cat.value}/100</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className={cn("h-full", cat.color)}
                                initial={{ width: 0 }}
                                animate={{ width: `${cat.value}%` }}
                                transition={{ delay: 0.2 + (i * 0.1), duration: 1 }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
