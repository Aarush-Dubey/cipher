"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowUp,
    RefreshCcw,
    Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_SCANS, IngredientAnalysis } from "@/lib/data";
import { useState, useRef, useEffect } from "react";
import { GenerativeUIPattern } from "@/components/generative-ui-patterns";
import { BrainCircuit, Activity, AlertTriangle, Zap, CheckCircle, Biohazard, Dna, Leaf, Scale, ShieldAlert, Siren } from "lucide-react";

const iconMap: Record<string, any> = {
    Activity,
    AlertTriangle,
    Bacteria: Biohazard,
    BrainCircuit,
    CheckCircle,
    Dna,
    Leaf,
    Scale,
    ShieldAlert,
    Siren,
    Zap
};

// --- Components for the Initial "Card" (The Original Dashboard) ---
// We treat the original dashboard as just one type of "UIPattern" called 'dashboard-summary'
// But for cleaner code, we'll keep it as a sub-component here
function DashboardCard({ data, minimized }: { data: IngredientAnalysis, minimized: boolean }) {
    // Animation Variants based on Visual Theme
    const getThemeConfig = (theme: IngredientAnalysis['visualTheme']) => {
        switch (theme) {
            case 'neon-red': // The "Glitch"
                return {
                    variants: {
                        initial: { x: 0 },
                        animate: {
                            x: [0, -2, 2, -2, 2, 0],
                            filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"],
                        },
                        transition: { duration: 0.3, repeat: 2, ease: "easeInOut" as const }
                    },
                    styles: {
                        ringColor: "text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]",
                        bgGlow: "bg-red-500/10",
                        border: "border-red-500/20",
                        icon: "text-red-400"
                    }
                };
            case 'neon-green': // The "Bloom"
                return {
                    variants: {
                        initial: { scale: 0.95, opacity: 0.8 },
                        animate: {
                            scale: [0.95, 1.05, 1],
                            opacity: 1,
                            boxShadow: ["0 0 0px rgba(0,0,0,0)", "0 0 20px rgba(16,185,129,0.3)", "0 0 0px rgba(0,0,0,0)"]
                        },
                        transition: { duration: 1.5, ease: "easeOut" as const }
                    },
                    styles: {
                        ringColor: "text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]",
                        bgGlow: "bg-emerald-500/10",
                        border: "border-emerald-500/20",
                        icon: "text-emerald-400"
                    }
                };
            case 'holographic-blue': // The "Flicker" (Low Confidence)
                return {
                    variants: {
                        initial: { opacity: 0.5 },
                        animate: { opacity: [1, 0.4, 1, 0.5, 1] },
                        transition: { duration: 0.2, repeat: 3 }
                    },
                    styles: {
                        ringColor: "text-blue-400",
                        bgGlow: "bg-blue-500/10",
                        border: "border-blue-500/20",
                        icon: "text-blue-400"
                    }
                };
            default: // neon-amber
                return {
                    variants: {
                        initial: {},
                        animate: {},
                        transition: {}
                    },
                    styles: {
                        ringColor: "text-amber-500",
                        bgGlow: "bg-amber-500/10",
                        border: "border-amber-500/20",
                        icon: "text-amber-400"
                    }
                };
        }
    };

    const themeConfig = getThemeConfig(data.visualTheme);

    if (minimized) {
        return (
            <motion.div layoutId="dashboard-card" className="w-full">
                <Card className="p-4 flex items-center justify-between bg-secondary/20 border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
                            data.healthScore >= 70 ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
                        )}>
                            {data.healthScore}
                        </div>
                        <div>
                            <h3 className="font-bold text-white">{data.name}</h3>
                            <div className="text-xs text-muted-foreground">{data.intentInference}</div>
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground italic">Analysis Context Active</div>
                </Card>
            </motion.div>
        )
    }

    return (
        <motion.div layoutId="dashboard-card" className="space-y-6 w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/5 gap-4">
                <div className="space-y-2">
                    <motion.h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        {data.name}
                    </motion.h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 w-fit px-3 py-1 rounded-full border border-white/5">
                        <BrainCircuit className="w-4 h-4 text-primary" />
                        <span>{data.intentInference}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Score Ring / Hero Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="md:col-span-4 h-full"
                >
                    <Card className={cn(
                        "h-full p-6 relative overflow-hidden bg-secondary/20 flex flex-col items-center justify-center min-h-[320px] backdrop-blur-sm",
                        themeConfig.styles.border
                    )}>
                        {/* Dynamic Background Effect */}
                        <div className={cn("absolute inset-0 opacity-20 transition-all duration-1000", themeConfig.styles.bgGlow)} />

                        <div className="relative z-10 flex flex-col items-center">
                            <motion.div
                                className="relative w-48 h-48 flex items-center justify-center"
                                variants={themeConfig.variants}
                                initial="initial"
                                animate="animate"
                                transition={themeConfig.variants.transition}
                            >
                                {/* SVG Ring */}
                                <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-2xl">
                                    <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                                    <motion.circle
                                        cx="50%" cy="50%" r="45%"
                                        stroke="currentColor" strokeWidth="6" fill="transparent"
                                        className={themeConfig.styles.ringColor}
                                        strokeLinecap="round"
                                        initial={{ strokeDasharray: "283 283", strokeDashoffset: 283 }}
                                        animate={{ strokeDashoffset: 283 - (283 * data.healthScore) / 100 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                </svg>

                                <div className="flex flex-col items-center animate-in fade-in duration-1000 delay-500">
                                    <span className="text-6xl font-black tracking-tighter text-white">{data.healthScore}</span>
                                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 mt-1">Score</span>
                                </div>
                            </motion.div>

                            {/* Confidence Meter if low */}
                            {data.confidenceScore < 0.8 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono"
                                >
                                    <AlertTriangle className="w-3 h-3" />
                                    Low Confidence: {(data.confidenceScore * 100).toFixed(0)}%
                                </motion.div>
                            )}
                        </div>
                    </Card>
                </motion.div>

                {/* AI Summary & Visual Theme */}
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="md:col-span-8 h-full"
                >
                    <Card className={cn("h-full p-8 flex flex-col justify-center relative overflow-hidden backdrop-blur-xl border-white/5", themeConfig.styles.bgGlow)}>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={cn("p-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10", themeConfig.styles.icon)}>
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold text-white/90">AI Verdict</h3>
                            </div>

                            <div className="text-lg md:text-xl leading-relaxed text-foreground/90 font-light">
                                {data.aiSummary.split(" ").map((word, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + (i * 0.015) }}
                                        className="inline-block mr-1.5"
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </div>
                        </div>

                        {/* Trade Offs */}
                        <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-semibold"> Trade-Off Analysis</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.tradeOffs.map((t, i) => (
                                    <div key={i} className="bg-black/20 rounded-lg p-3 border border-white/5 flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-emerald-400 text-sm">
                                            <CheckCircle className="w-3 h-3" /> <span className="font-medium text-white/80">{t.pro}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-red-400 text-sm">
                                            <AlertTriangle className="w-3 h-3" /> <span className="font-medium text-white/60">{t.con}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Background blob */}
                        <div className={cn("absolute -right-20 -bottom-20 w-80 h-80 blur-[80px] opacity-20 rounded-full bg-current", themeConfig.styles.ringColor.split(' ')[0])} />
                    </Card>
                </motion.div>

                {/* Key Insights Bento Grid */}
                <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.keyInsights.map((insight, i) => {
                        const Icon = iconMap[insight.icon] || Activity;
                        const colorClass = insight.type === 'risk' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                            insight.type === 'benefit' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                                insight.type === 'warning' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                                    'text-blue-400 bg-blue-500/10 border-blue-500/20'; // neutral

                        return (
                            <motion.div
                                key={i}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 + (i * 0.1) }}
                            >
                                <Card className={cn("h-full p-5 flex flex-col gap-3 transition-colors hover:bg-white/5", colorClass.split(' ').slice(1).join(' '))}>
                                    <div className="flex items-center justify-between">
                                        <span className={cn("text-xs font-bold uppercase tracking-wider opacity-80", colorClass.split(' ')[0])}>
                                            {insight.type}
                                        </span>
                                        <Icon className={cn("w-5 h-5", colorClass.split(' ')[0])} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white text-lg mb-1">{insight.title}</h4>
                                        <p className="text-sm text-muted-foreground/80 leading-snug">{insight.description}</p>
                                    </div>
                                </Card>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </motion.div>
    );
}


interface MessageItem {
    id: string;
    role: 'user' | 'ai';
    type: string; // e.g., 'dashboard', 'text', 'compliance_checklist', etc.
    data: any;
}

import { HealthIntelligenceDashboard } from "@/components/health-intelligence-dashboard";
import { useUserProfile } from "@/context/user-profile-context";
import { ConflictGuard } from "@/components/bio-sync-drawer";

export function GenerativeResult({ query, userContext, onReset }: { query: string; userContext?: string; onReset: () => void }) {
    // 2. Chat State & AI Initialization
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const { profile, hasConflict } = useUserProfile();
    const [conflictIngredient, setConflictIngredient] = useState<string | null>(null);

    // Shuffle Suggestions on Mount
    useEffect(() => {
        const pool = [
            "Is this safe for kids?",
            "What are the side effects?",
            "Show me better alternatives",
            "Is this vegan?",
            "Will this cause a crash?",
            "Is this banned in Europe?",
            "What is the molecular structure?",
            "Is the marketing true?",
            "What is the daily safety limit?",
            "Does it have allergens?"
        ];
        setSuggestions(pool.sort(() => 0.5 - Math.random()).slice(0, 3));
    }, []);

    // Initial AI Dashboard Generation
    useEffect(() => {
        const generateDashboard = async () => {
            try {
                // 1. Attempt Real AI Analysis with User Profile
                const res = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query,
                        userContext,
                        userProfile: profile ? {
                            goals: profile.goals,
                            constraints: profile.constraints,
                            dailySodiumCap: profile.dailySodiumCap,
                            dailyCalories: profile.dailyCalories
                        } : null
                    })
                });

                if (!res.ok) throw new Error("Analysis API failed");
                const aiData = await res.json();
                setMessages([{ id: 'init', role: 'ai', type: 'dashboard', data: aiData }]);

            } catch (error) {
                console.warn("Falling back to error state:", error);

                // 3. Generate Dynamic Error Dashboard (New Schema)
                const errorDashboard = {
                    meta: { product_name: query || "System Error", category: "Error", analysis_date: new Date().toISOString().split('T')[0] },
                    layout_config: { theme: "dark_slate", emphasis: "none" },
                    components: [
                        { id: "e1", zone: "zone_1", type: "score_ring", data: { score: 0, grade: "F", label: "Connection Failed" } },
                        { id: "e2", zone: "zone_1", type: "text_block", data: { headline: "System Offline", body: "Network analysis failed. Please check API configuration." } }
                    ]
                };
                setMessages([{ id: 'init', role: 'ai', type: 'dashboard', data: errorDashboard }]);
            }
        };

        generateDashboard();
    }, [query]);

    // Data Accessor for Chat Context
    const data = messages[0]?.data;

    // Auto-scroll Logic (Fixed to prevent jumping to bottom on load)
    useEffect(() => {
        if (scrollRef.current && messages.length > 1) {
            // Only scroll to bottom for chat messages, not the initial dashboard
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isThinking]);


    const handleSend = async (override?: string) => {
        const text = typeof override === 'string' ? override : input;
        if (!text.trim() || isThinking) return;

        // Add User Message
        const userMsg: MessageItem = {
            id: Date.now().toString(),
            role: 'user',
            type: 'text',
            data: text
        };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsThinking(true);

        try {
            // Call Grok API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productContext: data,
                    userQuery: userMsg.data
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Backend Error Details:", errorData);
                throw new Error(errorData.error || `API Request Failed: ${response.status}`);
            }
            const result = await response.json();

            console.log("Grok Response:", result);

            // --- Adapter Logic (Simplified for New Polymorphic Components) ---
            let uiComponent = null;

            const comp = result.component;
            if (comp && comp.type) {
                // The new Chat API returns { type: "compliance_checklist", data: {...} }
                // which matches our GenerativeUIPattern directly.
                uiComponent = comp;
            }

            // Construct Messages
            const newMessages: MessageItem[] = [];

            // 1. Text Summary (Always present)
            newMessages.push({
                id: (Date.now() + 1).toString(),
                role: 'ai',
                type: 'text',
                data: result.summary || "Here is the analysis."
            });

            // 2. UI Component (If returned)
            if (uiComponent) {
                newMessages.push({
                    id: (Date.now() + 2).toString(),
                    role: 'ai',
                    type: uiComponent.type, // e.g., "compliance_checklist"
                    data: uiComponent.data
                });
            }

            setMessages(prev => [...prev, ...newMessages]);

        } catch (error) {
            console.error("Generative UI Error:", error);
            // Fallback to offline mock logic or error text
            // For now, simple error text as requested
            const errorMsg: MessageItem = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                type: 'text',
                data: "I'm having trouble connecting to the neural network. Retrying simulation..."
            };
            setMessages(prev => [...prev, errorMsg]);

            // Optional: Fallback to local mock if API fails?
            // Keeping it simple as per request.
        } finally {
            setIsThinking(false);

            // Refresh Suggestions for next turn
            const nextPool = [
                "Is this safe for kids?",
                "What are the side effects?",
                "Show me better alternatives",
                "Is this vegan?",
                "Will this cause a crash?",
                "Is this banned in Europe?",
                "What is the molecular structure?",
                "Is the marketing true?",
                "What is the daily safety limit?",
                "Does it have allergens?",
                "Is it keto friendly?",
                "What is the source?",
                "Environmental impact?",
                "Is the packaging safe?",
                "Glycemic index?"
            ];
            setSuggestions(nextPool.sort(() => 0.5 - Math.random()).slice(0, 3));
        }
    };

    // Check for allergy conflict on query
    const detectedConflict = hasConflict([query]);

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col h-[calc(100vh-100px)] relative">
            {/* Conflict Guard Banner */}
            {detectedConflict && <ConflictGuard conflictIngredient={detectedConflict} />}

            {/* Scrollable Feed */}
            <div className="flex-1 overflow-y-auto pb-32 px-4 md:px-0 space-y-8 scrollbar-hide">
                <AnimatePresence>
                    {messages.map((msg, index) => {
                        // Logic to shrink the main dashboard if it's no longer the only item
                        const isDashboardToCheck = msg.type === 'dashboard';
                        const isMinimized = isDashboardToCheck && messages.length > 1;

                        return (
                            <motion.div
                                key={msg.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "w-full",
                                    msg.role === 'user' ? "flex justify-end" : ""
                                )}
                            >
                                {msg.role === 'user' ? (
                                    <div className="bg-white/10 text-white rounded-2xl rounded-tr-sm px-6 py-4 max-w-[80%] text-right text-lg font-light">
                                        {msg.data}
                                    </div>
                                ) : (
                                    <div className="w-full">
                                        {msg.type === 'dashboard' ? (
                                            <HealthIntelligenceDashboard data={msg.data} />
                                        ) : (
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary mt-2">
                                                    <Sparkles className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <GenerativeUIPattern component={{ type: msg.type, data: msg.data }} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}
                </AnimatePresence>

                {isThinking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-4 items-center pl-12"
                    >
                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </motion.div>
                )}
                <div ref={scrollRef} className="h-4" />
            </div>

            {/* Persistent Omni-Bar at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-20">
                <div className="relative max-w-3xl mx-auto">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask about toxicity, safe limits, better alternatives..."
                        className="h-16 pl-6 pr-14 rounded-full border-white/10 bg-secondary/50 backdrop-blur-xl shadow-2xl text-lg focus-visible:ring-primary/50"
                    />
                    <Button
                        size="icon"
                        className="absolute right-2 top-2 w-12 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                        onClick={() => handleSend()}
                        disabled={!input.trim()}
                    >
                        <ArrowUp className="w-6 h-6" />
                    </Button>
                </div>

                <div className="flex justify-center gap-4 mt-4 text-xs text-muted-foreground/60 w-full overflow-x-auto pb-2 scrollbar-hide">
                    <AnimatePresence>
                        {suggestions.map((s, i) => (
                            <motion.div
                                key={s}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-4 items-center"
                            >
                                <button
                                    onClick={() => { setInput(s); handleSend(s); }}
                                    className="hover:text-primary transition-colors whitespace-nowrap"
                                >
                                    {s}
                                </button>
                                {i < suggestions.length - 1 && <span>•</span>}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
