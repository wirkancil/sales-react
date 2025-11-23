const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Middleware
app.use(cors({ origin: true })); // Allow all origins for Firebase Functions
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(functions.config().gemini.apikey);

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

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Chat endpoint
app.post("/chat", async (req, res) => {
    try {
        const { message, inventoryContext, customInstructions, brochureUrl } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Use Gemini 1.5 Flash (multimodal)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Build system prompt
        const systemPrompt = `
        You are a helpful AI assistant for a business.
        
        YOUR KNOWLEDGE BASE:
        ${customInstructions || "No specific instructions provided."}

        CURRENT INVENTORY:
        ${inventoryContext || "No inventory data available."}

        INSTRUCTIONS:
        - Answer questions based on the inventory and knowledge base.
        - Be polite, professional, and concise.
        - If asked about something not in the inventory, suggest they contact us directly.
        - Respond in Indonesian (Bahasa Indonesia) or English as appropriate based on the user's language.
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
        console.error("Error in /chat:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

// Export as Firebase Function
exports.api = functions.https.onRequest(app);
