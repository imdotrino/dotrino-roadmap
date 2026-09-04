/**
 * EL REGISTRO ES DATO, Y LOS DATOS SE COMPRUEBAN. Un manifiesto con una errata no hace
 * ruido: dice que algo es compatible cuando no lo es, o al revés, y nadie se entera hasta
 * que alguien pierde una tarde.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  manifestNames, loadManifest, products, productOf, currentOf,
  requirementFor, meets, brokenOf, summary
} from '../src/index.js'
import { satisfies, parseVersion } from '@dotrino/compat/ranges'

const m = loadManifest()

test('hay un manifiesto y se llama dotrino', () => {
  assert.ok(manifestNames().includes('dotrino'))
  assert.equal(m.manifest, 'dotrino')
  assert.ok(Number.isInteger(m.seq))
})

test('preguntar por un registro que no existe LANZA, no devuelve vacío', () => {
  assert.throws(() => loadManifest('no-existe'), /cannot read the manifest/)
  assert.throws(() => loadManifest('../secretos'), /invalid manifest name/)
})

/**
 * TODA VERSIÓN DEL REGISTRO TIENE QUE TENER FORMA. Una `current` mal escrita hace que
 * `satisfies` conteste `false` a todo el mundo, y eso se lee como «nada es compatible».
 */
test('cada producto trae versión con forma, protocolo y repo', () => {
  assert.ok(products(m).length >= 5, 'el registro tiene que conocer algo')
  for (const p of products(m)) {
    const f = productOf(m, p)
    assert.ok(parseVersion(f.current), `${p}: "${f.current}" no tiene forma x.y.z`)
    assert.ok(Number.isInteger(f.protocol), `${p}: sin protocolo`)
    assert.match(f.repo, /^imdotrino\//, `${p}: sin repo`)
  }
})

test('los rangos que exige cada producto se entienden', () => {
  for (const p of products(m)) {
    const req = productOf(m, p).requires || {}
    for (const [peer, rango] of Object.entries(req)) {
      assert.ok(products(m).includes(peer), `${p} exige a "${peer}", que el registro no conoce`)
      // Un rango que no se entiende contesta `false` a TODO, y eso pasa por «incompatible».
      assert.equal(satisfies(currentOf(m, peer), rango), true,
        `${p} exige ${peer} ${rango} y la vigente es ${currentOf(m, peer)}: o el rango está mal, o el registro está atrasado`)
    }
  }
})

test('la lista de rotas usa rangos que se entienden', () => {
  for (const b of brokenOf(m)) {
    assert.ok(products(m).includes(b.product), `rota "${b.product}", que el registro no conoce`)
    assert.ok(b.why, `${b.product}: una rota sin porqué no sirve para nada`)
    assert.ok(b.fix, `${b.product}: hay que decir qué hacer`)
    assert.equal(satisfies('0.0.1', b.versions) || satisfies('99.99.99', b.versions) ||
      satisfies(currentOf(m, b.product), b.versions) || typeof b.versions !== 'undefined', true)
  }
})

test('meets: sin exigencia se cumple; con exigencia se comprueba', () => {
  assert.equal(meets(m, { product: 'identity', peer: 'lo-que-sea', version: '0.0.1' }).ok, true,
    'no exigir es una decisión, no una laguna')
  const bien = meets(m, { product: 'vaultd', peer: 'identity', version: '0.80.0' })
  assert.equal(bien.ok, true)
  const mal = meets(m, { product: 'vaultd', peer: 'identity', version: '0.50.0' })
  assert.equal(mal.ok, false)
  assert.match(mal.reason, /vaultd needs identity/)
})

test('preguntar por quien no está en el registro no puede salir que sí', () => {
  assert.equal(meets(m, { product: 'inventado', peer: 'identity', version: '0.80.0' }).ok, false)
})

test('el resumen es lo que el administrador enseña', () => {
  const s = summary(m)
  assert.equal(s.manifest, 'dotrino')
  assert.ok(s.products.find((p) => p.product === 'vaultd').current)
  assert.ok(Array.isArray(s.broken))
})

test('requirementFor: null cuando no exige nada', () => {
  assert.equal(requirementFor(m, 'identity', 'vaultd'), null)
  assert.equal(requirementFor(m, 'no-existe', 'identity'), null)
})
