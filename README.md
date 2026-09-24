# [balletcrypto.org](https://balletcrypto.org)
This is [balletcrypto.org](https://balletcrypto.org) source code.
## Getting started
### Prerequisites
1. Git
1. Node: install version 22.
1. Yarn (`npm install yarn -g`).
1. A clone of the `evian` repo.

### Installation
1. `git clone git@github.com:balletcrypto/evian.git`
2. `git submodule init`
3. `git submodule update`
4. `yarn` to install the repository's npm dependencies.
5. `cd src/utils/cryptojs-lib && yarn` to install the crypto library's dependencies.

### Running locally

1.  `yarn start` to start the development server.
1.  `open http://localhost:3000/` to open the site

### building locally
1. `yarn build` to build the file

### Testing
1. `yarn test` runs the unit tests (app and crypto library).
1. `yarn test:e2e` checks `build/index.html` in a headless browser against recorded outputs (run `yarn build` first; `npx playwright install chromium` once).

After you build it you can open `build/index.html` to use it.

You can also download `index.html` in [balletcrypto.github.io](https://github.com/balletcrypto/balletcrypto.github.io)

---
## License

[balletcrypto.org](https://balletcrypto.org) is [Apache-2.0](./LICENSE)

