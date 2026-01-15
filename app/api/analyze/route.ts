
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Simple API route (Next.js App Router)
export async function POST(req: Request) {
    try {
        const { input, mode = "simple", fieldToRegenerate, currentIdea } = await req.json();

        if (!input || input.trim() === "") {
            return NextResponse.json({ error: "Input text is required" }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const persona = mode === "executive"
            ? "strategic, high-level business consultant. focus on ROI, competitive moats, and market scalability."
            : mode === "pro"
                ? "highly technical, hands-on product architect. focus on implementation details, tech stacks, and edge cases."
                : "brilliant, non-conformist product strategist. focus on unique insights and creative, human-scale solutions.";

        let instruction = "Extract the most unique, high-signal product idea hiding inside a vague thought.";

        if (fieldToRegenerate && currentIdea) {
            instruction = `I have this current product idea: ${JSON.stringify(currentIdea)}. 
            Please REGENERATE ONLY the "${fieldToRegenerate}" field. Make it significantly DIFFERENT and more interesting/radical than the current one, but keep it consistent with the rest of the idea.`;
        }

        const prompt = `
You are a ${persona}

${instruction}

Rules:
- AVOID generic solutions (no "AI summaries", "standard dashboards", or "generalized productivity apps").
- BE SPECIFIC: Find a niche, narrow execution that feels inevitable once mentioned.
- Do NOT hype the idea, but make it intellectually interesting.
- Favor products that leverage a secret insight or overlooked behavior.
- Use a tone appropriate for the ${mode} mode selected.

Mode-Specific Guidelines:
- Simple: Keep language plain, focus on the core "magic" moment.
- Pro: Include technical jargon, specific database/API suggestions in the MVP.
- Executive: Frame the problem and solution in terms of opportunity cost and strategic value.

Pivot Variety:
Provide 4 distinct paths. Ensure one is "Analog/Physical", one is "Hyper-Niche", one is "Luxury/Premium", and one is "Viral/Social". 

Input:
${input}

Return a JSON object with this schema:
{
  "product": "Unique name and one-sentence description",
  "audience": "The exact group that would pay for this",
  "problem": "The hidden, painful truth behind the observation",
  "mvp": "An elegant, mode-appropriate proof of concept",
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
