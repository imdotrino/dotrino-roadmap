# dotrino-roadmap

El **registro común de compatibilidad** del ecosistema Dotrino: qué versión va cada pieza,
qué protocolo habla, qué necesita de las demás y qué versiones se saben rotas.

Dos cosas en un repo:

- **`manifests/*.json`** — los datos. Se editan aquí, a mano.
- **`@dotrino/roadmap`** — la pieza de consulta. Cada producto la importa en vez de abrir
  el JSON por su cuenta: treinta piezas parseando el mismo archivo a su manera son treinta
  formas de equivocarse, y ninguna hace ruido al equivocarse.

## Reparto con `@dotrino/compat`

| | Qué es |
|---|---|
| **`@dotrino/compat`** | la **lógica**: declarar qué eres, comparar, avisar |
| **esto** | el **registro**: los datos |

Va como `peerDependency`, no como dependencia: un pilar metido dentro de otro se cuela
anidado a cada consumidor, y ya pasó una vez.

## Cómo se consulta

```js
import { loadManifest, currentOf, brokenOf, meets } from '@dotrino/roadmap'

const m = loadManifest()                      // hay uno («dotrino») y caben varios
currentOf(m, 'vaultd')                        // '0.106.2'
meets(m, { product: 'vaultd', peer: 'identity', version: '0.80.0' })
brokenOf(m)                                   // se le pasa tal cual a check() de compat
```

## Los rangos

Los define `@dotrino/compat/ranges`. Pueden ser **abiertos**, que es como se escribe un
manifiesto de verdad — «esto y lo que venga»:

```
"0.106.2"             exacta
"0.106.0+"            de esa en adelante
">=0.106.0"           lo mismo en el otro idioma (también >  <=  <)
"0.100.0 - 0.106.2"   intervalo, extremos incluidos
"0.100.0 - *"         abierto por arriba
"*"                   cualquiera
```

Solo `x.y.z`: sin prereleases, sin `^` ni `~`. **Lo que no se entiende no pasa** — un rango
con una forma rara es un «no», nunca un «adelante».

## Los rangos NO vetan en marcha

Es a propósito, para no tener dos puertas para lo mismo:

- **En marcha deciden** el `protocol` que anuncia cada pieza y la lista de rotas. Son
  locales y no necesitan este registro.
- **Este registro sirve** para el roadmap, para que el administrador diga «deberías
  actualizar X», y para un chequeo en CI.

Si los rangos también vetaran, algún día una puerta diría que sí y la otra que no.

## El chequeo de CI

```sh
npx --yes @dotrino/roadmap@latest check        # en la carpeta con el package-lock.json
#   [--product <p>] [--dir <carpeta>]
```

Con la ÚLTIMA versión publicada, que trae la lista de rotas más nueva. Lee las versiones
**instaladas** del `package-lock.json` (anidadas incluidas) y:

| | Qué | Resultado |
|---|---|---|
| `broken` | una dependencia en una versión marcada rota | **falla** (sale con 1) |
| `requires` | el producto necesita de un pilar más de lo que trae | **falla** |
| `undeclared` | usa un pilar que su ficha no declara | aviso |

El producto se deduce del `name` del `package.json` (el `npm` de la ficha) o del repo de
git (`repo`). Va en el `release.yml` de cada paquete, **antes de publicar**: eso sí frena, y
es lo que faltaba — el proxio corrió meses con `@dotrino/vault` 0.52, marcada rota aquí
mismo, porque la lista existía y nadie la cruzaba antes de desplegar (2026-09-30).

**Una ficha tiene que declarar lo que usa.** La del proxio tenía `requires: {}` y por eso
ningún rango podía fallar. El aviso `undeclared` existe para eso.

## Y nada de esto bloquea

La incompatibilidad **se ve, no para** (dueño, 2026-09-04). El porqué está en el README de
`@dotrino/compat`; en corto: en los tres incidentes que originaron todo esto lo que faltó
fue enterarse, no parar.

## Apps con versión nativa

Algunas apps tienen además versión iOS y Android (CONVENCIONES §16, dueño 2026-09-28; la
primera, padel). Cada versión nativa es un **producto propio** del manifiesto, con su nombre
de plataforma:

```json
"padel-android": {
  "repo": "imdotrino/dotrino-padel-contador",
  "current": "0.3.0",
  "protocol": 1,
  "requires": { "proxy": "1.1.0+", "identity": ">=0.105.0" }
}
```

- **Entra cuando se publica**, no antes: un `current` de algo que no existe no es un registro.
  Hasta entonces, que una app está calificada lo dice su `package.json`
  (`dotrino.platforms`) y lo enseña `dotrino-index`.
- **`current` es la versión de la PWA con la que está a la par** (§16.3): la PWA va delante,
  así que `current` de `padel-android` por debajo del de la PWA es lo normal, y dice cuánto
  falta.
- **Sus `requires` son los del puerto nativo** (`dotrino-native`), no los de la PWA: lo que
  pide la app nativa es lo que habla su librería.
- **Una versión nativa rota va a `broken` por versión exacta**, como cualquier otra. Con más
  razón: una app de tienda no se recompone en horas.

## Pendiente

La página pública en **`roadmap.dotrino.com`** todavía no existe: hoy esto es el registro y
su librería. Cuando se haga, va como landing de servicio (CONVENCIONES §1.2).

## Licencia

MIT.

## Documentación de uso

Está en el wiki: <https://wiki.dotrino.com/desarrollo/versiones/>
