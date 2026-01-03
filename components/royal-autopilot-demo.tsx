"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDemoController, DEMO_MOCK_RESULT } from "@/hooks/use-demo-controller";
import { X, Play, AlertTriangle, User, Shield, Target, Check, Sparkles, Activity, Scale, Zap, ShieldAlert } from "lucide-react";
import { useState, useEffect } from "react";

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

// --- 3. The Gate (Profile Incomplete Popup) ---
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
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500/50 rounded-tl-xl" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500/50 rounded-tr-xl" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500/50 rounded-bl-xl" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500/50 rounded-br-xl" />

                        {/* Icon */}
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center"
                        >
                            <AlertTriangle className="w-10 h-10 text-amber-500" />
                        </motion.div>

                        {/* Content */}
                        <h2 className="text-center text-amber-500 font-mono text-xs tracking-[0.3em] uppercase mb-2">
                            Analysis Blocked
                        </h2>
                        <h3 className="text-center text-white text-xl font-light mb-4">
                            Subject Unidentified
                        </h3>
                        <p className="text-center text-white/60 text-sm leading-relaxed mb-8">
                            To judge the fuel, we must first understand <span className="text-amber-500">your engine</span>.
                            Please initialize your Bio-Avatar to continue.
                        </p>

                        {/* CTA */}
                        <motion.button
                            id="gate-init-btn"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-amber-600/20 to-amber-500/20 border border-amber-500/50 rounded-xl text-amber-500 font-medium tracking-wider uppercase text-sm"
                        >
                            Initialize Bio-Avatar
                        </motion.button>
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

    const currentStep = steps.filter(s => s.done).length;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: luxuryEase }}
            className="fixed inset-0 z-[10003] flex items-center justify-center bg-[#050A14]/95 backdrop-blur-xl"
        >
            <div className="max-w-lg w-full mx-8">
                {/* Header */}
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center">
                    <User className="w-8 h-8 text-amber-500" />
                </motion.div>
                <h2 className="text-center text-white text-2xl font-light tracking-wide mb-2">Bio-Calibration</h2>
                <p className="text-center text-white/40 text-sm font-mono tracking-wider mb-8">STEP {currentStep} OF 4</p>

                {/* Progress Steps */}
                <div className="flex justify-center gap-4 mb-8">
                    {steps.map((s, i) => (
                        <motion.div key={s.label} animate={s.done ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 0.5 }} className={cn("flex flex-col items-center gap-2", s.done ? "opacity-100" : "opacity-30")}>
                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border", s.done ? "bg-amber-500/20 border-amber-500/50" : "bg-white/5 border-white/10")}>
                                {s.done ? <Check className="w-5 h-5 text-green-400" /> : <s.icon className="w-5 h-5 text-white/30" />}
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-white/50">{s.label}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Data Display */}
                <div className="bg-black/30 border border-white/10 rounded-xl p-6 space-y-4">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between">
                        <span className="text-white/50 text-sm">Dimensions</span>
                        <span className="text-white font-mono">{profileData.height}cm / {profileData.weight}kg</span>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex items-center justify-between">
                        <span className="text-white/50 text-sm">Age</span>
                        <span className="text-white font-mono">{profileData.age} years</span>
                    </motion.div>
                    {profileData.allergies.length > 0 && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-between">
                            <span className="text-white/50 text-sm">Allergen Shield</span>
                            <div className="flex gap-2">
                                {profileData.allergies.map(a => <span key={a} className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-xs">{a}</span>)}
                            </div>
                        </motion.div>
                    )}
                    {profileData.goals.length > 0 && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex items-center justify-between">
                            <span className="text-white/50 text-sm">Protocol</span>
                            <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-500 text-sm capitalize">{profileData.goals[0]?.replace('_', ' ')}</span>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// --- 5. Mock Dashboard Result ---
function MockDashboard() {
    const data = DEMO_MOCK_RESULT;
    const IconMap: Record<string, React.ElementType> = { ShieldAlert, Scale, Zap, Activity };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: luxuryEase }}
            className="fixed inset-0 z-[10002] flex items-center justify-center p-8 overflow-auto"
        >
            <div className="max-w-4xl w-full bg-[#0A0A0F]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-white text-2xl font-light">{data.name}</h2>
                        <p className="text-white/50 text-sm mt-1">{data.aiSummary}</p>
                    </div>
                    {/* Score Ring */}
                    <div id="score-ring" className="relative w-24 h-24">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                            <motion.circle
                                cx="48" cy="48" r="40" fill="none" stroke="#ef4444" strokeWidth="8" strokeLinecap="round"
                                strokeDasharray={251.2}
                                initial={{ strokeDashoffset: 251.2 }}
                                animate={{ strokeDashoffset: 251.2 - (251.2 * data.healthScore / 100) }}
                                transition={{ duration: 1.5, ease: luxuryEase }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold text-red-500">{data.healthScore}</span>
                        </div>
                    </div>
                </div>

                {/* Key Insights */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {data.keyInsights.map((insight, i) => {
                        const Icon = IconMap[insight.icon] || Activity;
                        const colors = {
                            risk: "border-red-500/30 bg-red-500/10 text-red-400",
                            warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
                            benefit: "border-green-500/30 bg-green-500/10 text-green-400",
                            neutral: "border-white/10 bg-white/5 text-white/60"
                        };
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className={cn("p-4 rounded-xl border", colors[insight.type])}
                            >
                                <Icon className="w-6 h-6 mb-2" />
                                <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                                <p className="text-xs opacity-70">{insight.description}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Simulation Preview */}
                <div className="bg-black/30 border border-white/10 rounded-xl p-6">
                    <h3 className="text-white/50 text-xs uppercase tracking-wider mb-4">Simulation Engine</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {data.simulation.modifiers.map((mod, i) => (
                            <motion.div
                                key={mod.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:border-amber-500/30 cursor-pointer transition-colors"
                            >
                                <div className="w-5 h-5 rounded border border-white/30" />
                                <span className="text-white/70 text-sm">{mod.label}</span>
                                <span className="ml-auto text-green-400 text-xs">+{mod.impact.score_delta}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
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

// --- 7. Spotlight ---
function Spotlight({ target }: { target: string | null }) {
    const [rect, setRect] = useState<DOMRect | null>(null);
    useEffect(() => {
        if (!target) { setRect(null); return; }
        const el = document.querySelector(target);
        if (el) setRect(el.getBoundingClientRect());
    }, [target]);
    if (!rect) return null;
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed z-[10003] pointer-events-none rounded-xl border-2 border-[#D4AF37] shadow-[0_0_100px_rgba(212,175,55,0.2)]"
            style={{ top: rect.top - 10, left: rect.left - 10, width: rect.width + 20, height: rect.height + 20 }}>
            <div className="absolute inset-0 bg-[#D4AF37]/5 animate-pulse rounded-xl" />
        </motion.div>
    );
}

// --- 8. Phase Progress ---
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

// --- MAIN COMPONENT ---
export function RoyalAutopilotDemo() {
    const demo = useDemoController();
    if (!demo.isActive) return null;

    return (
        <>
            {/* Dim Layer */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[9990] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(5,10,20,0.3) 0%, rgba(5,10,20,0.85) 100%)" }} />

            {/* Scanlines */}
            <div className="fixed inset-0 z-[9991] pointer-events-none opacity-5">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]" />
            </div>

            {/* Actors */}
            <GhostCursor position={demo.ghostPosition} isTyping={demo.isTyping} />
            <IntentVisualizer text={demo.intentText} />
            <TheGate isVisible={demo.showGate} />
            <AnimatePresence>{demo.showRitual && <MiniRitualDisplay profileData={demo.profileData} />}</AnimatePresence>
            <AnimatePresence>{demo.showMockResult && <MockDashboard />}</AnimatePresence>
            <AnimatePresence>{demo.highlightTarget && <Spotlight target={demo.highlightTarget} />}</AnimatePresence>
            <DirectorCommentary text={demo.directorText} />
            <PhaseProgress currentPhase={demo.currentPhase} phases={demo.phases} onSkip={demo.skipToPhase} />

            {/* Controls */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-8 left-8 z-[10005] flex items-center gap-3">
                <button onClick={demo.stopDemo} className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all text-sm">
                    <X className="w-4 h-4" /><span className="uppercase tracking-wider text-xs">Exit Demo</span>
                </button>
            </motion.div>

            {/* Cinema Badge */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed top-8 right-8 z-[10005]">
                <div className="bg-[#050A14]/80 backdrop-blur-xl border border-[#D4AF37]/30 rounded-full px-4 py-2 flex items-center gap-2">
                    <motion.div className="w-2 h-2 bg-red-500 rounded-full" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    <span className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase font-mono">Cinema Mode</span>
                </div>
            </motion.div>
        </>
    );
}

// --- TRIGGER BUTTON ---
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
