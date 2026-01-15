
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
            ? "strategic, high-level Fortune 500 business consultant and venture capitalist. Your analysis is extremely thorough, rigorous, and covers multiple dimensions of business strategy, market dynamics, and operational feasibility."
            : mode === "pro"
                ? "highly technical lead product architect and startup CTO. Your analysis is deep, technical, and focuses on the 'how' - including engineering challenges, data architecture, and precise feature sets."
                : "creative, non-conformist product scout. Your analysis is punchy, high-level, and focused on the core 'aha!' moment and human behavior.";

        let instruction = "Distill the most provocative and viable product concept from the input.";

        if (fieldToRegenerate && currentIdea) {
            instruction = `I have this current product idea: ${JSON.stringify(currentIdea)}. 
            Please REGENERATE ONLY the "${fieldToRegenerate}" field. Keep it consistent with the overall concept but make it significantly more detailed and relevant to the selected ${mode} mode.`;
        }

        const prompt = `
You are a ${persona}

${instruction}

GENERAL RULES:
- AVOID generic solutions. No standard dashboards or "AI for X".
- BE SPECIFIC: Find a niche, narrow execution that feels like a "secret" being shared.
- Do NOT hype; use a calm, authoritative, intellectually honest tone.
- FORMATTING: Keep text blocks "bite-sized". Use short paragraphs (2-3 sentences max). Use bullet points (starting with "-") for lists. Use clear spacing.

DEPTH REQUIREMENTS PER MODE:
- Mode "simple": Provide high-level, concise snippets. Each field should be 1-2 powerful sentences max. Focus on clarity.
- Mode "pro": Provide significantly more depth (3-5 sentences per field). Include specific technical terminology, stack suggestions, and edge-case considerations.
- Mode "executive": Provide MAXIMUM depth and rigor. Each field should be a detailed paragraph (6-10 sentences). Analyze market defensibility, ROI potential, scalability friction, and strategic alignment. 

Input Thought:
"${input}"

Return a JSON object with this schema:
{
  "name": "A short, punchy product name (2-4 words)",
  "description": "A mode-appropriate overview of the product concept",
  "audience": "Description of the exact niche or persona",
  "problem": "Deep analysis of the underlying pain point",
  "mvp": "Specific, mode-appropriate proof of concept details",
  "not_feature": "A common but wrong direction this product explicitly REJECTS",
  "next_step": "A concrete, high-signal validation task",
  "pivots": [
    { "label": "Label", "description": "Mode-appropriate depth description of a pivot" }
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
