import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
Generate a single, extremely unique, and realistic "frustration" or "vague observation" that could lead to a great product.

Rules:
- One sentence only.
- First-person perspective ("I wish...", "I hate...", "There's no way to...").
- AVOID cliches (no "lost keys", "water plants", or "AI aggregators").
- Focus on weird, niche, or overlooked moments in modern life or work.
- Be specific and evocative.

Examples of the vibe I want:
- "I have too many cool stickers and I'm afraid to use them because it feels permanent."
- "I wish my clothes would tell me how many times I've actually worn them so I could donate the clutter."
- "There is no 'Shazam' for physical textures or fabrics when I'm out shopping for furniture."

Just return the raw text of the sentence, nothing else.
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        return NextResponse.json({ sample: text });
    } catch (error) {
        console.error("Failed to generate sample:", error);
        return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
    }
}
