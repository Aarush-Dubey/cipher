"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// --- Types ---

export interface UserBiometrics {
    weight_kg: number;
    height_cm: number;
    age: number;
    sex: "male" | "female" | "other";
}

export interface UserConstraints {
    allergies: string[];
    diet: string[];  // e.g., "keto", "vegan", "halal", "low_sodium"
    conditions: string[]; // e.g., "hypertension", "diabetes_t2"
}

export interface UserProfile {
    biometrics: UserBiometrics | null;
    goals: string[]; // e.g., "fat_loss", "muscle_gain", "heart_health"
    constraints: UserConstraints;
    // Calculated Values
    bmr: number | null;
    bmi: number | null;
    dailySodiumCap: number;
    dailyCalories: number;
}

const DEFAULT_PROFILE: UserProfile = {
    biometrics: null,
    goals: [],
    constraints: {
        allergies: [],
        diet: [],
        conditions: []
    },
    bmr: null,
    bmi: null,
    dailySodiumCap: 2300, // Standard cap
    dailyCalories: 2000
};

// --- Context ---

interface ProfileContextType {
    profile: UserProfile;
    updateBiometrics: (bio: UserBiometrics) => void;
    toggleGoal: (goal: string) => void;
    addConstraint: (type: "allergies" | "diet" | "conditions", value: string) => void;
    removeConstraint: (type: "allergies" | "diet" | "conditions", value: string) => void;
    isProfileComplete: boolean;
    hasConflict: (ingredientList: string[]) => string | null; // Returns conflicting ingredient or null
    resetProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function useUserProfile() {
    const ctx = useContext(ProfileContext);
    if (!ctx) throw new Error("useUserProfile must be used within ProfileProvider");
    return ctx;
}

// --- Calculations ---

function calculateBMR(bio: UserBiometrics): number {
    // Mifflin-St Jeor Equation
    const base = 10 * bio.weight_kg + 6.25 * bio.height_cm - 5 * bio.age;
    return bio.sex === "male" ? base + 5 : base - 161;
}

function calculateBMI(bio: UserBiometrics): number {
    const heightM = bio.height_cm / 100;
    return bio.weight_kg / (heightM * heightM);
}

function calculateSodiumCap(profile: UserProfile): number {
    if (profile.constraints.conditions.includes("hypertension") || profile.goals.includes("heart_health")) {
        return 1500; // Stricter cap
    }
    return 2300; // Standard
}

function calculateTDEE(bmr: number, goals: string[]): number {
    // Simple activity modifier
    let modifier = 1.55; // Moderate
    if (goals.includes("fat_loss")) modifier = 1.2;
    if (goals.includes("muscle_gain")) modifier = 1.8;
    return Math.round(bmr * modifier);
}

// --- Provider ---

export function ProfileProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("encode_user_profile");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setProfile({ ...DEFAULT_PROFILE, ...parsed });
            } catch (e) {
                console.error("Failed to parse saved profile", e);
            }
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem("encode_user_profile", JSON.stringify(profile));
    }, [profile]);

    const updateBiometrics = (bio: UserBiometrics) => {
        const bmr = calculateBMR(bio);
        const bmi = calculateBMI(bio);

        setProfile(prev => {
            const updated = {
                ...prev,
                biometrics: bio,
                bmr,
                bmi,
                dailyCalories: calculateTDEE(bmr, prev.goals),
                dailySodiumCap: calculateSodiumCap({ ...prev, biometrics: bio })
            };
            return updated;
        });
    };

    const toggleGoal = (goal: string) => {
        setProfile(prev => {
            const goals = prev.goals.includes(goal)
                ? prev.goals.filter(g => g !== goal)
                : [...prev.goals, goal];

            const updatedProfile = { ...prev, goals };
            updatedProfile.dailySodiumCap = calculateSodiumCap(updatedProfile);
            if (prev.bmr) {
                updatedProfile.dailyCalories = calculateTDEE(prev.bmr, goals);
            }
            return updatedProfile;
        });
    };

    const addConstraint = (type: "allergies" | "diet" | "conditions", value: string) => {
        setProfile(prev => {
            const constraints = { ...prev.constraints };
            if (!constraints[type].includes(value)) {
                constraints[type] = [...constraints[type], value];
            }
            const updatedProfile = { ...prev, constraints };
            updatedProfile.dailySodiumCap = calculateSodiumCap(updatedProfile);
            return updatedProfile;
        });
    };

    const removeConstraint = (type: "allergies" | "diet" | "conditions", value: string) => {
        setProfile(prev => {
            const constraints = { ...prev.constraints };
            constraints[type] = constraints[type].filter(v => v !== value);
            const updatedProfile = { ...prev, constraints };
            updatedProfile.dailySodiumCap = calculateSodiumCap(updatedProfile);
            return updatedProfile;
        });
    };

    const isProfileComplete = !!profile.biometrics && profile.goals.length > 0;

    const hasConflict = (ingredientList: string[]): string | null => {
        const lowerIngredients = ingredientList.map(i => i.toLowerCase());
        for (const allergy of profile.constraints.allergies) {
            if (lowerIngredients.some(ing => ing.includes(allergy.toLowerCase()))) {
                return allergy;
            }
        }
        return null;
    };

    const resetProfile = () => {
        setProfile(DEFAULT_PROFILE);
        localStorage.removeItem("encode_user_profile");
    };

    return (
        <ProfileContext.Provider value={{
            profile,
            updateBiometrics,
            toggleGoal,
            addConstraint,
            removeConstraint,
            isProfileComplete,
            hasConflict,
            resetProfile
        }}>
            {children}
        </ProfileContext.Provider>
    );
}
