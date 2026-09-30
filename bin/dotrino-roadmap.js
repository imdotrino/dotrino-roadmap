#!/usr/bin/env node
/**
 * dotrino-roadmap check [--product <p>] [--dir <carpeta>] [--manifest <nombre>]
 *
 * El chequeo de CI del registro (`src/check.js`). Se corre con la ÚLTIMA versión publicada,
 * que es la que trae la lista de rotas más nueva:
 *
 *   npx --yes @dotrino/roadmap@latest check
 *
 * Sin `--product` lo deduce: por el `name` del package.json (el `npm` de la ficha) o por el
 * repo de git (`repo` de la ficha). Si no lo encuentra, comprueba solo las rotas y lo dice.
 * Sale con 1 si algo está roto o no cumple; con 0 si solo hay avisos.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { loadManifest } from '../src/index.js'
import { checkInstalled, installedFromLock, productByNpm, productByRepo, formatReport } from '../src/check.js'

const args = process.argv.slice(2)
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null }
const cmd = args[0]

if (cmd !== 'check') {
  console.error('usage: dotrino-roadmap check [--product <product>] [--dir <folder>] [--manifest <name>]')
  process.exit(2)
}

const dir = path.resolve(opt('--dir') || '.')
const m = loadManifest(opt('--manifest') || 'dotrino')
const lockFile = path.join(dir, 'package-lock.json')
if (!fs.existsSync(lockFile)) {
  console.error(`✖ no package-lock.json in ${dir}: cannot tell which versions are installed`)
  process.exit(2)
}
const lock = JSON.parse(fs.readFileSync(lockFile, 'utf8'))
const pkg = (() => { try { return JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')) } catch (_) { return {} } })()
const repo = (() => {
  try {
    const url = execFileSync('git', ['-C', dir, 'remote', 'get-url', 'origin'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
    const r = /[:/]([^/:]+\/[^/]+?)(?:\.git)?$/.exec(url)
    return r ? r[1] : null
  } catch (_) { return null }
})()

const product = opt('--product') || productByNpm(m, pkg.name) || (repo && productByRepo(m, repo)) || null
if (!product) console.log(`! this package is not in the registry (${pkg.name || '?'}${repo ? `, ${repo}` : ''}): checking broken versions only`)

const direct = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies, ...pkg.optionalDependencies })
const r = checkInstalled(m, { product, installed: installedFromLock(lock), direct })
console.log(formatReport(r, { product }))
process.exit(r.ok ? 0 : 1)
