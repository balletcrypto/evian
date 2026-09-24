import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  base: './',
  plugins: [
    // React 16.13 has no react/jsx-runtime.
    react({ jsxRuntime: 'classic' }),
    svgr({
      svgrOptions: { titleProp: true, ref: true, jsxRuntime: 'classic' },
      oxcOptions: { jsx: { runtime: 'classic' } },
    }),
    // The Node built-ins webpack 4 used to polyfill for the crypto libraries.
    // With the Buffer global on, every `buffer` import resolves to the plugin's
    // bundled buffer@6.0.3 shim, so the app has a single Buffer implementation.
    nodePolyfills({
      include: ['buffer', 'crypto', 'stream', 'events', 'util', 'assert', 'process', 'string_decoder', 'vm', 'timers'],
      globals: { Buffer: true, global: true, process: true },
    }),
    // Inline everything so build/index.html runs offline on its own.
    viteSingleFile(),
  ],
  // scryptsy's async API calls the global setImmediate, which webpack 4 used to inject.
  optimizeDeps: {
    rolldownOptions: { transform: { inject: { setImmediate: ['timers', 'setImmediate'] } } },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    assetsInlineLimit: 100000000,
    rolldownOptions: { transform: { inject: { setImmediate: ['timers', 'setImmediate'] } } },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'app',
          environment: 'jsdom',
          globals: true,
          include: ['src/**/*.test.{js,jsx}'],
          exclude: ['src/utils/cryptojs-lib/**', '**/node_modules/**'],
        },
      },
      {
        extends: false,
        test: {
          name: 'cryptojs-lib',
          environment: 'node',
          globals: true,
          testTimeout: 100000,
          include: ['src/utils/cryptojs-lib/test/*_test.js'],
        },
      },
    ],
  },
})
