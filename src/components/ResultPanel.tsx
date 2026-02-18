import { useState, useRef, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { currentProjectDataStore } from '../stores/appStore';
import { toPng, toSvg } from 'html-to-image';
import clsx from 'clsx';
import { Copy, Download, Code, Monitor, Smartphone, Tablet, Wand2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

const COLORS = [
    { name: 'Zinc', value: 'zinc', class: 'bg-zinc-500' },
    { name: 'Red', value: 'red', class: 'bg-red-500' },
    { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
    { name: 'Green', value: 'green', class: 'bg-green-500' },
    { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
    { name: 'Indigo', value: 'indigo', class: 'bg-indigo-500' },
    { name: 'Violet', value: 'violet', class: 'bg-violet-500' },
];

export default function ResultPanel() {
    const projectData = useStore(currentProjectDataStore);
    const [html, setHtml] = useState('');
    const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [selectedColor, setSelectedColor] = useState('zinc');
    const [selectedFont, setSelectedFont] = useState('font-sans');
    const previewRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (projectData?.generatedHtml) {
            setHtml(projectData.generatedHtml);
        } else {
            setHtml('');
        }
    }, [projectData?.generatedHtml]);

    const getProcessedHtml = () => {
        if (!html) return '';
        let processed = html;

        if (selectedColor !== 'zinc') {
            processed = processed.replace(/indigo-/g, `${selectedColor}-`);
            processed = processed.replace(/zinc-/g, `${selectedColor}-`);
        }

        if (selectedFont !== 'font-sans') {
             processed = processed.replace(/font-sans/g, selectedFont);
        }

        return processed;
    };

    const handleCopyHtml = () => {
        navigator.clipboard.writeText(getProcessedHtml());
        toast.success("HTML copied to clipboard");
    };

    const handleDownloadImage = async (format: 'png' | 'svg') => {
        if (!containerRef.current) return;
        try {
            const dataUrl = format === 'png'
                ? await toPng(containerRef.current, { cacheBust: true })
                : await toSvg(containerRef.current, { cacheBust: true });

            const link = document.createElement('a');
            link.download = `ui-design.${format}`;
            link.href = dataUrl;
            link.click();
            toast.success(`Image downloaded as ${format.toUpperCase()}`);
        } catch (err) {
            console.error('Failed to download image', err);
            toast.error("Error downloading image");
        }
    };

    if (!projectData || !projectData.generatedHtml) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-6 text-muted-foreground p-8 text-center bg-muted/10">
                <div className="rounded-full bg-background p-6 shadow-sm ring-1 ring-border">
                    <Wand2 className="h-10 w-10 opacity-50 text-primary" />
                </div>
                <div className="space-y-2 max-w-sm">
                    <h3 className="text-lg font-semibold text-foreground">No code generated yet</h3>
                    <p className="text-sm text-muted-foreground">
                        Start drawing your idea on the whiteboard, then click <span className="font-medium text-foreground">"Generate UI"</span> to bring it to life here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background relative">
            {/* Toolbar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur shadow-sm p-1.5 px-3 supports-[backdrop-filter]:bg-background/60">
                {/* Device Toggles */}
                <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as any)} className="border-r pr-2 mr-2">
                    <TabsList className="h-8 bg-muted/50">
                        <TabsTrigger value="desktop" className="h-6 w-8 p-0" title="Desktop">
                            <Monitor className="h-3.5 w-3.5" />
                        </TabsTrigger>
                        <TabsTrigger value="tablet" className="h-6 w-8 p-0" title="Tablet">
                            <Tablet className="h-3.5 w-3.5" />
                        </TabsTrigger>
                        <TabsTrigger value="mobile" className="h-6 w-8 p-0" title="Mobile">
                            <Smartphone className="h-3.5 w-3.5" />
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Colors */}
                 <div className="flex items-center gap-1.5 border-r pr-2 mr-2">
                    {COLORS.map((color) => (
                        <button
                            key={color.value}
                            onClick={() => setSelectedColor(color.value)}
                            className={clsx(
                                "h-4 w-4 rounded-full ring-offset-background transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                color.class,
                                selectedColor === color.value && "ring-2 ring-ring ring-offset-2"
                            )}
                            title={color.name}
                        />
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={handleCopyHtml}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy HTML</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                         <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                     variant="ghost"
                                     size="icon"
                                     className="h-8 w-8"
                                     onClick={() => handleDownloadImage('png')}
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Download PNG</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-auto bg-muted/20 p-8 flex items-center justify-center">
                 {/* Container mimicking a browser window or device */}
                <div
                    ref={previewRef}
                    className={clsx(
                        "bg-background rounded-xl shadow-2xl overflow-hidden transition-all duration-500 ease-in-out border flex flex-col ring-1 ring-border/50",
                        previewMode === 'desktop' && "w-full max-w-5xl aspect-video",
                        previewMode === 'tablet' && "w-[768px] aspect-[3/4]",
                        previewMode === 'mobile' && "w-[375px] aspect-[9/19.5]"
                    )}
                >
                     {/* Browser Header Mockup */}
                    <div className="h-9 bg-muted/50 border-b flex items-center px-4 space-x-2 shrink-0">
                        <div className="flex space-x-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="h-5 w-1/2 bg-background rounded-md border text-[10px] flex items-center justify-center text-muted-foreground font-mono">
                                localhost:4321
                            </div>
                        </div>
                        <div className="w-10" />
                    </div>
                    <div className="w-full h-full overflow-auto bg-white dark:bg-zinc-950 text-foreground" ref={containerRef}>
                        <div dangerouslySetInnerHTML={{ __html: getProcessedHtml() }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
