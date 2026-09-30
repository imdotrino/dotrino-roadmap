/**
 * EL CHEQUEO QUE EL REGISTRO PROMETÍA Y NO EXISTÍA (2026-09-30).
 *
 * El README decía que los rangos sirven «para un chequeo en CI», y no había chequeo. El
 * resultado: `dotrino-proxy` corrió meses con `@dotrino/vault` 0.52 —marcada ROTA en este
 * mismo registro, y el índice lo decía— porque nada miraba antes de desplegar.
 *
 * Qué mira, con las versiones INSTALADAS (las del `package-lock.json`, anidadas incluidas:
 * una copia vieja escondida dentro de otro paquete es la que acaba corriendo):
 *
 *   · `broken`   — una dependencia en una versión marcada rota.          → falla
 *   · `requires` — el producto necesita de un pilar más de lo que trae.  → falla
 *   · `undeclared` — usa un pilar del registro que su ficha no declara.  → aviso
 *
 * Lo último es aviso y no fallo a propósito: una ficha incompleta es deuda del registro, no
 * un paquete roto. Pero se dice, porque una ficha vacía es justo lo que dejó pasar al proxio.
 *
 * Puro: recibe el manifiesto y lo instalado, no toca el disco (eso es de `bin/`).
 */
import { satisfies } from '@dotrino/compat/ranges'
import { isBroken } from '@dotrino/compat'

/** El producto del registro que se publica en npm como `npmName`, o `null`. */
export function productByNpm (m, npmName) {
  for (const [name, p] of Object.entries(m?.products || {})) if (p.npm === npmName) return name
  return null
}

/** El producto del registro cuyo repo es `repo` (`imdotrino/x`). Si hay varios, `null`. */
export function productByRepo (m, repo) {
  const hits = Object.entries(m?.products || {}).filter(([, p]) => p.repo === repo).map(([n]) => n)
  return hits.length === 1 ? hits[0] : null
}

/**
 * Las versiones instaladas de los paquetes `@dotrino/*`, leídas de un `package-lock.json`
 * (v2/v3). Devuelve `[{ name, version, path }]`: una entrada por copia, anidadas incluidas.
 */
export function installedFromLock (lock) {
  const out = []
  for (const [path, info] of Object.entries(lock?.packages || {})) {
    const m = /(?:^|\/)node_modules\/(@dotrino\/[^/]+)$/.exec(path)
    if (m && info?.version && !info.link) out.push({ name: m[1], version: info.version, path })
  }
  return out
}

/**
 * @param {object} m          el manifiesto (`loadManifest()`)
 * @param {object} o
 * @param {string|null} o.product   el producto que se comprueba (sus `requires`), o `null`
 * @param {{name:string,version:string,path:string}[]} o.installed
 * @param {string[]|null} [o.direct]  las dependencias DIRECTAS (package.json); sin esto, todo lo
 *   instalado arriba — que incluye lo que npm subió de otros paquetes
 * @returns {{ ok: boolean, problems: object[], warnings: object[] }}
 */
export function checkInstalled (m, { product = null, installed = [], direct = null } = {}) {
  const problems = []
  const warnings = []
  const broken = Array.isArray(m?.broken) ? m.broken : []

  for (const dep of installed) {
    const peer = productByNpm(m, dep.name)
    if (!peer) continue
    const b = isBroken(broken, { product: peer, version: dep.version })
    if (b) problems.push({ kind: 'broken', dep: dep.name, version: dep.version, path: dep.path, why: b.why || '', fix: b.fix || '' })
  }

  if (product) {
    const ficha = m?.products?.[product]
    if (!ficha) {
      problems.push({ kind: 'unknown-product', product })
    } else {
      const requires = ficha.requires || {}
      const top = installed.filter((d) => d.path === `node_modules/${d.name}` && (!direct || direct.includes(d.name)))
      for (const [peer, rango] of Object.entries(requires)) {
        const npm = m.products[peer]?.npm
        const dep = npm && top.find((d) => d.name === npm)
        if (!dep) continue   // lo pide a otra pieza en marcha, no como dependencia
        if (!satisfies(dep.version, rango)) problems.push({ kind: 'requires', dep: npm, version: dep.version, range: rango, product })
      }
      for (const dep of top) {
        const peer = productByNpm(m, dep.name)
        if (peer && peer !== product && !(peer in requires)) warnings.push({ kind: 'undeclared', dep: dep.name, version: dep.version, product })
      }
    }
  }
  return { ok: problems.length === 0, problems, warnings }
}

/** Una línea por hallazgo, en inglés (es lo que sale en el log de CI). */
export function formatReport ({ problems, warnings }, { product = null } = {}) {
  const L = []
  for (const p of problems) {
    if (p.kind === 'broken') L.push(`✖ ${p.dep}@${p.version} is marked BROKEN (${p.path})${p.why ? ` — ${p.why}` : ''}${p.fix ? `\n    fix: ${p.fix}` : ''}`)
    else if (p.kind === 'requires') L.push(`✖ ${p.product} needs ${p.dep} ${p.range}, and ${p.version} is installed`)
    else if (p.kind === 'unknown-product') L.push(`✖ the registry does not know the product "${p.product}"`)
  }
  for (const w of warnings) L.push(`! ${w.product} uses ${w.dep}@${w.version} but its entry in the registry does not declare it (requires)`)
  if (!L.length) L.push(`✔ roadmap: nothing broken${product ? `, and ${product} meets its requires` : ''}`)
  return L.join('\n')
}

export default { checkInstalled, installedFromLock, productByNpm, productByRepo, formatReport }
