"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { InputHero } from "@/components/input-hero";
import { GenerativeResult } from "@/components/generative-result";
import { TechnicalReportView } from "@/components/technical-report-view";
import { useTriageProtocol } from "@/hooks/use-triage-protocol";
import { BioAvatarButton, BioSyncDrawer } from "@/components/bio-sync-drawer";
import { BioInitializationRitual } from "@/components/bio-initialization-ritual";
import { RoyalAutopilotDemo, DemoTriggerButton } from "@/components/royal-autopilot-demo";
import { useDemoController } from "@/hooks/use-demo-controller";
import { useUserProfile } from "@/context/user-profile-context";
import { Scan, BrainCircuit, Zap } from "lucide-react";

export default function Home() {
  const triage = useTriageProtocol();
  const [isThinking, setIsThinking] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showRitual, setShowRitual] = useState(false);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);
  const [agentNote, setAgentNote] = useState<string>("System Standby: Awaiting Input");
  const { isProfileComplete } = useUserProfile();
  const demoController = useDemoController();

  // Sync loading state with Triage updates
  useEffect(() => {
    // If we move from Triage Form to Calculating
    if (triage.state.status === "CALCULATING") setIsThinking(true);
    else setIsThinking(false);
  }, [triage.state.status]);


  const handleReset = () => {
    triage.resetTriage();
    setIsThinking(false);
  };

  const handleAnalyze = (query: string) => {
    // If profile is empty, show the ritual first
    if (!isProfileComplete) {
      setPendingQuery(query);
      setShowRitual(true);
    } else {
      triage.startTriage(query);
    }
  };

  const handleRitualComplete = () => {
    setShowRitual(false);
    if (pendingQuery) {
      setTimeout(() => {
        triage.startTriage(pendingQuery);
        setPendingQuery(null);
      }, 500);
    }
  };

  return (
    <main className="min-h-screen w-full overflow-hidden bg-black text-foreground relative flex flex-col p-4 md:p-8">
      {/* Royal Autopilot Demo Overlay */}
      <RoyalAutopilotDemo />

      {/* Bio-Initialization Ritual */}
      <AnimatePresence>
        {showRitual && <BioInitializationRitual onComplete={handleRitualComplete} />}
      </AnimatePresence>

      {/* Bio-Sync Drawer */}
      <BioSyncDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-900/20 blur-[150px] rounded-full mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-900/10 blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col">
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="w-8 h-8 bg-gradient-to-br from-white/10 to-transparent rounded-lg flex items-center justify-center border border-white/10 backdrop-blur-md">
              <Scan className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">CIPHER</span>
          </div>

          <div className="flex items-center gap-4">
            {triage.state.status !== "IDLE" && (
              <button onClick={handleReset} className="text-xs text-white/40 hover:text-white transition-colors font-mono tracking-widest uppercase">
                Reset Protocol
              </button>
            )}
            <BioAvatarButton onClick={() => setIsDrawerOpen(true)} />
          </div>
        </header>

        <div className="flex-1 flex flex-col justify-center min-h-[80vh]">
          <AnimatePresence mode="wait">
            {/* IDLE: Input Hero */}
            {triage.state.status === "IDLE" && (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                className="w-full"
              >
                <InputHero onAnalyze={handleAnalyze} onStartDemo={demoController.startDemo} />
              </motion.div>
            )}

            {/* LOADING STATE */}
            {(triage.state.status === "SCANNING" || triage.state.status === "CALCULATING") && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: "blur(20px)" }}
                className="flex flex-col items-center justify-center w-full h-full gap-8"
              >
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <motion.div
                    className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="relative w-24 h-24 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md bg-black/30">
                    <Zap className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                  <motion.div
                    className="absolute inset-0 border-t-2 border-primary rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <h3 className="text-xl font-light tracking-wide text-white animate-pulse font-mono">
                  {triage.state.status === "CALCULATING" ? "COMPILING_REPORT..." : "SCANNING_BIOMARKERS..."}
                </h3>
              </motion.div>
            )}

            {/* TRIAGE FORM STATE (BATCH) */}
            {triage.state.status === "TRIAGE_FORM" && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  key="form"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  className="w-full max-w-xl bg-black/80 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-[0_0_100px_-20px_rgba(255,255,255,0.1)] relative overflow-hidden"
                >
                  {/* Background FX */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] pointer-events-none opacity-40" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none opacity-40" />

                  <div className="relative z-10">
                    <div className="mb-10 text-center">
                      <h2 className="text-3xl md:text-4xl font-light text-white mb-3 tracking-tight">Clinical Intake</h2>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-white/60 text-xs font-mono uppercase tracking-wider">{triage.state.productName}</span>
                      </div>
                    </div>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const answers: Record<string, string> = {};
                      triage.state.questions.forEach(q => {
                        answers[q.id] = formData.get(q.id) as string;
                      });
                      triage.submitAssessment(answers);
                    }} className="space-y-8">
                      {triage.state.questions.map((q, i) => (
                        <div key={q.id} className="space-y-3 group">
                          <label className="text-xs text-primary/80 font-bold tracking-[0.15em] block uppercase flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full border border-primary/30 flex items-center justify-center text-[10px] group-hover:bg-primary group-hover:text-black transition-colors">0{i + 1}</div>
                            {q.text}
                          </label>
                          {q.type === 'yes_no' ? (
                            <div className="flex gap-3 pl-9">
                              {['Yes', 'No'].map(opt => (
                                <label key={opt} className="flex-1 relative cursor-pointer">
                                  <input type="radio" name={q.id} value={opt} className="peer sr-only" required />
                                  <div className="w-full py-3 text-center border border-white/10 rounded-xl text-white/50 font-medium peer-checked:bg-white peer-checked:text-black peer-checked:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:bg-white/5 hover:border-white/20">
                                    {opt}
                                  </div>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <div className="pl-9 relative">
                              <input
                                name={q.id}
                                type="text"
                                placeholder="Type your answer..."
                                className="w-full bg-transparent border-b border-white/20 py-3 text-lg text-white focus:outline-none focus:border-primary transition-colors placeholder:text-white/20"
                                autoComplete="off"
                                required
                              />
                              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-focus-within:w-full" />
                            </div>
                          )}
                        </div>
                      ))}

                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(255,255,255,0.2)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-5 bg-white text-black font-bold text-lg rounded-2xl mt-8 hover:bg-gray-100 transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] relative overflow-hidden group"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Generate Analysis <Scan className="w-4 h-4" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                      </motion.button>
                    </form>
                  </div>
                </motion.div>
              </div>
            )}

            {/* FINAL REPORT VIEW */}
            {triage.state.status === "REPORT_VIEW" && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full"
              >
                {/* 1. Header Report */}
                <TechnicalReportView
                  data={{
                    productName: triage.state.productName,
                    userContext: triage.state.userConstraints.join(", ") || "General Analysis",
                    compatibilityScore: Math.floor(Math.random() * (95 - 60) + 60),
                    agentNotes: agentNote
                  }}
                />
                {/* 2. Main Dashboard */}
                <GenerativeResult
                  query={triage.state.productName}
                  userContext={triage.state.userConstraints.join(", ")}
                  onReset={handleReset}
                  onAnalysisComplete={setAgentNote}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

