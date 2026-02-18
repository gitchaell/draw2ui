import { exportToBlob } from "@excalidraw/excalidraw";
import { useStore } from "@nanostores/react";
import { useCallback, useState } from "react";
import { db } from "../lib/db";
import {
	currentProjectDataStore,
	currentProjectStore,
	setCurrentProjectData,
	setViewMode,
	viewModeStore,
} from "../stores/appStore";
import GenerateModal from "./GenerateModal";
import MainView from "./MainView";
import ResultPanel from "./ResultPanel"; // Will be created next
import WhiteboardWrapper from "./WhiteboardWrapper";

export default function Editor() {
	const currentProjectId = useStore(currentProjectStore);
	const currentProjectData = useStore(currentProjectDataStore);
	const viewMode = useStore(viewModeStore);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [tempElements, setTempElements] = useState<any[]>([]);
	const [tempAppState, setTempAppState] = useState<any>(null);
	const [tempFiles, setTempFiles] = useState<any>(null);

	const handleGenerateRequest = useCallback((elements: any[], appState: any, files: any) => {
		if (!elements || elements.length === 0) {
			alert("La pizarra está vacía. Dibuja algo primero.");
			return;
		}
		setTempElements(elements);
		setTempAppState(appState);
		setTempFiles(files);
		setIsModalOpen(true);
	}, []);

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
				}
			};
		} catch (error) {
			console.error("Generation failed", error);
			alert("Error al generar la UI. Revisa la consola para más detalles.");
		} finally {
			setLoading(false);
			setIsModalOpen(false);
		}
	};

	if (!currentProjectId) {
		return (
			<div className="flex items-center justify-center h-full text-gray-500">
				Selecciona o crea un proyecto para comenzar.
			</div>
		);
	}

	return (
		<>
			<MainView
				whiteboard={
					<WhiteboardWrapper
						projectId={currentProjectId}
						onGenerate={handleGenerateRequest}
					/>
				}
				result={<ResultPanel />}
			/>

			<GenerateModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onConfirm={handleGenerateConfirm}
				loading={loading}
			/>
		</>
	);
}
