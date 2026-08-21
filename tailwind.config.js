/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "#198754",
					50: "#e6f4ec",
					100: "#c3e6d3",
					200: "#9cd7ba",
					300: "#72c79e",
					400: "#4db986",
					500: "#198754",
					600: "#157347",
					700: "#115c3a",
					800: "#0d452c",
					900: "#092e1e",
				},
				secondary: {
					DEFAULT: "#0d1b2a",
					50: "#f0f4f8",
					100: "#d9e2ec",
					200: "#bcccdc",
					300: "#9bb0c9",
					400: "#7892b1",
					500: "#0d1b2a",
					600: "#0b1622",
					700: "#08111a",
					800: "#060c12",
					900: "#04070a",
				},
			},
			fontFamily: {
				sans: ["var(--font-inter)", "system-ui", "sans-serif"],
				bebas: ["var(--font-bebas)", "sans-serif"],
			},
		},
	},
	plugins: [],
};
