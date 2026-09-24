// Golden check: the built index.html must produce exactly the recorded outputs.
// Record from a known-good build with: yarn test:e2e --update-snapshots
const fs = require('fs')
const path = require('path')
const { test, expect } = require('@playwright/test')
const VECTORS = require('./vectors')

const BUILD_HTML = path.resolve(__dirname, '../build/index.html')
const INDEX = 'file://' + BUILD_HTML

async function openPage(page, route) {
  const consoleErrors = []
  const requests = []
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()) })
  page.on('pageerror', e => consoleErrors.push(String(e)))
  page.on('request', r => {
    const u = r.url()
    if (!/^(file|data|blob):/.test(u)) requests.push(u)
  })
  page.on('dialog', d => d.dismiss())
  await page.goto(INDEX + route)
  return { consoleErrors, requests }
}

async function enterPassphrase(page, v) {
  if (v.ballet) {
    const chars = v.passphrase.replace(/-/g, '').split('')
    for (let i = 0; i < chars.length; i++) {
      await page.locator('.passphrase__real .inputItem').nth(i).fill(chars[i])
    }
  } else {
    await page.locator('.switchbutton').click()
    await page.getByPlaceholder('Enter the cold storage passphrase').fill(v.passphrase)
  }
}

function snap(obj) {
  return JSON.stringify(obj, null, 2) + '\n'
}

for (const v of VECTORS) {
  test(`vector ${v.name}`, async ({ page }) => {
    const guard = await openPage(page, '#/')
    await enterPassphrase(page, v)
    if (v.kind === 'epk') {
      await page.getByPlaceholder(/BIP38 encrypted private key/).fill(v.code)
      await page.locator('a.button', { hasText: /^Decrypt$/ }).click()
    } else {
      await page.getByPlaceholder(/BIP38 confirmation code/).fill(v.code)
      await page.locator('a.button', { hasText: /^Verify$/ }).click()
    }
    await page.locator('.display__success, .display__failed').first().waitFor({ timeout: 150000 })

    const result = await page.evaluate(() => ({
      status: document.querySelector('.display__success') ? 'success' : 'failed',
      message: (document.querySelector('.display__resulttext') || {}).textContent || '',
      outputs: [...document.querySelectorAll('.outputComponent')]
        .filter(el => el.offsetParent !== null)
        .map(el => [el.querySelector('.outputTitle').textContent, el.querySelector('input').value]),
    }))

    expect(result.status).toBe(v.status)
    const values = result.outputs.map(o => o[1])
    for (const expected of v.mustContain) expect(values).toContain(expected)
    if (v.status === 'success') expect(values.filter(Boolean).length).toBeGreaterThan(10)
    expect(guard.requests).toEqual([])
    expect(snap({ ...result, consoleErrors: guard.consoleErrors })).toMatchSnapshot(`${v.name}.json`)
  })
}

test('intermediate code page generates a well-formed code offline', async ({ page }) => {
  const guard = await openPage(page, '#/bip38-intermediate-code')
  await page.getByPlaceholder('Please enter the passphrase').fill('golden-test-passphrase')
  await page.getByPlaceholder('Re-enter the passphrase').fill('golden-test-passphrase')
  await page.locator('a.button', { hasText: 'Generate Intermediate Code' }).click()
  await expect(page.locator('.intermediateCode textarea')).toHaveValue(
    /^passphrase[1-9A-HJ-NP-Za-km-z]{62}$/,
    { timeout: 150000 },
  )
  expect(guard.requests).toEqual([])
  expect(snap({ consoleErrors: guard.consoleErrors })).toMatchSnapshot('intermediate.json')
})

for (const [name, route, selector] of [
  ['route-claim-spark', '#/claim-spark', '.claimSpark'],
  ['route-qrscan', '#/qrscan', '#root *'],
]) {
  test(`${name} renders`, async ({ page }) => {
    const guard = await openPage(page, route)
    await page.locator(selector).first().waitFor()
    await page.waitForTimeout(1000)
    expect(snap({ consoleErrors: guard.consoleErrors, requests: guard.requests })).toMatchSnapshot(`${name}.json`)
  })
}

test('build/index.html external URLs are unchanged', () => {
  const html = fs.readFileSync(BUILD_HTML, 'utf8')
  const urls = [...new Set(html.match(/https?:\/\/[^\s"'`)<>\\]+/g) || [])].sort()
  expect(snap(urls)).toMatchSnapshot('external-urls.json')
})

test('build/index.html is self-contained', () => {
  const html = fs.readFileSync(BUILD_HTML, 'utf8')
  expect(html).not.toContain('static/media')
  expect(html).not.toMatch(/<script[^>]+src=/)
  expect(html).not.toMatch(/<link[^>]+href="(?!data:)/)
  expect(html).not.toMatch(/url\((?!["']?data:)["']?[^)"']+\.(svg|png|woff2|wav)/)
  expect(fs.readdirSync(path.dirname(BUILD_HTML)).filter(f => /\.map$/.test(f))).toEqual([])
})
