import { useState } from 'react';
import { Loader2, Wand2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface GenerateModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (prompt: string) => void;
	loading: boolean;
}

export default function GenerateModal({ isOpen, onClose, onConfirm, loading }: GenerateModalProps) {
	const [prompt, setPrompt] = useState('');

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Generar Interfaz</DialogTitle>
					<DialogDescription>
						Describe lo que quieres obtener o añade detalles extra a tu dibujo.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<Textarea
						placeholder="Ej: Un dashboard moderno con tarjetas de estadísticas, usa colores azules y grises..."
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						className="min-h-[120px]"
					/>
				</div>
				<DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
					<Button onClick={() => onConfirm(prompt)} disabled={loading} className="gap-2">
						{loading ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Generando...
							</>
						) : (
							<>
                                <Wand2 className="h-4 w-4" />
								Generar
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
