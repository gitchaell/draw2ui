import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { projectsStore, currentProjectStore, setProjects, setCurrentProject } from '../stores/appStore';
import { db } from '../lib/db';
import clsx from 'clsx';
import ThemeToggle from './ThemeToggle';
import { Plus, Trash2, Folder, PanelLeftClose, PanelLeftOpen, Settings } from 'lucide-react';

export default function Sidebar() {
	const projects = useStore(projectsStore);
	const currentProject = useStore(currentProjectStore);
	const [isOpen, setIsOpen] = useState(true);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const loadProjects = async () => {
            try {
                const data = await db.getProjects();
                setProjects(data.sort((a, b) => b.updatedAt - a.updatedAt));
                if (data.length > 0 && !currentProject) {
                    setCurrentProject(data[0].id);
                }
            } catch (error) {
                console.error('Failed to load projects', error);
            }
        };
		loadProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Only on mount

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
				"fixed left-0 top-0 h-full z-20 flex flex-col transition-all duration-300 ease-in-out border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
				isOpen ? "w-64" : "w-16"
			)}
		>
			{/* Header */}
			<div className="flex items-center justify-between p-4 h-14 border-b border-border">
				{isOpen && <h1 className="text-lg font-semibold tracking-tight">draw2ui</h1>}
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8 ml-auto"
					title={isOpen ? "Colapsar sidebar" : "Expandir sidebar"}
				>
					{isOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
				</button>
			</div>

			{/* Project List */}
			<div className="flex-1 overflow-y-auto p-2 space-y-1">
                {isOpen && (
                     <div className="px-2 py-2">
                        <button
                            onClick={handleCreateProject}
                            disabled={loading}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Nuevo Proyecto</span>
                        </button>
                    </div>
                )}

                {!isOpen && (
                    <div className="flex justify-center py-2">
                         <button
                            onClick={handleCreateProject}
                            disabled={loading}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
                            title="Nuevo Proyecto"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                )}

                <div className="px-2 py-2">
                    {isOpen && <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">Proyectos</h2>}
                    <div className="space-y-1">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => setCurrentProject(project.id)}
                                className={clsx(
                                    "group flex items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer",
                                    currentProject === project.id
                                        ? "bg-secondary text-secondary-foreground"
                                        : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                                )}
                                title={project.name}
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <Folder className={clsx("h-4 w-4 shrink-0", currentProject === project.id ? "text-foreground" : "text-muted-foreground")} />
                                    {isOpen && <span className="truncate">{project.name}</span>}
                                </div>

                                {isOpen && (
                                    <button
                                        onClick={(e) => handleDeleteProject(e, project.id)}
                                        className="opacity-0 group-hover:opacity-100 inline-flex items-center justify-center rounded-sm hover:bg-destructive/10 hover:text-destructive h-6 w-6 transition-all"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
				</div>
			</div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/20">
                <div className={clsx("flex items-center gap-2", isOpen ? "justify-between" : "justify-center flex-col gap-4")}>
                    {isOpen && (
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Settings className="h-4 w-4" />
                            <span>Configuración</span>
                        </div>
                    )}
                    <ThemeToggle />
                </div>
            </div>
		</aside>
	);
}
