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

## Y nada de esto bloquea

La incompatibilidad **se ve, no para** (dueño, 2026-09-04). El porqué está en el README de
`@dotrino/compat`; en corto: en los tres incidentes que originaron todo esto lo que faltó
fue enterarse, no parar.

## Pendiente

La página pública en **`roadmap.dotrino.com`** todavía no existe: hoy esto es el registro y
su librería. Cuando se haga, va como landing de servicio (CONVENCIONES §1.2).

## Licencia

MIT.
