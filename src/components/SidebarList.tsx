import { useState } from "react";
import { useStore } from "@nanostores/react";
import {
	projectsStore,
	currentProjectStore,
	setProjects,
	setCurrentProject,
} from "../stores/appStore";
import { db } from "../lib/db";
import clsx from "clsx";
import ThemeToggle from "./ThemeToggle";
import { Plus, Trash2, Folder, PanelLeftClose, PanelLeftOpen, Settings, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import SettingsDialog from "./SettingsDialog";

interface SidebarListProps {
	collapsed?: boolean;
	onToggleCollapse?: () => void;
	onSelect?: () => void;
}

export default function SidebarList({
	collapsed = false,
	onToggleCollapse,
	onSelect,
}: SidebarListProps) {
	const projects = useStore(projectsStore);
	const currentProject = useStore(currentProjectStore);
	const [loading, setLoading] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editName, setEditName] = useState("");

	const handleCreateProject = async () => {
		setLoading(true);
		try {
			const name = `Project ${projects.length + 1}`;
			const newProject = await db.createProject(name);
			setProjects([newProject, ...projects]);
			setCurrentProject(newProject.id);
			if (onSelect) onSelect();
		} catch (error) {
			console.error("Failed to create project", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteProject = async (e: React.MouseEvent, id: string) => {
		e.stopPropagation();
		if (!confirm("Are you sure you want to delete this project?")) return;

		try {
			await db.deleteProject(id);
			const remaining = projects.filter((p) => p.id !== id);
			setProjects(remaining);
			if (currentProject === id) {
				setCurrentProject(remaining.length > 0 ? remaining[0].id : null);
			}
		} catch (error) {
			console.error("Failed to delete project", error);
		}
	};

	const handleStartEditing = (e: React.MouseEvent, project: { id: string; name: string }) => {
		e.stopPropagation();
		setEditingId(project.id);
		setEditName(project.name);
	};

	const handleRenameProject = async () => {
		if (!editingId || !editName.trim()) {
			setEditingId(null);
			return;
		}

		try {
			await db.renameProject(editingId, editName);
			const updatedProjects = projects.map((p) =>
				p.id === editingId ? { ...p, name: editName } : p,
			);
			setProjects(updatedProjects);
		} catch (error) {
			console.error("Failed to rename project", error);
		} finally {
			setEditingId(null);
			setEditName("");
		}
	};

	const handleSelectProject = (id: string) => {
		if (editingId) return; // Prevent selection while editing
		setCurrentProject(id);
		if (onSelect) onSelect();
	};

	return (
		<div className="flex flex-col h-full w-full">
			{/* Header */}
			<div
				className={clsx(
					"flex items-center p-4 h-14 border-b",
					collapsed ? "justify-center" : "justify-between",
				)}
			>
				{!collapsed && <h1 className="text-lg font-semibold tracking-tight">draw2ui</h1>}
				{onToggleCollapse && (
					<Button
						variant="ghost"
						size="icon"
						onClick={onToggleCollapse}
						className={clsx("h-8 w-8", collapsed ? "" : "ml-auto")}
						title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
					>
						{collapsed ? (
							<PanelLeftOpen className="h-4 w-4" />
						) : (
							<PanelLeftClose className="h-4 w-4" />
						)}
					</Button>
				)}
			</div>

			{/* Project List */}
			<ScrollArea className="flex-1">
				<div className="p-2 space-y-2">
					{!collapsed ? (
						<div className="px-2">
							<Button
								onClick={handleCreateProject}
								disabled={loading}
								className="w-full justify-start gap-2"
							>
								<Plus className="h-4 w-4" />
								<span>New Project</span>
							</Button>
						</div>
					) : (
						<div className="flex justify-center">
							<Button
								variant="ghost"
								size="icon"
								onClick={handleCreateProject}
								disabled={loading}
								title="New Project"
							>
								<Plus className="h-4 w-4" />
							</Button>
						</div>
					)}

					<div className="px-2">
						{!collapsed && projects.length > 0 && (
							<h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
								Projects
							</h2>
						)}

						{projects.length === 0 ? (
							<div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground gap-2 mt-4">
								<div className="p-2 rounded-full bg-muted">
									<Folder className="h-6 w-6 text-muted-foreground opacity-50" />
								</div>
								{!collapsed && (
									<>
										<p className="text-sm font-medium">No projects yet</p>
										<p className="text-xs">Create one to start!</p>
									</>
								)}
							</div>
						) : (
							<div className="space-y-1">
								{projects.map((project) => (
									// biome-ignore lint/a11y/useSemanticElements: Interactive element containing another interactive element
									<div
										key={project.id}
										role="button"
										tabIndex={0}
										onClick={() => handleSelectProject(project.id)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												handleSelectProject(project.id);
											}
										}}
										className={clsx(
											"group flex items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer",
											currentProject === project.id
												? "bg-secondary text-secondary-foreground"
												: "hover:bg-accent hover:text-accent-foreground text-muted-foreground",
										)}
										title={project.name}
									>
										{editingId === project.id && !collapsed ? (
											<div className="flex items-center gap-2 w-full">
												<Input
													value={editName}
													onChange={(e) => setEditName(e.target.value)}
													onBlur={handleRenameProject}
													onKeyDown={(e) => {
														if (e.key === "Enter") handleRenameProject();
														if (e.key === "Escape") {
															setEditingId(null);
															e.stopPropagation();
														}
													}}
													autoFocus
													className="h-7 text-xs"
													onClick={(e) => e.stopPropagation()}
												/>
											</div>
										) : (
											<>
												<div className="flex items-center gap-2 overflow-hidden">
													<Folder
														className={clsx(
															"h-4 w-4 shrink-0",
															currentProject === project.id
																? "text-foreground"
																: "text-muted-foreground",
														)}
													/>
													{!collapsed && <span className="truncate">{project.name}</span>}
												</div>

												{!collapsed && (
													<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
														<Button
															variant="ghost"
															size="icon"
															onClick={(e) => handleStartEditing(e, project)}
															className="h-6 w-6 hover:bg-primary/10 hover:text-primary"
															title="Rename"
														>
															<Pencil className="h-3 w-3" />
														</Button>
														<Button
															variant="ghost"
															size="icon"
															onClick={(e) => handleDeleteProject(e, project.id)}
															className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
															title="Delete"
														>
															<Trash2 className="h-3 w-3" />
														</Button>
													</div>
												)}
											</>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</ScrollArea>

			{/* Footer */}
			<div className="h-14 px-4 border-t bg-muted/20 flex items-center">
				<div
					className={clsx(
						"flex items-center gap-2 w-full",
						!collapsed ? "justify-between" : "justify-center",
					)}
				>
					{!collapsed && (
						<Button
							variant="ghost"
							size="sm"
							className="gap-2 text-muted-foreground"
							onClick={() => setShowSettings(true)}
						>
							<Settings className="h-4 w-4" />
							<span>Settings</span>
						</Button>
					)}
					<ThemeToggle />
				</div>
			</div>

			<SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
		</div>
	);
}
