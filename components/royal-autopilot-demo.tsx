"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDemoController, DEMO_MOCK_RESULT } from "@/hooks/use-demo-controller";
import { X, Play, AlertTriangle, User, Shield, Target, Check, Sparkles, Activity, Scale, Zap, ShieldAlert } from "lucide-react";
import { useState, useEffect } from "react";
import { ManufacturingTimeline } from "@/components/generative/manufacturing-timeline";
import { BattleCard } from "@/components/generative/battle-card";

const luxuryEase = [0.16, 1, 0.3, 1] as [number, number, number, number];

// --- 1. Ghost Cursor ---
function GhostCursor({ position, isTyping }: { position: { x: number; y: number } | null; isTyping: boolean }) {
    if (!position) return null;

    return (
        <motion.div
            className="fixed z-[10000] pointer-events-none"
            animate={{ x: position.x - 12, y: position.y - 12 }}
            transition={{ type: "spring", damping: 20, stiffness: 100, mass: 0.8 }}
        >
            <div className="absolute w-32 h-32 -left-10 -top-10 bg-[#D4AF37]/20 blur-[40px] rounded-full" />
            <motion.div
                className="absolute w-24 h-1 bg-gradient-to-l from-[#D4AF37]/60 to-transparent rounded-full -left-20 top-1/2 -translate-y-1/2"
                animate={{ opacity: [0.2, 0.6, 0.2], width: ["80px", "120px", "80px"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div className={cn(
                "w-6 h-6 rounded-full bg-gradient-to-br from-[#F5E6BE] to-[#D4AF37] shadow-[0_0_30px_#D4AF37] relative z-10 transition-transform",
                isTyping && "scale-75"
            )}>
                <div className="absolute inset-0 bg-white/40 rounded-full animate-pulse" />
            </div>
            {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                    <div className="flex gap-1">
                        {[0, 0.1, 0.2].map((delay, i) => (
                            <motion.div key={i} className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.4, repeat: Infinity, delay }} />
                        ))}
                    </div>
                </motion.div>
            )}
            <motion.div className="absolute inset-0 border border-[#D4AF37] rounded-full" animate={{ scale: [1, 2], opacity: [1, 0] }} transition={{ duration: 1, repeat: Infinity }} />
        </motion.div>
    );
}

// --- 2. Intent Visualizer ---
function IntentVisualizer({ text }: { text: string | null }) {
    return (
        <AnimatePresence>
            {text && (
                <motion.div
                    initial={{ opacity: 0, y: -30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 0.6, ease: luxuryEase }}
                    className="fixed top-28 left-1/2 -translate-x-1/2 z-[10001]"
                >
                    <div className="relative px-8 py-3 bg-[#050A14]/90 backdrop-blur-2xl border border-[#D4AF37]/40 rounded-full shadow-[0_0_50px_-10px_rgba(212,175,55,0.3)]">
                        <p className="font-mono text-sm text-white tracking-widest flex items-center gap-3">
                            <span className="text-[#D4AF37] animate-pulse">▐</span>
                            {text}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// --- 3. The Gate ---
function TheGate({ isVisible }: { isVisible: boolean }) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 50 }}
                    transition={{ duration: 0.6, ease: luxuryEase }}
                    className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                >
                    <div className="relative bg-[#0A0A0F] border border-amber-500/30 rounded-3xl p-8 max-w-md shadow-[0_0_100px_-20px_rgba(212,175,55,0.3)]">
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center">
                            <AlertTriangle className="w-10 h-10 text-amber-500" />
                        </motion.div>
                        <h2 className="text-center text-amber-500 font-mono text-xs tracking-[0.3em] uppercase mb-2">Analysis Blocked</h2>
                        <h3 className="text-center text-white text-xl font-light mb-4">Subject Unidentified</h3>
                        <p className="text-center text-white/60 text-sm leading-relaxed mb-8">To judge the fuel, we must first understand <span className="text-amber-500">your engine</span>.</p>
                        <motion.button id="gate-init-btn" whileHover={{ scale: 1.02 }} className="w-full py-4 bg-gradient-to-r from-amber-600/20 to-amber-500/20 border border-amber-500/50 rounded-xl text-amber-500 font-medium tracking-wider uppercase text-sm">Initialize Bio-Avatar</motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// --- 4. Mini Ritual Display ---
function MiniRitualDisplay({ profileData }: { profileData: { height: number; weight: number; age: number; allergies: string[]; goals: string[] } }) {
    const steps = [
        { icon: User, label: "Metrics", done: profileData.height > 0 },
        { icon: Shield, label: "Allergies", done: profileData.allergies.length > 0 },
        { icon: Target, label: "Goals", done: profileData.goals.length > 0 },
        { icon: Sparkles, label: "Complete", done: profileData.goals.length > 0 },
    ];
    const formatLabel = (str: string) => str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.6, ease: luxuryEase }} className="fixed inset-0 z-[10003] flex items-center justify-center bg-[#050A14]/95 backdrop-blur-xl">
            <div className="max-w-lg w-full mx-8">
                <div className="text-center mb-8">
                    <User className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-white text-2xl font-light">Bio-Calibration</h2>
                </div>
                <div className="flex justify-center gap-4 mb-8">
                    {steps.map((s) => (
                        <div key={s.label} className={cn("flex flex-col items-center gap-2", s.done ? "opacity-100" : "opacity-30")}>
                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border", s.done ? "bg-amber-500/20 border-amber-500/50" : "bg-white/5 border-white/10")}>
                                <s.icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-[10px] uppercase text-white/50">{s.label}</span>
                        </div>
                    ))}
                </div>
                <div className="bg-black/30 border border-white/10 rounded-xl p-6 space-y-3">
                    <div className="flex justify-between text-white/50 text-sm">
                        <span>Biometrics</span>
                        <span className="text-white">{profileData.age} yr / {profileData.height}cm / {profileData.weight}kg</span>
                    </div>
                    <div className="flex justify-between text-white/50 text-sm">
                        <span>Allergies</span>
                        <span className="text-red-400 text-right max-w-[200px] truncate">
                            {profileData.allergies.length > 0 ? profileData.allergies.join(", ") : "None Detected"}
                        </span>
                    </div>
                    <div className="flex justify-between text-white/50 text-sm">
                        <span>Primary Goal</span>
                        <span className="text-amber-500 font-medium">
                            {profileData.goals[0] ? formatLabel(profileData.goals[0]) : "Calibrating..."}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// --- 5. Mock Dashboard & Polymorphic Views ---
function DashboardContainer({ showMockResult, showManufacturing, showBattle }: { showMockResult: boolean; showManufacturing: boolean; showBattle: boolean }) {
    const { mockResult: data, mockMfg, mockBattle } = useDemoController();

    return (
        <AnimatePresence mode="wait">
            {showMockResult && (
                <motion.div key="dashboard" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ duration: 0.6, ease: luxuryEase }} className="fixed inset-0 z-[10002] flex items-center justify-center p-8">
                    <div className="max-w-4xl w-full bg-[#0A0A0F]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <div><h2 className="text-white text-2xl font-light">{data.name}</h2><p className="text-white/50 text-sm">{data.aiSummary}</p></div>
                            <div id="score-ring" className="relative w-24 h-24 flex items-center justify-center border-4 border-white/10 rounded-full">
                                <span className="text-3xl font-bold text-red-500">{data.healthScore}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {data.keyInsights.map((k, i) => (
                                <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5">
                                    <h4 className="text-white font-medium text-sm mb-1">{k.title}</h4>
                                    <p className="text-white/60 text-xs">{k.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {showManufacturing && (
                <motion.div key="manufacturing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.5 }} className="fixed inset-0 z-[10002] flex items-center justify-center p-8">
                    <div className="max-w-4xl w-full">
                        <ManufacturingTimeline data={mockMfg} />
                    </div>
                </motion.div>
            )}

            {showBattle && (
                <motion.div key="battle" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.5 }} className="fixed inset-0 z-[10002] flex items-center justify-center p-8">
                    <div className="max-w-4xl w-full">
                        <BattleCard data={mockBattle} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// --- 6. Director's Commentary ---
function DirectorCommentary({ text }: { text: string }) {
    return (
        <AnimatePresence mode="wait">
            {text && (
                <motion.div key={text} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="fixed bottom-10 right-10 z-[10004] max-w-md">
                    <div className="bg-[#050A14]/80 backdrop-blur-xl border border-white/10 border-l-4 border-l-[#D4AF37] rounded-r-xl p-6 shadow-2xl">
                        <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-2 font-bold">Director's Note</h4>
                        <p className="text-gray-300 text-sm font-light leading-relaxed italic">"{text}"</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// --- 7. Phase Progress ---
function PhaseProgress({ currentPhase, phases, onSkip }: { currentPhase: number; phases: string[]; onSkip: (i: number) => void }) {
    return (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[10005]">
            <div className="bg-[#050A14]/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center gap-3">
                {phases.map((phase, i) => (
                    <button key={phase} onClick={() => onSkip(i)} className="flex items-center gap-2 group">
                        <div className={cn("h-2 w-2 rounded-full transition-all", i <= currentPhase ? "bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]" : "bg-white/20")} />
                        <span className={cn("text-[9px] uppercase tracking-wider hidden lg:block", i <= currentPhase ? "text-white" : "text-white/30")}>{phase}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

// --- 8. Speed Controls ---
function SpeedControls({ currentSpeed, onSetSpeed }: { currentSpeed: number; onSetSpeed: (s: number) => void }) {
    const speeds = [0.5, 1, 1.5, 2, 3, 4];
    return (
        <div className="fixed bottom-8 right-8 z-[10005]">
            <div className="bg-[#050A14]/80 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 flex items-center gap-1">
                <span className="text-[10px] uppercase text-white/40 font-mono pl-2 pr-1">Speed</span>
                {speeds.map((s) => (
                    <button
                        key={s}
                        onClick={() => onSetSpeed(s)}
                        className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-mono transition-all",
                            currentSpeed === s
                                ? "bg-[#D4AF37] text-black font-bold shadow-[0_0_10px_#D4AF37]"
                                : "hover:bg-white/10 text-white/60 hover:text-white"
                        )}
                    >
                        {s}x
                    </button>
                ))}
            </div>
        </div>
    );
}

// --- MAIN COMPONENT ---
export function RoyalAutopilotDemo() {
    const demo = useDemoController();
    if (!demo.isActive) return null;

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[9990] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(5,10,20,0.3) 0%, rgba(5,10,20,0.85) 100%)" }} />
            <div className="fixed inset-0 z-[9991] pointer-events-none opacity-5"><div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]" /></div>

            <GhostCursor position={demo.ghostPosition} isTyping={demo.isTyping} />
            <IntentVisualizer text={demo.intentText} />
            <TheGate isVisible={demo.showGate} />
            <AnimatePresence>{demo.showRitual && <MiniRitualDisplay profileData={demo.profileData} />}</AnimatePresence>

            {/* Polymorphic Interface Container */}
            <DashboardContainer
                showMockResult={demo.showMockResult}
                showManufacturing={demo.showManufacturing}
                showBattle={demo.showBattle}
            />

            <DirectorCommentary text={demo.directorText} />
            <PhaseProgress currentPhase={demo.currentPhase} phases={demo.phases} onSkip={demo.skipToPhase} />
            <SpeedControls currentSpeed={demo.timeScale} onSetSpeed={demo.setTimeScale} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-8 left-8 z-[10005] flex items-center gap-3">
                <button onClick={demo.stopDemo} className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all text-sm">
                    <X className="w-4 h-4" /><span className="uppercase tracking-wider text-xs">Exit Demo</span>
                </button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed top-8 right-8 z-[10005]">
                <div className="bg-[#050A14]/80 backdrop-blur-xl border border-[#D4AF37]/30 rounded-full px-4 py-2 flex items-center gap-2">
                    <motion.div className="w-2 h-2 bg-red-500 rounded-full" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    <span className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase font-mono">Cinema Mode</span>
                </div>
            </motion.div>
        </>
    );
}

export function DemoTriggerButton({ onClick }: { onClick: () => void }) {
    return (
        <motion.button onClick={onClick} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="group relative px-8 py-4 bg-[#D4AF37]/10 border border-[#D4AF37]/50 rounded-full overflow-hidden">
            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent -skew-x-12" animate={{ x: ["-200%", "200%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
            <span className="relative flex items-center gap-3 text-[#D4AF37] font-medium tracking-widest text-sm uppercase">
                <Play className="w-4 h-4" fill="currentColor" />Experience CIPHER
            </span>
        </motion.button>
    );
}
