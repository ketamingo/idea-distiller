import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// Simple in-memory "database" that persists during server uptime
let globalSamples: string[] = [];

export async function GET() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const themes = [
            "Grocery Shopping", "Subscription Fatigue", "Home Maintenance", "Streaming Services",
            "Cooking & Kitchen", "Fitness & Gym", "Social Life", "Gardening",
            "Personal Finance", "Cleaning & Organization", "Pet Care", "Transportation",
            "Work-Life Balance", "Sleep & Rest", "Tech Clutter", "Gift Giving",
            "Laundry & Clothes", "Hobbies & Crafting", "Coffee & Cafes", "Mobile Apps"
        ];

        // Pick 4 random themes to steer the AI for this batch
        const selectedThemes = themes.sort(() => 0.5 - Math.random()).slice(0, 4).join(", ");

        const prompt = `
Generate a list of 5 relatable, realistic, and slightly annoying "frustrations" or "vague observations" that occur in everyday life.

Focus on these specific themes for this batch: ${selectedThemes}.

Rules:
- Each item must be a single sentence.
- First-person perspective ("I wish...", "I hate...", "I'm tired of...").
- BE RELATABLE: Focus on common, modern annoyances that most people experience (e.g., forgetting things, subscription confusion, small home inconveniences).
- Be specific and evocative.
- Ensure the tone is authentic and slightly frustrated, but not aggressive.

Return ONLY a JSON array of strings. No markdown, no numbering.
Example: ["I wish I could remember which freezer drawer has the ice cream...", "I'm tired of my phone notifications interrupting my focus for things I don't care about."]
`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
        });

        const text = result.response.text();
        const batch = JSON.parse(text) as string[];

        // Save new unique ones to our "live" pool
        batch.forEach(item => {
            if (item && !globalSamples.includes(item)) {
                globalSamples.push(item);
            }
        });

        // Keep global pool from exploding too much in memory
        if (globalSamples.length > 500) {
            globalSamples = globalSamples.slice(-500);
        }

        return NextResponse.json({
            recent: batch,
            poolCount: globalSamples.length,
            randomFromPool: globalSamples.sort(() => 0.5 - Math.random()).slice(0, 10)
        });
    } catch (error) {
        console.error("Failed to generate samples:", error);
        return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
    }
}
