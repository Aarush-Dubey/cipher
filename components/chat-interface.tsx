"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    role: "user" | "ai";
    content: string;
}

export function ChatInterface({ productName }: { productName: string }) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "ai",
            content: `I've analyzed ${productName}. What specific health goals or concerns do you have?`
        }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate AI thinking and response
        setTimeout(() => {
            const response = generateMockResponse(input, productName);
            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "ai", content: response };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <Card className="flex flex-col h-[500px] w-full bg-black/20 border-white/10 backdrop-blur-md overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-white/5">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm text-foreground">Reasoning Chat</h3>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "flex gap-3 max-w-[80%]",
                            msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            msg.role === "user" ? "bg-white/10" : "bg-primary/20 text-primary"
                        )}>
                            {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={cn(
                            "p-3 rounded-2xl text-sm leading-relaxed",
                            msg.role === "user"
                                ? "bg-white/10 text-white rounded-tr-sm"
                                : "bg-primary/10 text-primary-foreground border border-primary/20 rounded-tl-sm"
                        )}>
                            {msg.content}
                        </div>
                    </motion.div>
                ))}
                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 mr-auto max-w-[80%]">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl rounded-tl-sm flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="p-4 border-t border-white/5 bg-white/5">
                <div className="relative flex items-center">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask about side effects, alternatives..."
                        className="pr-12 bg-black/20 border-white/10 focus-visible:ring-primary/50"
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-1 hover:bg-white/10 text-primary hover:text-primary"
                        onClick={handleSend}
                        disabled={!input.trim()}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}

// Simple mock response generator logic
function generateMockResponse(input: string, product: string): string {
    const query = input.toLowerCase();

    if (query.includes("safe") || query.includes("dangerous")) {
        return "Based on the addictive profile of the ingredients, I'd classify this as 'Safe in moderation' but potentially habit-forming due to the high dopamine response triggered by the sweeteners.";
    }
    if (query.includes("kid") || query.includes("children")) {
        return "Not recommended for children. The stimulant levels exceed the recommended daily limits for developing nervous systems.";
    }
    if (query.includes("vegan")) {
        return "The ingredients list appears free of animal by-products, though strict verification of the 'Natural Flavors' source would be needed to be 100% certain.";
    }
    if (query.includes("alternative")) {
        return "A better alternative would be Green Tea or Yerba Mate—you get the focus benefits from L-Theanine without the artificial sweetener crash.";
    }

    return "That's a complex interaction. Given the ingredient synergy, I'd suggest treating this as a high-performance tool rather than a daily beverage. What else would you like to know?";
}
