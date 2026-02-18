import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { viewModeStore, setViewMode } from '../stores/appStore';
import { PenTool, Code, Menu, Wand2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarList from './SidebarList';

interface BottomBarProps {
    onGenerate: () => void;
}

export default function BottomBar({ onGenerate }: BottomBarProps) {
	const viewMode = useStore(viewModeStore);
    const [open, setOpen] = useState(false);

	return (
		<div className="w-full border-t bg-background p-2 z-50 flex items-center justify-center shrink-0">
            {/* Mobile Navigation */}
            <div className="md:hidden flex flex-1 items-center justify-around w-full">
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
                    variant="ghost"
                    onClick={onGenerate}
                    className="flex-1 flex-col h-14 gap-1 rounded-md text-primary"
                >
                    <Wand2 className="h-5 w-5" />
                    <span className="text-xs">Generate</span>
                </Button>

                <Button
                    variant={viewMode === 'code' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('code')}
                    className="flex-1 flex-col h-14 gap-1 rounded-md"
                >
                    <Code className="h-5 w-5" />
                    <span className="text-xs">UI</span>
                </Button>
            </div>

            {/* Desktop Generate Button */}
            <div className="hidden md:flex">
                 <Button onClick={onGenerate} className="gap-2">
                    <Wand2 className="h-4 w-4" />
                    Generate UI
                </Button>
            </div>
		</div>
	);
}
