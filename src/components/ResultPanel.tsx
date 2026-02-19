import { useState, useRef, useEffect } from "react";
import { useStore } from "@nanostores/react";
import {
	currentProjectDataStore,
	isGeneratingStore,
	previewSettingsStore,
	setPreviewSettings,
} from "../stores/appStore";
import { toPng, toSvg } from "html-to-image";
import clsx from "clsx";
import {
	Copy,
	Download,
	Monitor,
	Smartphone,
	Tablet,
	Wand2,
	Type,
	Code,
	ZoomIn,
	ZoomOut,
	Maximize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const COLORS = [
	{ name: "Zinc", value: "zinc", class: "bg-zinc-500" },
	{ name: "Red", value: "red", class: "bg-red-500" },
	{ name: "Orange", value: "orange", class: "bg-orange-500" },
	{ name: "Green", value: "green", class: "bg-green-500" },
	{ name: "Blue", value: "blue", class: "bg-blue-500" },
	{ name: "Indigo", value: "indigo", class: "bg-indigo-500" },
	{ name: "Violet", value: "violet", class: "bg-violet-500" },
];

const FONTS = [
	{ name: "Default", value: "font-sans" },
	{ name: "Inter", value: "font-inter" },
	{ name: "Roboto", value: "font-roboto" },
	{ name: "Open Sans", value: "font-open-sans" },
	{ name: "Lato", value: "font-lato" },
	{ name: "Poppins", value: "font-poppins" },
];

export default function ResultPanel() {
	const projectData = useStore(currentProjectDataStore);
	const isGenerating = useStore(isGeneratingStore);
	const settings = useStore(previewSettingsStore);

	const [html, setHtml] = useState("");
	const previewRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// Sync local HTML state with store
	useEffect(() => {
		if (projectData?.generatedHtml) {
			setHtml(projectData.generatedHtml);
		} else {
			setHtml("");
		}
	}, [projectData?.generatedHtml]);

	const getProcessedHtml = () => {
		if (!html) return "";
		let processed = html;

		if (settings.themeColor !== "zinc") {
			processed = processed.replace(/indigo-/g, `${settings.themeColor}-`);
			processed = processed.replace(/zinc-/g, `${settings.themeColor}-`);
		}

		if (settings.font !== "font-sans") {
			processed = processed.replace(/font-sans/g, settings.font);
		}

		return processed;
	};

	const processedHtml = getProcessedHtml();

	const handleCopyHtml = () => {
		navigator.clipboard.writeText(processedHtml);
		toast.success("HTML copied to clipboard");
	};

	const handleDownloadImage = async (format: "png" | "svg") => {
		if (!containerRef.current) return;
		try {
			// Temporarily reset scale for capture
			const originalTransform = containerRef.current.style.transform;
			containerRef.current.style.transform = "scale(1)";

			const dataUrl =
				format === "png"
					? await toPng(containerRef.current, { cacheBust: true, pixelRatio: 2 })
					: await toSvg(containerRef.current, { cacheBust: true });

			// Restore scale
			containerRef.current.style.transform = originalTransform;

			const link = document.createElement("a");
			link.download = `ui-design.${format}`;
			link.href = dataUrl;
			link.click();
			toast.success(`Image downloaded as ${format.toUpperCase()}`);
		} catch (err) {
			console.error("Failed to download image", err);
			toast.error("Error downloading image");
		}
	};

	// Zoom/Scale Logic
	const handleZoomIn = () => {
		setPreviewSettings({ scale: Math.min(settings.scale + 0.1, 2) });
	};

	const handleZoomOut = () => {
		setPreviewSettings({ scale: Math.max(settings.scale - 0.1, 0.25) });
	};

	const handleFitToScreen = () => {
		setPreviewSettings({ scale: 1 });
	};

	return (
		<div className="flex flex-col h-full bg-background relative">
			{/* Toolbar - Always visible */}
			<div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur shadow-sm p-1.5 px-3 supports-[backdrop-filter]:bg-background/60 max-w-[95vw] overflow-x-auto no-scrollbar">
				{/* Device Toggles */}
				<Tabs
					value={settings.viewMode}
					onValueChange={(v) => setPreviewSettings({ viewMode: v as any })}
					className="border-r pr-2 mr-2 shrink-0"
				>
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
				<div className="flex items-center gap-1.5 border-r pr-2 mr-2 shrink-0">
					{COLORS.map((color) => (
						<button
							key={color.value}
							onClick={() => setPreviewSettings({ themeColor: color.value })}
							className={clsx(
								"h-4 w-4 rounded-full ring-offset-background transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
								color.class,
								settings.themeColor === color.value &&
									"ring-2 ring-ring ring-offset-2",
							)}
							title={color.name}
						/>
					))}
				</div>

				{/* Fonts */}
				<div className="flex items-center gap-2 border-r pr-2 mr-2 shrink-0">
					<Type className="h-4 w-4 text-muted-foreground" />
					<Select
						value={settings.font}
						onValueChange={(v) => setPreviewSettings({ font: v })}
					>
						<SelectTrigger className="h-7 w-[110px] text-xs border-none bg-transparent focus:ring-0 px-1 gap-1">
							<SelectValue placeholder="Font" />
						</SelectTrigger>
						<SelectContent>
							{FONTS.map((font) => (
								<SelectItem key={font.value} value={font.value} className="text-xs">
									{font.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Zoom Controls */}
				<div className="flex items-center gap-1 border-r pr-2 mr-2 shrink-0">
					<Button
						variant="ghost"
						size="icon"
						className="h-6 w-6"
						onClick={handleZoomOut}
						title="Zoom Out"
					>
						<ZoomOut className="h-3 w-3" />
					</Button>
					<span className="text-[10px] w-8 text-center font-mono">
						{Math.round(settings.scale * 100)}%
					</span>
					<Button
						variant="ghost"
						size="icon"
						className="h-6 w-6"
						onClick={handleZoomIn}
						title="Zoom In"
					>
						<ZoomIn className="h-3 w-3" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="h-6 w-6 ml-1"
						onClick={handleFitToScreen}
						title="Reset Zoom"
					>
						<Maximize className="h-3 w-3" />
					</Button>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-1 shrink-0">
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								title="View Code"
								disabled={!html}
							>
								<Code className="h-4 w-4" />
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-2xl max-h-[80vh]">
							<DialogHeader>
								<DialogTitle>Generated HTML</DialogTitle>
								<DialogDescription>
									Raw HTML code with Tailwind classes.
								</DialogDescription>
							</DialogHeader>
							<div className="relative mt-2">
								<ScrollArea className="h-[50vh] w-full rounded-md border p-4 bg-muted font-mono text-xs">
									<pre className="whitespace-pre-wrap break-all">
										{processedHtml}
									</pre>
								</ScrollArea>
								<Button
									size="icon"
									variant="outline"
									className="absolute top-2 right-2 h-8 w-8 bg-background/50 backdrop-blur"
									onClick={handleCopyHtml}
								>
									<Copy className="h-4 w-4" />
								</Button>
							</div>
						</DialogContent>
					</Dialog>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8"
									onClick={handleCopyHtml}
									disabled={!html}
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
									onClick={() => handleDownloadImage("png")}
									disabled={!html}
								>
									<Download className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Download PNG</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>

			{/* Content Area */}
			<div className="flex-1 overflow-hidden bg-muted/20 flex items-center justify-center relative">
				{isGenerating ? (
					// Loading State
					<div className="flex h-full flex-col items-center justify-center gap-6 p-8 w-full max-w-4xl">
						<div className="flex flex-col gap-4 w-full animate-pulse">
							<div className="flex gap-4 items-center mb-4">
								<Skeleton className="h-12 w-12 rounded-full" />
								<div className="space-y-2 flex-1">
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-3 w-1/2" />
								</div>
							</div>
							<Skeleton className="h-96 w-full rounded-xl" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-5/6" />
								<Skeleton className="h-4 w-4/6" />
							</div>
							<div className="flex justify-center mt-4">
								<span className="text-sm text-muted-foreground animate-bounce">
									Generating your UI...
								</span>
							</div>
						</div>
					</div>
				) : !html ? (
					// Empty State
					<div className="flex h-full flex-col items-center justify-center gap-6 text-muted-foreground p-8 text-center">
						<div className="rounded-full bg-background p-6 shadow-sm ring-1 ring-border">
							<Wand2 className="h-10 w-10 opacity-50 text-primary" />
						</div>
						<div className="space-y-2 max-w-sm">
							<h3 className="text-lg font-semibold text-foreground">
								No code generated yet
							</h3>
							<p className="text-sm text-muted-foreground">
								Start drawing your idea on the whiteboard, then click{" "}
								<span className="font-medium text-foreground">
									"Generate UI"
								</span>{" "}
								to bring it to life here.
							</p>
						</div>
					</div>
				) : (
					// Preview State
					<div
						style={{
							transform: `scale(${settings.scale})`,
							transformOrigin: "center center",
							transition: "transform 0.2s ease-in-out",
						}}
						className="flex items-center justify-center"
					>
						{/* Device Mockup */}
						<div
							ref={previewRef}
							className={clsx(
								"bg-background rounded-xl shadow-2xl overflow-hidden border flex flex-col ring-1 ring-border/50 transition-all duration-300",
								settings.viewMode === "desktop" && "w-[1280px] h-[800px]",
								settings.viewMode === "tablet" && "w-[768px] h-[1024px]",
								settings.viewMode === "mobile" && "w-[375px] h-[812px]",
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
							<div
								className="w-full h-full overflow-auto bg-background text-foreground"
								ref={containerRef}
							>
								{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Intentional rendering of AI output */}
								<div dangerouslySetInnerHTML={{ __html: processedHtml }} />
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
