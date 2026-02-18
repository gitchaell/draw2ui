import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { viewModeStore, setViewMode } from '../stores/appStore';
import { PenTool, Code, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ThemeToggle from './ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarList from './SidebarList';

export default function MobileNav() {
	const viewMode = useStore(viewModeStore);
    const [open, setOpen] = useState(false);

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-background/80 p-2 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 md:hidden pb-safe">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex-col h-14 gap-1 rounded-md px-2 min-w-[4rem]"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="text-xs">Projects</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[18rem]">
                    <SidebarList onSelect={() => setOpen(false)} />
                </SheetContent>
            </Sheet>

			<div className="w-px h-8 bg-border mx-1" />

			<Button
                variant={viewMode === 'draw' ? 'default' : 'ghost'}
				onClick={() => setViewMode('draw')}
                className="flex-1 flex-col h-14 gap-1 rounded-md"
			>
				<PenTool className="h-5 w-5" />
				<span className="text-xs">Whiteboard</span>
			</Button>

			<Button
				variant={viewMode === 'code' ? 'default' : 'ghost'}
				onClick={() => setViewMode('code')}
                className="flex-1 flex-col h-14 gap-1 rounded-md"
			>
				<Code className="h-5 w-5" />
				<span className="text-xs">UI</span>
			</Button>

            <div className="w-px h-8 bg-border mx-1" />

            <div className="flex flex-col items-center justify-center h-14 w-14">
                <ThemeToggle />
            </div>
		</div>
	);
}
