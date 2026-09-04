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

const registro = loadManifest()

// LA BÓVEDA, que es quien juzga: la versión que entra es la que tiene la lista al día.
const boveda = declare({ product: 'vaultd', version: '0.106.2', protocol: 1, speaks: [1] })

// Y lo que se le presenta. Las dos últimas son los casos que hoy se ven como silencio.
const fichas = [
  { quien: 'identity (al día)', v: declare({ product: 'identity', version: '0.80.0', protocol: 1, speaks: [1] }) },
  { quien: 'proxy-client (al día)', v: declare({ product: 'proxy-client', version: '0.17.0', protocol: 1, speaks: [1] }) },
  { quien: 'vault (el cliente viejo)', v: declare({ product: 'vault', version: '0.33.2', protocol: 1, speaks: [1] }) },
  { quien: 'un agente de otro cable', v: declare({ product: 'proxy-client', version: '0.4.0', protocol: 0, speaks: [0] }) },
  { quien: 'algo que no declara', v: null }
]

// La lista de rotas del registro MÁS lo que este ejemplo añade a mano, para enseñar el caso.
const rotas = [
  ...summary(registro).broken,
  { product: 'vault', versions: '<=0.33.2', why: 'es anterior al acta de perfil', fix: 'sube a 0.60.0+' }
]

const ancho = 26
const fila = (a, b) => console.log('  ' + String(a).padEnd(ancho) + b)

console.log('\nREGISTRO  ·  manifiesto "%s" nº%d (%s)\n', registro.manifest, registro.seq, registro.issued)
for (const p of summary(registro).products) {
  fila(p.product, `vigente ${p.current}  ·  protocolo ${p.protocol}`)
}

console.log('\nLO QUE CORRE, VISTO DESDE %s %s\n', boveda.product, boveda.version)
for (const { quien, v } of fichas) {
  const d = check({ mine: boveda, theirs: v, broken: rotas })
  fila(quien, (d.compatible ? '✓ cuadra' : '⚠ ' + d.code) + (v ? `  (${v.version})` : ''))
  if (!d.compatible) console.log(' '.repeat(ancho + 4) + d.reason)
}

console.log('\nEL REGISTRO DICE QUÉ DEBERÍA IR CADA UNA\n')
for (const peer of ['identity', 'proxy-client']) {
  const r = meets(registro, { product: 'vaultd', peer, version: currentOf(registro, peer) })
  fila(`vaultd ← ${peer}`, r.ok ? `✓ ${currentOf(registro, peer)} cumple` : '⚠ ' + r.reason)
}
const viejo = meets(registro, { product: 'vaultd', peer: 'identity', version: '0.50.0' })
fila('vaultd ← identity 0.50.0', viejo.ok ? '✓' : '⚠ ' + viejo.reason)

console.log('\nY LO QUE DE VERDAD AHORRA LA TARDE: el dictamen pegado al error real\n')
const d = check({ mine: boveda, theirs: fichas[2].v, broken: rotas })
console.log('  antes:   invalid cert: no-acta')
console.log('  ahora:   ' + annotate('invalid cert: no-acta', d))
console.log()
