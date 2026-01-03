"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, User, Scale, Ruler, Calendar, Heart, Flame, Dumbbell,
    Leaf, ShieldAlert, AlertTriangle, Check, Sparkles, ChevronUp, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserProfile, UserBiometrics } from "@/context/user-profile-context";

// --- Constants ---

const GOALS = [
    { id: "fat_loss", label: "Fat Loss", icon: Flame, color: "from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-400" },
    { id: "muscle_gain", label: "Muscle", icon: Dumbbell, color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400" },
    { id: "maintain", label: "Maintain", icon: Scale, color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400" },
    { id: "heart_health", label: "Heart", icon: Heart, color: "from-red-500/20 to-pink-500/20 border-red-500/30 text-red-400" }
];

const ALLERGIES = ["Peanuts", "Tree Nuts", "Shellfish", "Gluten", "Dairy", "Eggs", "Soy", "Sesame"];
const DIETS = ["Keto", "Vegan", "Vegetarian", "Halal", "Low Sodium", "Low Sugar"];
const CONDITIONS = ["Hypertension", "Diabetes (Type 2)", "High Cholesterol"];

const luxuryEase = [0.16, 1, 0.3, 1] as [number, number, number, number];

// --- Component ---

export function BioSyncDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { profile, updateBiometrics, toggleGoal, addConstraint, removeConstraint, resetProfile } = useUserProfile();

    // Local state for form
    const [localBio, setLocalBio] = useState({
        weight_kg: profile.biometrics?.weight_kg || 70,
        height_cm: profile.biometrics?.height_cm || 170,
        age: profile.biometrics?.age || 25,
        sex: profile.biometrics?.sex || "male" as const
    });

    // Sync with profile when drawer opens
    useEffect(() => {
        if (isOpen && profile.biometrics) {
            setLocalBio({
                weight_kg: profile.biometrics.weight_kg,
                height_cm: profile.biometrics.height_cm,
                age: profile.biometrics.age,
                sex: profile.biometrics.sex
            });
        }
    }, [isOpen, profile.biometrics]);

    const handleSave = () => {
        updateBiometrics(localBio as UserBiometrics);
        onClose();
    };

    const bmi = localBio.weight_kg / ((localBio.height_cm / 100) ** 2);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0A0A0F] border-l border-white/5 z-50 overflow-y-auto"
                    >
                        {/* Ambient Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

                        {/* Header */}
                        <div className="sticky top-0 bg-[#0A0A0F]/90 backdrop-blur-md p-6 border-b border-white/5 z-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-[10px] tracking-[0.4em] text-amber-500/70 uppercase mb-2 font-mono">Profile Settings</div>
                                    <h2 className="text-2xl font-serif text-white">Bio-Sync</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                                >
                                    <X className="w-5 h-5 text-white/60" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-10 relative">

                            {/* Section: Biometrics */}
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                        <User className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <h3 className="text-xs uppercase tracking-[0.2em] text-white/50 font-medium">Biometrics</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    {/* Height */}
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                        <div className="text-[10px] tracking-[0.2em] text-white/30 uppercase mb-3">Height</div>
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() => setLocalBio(p => ({ ...p, height_cm: Math.max(100, p.height_cm - 1) }))}
                                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                                            >
                                                <ChevronDown className="w-4 h-4 text-white/50" />
                                            </button>
                                            <div className="text-3xl font-mono font-light text-white tabular-nums">
                                                {localBio.height_cm}
                                                <span className="text-sm text-white/30 ml-1">cm</span>
                                            </div>
                                            <button
                                                onClick={() => setLocalBio(p => ({ ...p, height_cm: Math.min(220, p.height_cm + 1) }))}
                                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                                            >
                                                <ChevronUp className="w-4 h-4 text-white/50" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Weight */}
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                        <div className="text-[10px] tracking-[0.2em] text-white/30 uppercase mb-3">Weight</div>
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() => setLocalBio(p => ({ ...p, weight_kg: Math.max(30, p.weight_kg - 1) }))}
                                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                                            >
                                                <ChevronDown className="w-4 h-4 text-white/50" />
                                            </button>
                                            <div className="text-3xl font-mono font-light text-white tabular-nums">
                                                {localBio.weight_kg}
                                                <span className="text-sm text-white/30 ml-1">kg</span>
                                            </div>
                                            <button
                                                onClick={() => setLocalBio(p => ({ ...p, weight_kg: Math.min(200, p.weight_kg + 1) }))}
                                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                                            >
                                                <ChevronUp className="w-4 h-4 text-white/50" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* BMI Display */}
                                <div className="bg-gradient-to-r from-amber-500/5 to-transparent rounded-xl p-4 border border-amber-500/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-[10px] tracking-[0.2em] text-amber-500/50 uppercase">Body Mass Index</div>
                                            <div className="text-2xl font-mono text-white mt-1">{bmi.toFixed(1)}</div>
                                        </div>
                                        <div className={cn(
                                            "px-3 py-1 rounded-full text-xs font-medium",
                                            bmi < 18.5 ? "bg-blue-500/20 text-blue-400" :
                                                bmi < 25 ? "bg-emerald-500/20 text-emerald-400" :
                                                    bmi < 30 ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"
                                        )}>
                                            {bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese"}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section: Goals */}
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <h3 className="text-xs uppercase tracking-[0.2em] text-white/50 font-medium">Goals</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {GOALS.map(goal => {
                                        const isActive = profile.goals.includes(goal.id);
                                        const Icon = goal.icon;
                                        return (
                                            <button
                                                key={goal.id}
                                                onClick={() => toggleGoal(goal.id)}
                                                className={cn(
                                                    "p-4 rounded-xl border transition-all flex items-center gap-3",
                                                    isActive
                                                        ? `bg-gradient-to-br ${goal.color}`
                                                        : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10"
                                                )}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="text-sm font-medium">{goal.label}</span>
                                                {isActive && <Check className="w-4 h-4 ml-auto" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Section: Allergies */}
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                        <ShieldAlert className="w-4 h-4 text-red-400" />
                                    </div>
                                    <h3 className="text-xs uppercase tracking-[0.2em] text-white/50 font-medium">Allergens</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {ALLERGIES.map(allergy => {
                                        const isActive = profile.constraints.allergies.includes(allergy);
                                        return (
                                            <button
                                                key={allergy}
                                                onClick={() => isActive ? removeConstraint("allergies", allergy) : addConstraint("allergies", allergy)}
                                                className={cn(
                                                    "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                                                    isActive
                                                        ? "bg-red-500/20 text-red-400 border-red-500/40"
                                                        : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white/60"
                                                )}
                                            >
                                                {allergy}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Section: Dietary */}
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                        <Leaf className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <h3 className="text-xs uppercase tracking-[0.2em] text-white/50 font-medium">Dietary</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {DIETS.map(diet => {
                                        const isActive = profile.constraints.diet.includes(diet);
                                        return (
                                            <button
                                                key={diet}
                                                onClick={() => isActive ? removeConstraint("diet", diet) : addConstraint("diet", diet)}
                                                className={cn(
                                                    "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                                                    isActive
                                                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                                                        : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white/60"
                                                )}
                                            >
                                                {diet}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Section: Conditions */}
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                        <Heart className="w-4 h-4 text-amber-400" />
                                    </div>
                                    <h3 className="text-xs uppercase tracking-[0.2em] text-white/50 font-medium">Conditions</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {CONDITIONS.map(cond => {
                                        const isActive = profile.constraints.conditions.includes(cond);
                                        return (
                                            <button
                                                key={cond}
                                                onClick={() => isActive ? removeConstraint("conditions", cond) : addConstraint("conditions", cond)}
                                                className={cn(
                                                    "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                                                    isActive
                                                        ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                                                        : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white/60"
                                                )}
                                            >
                                                {cond}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-[#0A0A0F]/90 backdrop-blur-md p-6 border-t border-white/5 space-y-3">
                            <button
                                onClick={handleSave}
                                className="w-full py-4 bg-gradient-to-r from-amber-600/20 to-amber-500/20 border border-amber-500/30 text-amber-500 font-medium rounded-xl hover:bg-amber-500/30 transition-all tracking-widest uppercase text-sm"
                            >
                                Save & Close
                            </button>
                            <button
                                onClick={() => { resetProfile(); onClose(); }}
                                className="w-full py-2 text-[10px] text-white/20 hover:text-red-400 uppercase tracking-widest transition-colors font-mono"
                            >
                                Reset Profile Data
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// --- Bio-Avatar Button ---

export function BioAvatarButton({ onClick }: { onClick: () => void }) {
    const { isProfileComplete, profile } = useUserProfile();

    const ringColor = isProfileComplete
        ? "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        : "border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]";

    return (
        <button
            onClick={onClick}
            className={cn(
                "relative w-11 h-11 rounded-full bg-white/5 border-2 flex items-center justify-center transition-all hover:scale-105 hover:bg-white/10",
                ringColor
            )}
        >
            <User className="w-5 h-5 text-white/70" />

            {/* Status Dot */}
            <div className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black",
                isProfileComplete ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
            )} />
        </button>
    );
}

// --- Conflict Guard Banner ---

export function ConflictGuard({ conflictIngredient }: { conflictIngredient: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-gradient-to-r from-red-950/80 to-red-900/50 border border-red-500/30 rounded-xl p-4 flex items-center gap-4 mb-6 relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMzksMjcsNjksMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30 pointer-events-none" />

            <div className="relative z-10 flex items-center gap-4 w-full">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0 border border-red-500/30">
                    <ShieldAlert className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1">
                    <div className="text-red-400 font-bold uppercase tracking-wider text-xs mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        Allergy Conflict Detected
                    </div>
                    <div className="text-white/80 text-sm">
                        Contains <span className="font-bold text-red-400">{conflictIngredient}</span> — Do Not Consume
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
