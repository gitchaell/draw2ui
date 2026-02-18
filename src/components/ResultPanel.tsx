import { useState, useRef, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { currentProjectDataStore } from '../stores/appStore';
import { toPng, toSvg } from 'html-to-image';
import clsx from 'clsx';

const COLORS = [
    { name: 'Indigo', value: 'indigo' },
    { name: 'Blue', value: 'blue' },
    { name: 'Red', value: 'red' },
    { name: 'Green', value: 'green' },
    { name: 'Orange', value: 'orange' },
    { name: 'Purple', value: 'purple' },
    { name: 'Pink', value: 'pink' },
    { name: 'Gray', value: 'gray' },
];

const FONTS = [
    { name: 'Sans', value: 'font-sans' },
    { name: 'Serif', value: 'font-serif' },
    { name: 'Mono', value: 'font-mono' },
];

export default function ResultPanel() {
    const projectData = useStore(currentProjectDataStore);
    const [html, setHtml] = useState('');
    const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('dark');
    const [selectedColor, setSelectedColor] = useState('indigo');
    const [selectedFont, setSelectedFont] = useState('font-sans');
    const previewRef = useRef<HTMLDivElement>(null);

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

        // Replace colors
        if (selectedColor !== 'indigo') {
            // Simple regex replacement for standard tailwind colors
            // Replacing 'indigo-' with 'selectedColor-'
            processed = processed.replace(/indigo-/g, `${selectedColor}-`);
        }

        // Replace fonts
        // Assuming the AI generated 'font-sans'. If we want to force a font:
        // We can wrap the container in the font class, but if the HTML has explicit font classes, we might need to replace.
        // The prompt asked to use 'font-sans'.
        if (selectedFont !== 'font-sans') {
             processed = processed.replace(/font-sans/g, selectedFont);
        }

        return processed;
    };

    const handleCopyHtml = () => {
        navigator.clipboard.writeText(getProcessedHtml());
        alert('HTML copiado al portapapeles');
    };

    const handleDownloadImage = async (format: 'png' | 'svg') => {
        if (!previewRef.current) return;
        try {
            const dataUrl = format === 'png'
                ? await toPng(previewRef.current, { cacheBust: true })
                : await toSvg(previewRef.current, { cacheBust: true });

            const link = document.createElement('a');
            link.download = `ui-design.${format}`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to download image', err);
        }
    };

    if (!projectData || !projectData.generatedHtml) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-black p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
                <p className="text-lg font-medium">No hay código generado aún</p>
                <p className="text-sm mt-2 max-w-xs">
                    Dibuja en la pizarra y presiona "Generar UI" para ver el resultado aquí.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-zinc-800 overflow-x-auto gap-4">
                <div className="flex items-center gap-2">
                    {/* Color Picker */}
                    <div className="flex items-center gap-1">
                        {COLORS.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => setSelectedColor(color.value)}
                                className={clsx(
                                    "w-5 h-5 rounded-full border border-gray-200 dark:border-zinc-700 transition-transform",
                                    selectedColor === color.value ? "scale-125 ring-2 ring-offset-1 ring-offset-white dark:ring-offset-black ring-gray-400" : "hover:scale-110"
                                )}
                                style={{ backgroundColor: `var(--color-${color.value}-500, ${getColorHex(color.value)})` }}
                                title={color.name}
                            />
                        ))}
                    </div>

                    <div className="w-px h-6 bg-gray-200 dark:bg-zinc-800 mx-2" />

                    {/* Font Picker */}
                    <select
                        value={selectedFont}
                        onChange={(e) => setSelectedFont(e.target.value)}
                        className="text-xs p-1 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300"
                    >
                        {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                    </select>

                    <div className="w-px h-6 bg-gray-200 dark:bg-zinc-800 mx-2" />

                    {/* Theme Toggle for Preview */}
                    <button
                        onClick={() => setPreviewMode(previewMode === 'dark' ? 'light' : 'dark')}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500"
                        title="Alternar tema de vista previa"
                    >
                        {previewMode === 'dark' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                            </svg>
                        ) : (
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                            </svg>
                        )}
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopyHtml}
                        className="p-1.5 text-xs font-medium bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded text-gray-700 dark:text-gray-300 transition-colors"
                        title="Copiar HTML"
                    >
                        Copiar HTML
                    </button>
                    <button
                         onClick={() => handleDownloadImage('png')}
                         className="p-1.5 text-xs font-medium bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded text-gray-700 dark:text-gray-300 transition-colors"
                         title="Descargar Imagen"
                    >
                        PNG
                    </button>
                     <button
                         onClick={() => handleDownloadImage('svg')}
                         className="p-1.5 text-xs font-medium bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded text-gray-700 dark:text-gray-300 transition-colors"
                         title="Descargar SVG (Figma)"
                    >
                        SVG
                    </button>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-auto bg-gray-50 dark:bg-black/50 p-4 flex items-center justify-center">
                 {/* Container mimicking a browser window or device */}
                <div
                    ref={previewRef}
                    className={clsx(
                        "w-full max-w-4xl min-h-[500px] rounded-xl shadow-2xl overflow-hidden transition-all duration-300",
                        previewMode === 'dark' ? 'dark bg-zinc-950' : 'bg-white'
                    )}
                >
                    <div className="w-full h-full p-6 text-left" dangerouslySetInnerHTML={{ __html: getProcessedHtml() }} />
                </div>
            </div>
        </div>
    );
}

// Helper for color dots (approximation of tailwind 500 shades)
function getColorHex(color: string) {
    const map: Record<string, string> = {
        indigo: '#6366f1',
        blue: '#3b82f6',
        red: '#ef4444',
        green: '#22c55e',
        orange: '#f97316',
        purple: '#a855f7',
        pink: '#ec4899',
        gray: '#6b7280',
    };
    return map[color] || '#6366f1';
}
