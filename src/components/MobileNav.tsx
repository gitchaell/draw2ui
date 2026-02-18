import { useStore } from '@nanostores/react';
import { viewModeStore, setViewMode } from '../stores/appStore';
import clsx from 'clsx';

export default function MobileNav() {
	const viewMode = useStore(viewModeStore);

	return (
		<div className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 md:hidden flex justify-around p-2 pb-safe">
			<button
				onClick={() => setViewMode('draw')}
				className={clsx(
					"flex flex-col items-center gap-1 p-2 rounded-lg flex-1",
					viewMode === 'draw' ? "text-indigo-600 dark:text-indigo-400 bg-gray-100 dark:bg-zinc-800" : "text-gray-500 dark:text-gray-400"
				)}
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
					<path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
				</svg>
				<span className="text-xs font-medium">Pizarra</span>
			</button>
			<button
				onClick={() => setViewMode('code')}
				className={clsx(
					"flex flex-col items-center gap-1 p-2 rounded-lg flex-1",
					viewMode === 'code' ? "text-indigo-600 dark:text-indigo-400 bg-gray-100 dark:bg-zinc-800" : "text-gray-500 dark:text-gray-400"
				)}
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
					<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
				</svg>
				<span className="text-xs font-medium">Código</span>
			</button>
		</div>
	);
}
