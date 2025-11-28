const { onRequest } = require("firebase-functions/v2/https");
const { defineString } = require("firebase-functions/params");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Define environment parameter
const geminiApiKey = defineString("GEMINI_API_KEY");

// Helper function to fetch PDF as base64
async function fetchPDFAsBase64(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        return base64;
    } catch (error) {
        console.error("Error fetching PDF:", error);
        return null;
    }
}

// Chat API endpoint
exports.api = onRequest({
    cors: true,
    invoker: "public"  // Allow unauthenticated access
}, async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { message, inventoryContext, customInstructions, brochureUrl } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Initialize Gemini AI with API key from environment
        const apiKey = geminiApiKey.value();

        if (!apiKey) {
            return res.status(500).json({
                error: "Configuration error",
                details: "Gemini API key not configured. Please set GEMINI_API_KEY environment variable."
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey, { apiVersion: "v1" });

        // Use Gemini 1.5 Flash (multimodal)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Build system prompt
        const systemPrompt = `
        ROLE: Professional Car Sales Consultant (Marketing Expert).

        YOUR GOAL:
        - Engage the user in a friendly, professional, and persuasive manner.
        - Answer questions accurately using the provided INVENTORY and KNOWLEDGE BASE.
        - ALWAYS try to convert interest into action (Test Drive or WhatsApp contact).
        - Be flexible and interactive. Don't just dump facts; ask follow-up questions to understand their needs.

        YOUR KNOWLEDGE BASE:
        ${customInstructions || "No specific instructions provided."}

        CURRENT INVENTORY:
        ${inventoryContext || "No inventory data available."}

        GUIDELINES:
        1. **Tone**: Enthusiastic, polite, and professional. Use emojis sparingly but effectively to sound modern.
        2. **Structure**: 
           - Acknowledge the user's interest.
           - Provide the answer/specs clearly (use bullet points or bold text for readability).
           - **Crucial**: End every response with a question or a Call to Action (CTA).
             - Example: "Would you like to schedule a test drive to feel the acceleration yourself?"
             - Example: "Shall I send you the full brochure via WhatsApp?"
        3. **Language**: Respond in the same language as the user (Indonesian or English).
        4. **Unknowns**: If information is missing, apologize gracefully and suggest contacting us directly via WhatsApp for the latest details.
        `;

        // Prepare content parts
        const parts = [
            { text: systemPrompt },
            { text: `User Question: ${message}` }
        ];

        // If brochure URL is provided, fetch and include PDF
        if (brochureUrl) {
            const pdfBase64 = await fetchPDFAsBase64(brochureUrl);
            if (pdfBase64) {
                parts.push({
                    inlineData: {
                        mimeType: "application/pdf",
                        data: pdfBase64
                    }
                });
                parts.push({ text: "Please also refer to the attached brochure for detailed product information." });
            }
        }

        // Generate response
        const result = await model.generateContent(parts);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });

    } catch (error) {
        console.error("Error in /api:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});
