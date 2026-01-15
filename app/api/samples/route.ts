import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// Simple in-memory "database" that persists during server uptime
let globalSamples: string[] = [];

export async function GET() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
Generate a single, extremely unique, and realistic "frustration" or "vague observation" that could lead to a great product.

Rules:
- One sentence only.
- First-person perspective ("I wish...", "I hate...", "There's no way to...").
- AVOID cliches (no "lost keys", "water plants", or "AI aggregators").
- VARY THE THEME: Pick a random theme each time (e.g., "Architecture", "Fine Dining", "Space Travel", "Obsolete Technology", "Cyber-security", "Street Art", "Quietness", "Legacy Hardware").
- Focus on weird, niche, or overlooked moments in modern life or work.
- Be specific and evocative.

Examples:
- "I wish my desk would tell me if the floor under it is perfectly level without me needing a bubble level."
- "I hate that I can't easily find a recording of the specific forest I visited 5 years ago to help me sleep."
- "There is no 'Shazam' for physical textures like moss or coarse concrete when I'm scouting movie locations."

Just return the raw text of the sentence, nothing else.
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim().replace(/^["']|["']$/g, ''); // Clean quotes

        // Save to our "live" pool
        if (text && !globalSamples.includes(text)) {
            globalSamples.push(text);
        }

        return NextResponse.json({
            sample: text,
            count: globalSamples.length, // Show growth
            recent: globalSamples.slice(-5)
        });
    } catch (error) {
        console.error("Failed to generate sample:", error);
        return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
    }
}
