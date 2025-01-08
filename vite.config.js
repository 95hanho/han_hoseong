import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

export default defineConfig({
	// publicDir: false,
	plugins: [svelte()],
	// server: {
	//     proxy: {
	//         "/v1": {
	//             target: "http://ds-api.exc.co.kr/",
	//             changeOrigin: true,
	//         },
	//     },
	// },
	resolve: {
		// dev서버 설정
		// 디렉토리 alias설정
		alias: {
			"~": path.resolve(__dirname, "./src"),
			// "~components": path.resolve(__dirname, "./src/components"),
			// "~compositions": path.resolve(__dirname, "./src/compositions"),
			"~assets": path.resolve(__dirname, "./src/assets"),
			// "~views": path.resolve(__dirname, "./src/views"),
		},
	},
	// 테스트용 빌드 START
	build: {
		// outDir: "../frontend",
		// assetsDir: "",
		// copyPublicDir: "./frontend/assets",
		// outDir: "frontTest",
	},
	// base: "/frontTest/",
	// 테스트용 빌드 END
});
