
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Simple API route (Next.js App Router)
export async function POST(req: Request) {
    try {
        const { input } = await req.json();

        if (!input || input.trim() === "") {
            return NextResponse.json({ error: "Input text is required" }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
You are a calm, experienced product thinker.

Extract the most realistic, simple product idea hiding inside a vague thought.

Rules:
- Do NOT hype the idea.
- Do NOT pitch a startup.
- Do NOT invent market sizes or trends.
- Do NOT suggest complex features.
- Favor small, focused, human-scale products.
- Assume the builder is a solo person.

Input:
${input}

Output strictly in valid JSON format with these keys:
{
  "product": "Name and one-sentence description",
  "audience": "Who It’s For",
  "problem": "The Real Problem",
  "mvp": "The Simplest Version",
  "not_feature": "What This Is Not",
  "next_step": "A Realistic Next Step"
}
Do not use Markdown formatting (like json code blocks), just return the raw JSON string.
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json({ result: text });
    } catch (error) {
        console.error("AI call failed:", error);
        return NextResponse.json(
            { error: "AI generation failed. Try again later." },
            { status: 500 }
        );
    }
}
