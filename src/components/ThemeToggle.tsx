import { useStore } from "@nanostores/react";
import clsx from "clsx";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { setTheme, themeStore } from "../stores/appStore";

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
		<button
			onClick={toggleTheme}
			className={clsx(
				"inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
				"border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
				"h-9 w-9",
			)}
			aria-label="Toggle theme"
		>
			{theme === "dark" ? (
				<Sun className="h-4 w-4 transition-all" />
			) : (
				<Moon className="h-4 w-4 transition-all" />
			)}
		</button>
	);
}
