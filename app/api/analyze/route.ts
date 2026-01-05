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
                ? `\n\nPERSONALIZATION (CRITICAL - Adjust scores based on this):\n${constraints.join("\n")}\n\nIMPORTANT: The user has ALREADY provided this profile. Do NOT ask for allergies, goals, or biometrics again. Use these values as absolute constraints.`
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
4. If the user's query explicitly asks for a comparison between two products (e.g., "Product A vs Product B"), populate the "follow_up_data.battle" field.
5. If the user's query explicitly asks about the manufacturing process or how a product is made (e.g., "How is X made?", "Manufacturing process of Y"), populate the "follow_up_data.manufacturing" field.
6. Otherwise, set "follow_up_data.type" to null and leave "battle" and "manufacturing" empty.

Output ONLY valid JSON matching this schema:
{
  "meta": { 
      "product_name": "Exact Name", 
      "category": "String",
      "source": "e.g. Whole Foods / Unknown",
      "portion_size": "e.g. 350g",
      "caloric_density": "High" | "Medium" | "Low"
  },
  "goal_alignment": {
      "muscle_gain": number, // 0-100
      "weight_loss": number, 
      "longevity": number,
      "energy": number
  },
  "follow_up_data": {
        "type": "battle" | "manufacturing" | null,
        "battle": {
            "productA": { "name": "String", "protein": "String", "sodium": "String" },
            "productB": { "name": "String", "protein": "String", "sodium": "String" },
            "verdict": "String"
        },
        "manufacturing": {
            "steps": [ { "title": "String", "desc": "String", "risk": "high"|"medium"|"low" } ]
        }
  },
  "simulation": {
      "base_stats": {
          "score": number,
          "calories": number,
          "sodium_mg": number,
          "protein_g": number,
          "carbs_g": number,
          "fat_g": number,
          "magnesium_mg": number,
          "potassium_mg": number,
          "ingredients": ["Main", "Ingredients", "List"]
      },
      "additives": {
          "is_clean": boolean,
          "detected": ["names"]
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
                  "score_delta": number,
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
        "data": { "headline": "Punchy Soundbite" } 
    },
    { 
        "id": "risks", "zone": "zone_3", "type": "red_flag_list", 
        "data": { "flags": [{ "name": "Title", "risk_level": "high"|"medium"|"low", "description": "Insight", "category": "macro"|"bio"|"micro" }] } 
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

        let content = completion.choices[0]?.message?.content;
        if (!content) {
            throw new Error("No content received from Groq");
        }

        // Sanitize content: Remove markdown code fences if present
        content = content.replace(/```json\n?|```/g, "").trim();

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(content);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError, "Content:", content);
            throw new Error("Failed to parse LLM response as JSON");
        }
        return NextResponse.json(jsonResponse);

    } catch (error: any) {
        console.error("Groq Analyze API Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to analyze product" },
            { status: 500 }
        );
    }
}
