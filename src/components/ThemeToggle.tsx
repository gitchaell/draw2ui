import { useStore } from "@nanostores/react";
import { themeStore, setTheme } from "../stores/appStore";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
	const theme = useStore(themeStore);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		// Sync with localStorage on mount
		const savedTheme = localStorage.getItem("theme") as "light" | "dark";
		if (savedTheme) {
			setTheme(savedTheme);
		}
	}, []);

	useEffect(() => {
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
		localStorage.setItem("theme", theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	if (!mounted) return <div className="w-9 h-9" />;

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={toggleTheme}
			className="h-9 w-9 relative"
			title="Toggle theme"
		>
			<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
