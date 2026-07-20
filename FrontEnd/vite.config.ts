import { defineConfig } from "vite";
import { TanStackStartVite } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    TanStackStartVite({ server: { entry: "server" } }),
    viteReact(),
    tailwindcss()
  ],
});
