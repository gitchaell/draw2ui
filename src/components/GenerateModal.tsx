import clsx from "clsx";
import { Loader2, Wand2, X } from "lucide-react";
import { useState } from "react";

interface GenerateModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (prompt: string) => void;
	loading: boolean;
}

export default function GenerateModal({ isOpen, onClose, onConfirm, loading }: GenerateModalProps) {
	const [prompt, setPrompt] = useState("");

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
			<div className="relative z-50 grid w-full max-w-lg gap-4 border border-border bg-background p-6 shadow-lg sm:rounded-lg animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] duration-200">
				<div className="flex flex-col space-y-1.5 text-center sm:text-left">
					<h2 className="text-lg font-semibold leading-none tracking-tight">
						Generar Interfaz
					</h2>
					<p className="text-sm text-muted-foreground">
						Describe lo que quieres obtener o añade detalles extra a tu dibujo.
					</p>
				</div>

				<button
					onClick={onClose}
					className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
				>
					<X className="h-4 w-4" />
					<span className="sr-only">Close</span>
				</button>

				<textarea
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					placeholder="Ej: Un dashboard moderno con tarjetas de estadísticas, usa colores azules y grises..."
					className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
				/>

				<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
					<button
						onClick={onClose}
						disabled={loading}
						className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 mt-2 sm:mt-0"
					>
						Cancelar
					</button>
					<button
						onClick={() => onConfirm(prompt)}
						disabled={loading}
						className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
					>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Generando...
							</>
						) : (
							<>
								<Wand2 className="mr-2 h-4 w-4" />
								Generar
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
