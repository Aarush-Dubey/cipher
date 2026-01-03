"use client";

import { motion } from "framer-motion";
import { Check, X, AlertTriangle, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ComplianceItem {
    label: string;
    status: 'safe' | 'conflict' | 'warning';
    detail?: string;
}

interface ComplianceMatrixProps {
    data: {
        items: ComplianceItem[];
        overall: 'pass' | 'fail' | 'warn';
    };
}

export function ComplianceMatrix({ data }: ComplianceMatrixProps) {
    return (
        <Card className="p-1 overflow-hidden bg-black/40 border-white/10 backdrop-blur-md">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Compliance Check</span>
                </div>
                <div className={cn("px-2 py-0.5 rounded text-[10px] font-black uppercase border",
                    data.overall === 'pass' ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" :
                        data.overall === 'fail' ? "bg-red-500/20 text-red-500 border-red-500/20" :
                            "bg-amber-500/20 text-amber-500 border-amber-500/20"
                )}>
                    {data.overall}
                </div>
            </div>

            <div className="p-4 space-y-3">
                {data.items.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 border",
                                item.status === 'safe' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                                    item.status === 'conflict' ? "bg-red-500/10 border-red-500/20 text-red-500" :
                                        "bg-amber-500/10 border-amber-500/20 text-amber-500"
                            )}>
                                {item.status === 'safe' && <Check className="w-3 h-3" />}
                                {item.status === 'conflict' && <X className="w-3 h-3" />}
                                {item.status === 'warning' && <AlertTriangle className="w-3 h-3" />}
                            </div>
                            <span className={cn("text-sm font-medium",
                                item.status === 'conflict' ? "text-red-200" : "text-white/90"
                            )}>{item.label}</span>
                        </div>

                        {item.detail && (
                            <span className="text-xs text-muted-foreground/60 italic border-l border-white/10 pl-3">
                                {item.detail}
                            </span>
                        )}

                        {/* Conflict Glow Effect */}
                        {item.status === 'conflict' && (
                            <motion.div
                                className="absolute inset-0 bg-red-500/5 -z-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        )}
                    </motion.div>
                ))}
            </div>
        </Card>
    );
}
