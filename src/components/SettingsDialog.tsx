import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import ThemeToggle from "./ThemeToggle";

interface SettingsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>Customize your experience.</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 py-4">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Theme</span>
						<ThemeToggle />
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Version</span>
						<span className="text-sm text-muted-foreground">v0.0.1</span>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
