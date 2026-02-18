import type { APIRoute } from 'astro';
import { VertexAI } from '@google-cloud/vertexai';

export const POST: APIRoute = async ({ request }) => {
	if (request.headers.get('Content-Type') !== 'application/json') {
		return new Response(JSON.stringify({ error: 'Content-Type must be application/json' }), { status: 400 });
	}

	try {
		const body = await request.json();
		const { image, prompt, theme } = body;

		if (!image) {
			return new Response(JSON.stringify({ error: 'No image provided' }), { status: 400 });
		}

		// Configure Vertex AI
		const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
		const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

		// Auth Options
		// If using a service account JSON string in env var
		let googleAuthOptions = undefined;
		if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
			try {
				const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
				googleAuthOptions = { credentials };
			} catch (e) {
				console.error('Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON', e);
			}
		}

		const vertexAI = new VertexAI({
			project: projectId ?? 'draw2ui', // Fallback if not set
			location: location,
			googleAuthOptions: googleAuthOptions,
		});

		// Instantiate the model
		// Using 'gemini-1.5-flash-001' as requested (multimodal)
		const modelName = 'gemini-1.5-flash-001';
		const generativeModel = vertexAI.getGenerativeModel({
			model: modelName,
			generationConfig: {
				maxOutputTokens: 8192,
				temperature: 0.2,
				topP: 0.95,
			},
		});

		// Clean base64 string
		const base64Image = image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

		const textPart = {
			text: `
You are an expert Frontend Developer and UI Designer specializing in Tailwind CSS.
Your task is to convert the provided wireframe/sketch into a high-fidelity, production-ready HTML component using Tailwind CSS.

Requirements:
1.  **Framework:** Use ONLY standard HTML and Tailwind CSS (v3). No external CSS files.
2.  **Responsiveness:** The layout must be responsive (mobile-first or adaptable).
3.  **Theme:** Support Dark Mode. Use 'dark:' classes for dark mode variants. The user prefers '${theme || 'system'}' mode.
4.  **Fonts:** Use 'font-sans' (Google Sans/Inter) for text and 'font-mono' (Google Sans Code) for code/numbers.
5.  **Colors:** Use a modern, clean palette. Use 'indigo-600' as the primary color unless the sketch implies otherwise.
6.  **Icons:** Use inline SVGs for icons (Heroicons style). Do not use external icon libraries.
7.  **Output:** Return ONLY the raw HTML string (e.g., <div class="...">...</div>). Do NOT wrap in markdown code blocks. Do not include <!DOCTYPE html> or <html> tags, just the component markup.
8.  **Context:** The user might provide extra instructions.

User Instructions: ${prompt || 'None'}
`
		};

		const imagePart = {
			inlineData: {
				mimeType: 'image/png',
				data: base64Image,
			},
		};

		const result = await generativeModel.generateContent({
			contents: [{ role: 'user', parts: [imagePart, textPart] }],
		});

		const response = await result.response;
		const candidates = response.candidates;
		let html = candidates?.[0]?.content?.parts?.[0]?.text || '';

		// Post-process cleanup
		html = html.replace(/```html/g, '').replace(/```/g, '').trim();

		return new Response(JSON.stringify({ html }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error: any) {
		console.error('Vertex AI Error:', error);
		return new Response(JSON.stringify({ error: 'Failed to generate UI', details: error.message }), { status: 500 });
	}
};
