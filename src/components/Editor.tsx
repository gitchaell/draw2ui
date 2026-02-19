import { useStore } from "@nanostores/react";
import {
	currentProjectStore,
	currentProjectDataStore,
	setCurrentProjectData,
	viewModeStore,
	setViewMode,
} from "../stores/appStore";
import { db } from "../lib/db";
import WhiteboardWrapper, { type WhiteboardWrapperRef } from "./WhiteboardWrapper";
import GenerateModal from "./GenerateModal";
import MainView from "./MainView";
import ResultPanel from "./ResultPanel";
import BottomBar from "./BottomBar";
import { exportToBlob } from "@excalidraw/excalidraw";
import { useState, useCallback, useRef } from "react";
import { toast, Toaster } from "sonner";

export default function Editor() {
	const currentProjectId = useStore(currentProjectStore);
	const currentProjectData = useStore(currentProjectDataStore);
	const viewMode = useStore(viewModeStore);

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

		setLoading(true);
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
					toast.success("Interface generated successfully");
				}
			};
		} catch (error) {
			console.error("Generation failed", error);
			toast.error("Error generating UI.");
		} finally {
			setLoading(false);
			setIsModalOpen(false);
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
			<Toaster position="top-center" />
		</>
	);
}
