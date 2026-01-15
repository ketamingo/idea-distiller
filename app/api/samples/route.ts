import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// Simple in-memory "database" that persists during server uptime
let globalSamples: string[] = [];

export async function GET() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const themes = [
            "Architecture", "Fine Dining", "Space Travel", "Obsolete Technology",
            "Cyber-security", "Street Art", "Quietness", "Legacy Hardware",
            "Deep Sea Exploration", "Micro-gardening", "Extreme Sports", "Typefaces",
            "Analog Photography", "Social Etiquette", "Urban Wildlife", "Carpentry",
            "Fermentation", "Mental Health", "Public Transportation", "Bespoke Clothing",
            "Vintage Watches", "Paper Stationery", "Birdwatching", "Rare Spices"
        ];

        // Pick 3 random themes to steer the AI for this batch
        const selectedThemes = themes.sort(() => 0.5 - Math.random()).slice(0, 3).join(", ");

        const prompt = `
Generate a list of 5 extremely unique, and realistic "frustrations" or "vague observations" that could lead to a great product.

Explore these specific themes for this batch: ${selectedThemes}.

Rules:
- Each item must be a single sentence.
- First-person perspective ("I wish...", "I hate...", "There's no way to...").
- AVOID cliches (no "lost keys", "water plants", or "AI aggregators").
- Focus on weird, niche, or overlooked moments in modern life, design, or specialized hobbies.
- Be specific, evocative, and diverse.

Return ONLY a JSON array of strings. No markdown, no numbering.
Example: ["I wish my desk would tell me if it's level...", "I hate that I can't find recordings of specific forests..."]
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
