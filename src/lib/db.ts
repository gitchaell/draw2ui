import { get, set, update, del } from 'idb-keyval';
import type { Project, ProjectData, Settings } from '../types';

const PROJECTS_KEY = 'draw2ui-projects';
const SETTINGS_KEY = 'draw2ui-settings';
const DEFAULT_SETTINGS: Settings = {
	theme: 'dark', // Default to dark as per plan
	credits: 10,
};

export const db = {
	// Project CRUD
	async getProjects(): Promise<Project[]> {
		return (await get<Project[]>(PROJECTS_KEY)) || [];
	},

	async createProject(name: string): Promise<Project> {
		const newProject: Project = {
			id: crypto.randomUUID(),
			name,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};

		await update(PROJECTS_KEY, (projects: Project[] = []) => [...projects, newProject]);

		// Initialize empty project data
		await set(`project-${newProject.id}`, {
			id: newProject.id,
			elements: [],
			appState: {},
			generatedHtml: '',
		});

		return newProject;
	},

	async getProjectData(id: string): Promise<ProjectData | undefined> {
		return await get<ProjectData>(`project-${id}`);
	},

	async updateProjectData(id: string, data: Partial<ProjectData>): Promise<void> {
		const current = (await get<ProjectData>(`project-${id}`)) || {
			id,
			elements: [],
			appState: {},
			generatedHtml: '',
		};

		await set(`project-${id}`, { ...current, ...data });

		// Update timestamp in project list
		await update(PROJECTS_KEY, (projects: Project[] = []) =>
			projects.map((p) => (p.id === id ? { ...p, updatedAt: Date.now() } : p))
		);
	},

	async deleteProject(id: string): Promise<void> {
		await update(PROJECTS_KEY, (projects: Project[] = []) =>
			projects.filter((p) => p.id !== id)
		);
		await del(`project-${id}`);
	},

	// Settings
	async getSettings(): Promise<Settings> {
		return (await get<Settings>(SETTINGS_KEY)) || DEFAULT_SETTINGS;
	},

	async updateSettings(newSettings: Partial<Settings>): Promise<void> {
		await update(SETTINGS_KEY, (current: Settings = DEFAULT_SETTINGS) => ({
			...current,
			...newSettings,
		}));
	},
};
