import { atom, map } from "nanostores";
import type { Project, ProjectData, Settings, ViewMode } from "../types";

export const projectsStore = atom<Project[]>([]);
export const currentProjectStore = atom<string | null>(null);
export const currentProjectDataStore = atom<ProjectData | null>(null);
export const viewModeStore = atom<ViewMode>("split"); // Default split for desktop
export const themeStore = atom<"light" | "dark">("dark");
export const isGeneratingStore = atom<boolean>(false);

// Settings store
export const settingsStore = map<Settings>({
	theme: "dark",
	credits: 10,
});

export const previewSettingsStore = map({
	themeColor: "zinc",
	font: "font-sans",
	viewMode: "desktop" as "desktop" | "tablet" | "mobile",
	scale: 1,
});

// Actions
export const setProjects = (projects: Project[]) => {
	projectsStore.set(projects);
};

export const setCurrentProject = (id: string | null) => {
	currentProjectStore.set(id);
};

export const setCurrentProjectData = (data: ProjectData | null) => {
	currentProjectDataStore.set(data);
};

export const setViewMode = (mode: ViewMode) => {
	viewModeStore.set(mode);
};

export const setTheme = (theme: "light" | "dark") => {
	themeStore.set(theme);
	// Persist to settings
	settingsStore.setKey("theme", theme);
};

export const setIsGenerating = (isGenerating: boolean) => {
	isGeneratingStore.set(isGenerating);
};

export const setPreviewSettings = (
	settings: Partial<ReturnType<typeof previewSettingsStore.get>>,
) => {
	previewSettingsStore.set({ ...previewSettingsStore.get(), ...settings });
};
