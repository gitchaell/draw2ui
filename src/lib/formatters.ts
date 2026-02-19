export const getLocale = (): string => {
	if (typeof navigator !== "undefined" && navigator.language) {
		return navigator.language;
	}
	return "en-US";
};

export const formatDate = (
	date: number | Date,
	style: "short" | "full" = "short",
): string => {
	const options: Intl.DateTimeFormatOptions = {
		month: style === "short" ? "short" : "long",
		day: "numeric",
		year: "numeric",
	};
	return new Intl.DateTimeFormat(getLocale(), options).format(date);
};

export const formatCurrency = (amount: number, currency = "USD"): string => {
	return new Intl.NumberFormat(getLocale(), {
		style: "currency",
		currency,
	}).format(amount);
};

export const formatTime = (date: number | Date): string => {
	return new Intl.DateTimeFormat(getLocale(), {
		hour: "numeric",
		minute: "numeric",
	}).format(date);
};
