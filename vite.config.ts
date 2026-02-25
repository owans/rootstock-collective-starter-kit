import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createRequire } from "node:module";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

const require = createRequire(import.meta.url);
const collectiveSdkInstalled = (() => {
  try {
    require.resolve("@rsksmart/collective-sdk");
    return true;
  } catch {
    return false;
  }
})();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      external: collectiveSdkInstalled ? [] : ["@rsksmart/collective-sdk"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      ...(collectiveSdkInstalled
        ? {}
        : { "@rsksmart/collective-sdk": path.resolve(__dirname, "src/lib/collectiveSdkPlaceholder.ts") }),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [NodeGlobalsPolyfillPlugin({ process: true, buffer: true })],
    },
  },
});
