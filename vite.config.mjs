import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { viteSingleFile } from 'vite-plugin-singlefile'

// The polyfill plugin's buffer shim ships ESM and CJS builds; its exports map hands
// require('buffer') the CJS one. Pin every buffer import to the ESM build so the
// bundle has a single Buffer class.
const bufferShim = fileURLToPath(
  new URL('./node_modules/vite-plugin-node-polyfills/shims/buffer/dist/index.js', import.meta.url),
)
const singleBuffer = {
  name: 'single-buffer',
  enforce: 'pre',
  resolveId(id) {
    if (/^(node:)?buffer\/?$|^vite-plugin-node-polyfills\/shims\/buffer\/?$/.test(id)) return bufferShim
  },
}

export default defineConfig({
  base: './',
  plugins: [
    singleBuffer,
    // React 16.13 has no react/jsx-runtime.
    react({ jsxRuntime: 'classic' }),
    svgr({
      svgrOptions: { titleProp: true, ref: true, jsxRuntime: 'classic' },
      oxcOptions: { jsx: { runtime: 'classic' } },
    }),
    // The Node built-ins webpack 4 used to polyfill for the crypto libraries.
    nodePolyfills({
      include: ['buffer', 'crypto', 'stream', 'events', 'util', 'assert', 'process', 'string_decoder', 'vm', 'timers'],
      globals: { Buffer: true, global: true, process: true },
    }),
    // Inline everything so build/index.html runs offline on its own.
    viteSingleFile(),
  ],
  // scryptsy's async API calls the global setImmediate, which webpack 4 used to inject.
  optimizeDeps: {
    rolldownOptions: {
      plugins: [singleBuffer],
      transform: { inject: { setImmediate: ['timers', 'setImmediate'] } },
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
    // Oldest browsers that run <script type="module">; cold-storage users may be on
    // old offline machines. The golden check parses the bundle as ES2017.
    target: ['es2017', 'chrome61', 'safari11', 'firefox60', 'edge79'],
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
