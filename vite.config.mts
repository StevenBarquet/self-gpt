import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tsconfigPaths(),
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				name: "Self GPT",
				short_name: "SelfGpt",
				description: "Your personal AI assistant, open source and FREE to use.",
				theme_color: "#1e498f",
				icons: [
					{
						src: "/src/assets/192-logo.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/src/assets/512-logo.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
			},
		}),
	],
	resolve: {
		alias: {
			"@node_modules": path.resolve(__dirname, "node_modules"),
			"@src": path.resolve(__dirname, "src"),
		},
	},
	css: {
		modules: {
			// Esta es la configuración clave para personalizar cómo se generan los identificadores locales
			generateScopedName: (name) => {
				return name;
			},
		},
		preprocessorOptions: {
			scss: {
				// Configuración para incluir rutas. Esto es equivalente al `includePaths` en tu configuración de Next.js.
				loadPaths: [path.resolve(__dirname, "src/styles")],
			},
		},
	},
});
