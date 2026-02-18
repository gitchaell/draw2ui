import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { projectsStore, currentProjectStore, setProjects, setCurrentProject } from '../stores/appStore';
import { db } from '../lib/db';
import clsx from 'clsx';
import ThemeToggle from './ThemeToggle';

export default function Sidebar() {
	const projects = useStore(projectsStore);
	const currentProject = useStore(currentProjectStore);
	const [isOpen, setIsOpen] = useState(true);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		loadProjects();
	}, []);

	const loadProjects = async () => {
		try {
			const data = await db.getProjects();
			setProjects(data.sort((a, b) => b.updatedAt - a.updatedAt));
			// Select the first project if none selected and list is not empty
			if (data.length > 0 && !currentProject) {
				setCurrentProject(data[0].id);
			}
		} catch (error) {
			console.error('Failed to load projects', error);
		}
	};

	const handleCreateProject = async () => {
		setLoading(true);
		try {
			const name = `Proyecto ${projects.length + 1}`;
			const newProject = await db.createProject(name);
			setProjects([newProject, ...projects]);
			setCurrentProject(newProject.id);
		} catch (error) {
			console.error('Failed to create project', error);
		} finally {
			setLoading(false);
		}
	};

    const handleDeleteProject = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

        try {
            await db.deleteProject(id);
            const remaining = projects.filter(p => p.id !== id);
            setProjects(remaining);
            if (currentProject === id) {
                setCurrentProject(remaining.length > 0 ? remaining[0].id : null);
            }
        } catch (error) {
            console.error('Failed to delete project', error);
        }
    };

	return (
		<aside
			className={clsx(
				"fixed left-0 top-0 h-full z-20 flex flex-col bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 transition-all duration-300",
				isOpen ? "w-64" : "w-16"
			)}
		>
			<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800">
				{isOpen && <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 truncate">draw2ui</h1>}
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500"
					title={isOpen ? "Colapsar sidebar" : "Expandir sidebar"}
				>
					{isOpen ? (
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
					) : (
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
					)}
				</button>
			</div>

			<div className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
                {isOpen && (
                    <button
                        onClick={handleCreateProject}
                        disabled={loading}
                        className="w-full flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Nuevo Proyecto
                    </button>
                )}

                {!isOpen && (
                     <button
                        onClick={handleCreateProject}
                        disabled={loading}
                        className="w-full flex justify-center p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                        title="Nuevo Proyecto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                )}

				<div className="mt-6 space-y-1">
					{projects.map((project) => (
						<div
							key={project.id}
							className={clsx(
								"group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors",
								currentProject === project.id
									? "bg-gray-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400"
									: "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
							)}
							onClick={() => setCurrentProject(project.id)}
                            title={project.name}
						>
                            <div className="flex items-center gap-3 overflow-hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                                {isOpen && <span className="text-sm font-medium truncate">{project.name}</span>}
                            </div>

                            {isOpen && (
                                <button
                                    onClick={(e) => handleDeleteProject(e, project.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                                    title="Eliminar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            )}
						</div>
					))}
				</div>
			</div>

            <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
                <div className={clsx("flex items-center", isOpen ? "justify-between" : "justify-center")}>
                    {isOpen && <span className="text-xs text-gray-500 dark:text-gray-400">Tema</span>}
                    <ThemeToggle />
                </div>
            </div>
		</aside>
	);
}
