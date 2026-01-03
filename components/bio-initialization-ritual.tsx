"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUserProfile, UserBiometrics } from "@/context/user-profile-context";
import { Sparkles, Shield, Flame, Dumbbell, Heart, Leaf, ChevronUp, ChevronDown, X, Check } from "lucide-react";

// --- Constants ---

const ALLERGIES = ["Peanuts", "Tree Nuts", "Shellfish", "Gluten", "Dairy", "Eggs", "Soy", "Sesame", "Fish", "Wheat"];
const DIETS = ["Low Sodium", "Low Sugar", "Keto", "Vegan", "Vegetarian", "Halal", "Kosher", "Paleo"];

const GOALS = [
    {
        id: "muscle_gain",
        title: "Sculpt & Strengthen",
        subtitle: "Build lean muscle mass",
        icon: Dumbbell,
        gradient: "from-purple-900/40 to-indigo-900/40"
    },
    {
        id: "fat_loss",
        title: "Refine & Reduce",
        subtitle: "Optimize body composition",
        icon: Flame,
        gradient: "from-orange-900/40 to-red-900/40"
    },
    {
        id: "heart_health",
        title: "Sustain & Protect",
        subtitle: "Cardiovascular wellness",
        icon: Heart,
        gradient: "from-red-900/40 to-pink-900/40"
    },
    {
        id: "maintain",
        title: "Balance & Thrive",
        subtitle: "Maintain optimal health",
        icon: Leaf,
        gradient: "from-emerald-900/40 to-teal-900/40"
    }
];

// --- Easing ---
const luxuryEase = [0.16, 1, 0.3, 1] as [number, number, number, number];

// --- Component ---

export function BioInitializationRitual({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(0);
    const { updateBiometrics, toggleGoal, addConstraint, profile } = useUserProfile();

    // Local state for ritual
    const [height, setHeight] = useState(170);
    const [weight, setWeight] = useState(70);
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const handleComplete = () => {
        // Save biometrics
        updateBiometrics({
            height_cm: height,
            weight_kg: weight,
            age: 30, // Default, can be enhanced later
            sex: "male" // Default
        });

        // Save allergies
        selectedAllergies.forEach(allergy => {
            addConstraint("allergies", allergy);
        });

        // Save goal
        if (selectedGoal) {
            toggleGoal(selectedGoal);
        }

        // Trigger completion immediately
        onComplete();
    };

    const nextStep = () => {
        if (step === 4) {
            handleComplete();
        } else {
            setStep(prev => prev + 1);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#050A14] overflow-hidden">
            {/* Background Ambiance */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-900/5 blur-[200px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-800/5 blur-[150px] rounded-full" />
            </div>

            {/* Step Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute top-8 left-1/2 -translate-x-1/2 z-50"
            >
                <div className="flex items-center gap-3">
                    {[0, 1, 2, 3, 4].map(i => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 + i * 0.1, ease: luxuryEase }}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-700",
                                i === step ? "w-8 bg-amber-500" : i < step ? "bg-amber-500/50" : "bg-white/10"
                            )}
                        />
                    ))}
                </div>
                <div className="text-center mt-4 text-[10px] tracking-[0.4em] text-white/30 uppercase font-mono">
                    S T E P {String(step + 1).padStart(2, '0')}
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {/* Screen 1: The Greeting */}
                {step === 0 && (
                    <motion.div
                        key="greeting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, filter: "blur(20px)" }}
                        transition={{ duration: 1.5, ease: luxuryEase }}
                        className="absolute inset-0 flex flex-col items-center justify-center px-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 1.2, ease: luxuryEase }}
                            className="text-center max-w-xl"
                        >
                            <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/20">
                                <Sparkles className="w-8 h-8 text-amber-500" />
                            </div>

                            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
                                Welcome. <br className="hidden md:block" />
                                <span className="text-amber-500/90 italic">Let us calibrate your engine.</span>
                            </h1>

                            <p className="text-white/40 text-lg font-light leading-relaxed mb-12">
                                A brief ritual to personalize your nutritional intelligence.
                                This ensures every analysis is tailored precisely to you.
                            </p>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.8, ease: luxuryEase }}
                            onClick={nextStep}
                            whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(212, 175, 55, 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            className="px-12 py-4 bg-gradient-to-r from-amber-600/20 to-amber-500/20 border border-amber-500/40 text-amber-500 rounded-full font-medium tracking-widest uppercase text-sm transition-all hover:bg-amber-500/30 hover:border-amber-500/60"
                        >
                            Begin Calibration
                        </motion.button>
                    </motion.div>
                )}

                {/* Screen 2: The Metrics */}
                {step === 1 && (
                    <motion.div
                        key="metrics"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, filter: "blur(20px)" }}
                        transition={{ duration: 0.8, ease: luxuryEase }}
                        className="absolute inset-0 flex flex-col items-center justify-center px-8"
                    >
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl font-serif text-white mb-4 text-center"
                        >
                            Your <span className="text-amber-500 italic">Dimensions</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-white/40 text-center mb-12 max-w-md"
                        >
                            Precision measurements for accurate metabolic calculation
                        </motion.p>

                        <div className="flex gap-16 md:gap-24 mb-12">
                            {/* Height Wheel */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, ease: luxuryEase }}
                                className="text-center"
                            >
                                <div className="text-[10px] tracking-[0.3em] text-white/30 uppercase mb-6">Height (cm)</div>
                                <div className="relative">
                                    <button
                                        onClick={() => setHeight(h => Math.min(220, h + 1))}
                                        className="absolute -top-10 left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center text-white/30 hover:text-amber-500 transition-colors"
                                    >
                                        <ChevronUp className="w-6 h-6" />
                                    </button>

                                    <div className="text-6xl font-mono font-light text-white tabular-nums tracking-tight">
                                        {height}
                                    </div>

                                    <button
                                        onClick={() => setHeight(h => Math.max(100, h - 1))}
                                        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center text-white/30 hover:text-amber-500 transition-colors"
                                    >
                                        <ChevronDown className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Slider */}
                                <input
                                    type="range"
                                    min={100}
                                    max={220}
                                    value={height}
                                    onChange={(e) => setHeight(+e.target.value)}
                                    className="mt-8 w-32 accent-amber-500 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                                />
                            </motion.div>

                            {/* Divider */}
                            <div className="w-px bg-gradient-to-b from-transparent via-amber-500/20 to-transparent" />

                            {/* Weight Wheel */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, ease: luxuryEase }}
                                className="text-center"
                            >
                                <div className="text-[10px] tracking-[0.3em] text-white/30 uppercase mb-6">Weight (kg)</div>
                                <div className="relative">
                                    <button
                                        onClick={() => setWeight(w => Math.min(200, w + 1))}
                                        className="absolute -top-10 left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center text-white/30 hover:text-amber-500 transition-colors"
                                    >
                                        <ChevronUp className="w-6 h-6" />
                                    </button>

                                    <div className="text-6xl font-mono font-light text-white tabular-nums tracking-tight">
                                        {weight}
                                    </div>

                                    <button
                                        onClick={() => setWeight(w => Math.max(30, w - 1))}
                                        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center text-white/30 hover:text-amber-500 transition-colors"
                                    >
                                        <ChevronDown className="w-6 h-6" />
                                    </button>
                                </div>

                                <input
                                    type="range"
                                    min={30}
                                    max={200}
                                    value={weight}
                                    onChange={(e) => setWeight(+e.target.value)}
                                    className="mt-8 w-32 accent-amber-500 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                                />
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-center text-white/30 text-sm font-mono mb-8"
                        >
                            BMI: <span className="text-amber-500">{(weight / ((height / 100) ** 2)).toFixed(1)}</span>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            onClick={nextStep}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-10 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full font-medium tracking-widest uppercase text-xs hover:bg-amber-500/20 transition-all"
                        >
                            Continue
                        </motion.button>
                    </motion.div>
                )}

                {/* Screen 3: The Constraints */}
                {step === 2 && (
                    <motion.div
                        key="constraints"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, filter: "blur(20px)" }}
                        transition={{ duration: 0.8, ease: luxuryEase }}
                        className="absolute inset-0 flex flex-col items-center justify-center px-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center border border-red-500/20"
                        >
                            <Shield className="w-8 h-8 text-red-400" />
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl font-serif text-white mb-4 text-center"
                        >
                            Threats to <span className="text-red-400 italic">Avoid</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-white/40 text-center mb-10 max-w-md"
                        >
                            Select any allergens or dietary restrictions. These will trigger critical alerts.
                        </motion.p>

                        {/* Selected Allergies Shield */}
                        {selectedAllergies.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-wrap gap-2 justify-center mb-8 max-w-md"
                            >
                                {selectedAllergies.map(allergy => (
                                    <motion.div
                                        key={allergy}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-full text-red-400 text-sm flex items-center gap-2"
                                    >
                                        {allergy}
                                        <button
                                            onClick={() => setSelectedAllergies(prev => prev.filter(a => a !== allergy))}
                                            className="hover:text-white transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* Allergy Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap gap-2 justify-center max-w-lg mb-10"
                        >
                            {ALLERGIES.filter(a => !selectedAllergies.includes(a)).map(allergy => (
                                <button
                                    key={allergy}
                                    onClick={() => setSelectedAllergies(prev => [...prev, allergy])}
                                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/50 text-sm hover:bg-white/10 hover:border-white/20 hover:text-white transition-all"
                                >
                                    {allergy}
                                </button>
                            ))}
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            onClick={nextStep}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-10 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full font-medium tracking-widest uppercase text-xs hover:bg-amber-500/20 transition-all"
                        >
                            {selectedAllergies.length > 0 ? "Continue" : "Skip"}
                        </motion.button>
                    </motion.div>
                )}

                {/* Screen 4: The Goals */}
                {step === 3 && (
                    <motion.div
                        key="goals"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, filter: "blur(20px)" }}
                        transition={{ duration: 0.8, ease: luxuryEase }}
                        className="absolute inset-0 flex flex-col items-center justify-center px-8"
                    >
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl font-serif text-white mb-4 text-center"
                        >
                            Your <span className="text-amber-500 italic">Ambition</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-white/40 text-center mb-12 max-w-md"
                        >
                            What transformation do you seek?
                        </motion.p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
                            {GOALS.map((goal, i) => {
                                const isSelected = selectedGoal === goal.id;
                                const Icon = goal.icon;

                                return (
                                    <motion.button
                                        key={goal.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + i * 0.1, ease: luxuryEase }}
                                        onClick={() => setSelectedGoal(goal.id)}
                                        whileHover={{ scale: 1.03, y: -5 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={cn(
                                            "relative p-6 rounded-2xl border backdrop-blur-sm transition-all duration-500 text-left overflow-hidden group",
                                            isSelected
                                                ? "bg-amber-500/20 border-amber-500/50 shadow-[0_0_40px_rgba(212,175,55,0.2)]"
                                                : "bg-white/5 border-white/10 hover:border-white/20"
                                        )}
                                    >
                                        {/* Background Gradient */}
                                        <div className={cn(
                                            "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                                            goal.gradient
                                        )} />

                                        <div className="relative z-10">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
                                                isSelected ? "bg-amber-500/20 text-amber-500" : "bg-white/5 text-white/50 group-hover:text-white/80"
                                            )}>
                                                <Icon className="w-6 h-6" />
                                            </div>

                                            <h3 className={cn(
                                                "font-serif text-lg mb-1 transition-colors",
                                                isSelected ? "text-amber-500" : "text-white"
                                            )}>
                                                {goal.title}
                                            </h3>
                                            <p className="text-white/40 text-xs">{goal.subtitle}</p>

                                            {isSelected && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute top-3 right-3 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center"
                                                >
                                                    <Check className="w-4 h-4 text-black" />
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            onClick={nextStep}
                            disabled={!selectedGoal}
                            whileHover={{ scale: selectedGoal ? 1.02 : 1 }}
                            whileTap={{ scale: selectedGoal ? 0.98 : 1 }}
                            className={cn(
                                "mt-12 px-10 py-3 rounded-full font-medium tracking-widest uppercase text-xs transition-all",
                                selectedGoal
                                    ? "bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20"
                                    : "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
                            )}
                        >
                            Continue
                        </motion.button>
                    </motion.div>
                )}

                {/* Screen 5: The Synthesis */}
                {step === 4 && (
                    <motion.div
                        key="synthesis"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: luxuryEase }}
                        className="absolute inset-0 flex flex-col items-center justify-center px-8"
                    >
                        {/* Central Ring Animation */}
                        <div className="relative w-48 h-48 mb-8">
                            {/* Outer Ring */}
                            <motion.svg
                                className="absolute inset-0 w-full h-full -rotate-90"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <circle
                                    cx="96" cy="96" r="88"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="4"
                                />
                                <motion.circle
                                    cx="96" cy="96" r="88"
                                    fill="none"
                                    stroke="url(#goldGradient)"
                                    strokeWidth="4"
                                    strokeDasharray="553"
                                    initial={{ strokeDashoffset: 553 }}
                                    animate={{ strokeDashoffset: 0 }}
                                    transition={{ duration: 2, ease: luxuryEase }}
                                />
                                <defs>
                                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#D4AF37" />
                                        <stop offset="100%" stopColor="#F4E4BC" />
                                    </linearGradient>
                                </defs>
                            </motion.svg>

                            {/* Center Content */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 1, duration: 0.8, ease: luxuryEase }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <div className="text-center">
                                    <Sparkles className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                                    <div className="text-amber-500 font-mono text-xs tracking-widest">COMPLETE</div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Data Stream */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-center space-y-2 font-mono text-xs text-white/30 mb-8"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span>BMR: {Math.round(10 * weight + 6.25 * height - 5 * 30 + 5)} kcal</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span>Sodium Cap: {selectedGoal === "heart_health" ? "1500" : "2300"}mg</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span>Allergen Filters: {selectedAllergies.length} active</span>
                            </div>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5, duration: 0.8 }}
                            className="text-2xl font-serif text-white text-center"
                        >
                            Calibration <span className="text-amber-500 italic">Complete</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.8 }}
                            className="text-white/40 text-center mt-2 mb-8"
                        >
                            Your personalized health guard is now active.
                        </motion.p>

                        {/* Continue Button */}
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2.2, duration: 0.8, ease: luxuryEase }}
                            onClick={handleComplete}
                            whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(212, 175, 55, 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            className="px-12 py-4 bg-gradient-to-r from-amber-600/20 to-amber-500/20 border border-amber-500/40 text-amber-500 rounded-full font-medium tracking-widest uppercase text-sm transition-all hover:bg-amber-500/30 hover:border-amber-500/60"
                        >
                            Continue to Analysis
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
