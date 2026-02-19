import type { APIRoute } from "astro";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const POST: APIRoute = async ({ request }) => {
	if (request.headers.get("Content-Type") !== "application/json") {
		return new Response(JSON.stringify({ error: "Content-Type must be application/json" }), {
			status: 400,
		});
	}

	try {
		const body = await request.json();
		const { image, prompt, theme } = body;

		if (!image) {
			return new Response(JSON.stringify({ error: "No image provided" }), { status: 400 });
		}

		const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

		if (!apiKey) {
			return new Response(
				JSON.stringify({ error: "GOOGLE_API_KEY or GEMINI_API_KEY is not configured" }),
				{
					status: 500,
				},
			);
		}

		const genAI = new GoogleGenerativeAI(apiKey);

		// List of models to try in order of preference
		const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
		let lastError = null;
		let generatedHtml = null;

		// Clean base64 string
		const base64Image = image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

		const promptText = `
You are an expert Frontend Developer and UI Designer specializing in Tailwind CSS.
Your task is to convert the provided wireframe/sketch into a high-fidelity, production-ready HTML component using Tailwind CSS.

Requirements:
1.  **Framework:** Use ONLY standard HTML and Tailwind CSS (v3/v4 compatible). No external CSS files.
2.  **Responsiveness:** The layout must be responsive (mobile-first or adaptable).
3.  **Theme:** Support Dark Mode. Use 'dark:' classes for dark mode variants. The user prefers '${theme || "system"}' mode.
4.  **Fonts:** Use 'font-sans' (Google Sans/Inter) for text and 'font-mono' (Google Sans Code) for code/numbers.
5.  **Colors:** Use a modern, clean palette. Use 'indigo-600' as the primary color unless the sketch implies otherwise.
6.  **Icons:** Use inline SVGs for icons (Heroicons style). Do not use external icon libraries.
7.  **Output:** Return ONLY the raw HTML string (e.g., <div class="...">...</div>). Do NOT wrap in markdown code blocks. Do not include <!DOCTYPE html> or <html> tags, just the component markup.
8.  **Context:** The user might provide extra instructions.

User Instructions: ${prompt || "None"}
`;

		const imagePart = {
			inlineData: {
				data: base64Image,
				mimeType: "image/png",
			},
		};

		for (const modelName of modelsToTry) {
			try {
				const model = genAI.getGenerativeModel({ model: modelName });
				const result = await model.generateContent([promptText, imagePart]);
				const response = await result.response;
				generatedHtml = response.text();
				// If successful, break the loop
				break;
			} catch (error: any) {
				console.warn(`Model ${modelName} failed:`, error.message);
				lastError = error;
				// Continue to next model if it's a 404 or similar
				if (error.message.includes("404") || error.message.includes("not found")) {
					// continue;
				}
				// If it's another error (e.g. 400, 429), we could stop, but let's try fallback just in case
			}
		}

		if (!generatedHtml) {
			throw lastError || new Error("Failed to generate content with any model");
		}

		// Post-process cleanup
		const html = generatedHtml
			.replace(/```html/g, "")
			.replace(/```/g, "")
			.trim();

		return new Response(JSON.stringify({ html }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error: any) {
		console.error("Gemini AI Error:", error);
		return new Response(
			JSON.stringify({ error: "Failed to generate UI", details: error.message }),
			{ status: 500 },
		);
	}
};
