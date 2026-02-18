import { useState } from 'react';
import clsx from 'clsx';

interface GenerateModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (prompt: string) => void;
	loading: boolean;
}

export default function GenerateModal({ isOpen, onClose, onConfirm, loading }: GenerateModalProps) {
	const [prompt, setPrompt] = useState('');

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
			<div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-zinc-800">
				<h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Generar Interfaz</h2>

				<p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
					Describe lo que quieres obtener o añade detalles extra a tu dibujo.
				</p>

				<textarea
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					placeholder="Ej: Un dashboard moderno con tarjetas de estadísticas, usa colores azules y grises..."
					className="w-full h-32 p-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none mb-4"
				/>

				<div className="flex justify-end gap-3">
					<button
						onClick={onClose}
						disabled={loading}
						className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
					>
						Cancelar
					</button>
					<button
						onClick={() => onConfirm(prompt)}
						disabled={loading}
						className={clsx(
							"px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2",
							loading && "opacity-75 cursor-not-allowed"
						)}
					>
						{loading ? (
							<>
								<svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Generando...
							</>
						) : (
							<>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                </svg>
								Generar
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
