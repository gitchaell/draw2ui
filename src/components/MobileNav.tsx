import { useStore } from '@nanostores/react';
import { viewModeStore, setViewMode } from '../stores/appStore';
import { PenTool, Code } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ThemeToggle from './ThemeToggle';

export default function MobileNav() {
	const viewMode = useStore(viewModeStore);

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-background/80 p-2 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 md:hidden pb-safe">
			<Button
                variant={viewMode === 'draw' ? 'default' : 'ghost'}
				onClick={() => setViewMode('draw')}
                className="flex-1 flex-col h-14 gap-1 rounded-md"
			>
				<PenTool className="h-5 w-5" />
				<span className="text-xs">Whiteboard</span>
			</Button>
			<div className="w-px h-8 bg-border mx-2" />
			<Button
				variant={viewMode === 'code' ? 'default' : 'ghost'}
				onClick={() => setViewMode('code')}
                className="flex-1 flex-col h-14 gap-1 rounded-md"
			>
				<Code className="h-5 w-5" />
				<span className="text-xs">Code</span>
			</Button>
            <div className="w-px h-8 bg-border mx-2" />
            <div className="flex flex-col items-center justify-center h-14 w-14">
                <ThemeToggle />
            </div>
		</div>
	);
}
