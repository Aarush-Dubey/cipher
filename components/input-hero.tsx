"use client";

import { motion } from "framer-motion";
import { Upload, ScanBarcode, ArrowRight, Camera, Play } from "lucide-react";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function InputHero({ onAnalyze, onStartDemo }: { onAnalyze: (query: string) => void; onStartDemo?: () => void }) {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsScanning(true);
            setQuery("Scanning image...");

            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                setQuery("Invalid file type");
                setIsScanning(false);
                return;
            }

            setTimeout(() => {
                setIsScanning(false);
                setQuery("Detected: Hyper-Fuel Energy Drink...");
                setTimeout(() => {
                    onAnalyze("Hyper-Fuel Energy");
                }, 800);
            }, 2500);
        }
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[40vh] py-20">
            {/* Orb Animation */}
            <motion.div
                animate={{
                    scale: isFocused || isScanning ? [1, 1.1, 1] : 1,
                    opacity: isFocused || isScanning ? 0.6 : 0.3,
                    filter: isScanning ? "hue-rotate(90deg) blur(100px)" : "blur(120px)"
                }}
                transition={{
                    duration: isScanning ? 1.5 : 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={cn(
                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full transition-colors duration-1000",
                    isScanning ? "bg-red-500/40" : "bg-primary/40"
                )}
            />

            <div className="relative z-10 w-full space-y-8">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center space-y-3"
                >
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
                        Decode What You Eat
                    </h1>
                    <p className="text-lg text-muted-foreground font-light">
                        AI-powered ingredient analysis. Instantly.
                    </p>
                </motion.div>

                {/* Input Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    <div className={cn(
                        "flex items-center gap-3 p-2 rounded-2xl border backdrop-blur-xl transition-all duration-500",
                        isFocused ? "border-primary/50 bg-black/40 shadow-[0_0_30px_-5px_rgba(var(--primary),0.2)]" : "border-white/10 bg-black/20"
                    )}>
                        <Input
                            id="demo-input"
                            type="text"
                            placeholder="Enter product name or paste ingredients..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onKeyDown={(e) => e.key === "Enter" && query.trim() && onAnalyze(query)}
                            className="flex-1 border-0 bg-transparent text-lg placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                            disabled={isScanning}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isScanning}
                        >
                            <Upload className="w-5 h-5" />
                        </Button>
                        <Button
                            size="icon"
                            className={cn(
                                "rounded-xl w-10 h-10 transition-all duration-300",
                                query.trim() ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.5)]" : "bg-muted text-muted-foreground"
                            )}
                            disabled={!query.trim() || isScanning}
                            onClick={() => onAnalyze(query)}
                        >
                            {isScanning ? <ScanBarcode className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                        </Button>
                    </div>
                </motion.div>

                {/* Quick Suggestions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap justify-center gap-3 text-sm"
                >
                    {["Hyper-Fuel Energy", "Eco-Crunch Bar", "Zenith Kale Chips", "Mystic Noodles"].map((item) => (
                        <button
                            key={item}
                            onClick={() => {
                                setQuery(item);
                                onAnalyze(item);
                            }}
                            className="px-4 py-2 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors backdrop-blur-sm"
                        >
                            {item}
                        </button>
                    ))}
                </motion.div>

                {/* Demo Trigger Button */}
                {onStartDemo && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col items-center gap-3 pt-8"
                    >
                        <span className="text-[10px] tracking-[0.4em] text-white/30 uppercase font-mono">
                            Interactive Demo
                        </span>
                        <motion.button
                            onClick={onStartDemo}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative px-8 py-4 bg-gradient-to-r from-amber-600/10 to-amber-500/10 border border-amber-500/30 rounded-full overflow-hidden"
                        >
                            {/* Shimmer Effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent -skew-x-12"
                                animate={{ x: ["-200%", "200%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />

                            <div className="relative flex items-center gap-3">
                                <Play className="w-4 h-4 text-amber-500" />
                                <span className="text-amber-500 font-medium tracking-widest uppercase text-sm">
                                    Experience CIPHER
                                </span>
                            </div>
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
