"use client";

import { motion } from "framer-motion";
import { CopyCheck, FileText, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SourceStreamProps {
    data: {
        sources: Array<{
            title: string;
            journal: string;
            year: string;
            verified: boolean;
        }>
    }
}

export function SourceStream({ data }: SourceStreamProps) {
    return (
        <Card className="max-h-60 overflow-hidden bg-black/40 border-white/10 flex flex-col relative">
            <div className="p-3 border-b border-white/5 bg-white/5 flex items-center justify-between z-20">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <CopyCheck className="w-3 h-3" /> Citation Feed
                </div>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
            </div>

            <div className="relative overflow-hidden flex-1 p-4">
                <motion.div
                    className="absolute inset-x-0 top-0 space-y-3 px-4"
                    animate={{ y: [0, -100] }} // simple scroll simulation
                    transition={{ duration: 10, repeat: Infinity, ease: "linear", repeatType: "mirror" }}
                >
                    {/* Duplicate list for loop effect */}
                    {[...data.sources, ...data.sources].map((source, i) => (
                        <div key={i} className="flex gap-3 items-start group">
                            <div className="mt-1">
                                <FileText className="w-4 h-4 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                            </div>
                            <div className="flex-1 pb-3 border-b border-white/5">
                                <div className="text-sm font-medium text-white/90 group-hover:underline decoration-white/30 underline-offset-4 cursor-pointer">
                                    {source.title}
                                </div>
                                <div className="flex justify-between mt-1 items-center">
                                    <div className="text-[10px] text-muted-foreground uppercase font-mono">
                                        {source.journal} • {source.year}
                                    </div>
                                    {source.verified && (
                                        <span className="flex items-center gap-1 text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">
                                            <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" /> VERIFIED
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Fade gradient at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black to-transparent z-10" />
            </div>
        </Card>
    );
}
