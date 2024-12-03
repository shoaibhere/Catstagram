import { defineConfig } from "vite"; // Import defineConfig
import react from "@vitejs/plugin-react"; // Import the react plugin
import path from "path"; // Import path module if it's not already imported

export default defineConfig({
  plugins: [react()], // Use the react plugin
  server: {
    port: 5173, // Set your custom server port
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Set up alias for your src folder
    },
  },
  optimizeDeps: {
    include: [
      "@chakra-ui/react",
      "@emotion/react",
      "@emotion/styled",
      "framer-motion",
    ], // Optimize Chakra UI and related dependencies
  },
});
