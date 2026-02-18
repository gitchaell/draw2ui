import { useStore } from "@nanostores/react";
import clsx from "clsx";
import { toPng, toSvg } from "html-to-image";
import { Code, Copy, Download, Monitor, Smartphone, Tablet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { currentProjectDataStore } from "../stores/appStore";

const COLORS = [
	{ name: "Zinc", value: "zinc", class: "bg-zinc-500" },
	{ name: "Red", value: "red", class: "bg-red-500" },
	{ name: "Orange", value: "orange", class: "bg-orange-500" },
	{ name: "Green", value: "green", class: "bg-green-500" },
	{ name: "Blue", value: "blue", class: "bg-blue-500" },
	{ name: "Indigo", value: "indigo", class: "bg-indigo-500" },
	{ name: "Violet", value: "violet", class: "bg-violet-500" },
];

export default function ResultPanel() {
	const projectData = useStore(currentProjectDataStore);
	const [html, setHtml] = useState("");
	const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
	const [selectedColor, setSelectedColor] = useState("zinc");
	const [selectedFont, setSelectedFont] = useState("font-sans");
	const previewRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

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

		if (selectedColor !== "zinc") {
			processed = processed.replace(/indigo-/g, `${selectedColor}-`);
			processed = processed.replace(/zinc-/g, `${selectedColor}-`);
		}

		if (selectedFont !== "font-sans") {
			processed = processed.replace(/font-sans/g, selectedFont);
		}

		return processed;
	};

	const handleCopyHtml = () => {
		navigator.clipboard.writeText(getProcessedHtml());
		alert("HTML copiado al portapapeles");
	};

	const handleDownloadImage = async (format: "png" | "svg") => {
		if (!containerRef.current) return;
		try {
			const dataUrl =
				format === "png"
					? await toPng(containerRef.current, { cacheBust: true })
					: await toSvg(containerRef.current, { cacheBust: true });

			const link = document.createElement("a");
			link.download = `ui-design.${format}`;
			link.href = dataUrl;
			link.click();
		} catch (err) {
			console.error("Failed to download image", err);
		}
	};

	if (!projectData || !projectData.generatedHtml) {
		return (
			<div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground p-8 text-center bg-background/50">
				<div className="rounded-full bg-muted p-4">
					<Code className="h-8 w-8 opacity-50" />
				</div>
				<div className="space-y-2">
					<h3 className="font-semibold text-foreground">Sin código generado</h3>
					<p className="text-sm max-w-xs">
						Dibuja en la pizarra y presiona "Generar UI" para ver el resultado aquí.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-background relative">
			{/* Toolbar */}
			<div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur shadow-sm p-1.5 px-3 supports-[backdrop-filter]:bg-background/60">
				{/* Device Toggles */}
				<div className="flex items-center border-r border-border pr-2 mr-2 space-x-1">
					<button
						onClick={() => setPreviewMode("desktop")}
						className={clsx(
							"inline-flex items-center justify-center rounded-sm h-8 w-8 transition-colors hover:text-foreground",
							previewMode === "desktop"
								? "bg-muted text-foreground"
								: "text-muted-foreground",
						)}
						title="Desktop"
					>
						<Monitor className="h-4 w-4" />
					</button>
					<button
						onClick={() => setPreviewMode("tablet")}
						className={clsx(
							"inline-flex items-center justify-center rounded-sm h-8 w-8 transition-colors hover:text-foreground",
							previewMode === "tablet"
								? "bg-muted text-foreground"
								: "text-muted-foreground",
						)}
						title="Tablet"
					>
						<Tablet className="h-4 w-4" />
					</button>
					<button
						onClick={() => setPreviewMode("mobile")}
						className={clsx(
							"inline-flex items-center justify-center rounded-sm h-8 w-8 transition-colors hover:text-foreground",
							previewMode === "mobile"
								? "bg-muted text-foreground"
								: "text-muted-foreground",
						)}
						title="Mobile"
					>
						<Smartphone className="h-4 w-4" />
					</button>
				</div>

				{/* Colors */}
				<div className="flex items-center gap-1.5 border-r border-border pr-2 mr-2">
					{COLORS.map((color) => (
						<button
							key={color.value}
							onClick={() => setSelectedColor(color.value)}
							className={clsx(
								"h-4 w-4 rounded-full ring-offset-background transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
								color.class,
								selectedColor === color.value && "ring-2 ring-ring ring-offset-2",
							)}
							title={color.name}
						/>
					))}
				</div>

				{/* Actions */}
				<div className="flex items-center gap-1">
					<button
						onClick={handleCopyHtml}
						className="inline-flex items-center justify-center rounded-sm h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
						title="Copiar HTML"
					>
						<Copy className="h-4 w-4" />
					</button>
					<button
						onClick={() => handleDownloadImage("png")}
						className="inline-flex items-center justify-center rounded-sm h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
						title="Descargar Imagen"
					>
						<Download className="h-4 w-4" />
					</button>
				</div>
			</div>

			{/* Preview Area */}
			<div className="flex-1 overflow-auto bg-muted/50 p-8 flex items-center justify-center">
				{/* Container mimicking a browser window or device */}
				<div
					ref={previewRef}
					className={clsx(
						"bg-background rounded-xl shadow-2xl overflow-hidden transition-all duration-500 ease-in-out border border-border flex flex-col",
						previewMode === "desktop" && "w-full max-w-5xl aspect-video",
						previewMode === "tablet" && "w-[768px] aspect-[3/4]",
						previewMode === "mobile" && "w-[375px] aspect-[9/19.5]",
					)}
				>
					{/* Browser Header Mockup */}
					<div className="h-8 bg-muted border-b border-border flex items-center px-3 space-x-1.5 shrink-0">
						<div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
						<div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
						<div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
					</div>
					<div className="w-full h-full overflow-auto" ref={containerRef}>
						<div dangerouslySetInnerHTML={{ __html: getProcessedHtml() }} />
					</div>
				</div>
			</div>
		</div>
	);
}
