import { useStore } from "@nanostores/react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { settingsStore } from "../stores/appStore";
import { formatCurrency } from "../lib/formatters";
import ThemeToggle from "./ThemeToggle";

interface SettingsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
	const settings = useStore(settingsStore);

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
						<span className="text-sm font-medium">Credits</span>
						<span className="text-sm text-muted-foreground">
							{formatCurrency(settings.credits)}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Version</span>
						<span className="text-sm text-muted-foreground">v0.0.2</span>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
