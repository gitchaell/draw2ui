import { useStore } from "@nanostores/react";
import clsx from "clsx";
import { Code, PenTool, SplitSquareHorizontal } from "lucide-react";
import { setViewMode, viewModeStore } from "../stores/appStore";

export default function MobileNav() {
	const viewMode = useStore(viewModeStore);

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background/80 p-2 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 md:hidden pb-safe">
			<button
				onClick={() => setViewMode("draw")}
				className={clsx(
					"inline-flex flex-col items-center justify-center gap-1 rounded-md px-3 py-2 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background h-14 flex-1",
					viewMode === "draw" ? "text-primary" : "text-muted-foreground",
				)}
			>
				<PenTool className="h-5 w-5" />
				<span>Pizarra</span>
			</button>
			<div className="w-px h-8 bg-border mx-2" />
			<button
				onClick={() => setViewMode("code")}
				className={clsx(
					"inline-flex flex-col items-center justify-center gap-1 rounded-md px-3 py-2 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background h-14 flex-1",
					viewMode === "code" ? "text-primary" : "text-muted-foreground",
				)}
			>
				<Code className="h-5 w-5" />
				<span>Código</span>
			</button>
		</div>
	);
}
