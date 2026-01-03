import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function POST(req: Request) {
    try {
        const { productContext, userQuery } = await req.json();
        const q = userQuery.toLowerCase();
        let uiComponent = null;

        // --- Intent Router ---

        // 1. Compliance Checklist
        if (q.includes("keto") || q.includes("vegan") || q.includes("gluten") || q.includes("diet")) {
            const isKeto = q.includes("keto");
            uiComponent = {
                type: "compliance_checklist",
                data: {
                    title: isKeto ? "Keto Compliance" : "Dietary Check",
                    status: "FAIL",
                    items: [
                        { label: "Carb Limit (<20g)", status: "fail", value: "54g Detected", reason: "Wheat Flour Base" },
                        { label: "Animal Derivatives", status: "pass", value: "0g Found" },
                        { label: "Processed Oils", status: "warn", value: "Palm Oil detected" }
                    ]
                }
            };
        }
        // 2. Comparison
        else if (q.includes("compare") || q.includes("better") || q.includes("vs")) {
            uiComponent = {
                type: "comparison_card",
                data: {
                    entity_a: "This Product",
                    entity_b: "Fresh Alternative",
                    rows: [
                        { metric: "Sodium", val_a: "1800mg", val_b: "200mg", winner: "b" },
                        { metric: "Fiber", val_a: "1g", val_b: "6g", winner: "b" },
                        { metric: "Processing", val_a: "Ultra", val_b: "Minimal", winner: "b" }
                    ]
                }
            };
        }
        // 3. Process Timeline
        else if (q.includes("process") || q.includes("made") || q.includes("how")) {
            uiComponent = {
                type: "process_timeline",
                data: {
                    steps: [
                        { step: "Harvest", type: "natural" },
                        { step: "Refining", type: "processing", note: "Stripped of fiber" },
                        { step: "Flash Frying", type: "ultra", note: "Soaked in Palm Oil" },
                        { step: "Chemical Coat", type: "chemical", note: "TBHQ & MSG Added" }
                    ]
                }
            };
        }
        // 4. Swap Shop
        else if (q.includes("swap") || q.includes("alternative") || q.includes("instead")) {
            uiComponent = {
                type: "product_carousel",
                data: {
                    title: "Healthier Alternatives",
                    products: [
                        { name: "Millet Ramen", badge: "Whole Grain", sodium: "450mg" },
                        { name: "Air-Dried Noodles", badge: "Non-Fried", sodium: "800mg" },
                        { name: "Zucchini Noodles", badge: "Low Carb", sodium: "5mg" }
                    ]
                }
            };
        }
        // 5. Deep Dive
        else if (q.includes("ingredient") || q.includes("chemical") || q.includes("what is")) {
            uiComponent = {
                type: "ingredient_deep_dive",
                data: {
                    ingredients: [
                        { name: "Wheat Flour", type: "base", description: "Refined carbohydrate source" },
                        { name: "Palm Oil", type: "base", description: "High saturate fat source" },
                        { name: "TBHQ", type: "additive_risk", description: "Synthetic antioxidant linked to immune issues" },
                        { name: "MSG", type: "additive_safe", description: "Flavor enhancer" },
                        { name: "Red 40", type: "additive_risk", description: "Artificial dye" }
                    ]
                }
            };
        }

        // Generate Text Response
        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a witty health assistant. Give a 1-sentence answer." },
                { role: "user", content: `Context: ${JSON.stringify(productContext)}\nQuery: ${userQuery}` }
            ],
            max_tokens: 100
        });

        return NextResponse.json({
            summary: completion.choices[0]?.message?.content,
            component: uiComponent
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
