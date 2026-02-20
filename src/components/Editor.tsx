import { useStore } from "@nanostores/react";
import {
	currentProjectStore,
	currentProjectDataStore,
	setCurrentProjectData,
	setIsGenerating,
	isGeneratingStore,
	setViewMode,
} from "../stores/appStore";
import { checkDailyLimit, incrementUsage } from "../lib/credits";
import { db } from "../lib/db";
import WhiteboardWrapper, { type WhiteboardWrapperRef } from "./WhiteboardWrapper";
import GenerateModal from "./GenerateModal";
import MainView from "./MainView";
import ResultPanel from "./ResultPanel";
import BottomBar from "./BottomBar";
import { exportToBlob } from "@excalidraw/excalidraw";
import { useState, useCallback, useRef } from "react";
import { toast, Toaster } from "sonner";
import { Loader2 } from "lucide-react";

export default function Editor() {
	const currentProjectId = useStore(currentProjectStore);
	const _currentProjectData = useStore(currentProjectDataStore);
	const isGenerating = useStore(isGeneratingStore);

	const whiteboardRef = useRef<WhiteboardWrapperRef>(null);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [tempElements, setTempElements] = useState<any[]>([]);
	const [tempAppState, setTempAppState] = useState<any>(null);
	const [tempFiles, setTempFiles] = useState<any>(null);

	const handleGenerateRequest = useCallback((elements: any[], appState: any, files: any) => {
		if (!elements || elements.length === 0) {
			toast.error("The whiteboard is empty. Draw something first.");
			return;
		}
		setTempElements(elements);
		setTempAppState(appState);
		setTempFiles(files);
		setIsModalOpen(true);
	}, []);

	const handleGenerateTrigger = () => {
		if (whiteboardRef.current) {
			const snapshot = whiteboardRef.current.getSnapshot();
			if (snapshot) {
				handleGenerateRequest(snapshot.elements, snapshot.appState, snapshot.files);
			}
		}
	};

	const handleGenerateConfirm = async (prompt: string) => {
		if (!currentProjectId) return;

		const { allowed, remaining } = checkDailyLimit();
		if (!allowed) {
			toast.error("Daily limit reached", {
				description: "You have used all 3 free generations for today. Come back tomorrow!",
			});
			return;
		}

		setLoading(true);
		setIsGenerating(true);
		setIsModalOpen(false); // Close modal immediately to show full screen loader

		try {
			// 1. Export to Blob/Image
			const blob = await exportToBlob({
				elements: tempElements,
				appState: tempAppState,
				files: tempFiles,
				mimeType: "image/png",
				quality: 1,
			});

			// 2. Convert to Base64
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = async () => {
				const base64data = reader.result as string;

				// 3. Call API
				const response = await fetch("/api/generate", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						image: base64data,
						prompt,
						theme: localStorage.getItem("theme") || "dark",
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Failed to generate");
				}

				// 4. Save Result
				const html = data.html;
				if (html) {
					// Increment usage only on success
					incrementUsage();

					await db.updateProjectData(currentProjectId, {
						generatedHtml: html,
					});

					// Update store
					const freshData = await db.getProjectData(currentProjectId);
					if (freshData) setCurrentProjectData(freshData);

					// Switch to Result view (or Split)
					if (window.innerWidth < 768) {
						setViewMode("code");
					} else {
						setViewMode("split");
					}
					toast.success(`Interface generated! You have ${remaining - 1} credits left today.`);
				}
			};
		} catch (error) {
			console.error("Generation failed", error);
			toast.error("Error generating UI.");
		} finally {
			setLoading(false);
			setIsGenerating(false);
			// setIsModalOpen(false); // Already closed
		}
	};

	if (!currentProjectId) {
		return (
			<>
				<div className="flex flex-1 items-center justify-center h-full text-muted-foreground">
					Select or create a project to start.
				</div>
				<BottomBar onGenerate={handleGenerateTrigger} />
			</>
		);
	}

	return (
		<>
			<MainView
				whiteboard={
					<WhiteboardWrapper
						ref={whiteboardRef}
						projectId={currentProjectId}
						onGenerate={handleGenerateRequest}
					/>
				}
				result={<ResultPanel />}
			/>

			<BottomBar onGenerate={handleGenerateTrigger} />

			<GenerateModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onConfirm={handleGenerateConfirm}
				loading={loading}
			/>

			{/* Full Screen Loader */}
			{isGenerating && (
				<div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
					<div className="bg-card p-8 rounded-xl shadow-2xl border flex flex-col items-center gap-6 max-w-sm text-center">
						<div className="relative">
							<div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
							<Loader2 className="h-16 w-16 animate-spin text-primary relative z-10" />
						</div>
						<div className="space-y-2">
							<h3 className="text-xl font-bold">Generating UI...</h3>
							<p className="text-muted-foreground text-sm">
								Our AI is crafting your interface with pixel-perfect precision. This may take a moment.
							</p>
						</div>
					</div>
				</div>
			)}

			<Toaster position="top-center" />
		</>
	);
}
