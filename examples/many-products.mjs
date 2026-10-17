/**
 * UN CASO CON VARIAS FICHAS, para verlo funcionando:
 *
 *   node examples/many-products.mjs
 *
 * Monta seis piezas a versiones distintas y enseña lo que vería el administrador. Cubre
 * los cuatro dictámenes que existen: cuadra, protocolo distinto, versión marcada rota, y
 * quien no dice qué es.
 *
 * Nada de esto bloquea: son dictámenes para enseñar y para pegárselos a un error.
 */
import { declare, check, annotate } from '@dotrino/compat'
import { loadManifest, currentOf, meets, summary } from '../src/index.js'

const registry = loadManifest()

// LA BÓVEDA, que es quien juzga: la versión que entra es la que tiene la lista al día.
const vault = declare({ product: 'vaultd', version: '0.106.2', protocol: 1, speaks: [1] })

// Y lo que se le presenta. Las dos últimas son los casos que hoy se ven como silencio.
const peers = [
  { who: 'identity (al día)', v: declare({ product: 'identity', version: '0.80.0', protocol: 1, speaks: [1] }) },
  { who: 'proxy-client (al día)', v: declare({ product: 'proxy-client', version: '0.17.0', protocol: 1, speaks: [1] }) },
  { who: 'vault (el cliente viejo)', v: declare({ product: 'vault', version: '0.33.2', protocol: 1, speaks: [1] }) },
  { who: 'un agente de otro cable', v: declare({ product: 'proxy-client', version: '0.4.0', protocol: 0, speaks: [0] }) },
  { who: 'algo que no declara', v: null }
]

// La lista de rotas del registro MÁS lo que este ejemplo añade a mano, para enseñar el caso.
const brokenList = [
  ...summary(registry).broken,
  { product: 'vault', versions: '<=0.33.2', why: 'es anterior al acta de perfil', fix: 'sube a 0.60.0+' }
]

const width = 26
const row = (a, b) => console.log('  ' + String(a).padEnd(width) + b)

console.log('\nREGISTRO  ·  manifiesto "%s" nº%d (%s)\n', registry.manifest, registry.seq, registry.issued)
for (const p of summary(registry).products) {
  row(p.product, `vigente ${p.current}  ·  protocolo ${p.protocol}`)
}

console.log('\nLO QUE CORRE, VISTO DESDE %s %s\n', vault.product, vault.version)
for (const { who, v } of peers) {
  const d = check({ mine: vault, theirs: v, broken: brokenList })
  row(who, (d.compatible ? '✓ cuadra' : '⚠ ' + d.code) + (v ? `  (${v.version})` : ''))
  if (!d.compatible) console.log(' '.repeat(width + 4) + d.reason)
}

console.log('\nEL REGISTRO DICE QUÉ DEBERÍA IR CADA UNA\n')
for (const peer of ['identity', 'proxy-client']) {
  const r = meets(registry, { product: 'vaultd', peer, version: currentOf(registry, peer) })
  row(`vaultd ← ${peer}`, r.ok ? `✓ ${currentOf(registry, peer)} cumple` : '⚠ ' + r.reason)
}
const old = meets(registry, { product: 'vaultd', peer: 'identity', version: '0.50.0' })
row('vaultd ← identity 0.50.0', old.ok ? '✓' : '⚠ ' + old.reason)

console.log('\nY LO QUE DE VERDAD AHORRA LA TARDE: el dictamen pegado al error real\n')
const d = check({ mine: vault, theirs: peers[2].v, broken: brokenList })
console.log('  antes:   invalid cert: no-acta')
console.log('  ahora:   ' + annotate('invalid cert: no-acta', d))
console.log()
