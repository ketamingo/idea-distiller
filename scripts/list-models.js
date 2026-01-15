
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function main() {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    try {
        const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).apiKey; // access internal or just list?
        // actually, we don't need a model to list models usually, but the SDK structure is genAI.getGenerativeModel...
        // Wait, the SDK has a verify method? No.
        // We can't list models easily with the high-level SDK directly in all versions?
        // Actually, create a manager or use fetch?
        // Let's use simple fetch to the REST API list endpoint to be sure, avoiding SDK quirks.

        // BUT, let's try to use the SDK if possible. genAI has no listModels method on the instance?
        // Actually it doesn't seem to have a top-level listModels in the node sdk?
        // Let's use fetch.

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("Error listing models:", data.error);
        } else {
            console.log("Available models:");
            data.models.forEach(m => console.log(`- ${m.name}`));
        }
    } catch (e) {
        console.error(e);
    }
}

main();
