"use client";

import { motion } from "framer-motion";
import { ScanSearch, PartyPopper } from "lucide-react"; // Using ScanSearch as generic match
import { Card } from "@/components/ui/card";

interface TruthTerminalProps {
    data: {
        claim: string;
        reality: string;
        verdict: string;
    }
}

export function TruthTerminal({ data }: TruthTerminalProps) {
    return (
        <Card className="overflow-hidden bg-black/60 border-amber-500/20 relative group">
            {/* Scanning Line Animation */}
            <motion.div
                className="absolute top-0 bottom-0 w-[2px] bg-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.5)] z-20"
                initial={{ left: "0%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
            />

            <div className="grid grid-cols-2 h-32">
                {/* Marketing Side (Left) */}
                <div className="p-4 flex flex-col justify-center border-r border-amber-500/20 bg-amber-500/5 relative">
                    <div className="text-[10px] uppercase text-amber-500/60 font-mono mb-1">Marketing Claim</div>
                    <h3 className="text-xl font-serif text-white/50 italic">"{data.claim}"</h3>
                </div>

                {/* Reality Side (Right) */}
                <div className="p-4 flex flex-col justify-center relative overflow-hidden">
                    {/* The Reveal */}
                    <div className="text-[10px] uppercase text-amber-400 font-mono mb-1 animate-pulse">Core Truth</div>
                    <motion.h3
                        className="text-lg font-bold text-amber-100 leading-tight"
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ delay: 1, duration: 0.5 }}
                    >
                        {data.reality}
                    </motion.h3>
                    <div className="mt-2 inline-block px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {data.verdict}
                    </div>

                    {/* Background Noise */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
                </div>
            </div>
        </Card>
    );
}
