"use client";

import { useState } from "react";

export interface TriageQuestion {
    id: string;
    text: string;
    type: "yes_no" | "text";
}

export interface TriageState {
    status: "IDLE" | "SCANNING" | "TRIAGE_FORM" | "CALCULATING" | "REPORT_VIEW";
    productName: string;
    questions: TriageQuestion[];
    userConstraints: string[];
}

export function useTriageProtocol() {
    const [state, setState] = useState<TriageState>({
        status: "IDLE",
        productName: "",
        questions: [],
        userConstraints: []
    });

    const startTriage = async (product: string) => {
        setState(prev => ({ ...prev, status: "SCANNING", productName: product }));

        try {
            const res = await fetch("/api/agent/triage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productName: product })
            });
            const data = await res.json();

            if (data.questions && Array.isArray(data.questions)) {
                setState(prev => ({
                    ...prev,
                    status: "TRIAGE_FORM",
                    questions: data.questions
                }));
            } else {
                // Fallback if no questions
                setState(prev => ({ ...prev, status: "REPORT_VIEW" }));
            }
        } catch (e) {
            console.error(e);
            setState(prev => ({ ...prev, status: "REPORT_VIEW" }));
        }
    };

    const submitAssessment = (answers: Record<string, string>) => {
        // Compile constraints from answers
        const constraints = Object.values(answers);

        setState(prev => ({
            ...prev,
            status: "CALCULATING",
            userConstraints: constraints
        }));

        setTimeout(() => {
            setState(prev => ({ ...prev, status: "REPORT_VIEW" }));
        }, 1500);
    };

    const resetTriage = () => {
        setState({
            status: "IDLE",
            productName: "",
            questions: [],
            userConstraints: []
        });
    };

    return { state, startTriage, submitAssessment, resetTriage };
}
