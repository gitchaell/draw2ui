const DAILY_LIMIT = 3;
const STORAGE_KEY_PREFIX = "ui_gen_usage_";

export function checkDailyLimit(): { allowed: boolean; remaining: number } {
	// Ensure we are in a browser environment
	if (typeof window === "undefined") {
		return { allowed: true, remaining: DAILY_LIMIT };
	}

	const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
	const key = `${STORAGE_KEY_PREFIX}${today}`;
	const currentUsage = Number(localStorage.getItem(key) || 0);

	return {
		allowed: currentUsage < DAILY_LIMIT,
		remaining: Math.max(0, DAILY_LIMIT - currentUsage),
	};
}

export function incrementUsage(): void {
	if (typeof window === "undefined") return;

	const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
	const key = `${STORAGE_KEY_PREFIX}${today}`;
	const currentUsage = Number(localStorage.getItem(key) || 0);
	localStorage.setItem(key, String(currentUsage + 1));
}
