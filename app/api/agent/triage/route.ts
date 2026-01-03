import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function POST(req: Request) {
    try {
        const { productName, history } = await req.json();

        if (!productName) {
            return NextResponse.json(
                { error: "Missing productName" },
                { status: 400 }
            );
        }

        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `YOU ARE: The "ENCODE Triage Protocol".
TARGET: A Clinical Nutrition Screener.

INPUT:
Product Name: "${productName}"

TASK:
Analyze the product's nutritional profile and potential risks.
Generate exactly 3 High-Value Screening Questions to determine if this product is safe/aligned with the user.
These questions should be asked *simultaneously* to gather context fast.

GUIDELINES:
- Question 1: Focused on major risk (e.g. "Do you have high blood pressure?" for salty foods).
- Question 2: Focused on dietary goals (e.g. "Are you tracking specific macros?").
- Question 3: Focused on sensitivity/preference (e.g. "Are you avoiding artificial sweeteners?").

FORMAT:
Return JSON:
{
  "questions": [
    { "id": "q1", "text": "Question string", "type": "yes_no" | "text" },
    { "id": "q2", "text": "Question string", "type": "yes_no" | "text" },
    { "id": "q3", "text": "Question string", "type": "yes_no" | "text" }
  ]
}`
                },
                {
                    role: "user",
                    content: `Product: "${productName}"`
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.6,
            max_tokens: 512
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
            throw new Error("No content received from Groq");
        }

        const jsonResponse = JSON.parse(content);
        return NextResponse.json(jsonResponse);

    } catch (error: any) {
        console.error("Groq Triage API Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to triage product" },
            { status: 500 }
        );
    }
}
