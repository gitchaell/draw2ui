import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { viewModeStore, setViewMode } from '../stores/appStore';
import { PenTool, Code, Menu, ArrowRight } from 'lucide-react';
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
		<div className="w-full border-t bg-background p-2 z-50 flex items-center justify-center shrink-0 relative">
            {/* Mobile Navigation */}
            <div className="md:hidden flex flex-1 items-center justify-between w-full relative">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-14 w-14 rounded-md shrink-0"
                        >
                            <Menu className="h-6 w-6" />
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

                {/* Spacer for Floating Button */}
                <div className="w-16 shrink-0" />

                <Button
                    variant={viewMode === 'code' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('code')}
                    className="flex-1 flex-col h-14 gap-1 rounded-md"
                >
                    <Code className="h-5 w-5" />
                    <span className="text-xs">UI</span>
                </Button>

                {/* Dummy spacer to balance the layout (Projects button width + separator) */}
                <div className="w-px h-8 mx-1 invisible" />
                <div className="h-14 w-14 shrink-0 invisible" />

                 {/* Floating Generate Button */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-6">
                    <Button
                        variant="default"
                        onClick={onGenerate}
                        className="rounded-full h-14 w-14 p-0 shadow-lg"
                    >
                        <ArrowRight className="h-6 w-6" />
                    </Button>
                </div>
            </div>

            {/* Desktop Generate Button */}
            <div className="hidden md:flex">
                 <Button onClick={onGenerate} className="gap-2 rounded-full shadow-lg">
                    <ArrowRight className="h-4 w-4" />
                    Generate UI
                </Button>
            </div>
		</div>
	);
}
