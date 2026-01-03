"use client";

import { motion } from "framer-motion";
import { Microscope } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MolecularLensProps {
    data: {
        name: string;
        formula: string;
        description: string;
    }
}

export function MolecularLens({ data }: MolecularLensProps) {
    return (
        <Card className="p-6 bg-[#000510] border-cyan-500/20 relative overflow-hidden group">
            <div className="flex gap-6 relative z-10">
                {/* 3D Model Simulation */}
                <div className="w-24 h-24 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-colors" />

                    <motion.div
                        className="w-16 h-16 border border-cyan-400/30 relative"
                        animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        style={{ preserve3d: true } as any}
                    >
                        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-200 rounded-full shadow-[0_0_10px_white]" />
                        <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-200 rounded-full shadow-[0_0_10px_white]" />
                        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-2 h-2 bg-cyan-200 rounded-full shadow-[0_0_10px_white]" />
                        <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-cyan-200 rounded-full shadow-[0_0_10px_white]" />

                        {/* Cross lines */}
                        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-cyan-500/30" />
                        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-cyan-500/30" />
                    </motion.div>
                </div>

                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 text-xs uppercase tracking-widest">
                        <Microscope className="w-3 h-3" /> Molecular Analysis
                    </div>
                    <h3 className="text-3xl font-mono text-white">{data.formula}</h3>
                    <div className="text-sm font-bold text-cyan-100">{data.name}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-cyan-500/20 pl-2">
                        {data.description}
                    </p>
                </div>
            </div>
        </Card>
    );
}
