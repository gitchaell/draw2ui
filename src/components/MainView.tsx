import { useStore } from "@nanostores/react";
import clsx from "clsx";
import { type ReactNode, useEffect, useState } from "react";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import { viewModeStore } from "../stores/appStore";

interface MainViewProps {
	whiteboard: ReactNode;
	result: ReactNode;
}

export default function MainView({ whiteboard, result }: MainViewProps) {
	const viewMode = useStore(viewModeStore);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	if (isMobile) {
		return (
			<main className="flex-1 relative w-full overflow-hidden">
				{/* Mobile View: Toggle visibility based on viewMode */}
				<div
					className={clsx(
						"absolute inset-0 w-full h-full",
						viewMode === "draw" ? "block z-10" : "hidden",
					)}
				>
					{whiteboard}
				</div>
				<div
					className={clsx(
						"absolute inset-0 w-full h-full",
						viewMode === "code" ? "block z-10" : "hidden",
					)}
				>
					{result}
				</div>
			</main>
		);
	}

	return (
		<main className="flex-1 w-full overflow-hidden flex">
			<PanelGroup direction="horizontal">
				<Panel
					defaultSize={50}
					minSize={20}
					order={1}
					className="bg-muted/30 h-full"
				>
					{whiteboard}
				</Panel>
				<PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors cursor-col-resize z-10" />
				<Panel
					defaultSize={50}
					minSize={20}
					order={2}
					className="bg-background h-full"
				>
					{result}
				</Panel>
			</PanelGroup>
		</main>
	);
}
