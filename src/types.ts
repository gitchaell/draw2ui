export interface Project {
	id: string;
	name: string;
	createdAt: number;
	updatedAt: number;
	// We might store the content separately to avoid loading heavy data when listing projects
}

export interface ProjectData {
	id: string;
	elements: any[]; // Excalidraw elements
	appState: any; // Excalidraw app state
	generatedHtml: string;
}

export interface Settings {
	theme: "light" | "dark";
	credits: number;
	openAIKey?: string; // If we add custom key support
}

export type ViewMode = "draw" | "code" | "split";
