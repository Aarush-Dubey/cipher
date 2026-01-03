import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function POST(req: Request) {
    try {
        const { query, userContext, userProfile } = await req.json();

        if (!query) {
            return NextResponse.json(
                { error: "Missing query" },
                { status: 400 }
            );
        }

        // Build personalization context
        let profileContext = "";
        if (userProfile) {
            const constraints = [];
            if (userProfile.constraints?.allergies?.length > 0) {
                constraints.push(`ALLERGIES: ${userProfile.constraints.allergies.join(", ")}`);
            }
            if (userProfile.constraints?.conditions?.length > 0) {
                constraints.push(`HEALTH CONDITIONS: ${userProfile.constraints.conditions.join(", ")}`);
            }
            if (userProfile.goals?.length > 0) {
                constraints.push(`GOALS: ${userProfile.goals.join(", ")}`);
            }
            if (userProfile.dailySodiumCap) {
                constraints.push(`DAILY SODIUM LIMIT: ${userProfile.dailySodiumCap}mg`);
            }
            profileContext = constraints.length > 0
                ? `\n\nPERSONALIZATION (CRITICAL - Adjust scores based on this):\n${constraints.join("\n")}`
                : "";
        }

        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are an expert nutritional data scientist and UI renderer. You are analyzing a food product.
CONTEXT: The user has stated: "${userContext || "General health awareness"}".${profileContext}
CRITICAL: Bias the health score and risks heavily based on this context.

1. Calculate a health score (0-100) based on nutritional density and processing.
2. Identify the 3 biggest health risks (e.g., Sodium, Sugar, Additives).
3. DESIGN THE "SIMULATION ENGINE":
   - Define exact "base_stats" (Calories, Sodium, Macos).
   - Create 3 realistic "Hacks/Modifiers" that specificially address the product's flaws (e.g. "Drain Noodles" to reduce Fat, "Add Spinach" to add Fiber).
   - Calculate the QUANTITATIVE IMPACT of each hack (e.g. sodium_mg: -800).
   - Write 3 "Verdict" states: Default (Bad), Improved (Okay), Optimized (Great).

Output ONLY valid JSON matching this schema:
{
  "meta": { 
      "product_name": "Exact Name", 
      "analysis_date": "YYYY-MM-DD", 
      "category": "String" 
  },
  "simulation": {
      "base_stats": {
          "score": number,
          "calories": number,
          "sodium_mg": number,
          "protein_g": number,
          "carbs_g": number,
          "fat_g": number,
          "ingredients": ["Main", "Ingredients", "List"]
      },
      "modifiers": [
          {
              "id": "hack_id",
              "label": "Action Label",
              "type": "addition" | "subtraction",
              "impact": {
                  "calories": number (optional),
                  "sodium_mg": number (optional),
                  "protein_g": number (optional),
                  "carbs_g": number (optional),
                  "fat_g": number (optional),
                  "score_impact": number,
                  "remove_ingredients": ["Ingredient Name"] (optional)
              }
          }
      ],
      "verdicts": {
          "default": "Critique of base product",
          "improved": "Encouraging update",
          "optimized": "Final praise"
      }
  },
  "layout_config": { 
      "theme": "dark_slate", 
      "emphasis": "sodium_warning" 
  },
  "components": [
    { 
        "id": "hero", "zone": "zone_1", "type": "score_ring", 
        "data": { "grade": "A-F", "label": "Short Verdict" } 
    },
    { 
        "id": "summary", "zone": "zone_1", "type": "text_block", 
        "data": { "headline": "Punchy Title" } 
    },
    { 
        "id": "macros", "zone": "zone_2", "type": "stacked_bar", 
        "data": { "segments": [{ "label": "Carbs"|"Fat"|"Protein", "unit": "g", "color": "purple"|"yellow"|"blue" }] } 
    },
    { 
        "id": "sodium", "zone": "zone_3", "type": "equivalence_icon", 
        "data": { "value": "e.g. 1500mg", "comparison_item": "e.g. Fries", "comparison_count": number } 
    },
    { 
        "id": "risks", "zone": "zone_3", "type": "red_flag_list", 
        "data": { "flags": [{ "name": "Ingredient Name", "risk_level": "high"|"medium", "description": "Short reasoning" }] } 
    },
    { 
        "id": "sim", "zone": "zone_4", "type": "interactive_simulator", 
        "data": { "defaults": {} } 
    }
  ]
}`

                },
                {
                    role: "user",
                    content: `Analyze this product: "${query}"`
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.5,
            max_tokens: 2048
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
            throw new Error("No content received from Groq");
        }

        const jsonResponse = JSON.parse(content);
        return NextResponse.json(jsonResponse);

    } catch (error: any) {
        console.error("Groq Analyze API Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to analyze product" },
            { status: 500 }
        );
    }
}
