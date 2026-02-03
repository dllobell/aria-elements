import path from 'path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'AriaElements',
      formats: ['es', 'umd'],
      fileName: 'index',
    },
  },
});
