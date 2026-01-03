"use client";

import { motion } from "framer-motion";
import { Factory, Truck, Package, Droplets, Flame } from "lucide-react";

export interface ManufacturingStep {
    title: string;
    desc: string;
    risk: 'high' | 'medium' | 'low';
}

export function ManufacturingTimeline({ data }: { data?: any }) {
    // Adapter Logic: Handle both { steps: [] } and direct array []
    let rawSteps: any[] = [];
    if (Array.isArray(data)) {
        rawSteps = data;
    } else if (data?.steps && Array.isArray(data.steps)) {
        rawSteps = data.steps;
    }

    // Normalization Logic: Map 'description' -> 'desc', 'status' -> 'risk'
    const steps: ManufacturingStep[] = rawSteps.map(s => ({
        title: s.title || "Unknown Step",
        desc: s.desc || s.description || "No details provided.",
        risk: (s.risk || (s.status === 'completed' ? 'low' : s.status === 'warning' ? 'medium' : 'high')) as 'low' | 'medium' | 'high'
    }));
    // If no steps, show empty state or nothing
    if (steps.length === 0) return null;

    const icons = {
        0: Droplets,
        1: Flame,
        2: Factory,
        3: Package,
        4: Truck
    };

    return (
        <div className="w-full bg-[#0A0A0F]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
            <div className="mb-8">
                <h3 className="text-white text-xl font-light">Manufacturing Lifecycle</h3>
                <p className="text-white/40 text-sm mt-1">Traceability Index: <span className="text-amber-500">Visible</span></p>
            </div>

            <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-6 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="grid grid-cols-5 gap-4 relative z-10">
                    {steps.map((step, i) => {
                        const Icon = icons[i as keyof typeof icons] || Factory;
                        return (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className={`w-12 h-12 rounded-full border flex items-center justify-center mb-4 transition-all duration-500 relative z-10 bg-[#0A0A0F]
                                ${step.risk === 'high' ? 'border-red-500/50 text-red-400 shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]' :
                                        step.risk === 'medium' ? 'border-amber-500/50 text-amber-400' :
                                            'border-green-500/50 text-green-400'}`}
                                >
                                    <Icon className="w-5 h-5" />
                                </div>

                                <h4 className="text-white font-medium text-xs mb-1 group-hover:text-amber-500 transition-colors">{step.title}</h4>
                                <p className="text-white/30 text-[10px] leading-tight px-1">{step.desc}</p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
