"use client";

import { motion } from "framer-motion";
import { Globe, AlertOctagon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface RegulatoryMapProps {
    data: {
        banned: string[];
        restricted: string[];
        approved: string[];
    }
}

export function RegulatoryMap({ data }: RegulatoryMapProps) {
    return (
        <Card className="p-0 overflow-hidden bg-[#0A101F] border-blue-500/20 relative">
            {/* Grid Line Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none" />

            <div className="p-4 border-b border-white/5 flex justify-between items-center z-10 relative">
                <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-bold text-blue-100">Global Regulatory Status</span>
                </div>
                <div className="flex gap-2 text-[10px] uppercase font-mono">
                    <span className="text-emerald-400">● Allowed</span>
                    <span className="text-red-400">● Banned</span>
                </div>
            </div>

            <div className="p-6 relative z-10 space-y-4">
                {/* Banned Section (High Alert) */}
                {data.banned.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-widest">
                            <AlertOctagon className="w-3 h-3" /> Strict Ban Detected
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {data.banned.map((country, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.1, type: "spring" }}
                                    className="px-3 py-1 rounded bg-red-900/30 border border-red-500/30 text-red-200 text-xs font-medium flex items-center gap-2"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                    {country}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Restricted/Approved Minimal List */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div>
                        <div className="text-[10px] text-muted-foreground uppercase mb-2">Restricted</div>
                        <div className="text-xs text-amber-200/80 leading-relaxed">
                            {data.restricted.length > 0 ? data.restricted.join(", ") : "None"}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] text-muted-foreground uppercase mb-2">Approved Markets</div>
                        <div className="text-xs text-emerald-200/80 leading-relaxed">
                            {data.approved.slice(0, 3).join(", ")} {data.approved.length > 3 && `+${data.approved.length - 3} more`}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
