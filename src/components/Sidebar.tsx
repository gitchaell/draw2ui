import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { currentProjectStore, setProjects, setCurrentProject } from '../stores/appStore';
import { db } from '../lib/db';
import clsx from 'clsx';
import SidebarList from './SidebarList';

export default function Sidebar() {
	const currentProject = useStore(currentProjectStore);
	const [isOpen, setIsOpen] = useState(true);

    // biome-ignore lint/correctness/useExhaustiveDependencies: Only run once on mount
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
	}, []);

	return (
		<aside
			className={clsx(
				"fixed left-0 top-0 h-full z-20 flex flex-col transition-all duration-300 ease-in-out border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
				isOpen ? "w-64" : "w-16"
			)}
		>
            <SidebarList
                collapsed={!isOpen}
                onToggleCollapse={() => setIsOpen(!isOpen)}
            />
		</aside>
	);
}
