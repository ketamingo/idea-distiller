
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
You are a brilliant, non-conformist product strategist.

Extract the most unique, high-signal product idea hiding inside a vague thought.

Rules:
- AVOID generic solutions (no "AI summaries", "standard dashboards", or "generalized productivity apps").
- BE SPECIFIC: Find a niche, narrow execution that feels inevitable once mentioned.
- Do NOT hype the idea, but make it intellectually interesting.
- Favor solo-builder products that leverage a secret insight or overlooked behavior.
- The "Next Step" must be a single, surprising, low-cost verification task.

Pivot Directions for the "pivots" array:
- Make pivots bold and distinct. 
- Mix high-tech and low-tech (e.g., "Pivot to Analog", "Pivot to Distributed State", "Pivot to Extreme Privacy").
- Think about different monetization angles or extreme user constraints.

Input:
${input}

Return a JSON object with this schema:
{
  "product": "Unique name and one-sentence counter-intuitive description",
  "audience": "The exact, small group that would pay for this today",
  "problem": "The hidden, painful truth behind the observation",
  "mvp": "An elegant, minimal proof of concept (no code if possible)",
  "not_feature": "A common but wrong direction this product explicitly REJECTS",
  "next_step": "A high-signal validation task",
  "pivots": [
    { "label": "Short Bold Label", "description": "A radically different but plausible direction" }
  ]
}
`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
        });
        const text = result.response.text();

        return NextResponse.json({ result: text });
    } catch (error) {
        console.error("AI call failed:", error);
        return NextResponse.json(
            { error: `AI Error: ${(error as any)?.message || error}` },
            { status: 500 }
        );
    }
}
