# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Security

Security is very important for this project, as it's related to the private key of Ballet Wallets.

## Commands

```bash
# Install dependencies
yarn

# Run development server (http://localhost:3000/)
yarn start

# Build for production (outputs to build/index.html as a self-contained file)
yarn build

# Run unit tests (app + cryptojs-lib, via Vitest)
yarn test

# Run only the crypto library tests
yarn test --project cryptojs-lib

# Run a single test file
yarn test src/utils/cryptojs-lib/test/address_test.js

# Golden browser check against build/index.html (run yarn build first)
yarn test:e2e
```

## Architecture

This is a React 16 single-page application built with Vite 8 for [balletcrypto.org](https://balletcrypto.org) — a BIP38 cold storage verify/decrypt tool. The build produces a single self-contained `index.html` (JS, CSS, fonts and images inlined by `vite-plugin-singlefile`) so it can be run fully offline. Node built-ins needed by the crypto libraries are polyfilled explicitly in `vite.config.mjs` (one `Buffer` implementation; `setImmediate` injected for scryptsy).

### Golden check (`e2e/`)

`e2e/golden/` holds reference outputs for the cryptojs-lib test vectors, recorded from a known-good build. Any dependency or build change must pass `yarn test:e2e` without `--update-snapshots`.

### Routing (`src/router.jsx`)

Uses `HashRouter` with four routes:
- `/` → `App` — BIP38 verify & decrypt main page
- `/bip38-intermediate-code` → `IntermediateGenerate` — generate BIP38 intermediate codes
- `/qrscan` → `Qrscan` — QR code scanner page
- `/claim-spark` → `ClaimSpark` — Spark claim page

The router also handles an online/offline network warning banner (polls `navigator.onLine` every second).

### Crypto Library (`src/utils/cryptojs-lib/`)

This is a **git submodule** with its own `package.json` and test suite (Mocha/Chai; the root `yarn test` runs it through Vitest). It contains all cryptographic logic:

- **`src/bip38.js`** — BIP38 encrypt/decrypt (`decryptEpkVcode`)
- **`src/confirmation.js`** — BIP38 confirmation code validation (`validateConfirmation`)
- **`src/Intermediate.js`** — BIP38 intermediate code generation (`genIntermediate`)
- **`src/CryptoAddress.js`** — Derives addresses for 20+ cryptocurrencies from a compressed public key hex string
- **`src/wif.js`** — WIF private key encoding for Litecoin, Dash, Doge, Ravencoin, Zcash
- **`src/btc/`** — Bitcoin-specific address and signing utilities

After cloning, run `git submodule init && git submodule update` to populate this directory.

### Key Data Flow in `App.jsx`

1. User enters passphrase (either Ballet cold storage format — 20 character segmented input — or generic BIP38 passphrase)
2. User enters either a BIP38 confirmation code (`cfrm38...`, 75 chars) or encrypted private key (EPK, starts `6P`, 58 chars)
3. **Verify path**: `validateConfirmation(confirmationCode, passphrase)` → returns `publicKeyHex` → all coin addresses derived
4. **Decrypt path**: `decryptEpkVcode(epk, passphrase)` → returns `publicKeyHex`, `privateKeyHex`, `wif` → all addresses and WIF/hex private keys derived

Address derivation for all supported currencies is driven by the `outputAddressWIFList` array in `App.jsx`, which maps each coin to its `getAddressMethod` from `CryptoAddress.js`.

### Styling

Uses Bulma CSS framework + SCSS. Each major component has a co-located `.scss` file.
