import { useState, useEffect, useRef, useCallback } from 'react';
import { Excalidraw, convertToExcalidrawElements } from '@excalidraw/excalidraw';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { AppState, ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { useStore } from '@nanostores/react';
import { themeStore } from '../stores/appStore';
import { db } from '../lib/db';
import clsx from 'clsx';

interface WhiteboardWrapperProps {
	projectId: string;
	onGenerate: (elements: readonly ExcalidrawElement[], appState: AppState, files: any) => void;
}

export default function WhiteboardWrapper({ projectId, onGenerate }: WhiteboardWrapperProps) {
	const theme = useStore(themeStore);
	const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
	const [loaded, setLoaded] = useState(false);
    // Use a ref to track if we're currently saving to avoid race conditions or loops
    const isSaving = useRef(false);
    const saveTimeout = useRef<NodeJS.Timeout | null>(null);

	// Load initial data
	useEffect(() => {
		let isMounted = true;
		const loadData = async () => {
			setLoaded(false);
			try {
				const data = await db.getProjectData(projectId);
				if (isMounted && data && excalidrawAPI) {
					excalidrawAPI.updateScene({
						elements: data.elements?.length ? data.elements : undefined,
						appState: data.appState || { viewBackgroundColor: theme === 'dark' ? '#18181b' : '#ffffff' }, // Default bg
					});
                    // If no elements, maybe add a welcome text?
                    if (!data.elements || data.elements.length === 0) {
                        // Optional: Add welcome text
                    }
				}
			} catch (error) {
				console.error('Failed to load project data', error);
			} finally {
				if (isMounted) setLoaded(true);
			}
		};

		if (excalidrawAPI) {
			loadData();
		}

		return () => {
			isMounted = false;
		};
	}, [projectId, excalidrawAPI]); // Reload when projectId changes

	const handleChange = useCallback((elements: readonly ExcalidrawElement[], appState: AppState, files: any) => {
		if (!loaded) return;

		// Debounce save
		if (saveTimeout.current) {
			clearTimeout(saveTimeout.current);
		}

		saveTimeout.current = setTimeout(async () => {
			isSaving.current = true;
			try {
				await db.updateProjectData(projectId, {
					elements: elements as any[], // Casting to any to avoid strict type checks on indexedDB storage
					appState: {
                        ...appState,
                        collaborators: [] // Don't save collaborators
                    },
				});
			} catch (error) {
				console.error('Failed to save project', error);
			} finally {
				isSaving.current = false;
			}
		}, 1000); // 1 second debounce
	}, [projectId, loaded]);

	return (
		<div className="w-full h-full relative">
			<Excalidraw
				theme={theme}
				initialData={{
					appState: {
						viewBackgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
						currentItemFontFamily: 1, // Excalidraw font
					},
				}}
				excalidrawAPI={(api) => setExcalidrawAPI(api)}
				onChange={handleChange}
                UIOptions={{
                    canvasActions: {
                        changeViewBackgroundColor: true,
                        clearCanvas: true,
                        export: { saveFileToDisk: true },
                        loadScene: true,
                        saveToActiveFile: false,
                        toggleTheme: false, // We handle theme globally
                        saveAsImage: true,
                    }
                }}
			/>

            {/* Generate Button Overlay */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={() => {
                        if (excalidrawAPI) {
                            const elements = excalidrawAPI.getSceneElements();
                            const appState = excalidrawAPI.getAppState();
                            const files = excalidrawAPI.getFiles();
                            onGenerate(elements, appState, files);
                        }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg transition-all transform hover:scale-105 font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                    Generar UI
                </button>
            </div>
		</div>
	);
}
