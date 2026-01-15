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
- Focus on weird, niche, or overlooked moments in modern life, design, fashion, or hardware.
- Be specific, evocative, and slightly poetic.

Examples:
- "I have too many cool stickers and I'm afraid to use them because it feels permanent."
- "I wish my clothes would tell me how many times I've actually worn them so I could donate the clutter."
- "I want to hear the ambient sound of various cities around the world as my white noise."

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

