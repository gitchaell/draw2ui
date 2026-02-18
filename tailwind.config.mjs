/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				sans: ['Google Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				mono: ['Google Sans Code', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'monospace'],
			},
			colors: {
				// Define custom colors if needed, but Tailwind's default palette is usually sufficient.
				// We can add semantic colors here later.
			}
		},
	},
	plugins: [],
}
