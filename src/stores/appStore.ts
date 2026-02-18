import { atom, map } from 'nanostores';
import type { Project, ProjectData, Settings, ViewMode } from '../types';

export const projectsStore = atom<Project[]>([]);
export const currentProjectStore = atom<string | null>(null);
export const currentProjectDataStore = atom<ProjectData | null>(null);
export const viewModeStore = atom<ViewMode>('split'); // Default split for desktop
export const themeStore = atom<'light' | 'dark'>('dark');

// Settings store
export const settingsStore = map<Settings>({
	theme: 'dark',
	credits: 10,
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

export const setTheme = (theme: 'light' | 'dark') => {
	themeStore.set(theme);
	// Persist to settings
    const current = settingsStore.get();
    settingsStore.setKey('theme', theme);
};
