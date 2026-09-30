/**
 * El chequeo de CI (`src/check.js`). El caso que lo trajo: el proxio con `@dotrino/vault`
 * 0.52, marcada rota, y una ficha sin `requires` que no dejaba ver nada (2026-09-30).
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { checkInstalled, installedFromLock, productByNpm } from '../src/check.js'

const m = {
  products: {
    vault: { npm: '@dotrino/vault', current: '0.79.0' },
    identity: { npm: '@dotrino/identity', current: '0.105.0' },
    proxy: { repo: 'imdotrino/dotrino-proxy', current: '1.3.7', requires: { vault: '>=0.79.0' } },
    bare: { repo: 'imdotrino/bare', current: '1.0.0', requires: {} }
  },
  broken: [{ product: 'vault', versions: '0.52.0', why: 'viejo', fix: 'sube' }]
}

const lock = (deps) => ({
  packages: Object.fromEntries(Object.entries(deps).map(([p, v]) => [p, { version: v }]))
})

test('lee del lock cada copia de un @dotrino/*, anidadas incluidas', () => {
  const got = installedFromLock(lock({
    'node_modules/@dotrino/vault': '0.79.0',
    'node_modules/@dotrino/remote-agent/node_modules/@dotrino/vault': '0.52.0',
    'node_modules/ws': '8.0.0'
  }))
  assert.deepEqual(got.map((d) => d.version).sort(), ['0.52.0', '0.79.0'])
})

test('una versión ROTA falla, también escondida dentro de otro paquete', () => {
  const r = checkInstalled(m, {
    installed: installedFromLock(lock({ 'node_modules/@dotrino/x/node_modules/@dotrino/vault': '0.52.0' }))
  })
  assert.equal(r.ok, false)
  assert.equal(r.problems[0].kind, 'broken')
  assert.equal(r.problems[0].fix, 'sube')
})

test('no cumplir los `requires` del producto falla', () => {
  const r = checkInstalled(m, { product: 'proxy', installed: installedFromLock(lock({ 'node_modules/@dotrino/vault': '0.78.0' })) })
  assert.equal(r.ok, false)
  assert.equal(r.problems[0].kind, 'requires')
})

test('cumplirlos pasa', () => {
  const r = checkInstalled(m, { product: 'proxy', installed: installedFromLock(lock({ 'node_modules/@dotrino/vault': '0.79.0' })) })
  assert.equal(r.ok, true)
})

test('usar un pilar que la ficha no declara es un AVISO, no un fallo', () => {
  const r = checkInstalled(m, { product: 'bare', installed: installedFromLock(lock({ 'node_modules/@dotrino/identity': '0.105.0' })) })
  assert.equal(r.ok, true)
  assert.equal(r.warnings[0].kind, 'undeclared')
})

test('lo que npm subió de otro paquete no cuenta como dependencia directa', () => {
  const r = checkInstalled(m, {
    product: 'bare', direct: ['@dotrino/vault'],
    installed: installedFromLock(lock({ 'node_modules/@dotrino/identity': '0.105.0', 'node_modules/@dotrino/vault': '0.79.0' }))
  })
  assert.deepEqual(r.warnings.map((w) => w.dep), ['@dotrino/vault'])
})

test('un producto que el registro no conoce no pasa', () => {
  const r = checkInstalled(m, { product: 'nadie', installed: [] })
  assert.equal(r.ok, false)
})

test('el producto se deduce por el nombre de npm', () => {
  assert.equal(productByNpm(m, '@dotrino/vault'), 'vault')
  assert.equal(productByNpm(m, 'websocket-proxy'), null)
})

test('lo que solo es de desarrollo no cuenta: no viaja con el paquete', () => {
  const got = installedFromLock({ packages: {
    'node_modules/@dotrino/vault': { version: '0.52.0', dev: true },
    'node_modules/@dotrino/store': { version: '0.7.0', peer: true },
    'node_modules/@dotrino/identity': { version: '0.105.0' }
  } })
  assert.deepEqual(got.map((d) => d.name), ['@dotrino/identity'])
})
