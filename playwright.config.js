// Golden browser check: loads build/index.html over file://, like an offline user.
const { defineConfig, devices } = require('@playwright/test')

module.exports = defineConfig({
  testDir: 'e2e',
  timeout: 180000,
  fullyParallel: false,
  workers: 1,
  snapshotPathTemplate: '{testDir}/golden/{arg}{ext}',
  use: { ...devices['Desktop Chrome'] },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
