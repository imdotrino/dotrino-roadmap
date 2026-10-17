#!/usr/bin/env node
/**
 * Mete los manifiestos DENTRO del código (`src/manifests.js`).
 *
 * POR QUÉ EXISTE, y costó un binario que no arrancaba: la primera versión leía los JSON
 * del disco con `fileURLToPath(import.meta.url)` calculado AL IMPORTARSE. En un ejecutable
 * único (SEA) eso no existe, así que la bóveda moría al arrancar con «The "path" argument
 * must be of type string». Y en un navegador no habría arrancado nunca.
 *
 * Los van a consumir ~30 PWAs, varios daemons y un binario: **un registro que hay que leer
 * del disco no sirve para eso**. El JSON sigue siendo la fuente que se edita; esto lo
 * convierte en un módulo, y un test comprueba que no se separen.
 *
 *   node scripts/build-manifests.mjs
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dir = join(root, 'manifests')
const names = readdirSync(dir).filter((f) => f.endsWith('.json')).sort()

const entries = names.map((f) => {
  const name = f.slice(0, -5)
  const data = JSON.parse(readFileSync(join(dir, f), 'utf8'))
  return `  ${JSON.stringify(name)}: ${JSON.stringify(data, null, 2).split('\n').join('\n  ')}`
})

const output = `/**
 * GENERADO — no se edita a mano. La fuente son los JSON de \`manifests/\`.
 * Regenerar:  node scripts/build-manifests.mjs
 *
 * Van dentro del código y no se leen del disco a propósito: los consumen ~30 PWAs, varios
 * daemons y un ejecutable único. Un registro que hay que leer del disco no sirve para eso.
 */
export const MANIFESTS = Object.freeze({
${entries.join(',\n')}
})
`
writeFileSync(join(root, 'src', 'manifests.js'), output)
console.log(`src/manifests.js — ${names.length} manifest(s): ${names.map((n) => n.slice(0, -5)).join(', ')}`)
