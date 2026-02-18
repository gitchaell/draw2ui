import { useState, useEffect, useRef, useCallback } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import "@excalidraw/excalidraw/index.css";
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { AppState, ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { useStore } from '@nanostores/react';
import { themeStore } from '../stores/appStore';
import { db } from '../lib/db';
import { Wand2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface WhiteboardWrapperProps {
	projectId: string;
	onGenerate: (elements: readonly ExcalidrawElement[], appState: AppState, files: any) => void;
}

export default function WhiteboardWrapper({ projectId, onGenerate }: WhiteboardWrapperProps) {
	const theme = useStore(themeStore);
	const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
	const [loaded, setLoaded] = useState(false);
    const isSaving = useRef(false);
    const saveTimeout = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		let isMounted = true;
		const loadData = async () => {
			setLoaded(false);
			try {
				const data = await db.getProjectData(projectId);
				if (isMounted && data && excalidrawAPI) {
					excalidrawAPI.updateScene({
						elements: data.elements?.length ? data.elements : undefined,
						appState: data.appState || { viewBackgroundColor: theme === 'dark' ? 'hsl(240 10% 3.9%)' : '#ffffff' },
					});
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
	}, [projectId, excalidrawAPI, theme]);

	const handleChange = useCallback((elements: readonly ExcalidrawElement[], appState: AppState, _files: any) => {
		if (!loaded) return;

		if (saveTimeout.current) {
			clearTimeout(saveTimeout.current);
		}

		saveTimeout.current = setTimeout(async () => {
			isSaving.current = true;
			try {
				await db.updateProjectData(projectId, {
					elements: elements as any[],
					appState: {
                        ...appState,
                        collaborators: []
                    },
				});
			} catch (error) {
				console.error('Failed to save project', error);
			} finally {
				isSaving.current = false;
			}
		}, 1000);
	}, [projectId, loaded]);

	return (
		<div className="w-full h-full relative group" style={{ touchAction: 'none' }}>
			<Excalidraw
				theme={theme}
				initialData={{
					appState: {
						viewBackgroundColor: theme === 'dark' ? 'hsl(240 10% 3.9%)' : '#ffffff',
						currentItemFontFamily: 1,
                        gridSize: 20,
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
                        toggleTheme: false,
                        saveAsImage: true,
                    }
                }}
			/>

            {/* Generate Button Overlay */}
            <div className="absolute top-4 right-4 z-10">
                <Button
                    onClick={() => {
                        if (excalidrawAPI) {
                            const elements = excalidrawAPI.getSceneElements();
                            const appState = excalidrawAPI.getAppState();
                            const files = excalidrawAPI.getFiles();
                            onGenerate(elements, appState, files);
                        }
                    }}
                    className="shadow-lg animate-in fade-in zoom-in duration-300 gap-2 rounded-full"
                >
                    <Wand2 className="h-4 w-4" />
                    Generate UI
                </Button>
            </div>
		</div>
	);
}
