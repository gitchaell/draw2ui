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
					<DialogTitle>Generate Interface</DialogTitle>
					<DialogDescription>
						Describe what you want to generate or add extra details to your drawing.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<Textarea
						placeholder="Ex: A modern dashboard with statistic cards, use blue and gray colors..."
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						className="min-h-[120px]"
					/>
				</div>
				<DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
					<Button onClick={() => onConfirm(prompt)} disabled={loading} className="gap-2">
						{loading ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Generating...
							</>
						) : (
							<>
                                <Wand2 className="h-4 w-4" />
								Generate
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
