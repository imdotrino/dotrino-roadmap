/**
 * GENERADO — no se edita a mano. La fuente son los JSON de `manifests/`.
 * Regenerar:  node scripts/build-manifests.mjs
 *
 * Van dentro del código y no se leen del disco a propósito: los consumen ~30 PWAs, varios
 * daemons y un ejecutable único. Un registro que hay que leer del disco no sirve para eso.
 */
export const MANIFESTS = Object.freeze({
  "dotrino": {
    "manifest": "dotrino",
    "seq": 20,
    "issued": "2026-09-21",
    "note": "Registro comun de compatibilidad del ecosistema. Se edita a mano en este repo y se consulta con @dotrino/roadmap. Rangos: ver @dotrino/compat/ranges (x.y.z, >= > <= <, «a - b», «*», o una lista que es un O).",
    "products": {
      "compat": {
        "repo": "imdotrino/dotrino-compat",
        "npm": "@dotrino/compat",
        "current": "0.4.0",
        "protocol": 1,
        "requires": {}
      },
      "env": {
        "repo": "imdotrino/dotrino-vault",
        "npm": "@dotrino/env",
        "current": "0.70.0",
        "protocol": 1,
        "requires": {
          "vault": ">=0.70.0"
        }
      },
      "identity": {
        "repo": "imdotrino/dotrino-identity",
        "npm": "@dotrino/identity",
        "current": "0.99.0",
        "protocol": 1,
        "requires": {}
      },
      "lobby": {
        "repo": "imdotrino/dotrino-lobby",
        "npm": "@dotrino/lobby",
        "current": "0.10.0",
        "protocol": 2,
        "requires": {
          "proxy-client": ">=0.22.0",
          "identity": ">=0.53.0"
        }
      },
      "notifications": {
        "repo": "imdotrino/dotrino-notifications",
        "npm": "@dotrino/notifications",
        "current": "0.4.0",
        "protocol": 2,
        "requires": {
          "proxy-client": ">=0.20.0"
        }
      },
      "opaque": {
        "repo": "imdotrino/dotrino-opaque",
        "npm": "@dotrino/opaque",
        "current": "0.1.0",
        "protocol": 1,
        "requires": {}
      },
      "profile": {
        "repo": "imdotrino/dotrino-profile",
        "npm": "@dotrino/profile",
        "current": "0.19.0",
        "protocol": 1,
        "requires": {
          "identity": ">=0.33.0"
        }
      },
      "proxy": {
        "repo": "imdotrino/dotrino-proxy",
        "current": "1.1.0",
        "protocol": 2,
        "requires": {}
      },
      "proxy-client": {
        "repo": "imdotrino/dotrino-proxy-client",
        "npm": "@dotrino/proxy-client",
        "current": "0.23.1",
        "protocol": 2,
        "requires": {
          "identity": ">=0.53.0",
          "proxy": "1.1.0+"
        }
      },
      "remote-agent": {
        "repo": "imdotrino/dotrino-remote-agent",
        "npm": "@dotrino/remote-agent",
        "current": "0.10.0",
        "protocol": 1,
        "requires": {
          "identity": ">=0.92.0",
          "vault": ">=0.64.0"
        }
      },
      "roadmap": {
        "repo": "imdotrino/dotrino-roadmap",
        "npm": "@dotrino/roadmap",
        "current": "0.3.4",
        "protocol": 1,
        "requires": {
          "compat": "0.4.0+"
        }
      },
      "store": {
        "repo": "imdotrino/dotrino-store",
        "npm": "@dotrino/store",
        "current": "0.11.0",
        "protocol": 1,
        "requires": {
          "identity": ">=0.91.0",
          "vaultd": ">=0.115.0"
        }
      },
      "topbar": {
        "repo": "imdotrino/dotrino-topbar",
        "npm": "@dotrino/topbar",
        "current": "0.11.1",
        "protocol": 1,
        "requires": {
          "identity": ">=0.96.1"
        }
      },
      "vault": {
        "repo": "imdotrino/dotrino-vault",
        "npm": "@dotrino/vault",
        "current": "0.70.0",
        "protocol": 1,
        "requires": {
          "vaultd": ">=0.105.0",
          "proxy-client": "0.23.1+",
          "identity": ">=0.99.0",
          "opaque": ">=0.1.0"
        }
      },
      "vaultd": {
        "repo": "imdotrino/dotrino-vault",
        "npm": "@dotrino/vaultd",
        "current": "0.124.0",
        "protocol": 1,
        "requires": {
          "identity": ">=0.80.0",
          "proxy-client": ">=0.23.1",
          "store": ">=0.11.0",
          "passmanager": ">=0.16.0"
        }
      },
      "verifier": {
        "repo": "imdotrino/dotrino-verifier",
        "npm": "@dotrino/verifier",
        "current": "0.2.0",
        "protocol": 1,
        "requires": {
          "identity": "0.87.0+"
        }
      },
      "passmanager": {
        "repo": "imdotrino/dotrino-passmanager",
        "npm": "@dotrino/passmanager",
        "current": "0.16.0",
        "protocol": 1,
        "requires": {
          "identity": ">=0.61.0",
          "proxy-client": ">=0.13.0"
        }
      }
    },
    "broken": [
      {
        "product": "vault",
        "versions": "<=0.33.2",
        "why": "es anterior al acta de perfil: al enrolar contesta «invalid cert: no-acta», que es verdad y no es la causa",
        "fix": "sube @dotrino/env y @dotrino/vault a la version de vaultd que corre"
      },
      {
        "product": "vault",
        "versions": "0.62.0",
        "why": "se publico declarando proxy-client >=0.17.0, y el identifyAs que usa nacio en 0.18.0: con 0.17.x muere con «client.identifyAs is not a function», que es un fallo mudo",
        "fix": "sube a @dotrino/vault 0.62.1, que ya pide >=0.18.0"
      },
      {
        "product": "store",
        "versions": [
          "0.8.0",
          "0.9.0"
        ],
        "why": "connect({ identity }) devuelve el singleton tal cual si ya existia: la moneda de <dotrino-support> lo abre SIN identidad al montarse y suele llegar antes que la app, asi que la app recibe un almacen sin setProfile y todo lo suyo va al espacio comun de todos los perfiles del aparato, sin ningun error. Ademas, una identidad sin perfil activo caia en silencio al espacio por defecto",
        "fix": "sube a @dotrino/store 0.10.0"
      },
      {
        "product": "store",
        "versions": "0.8.0",
        "why": "abrir el almacen es un saludo de un solo mensaje: el iframe manda `ready` al cargar y, si se pierde o la pagina tarda mas de 8 s, connect() falla; peor, la promesa rechazada se queda cacheada en el singleton, asi que el boton «Reintentar» que enseñan las apps devuelve el mismo error sin intentar nada y el almacen queda inservible hasta recargar",
        "fix": "sube a @dotrino/store 0.9.0"
      },
      {
        "product": "store",
        "versions": "0.7.0",
        "why": "soltar la boveda (vaultUnpair) borraba todos los hilos del perfil, igual que una expulsion; y desde 0.6.0 dejo de adoptar lo que guardo la version anterior a IndexedDB, asi que al actualizar se perdian los hilos en silencio",
        "fix": "sube a @dotrino/store 0.8.0"
      },
      {
        "product": "proxy-client",
        "versions": "0.18.2",
        "why": "el Service Worker del push se publicaba como sw/closer-click-push-sw.js mientras el README mandaba copiarlo como dotrino-push-sw.js: quien seguia el README importaba un 404, y eso deja el SW de Workbox VACIO (sin precache, sin offline y sin actualizarse), no solo sin push",
        "fix": "sube a @dotrino/proxy-client 0.19.0 y copia sw/dotrino-push-sw.js a public/"
      },
      {
        "product": "notifications",
        "versions": "0.3.0",
        "why": "el acuse de apertura salia con sendByPubkey, o sea EN CLARO: la url del contenido, su nombre y el apodo de quien lo abrio cruzaban el proxio tal cual. Y contra un 0.4.0 no se entiende: lo suyo llega sin sellar y el otro lo descarta, asi que el acuse no aparece y no hay error en ninguna de las dos puntas",
        "fix": "sube @dotrino/notifications a 0.4.0 y dale al cliente con que sellar (myEncPub + sealing), con @dotrino/proxy-client >=0.20.0"
      },
      {
        "product": "store",
        "versions": [
          "0.7.0",
          "0.8.0",
          "0.9.0",
          "0.10.0"
        ],
        "why": "con la boveda emparejada, el respaldo manda el almacen ENTERO en un mensaje (exportThreads/importThreads) y el proxio corta en 1 MB: pasado ese tamano deja de llegar, el error se traga en un catch vacio y el almacen sigue solo en el navegador sin avisar. Ademas, un borrado vuelve desde la boveda o desde otro aparato, y la boveda recortaba cada hilo a 1000 entradas",
        "fix": "sube a @dotrino/store 0.11.0 (y dotrino-vault 0.115.0 en la boveda)"
      },
      {
        "product": "identity",
        "versions": [
          "0.73.0",
          "0.73.1",
          "0.74.0",
          "0.74.1",
          "0.75.0",
          "0.76.0",
          "0.77.0",
          "0.78.0",
          "0.79.0",
          "0.80.0",
          "0.81.0",
          "0.82.0",
          "0.83.0",
          "0.83.1",
          "0.84.0",
          "0.85.0",
          "0.86.0",
          "0.86.1",
          "0.86.2",
          "0.87.0",
          "0.88.0",
          "0.89.0",
          "0.89.1",
          "0.90.0",
          "0.91.0"
        ],
        "why": "enrollDevice comparaba acta.profileId con la llave de la boveda al emparejar y al renovar, y eso solo es verdad en una cuenta que nacio en esa boveda: con una SEGUNDA boveda (multivault) o con una que adopto la cuenta, ningun aparato ni servicio puede emparejarse ni renovar por ella («the record is from a profile other than the one you saw»). Y no protegia: el acta no se verificaba. Ademas requestRenew guardaba el papel renovado sin comprobarlo",
        "fix": "sube a @dotrino/identity 0.92.0 (checkVaultReply)"
      },
      {
        "product": "vault",
        "versions": [
          "0.43.0",
          "0.44.0",
          "0.45.0",
          "0.45.1",
          "0.46.0",
          "0.47.0",
          "0.47.1",
          "0.48.0",
          "0.49.0",
          "0.49.1",
          "0.50.0",
          "0.51.0",
          "0.52.0",
          "0.53.0",
          "0.54.0",
          "0.60.1",
          "0.60.2",
          "0.60.3",
          "0.60.4",
          "0.61.0",
          "0.62.0",
          "0.62.1",
          "0.63.0"
        ],
        "why": "el enrolamiento de servicios (enrollWithVault) comparaba acta.profileId con la llave de la boveda al emparejar y al renovar, y eso solo es verdad en una cuenta que nacio en esa boveda: con una SEGUNDA boveda (multivault) o con una que adopto la cuenta, ningun aparato ni servicio puede emparejarse ni renovar por ella («the record is from a profile other than the one you saw»). Y no protegia: el acta no se verificaba; y al renovar se guardaba el papel sin verificar su firma",
        "fix": "sube a @dotrino/vault 0.64.0 (y @dotrino/env 0.64.0)"
      },
      {
        "product": "vaultd",
        "versions": [
          "0.73.0",
          "0.74.0",
          "0.75.0",
          "0.75.1",
          "0.76.0",
          "0.77.0",
          "0.78.0",
          "0.79.0",
          "0.80.0",
          "0.80.1",
          "0.80.2",
          "0.81.0",
          "0.82.0",
          "0.83.0",
          "0.84.0",
          "0.85.0",
          "0.86.0",
          "0.87.0",
          "0.88.0",
          "0.89.0",
          "0.90.0",
          "0.91.0",
          "0.92.0",
          "0.93.0",
          "0.93.1",
          "0.94.0",
          "0.94.1",
          "0.95.0",
          "0.96.0",
          "0.97.0",
          "0.98.0",
          "0.105.1",
          "0.105.2",
          "0.105.3",
          "0.106.0",
          "0.106.1",
          "0.106.2",
          "0.107.0",
          "0.107.1",
          "0.107.2",
          "0.108.0",
          "0.109.0",
          "0.111.0",
          "0.111.1",
          "0.112.0",
          "0.112.1",
          "0.113.0",
          "0.114.0",
          "0.115.0",
          "0.116.0",
          "0.117.0"
        ],
        "why": "trae @dotrino/identity 0.81.0 dentro: una boveda que hace `join` contra otra que no es la del genesis no puede entrar, y el cliente de referencia (src/client.js) comparaba acta.profileId con la llave de la boveda al emparejar y al renovar, y eso solo es verdad en una cuenta que nacio en esa boveda: con una SEGUNDA boveda (multivault) o con una que adopto la cuenta, ningun aparato ni servicio puede emparejarse ni renovar por ella («the record is from a profile other than the one you saw»). Y no protegia: el acta no se verificaba",
        "fix": "sube a @dotrino/vaultd 0.118.0"
      },
      {
        "product": "remote-agent",
        "versions": [
          "0.6.0",
          "0.6.1",
          "0.6.2",
          "0.7.0",
          "0.7.1",
          "0.8.0",
          "0.9.0",
          "0.9.1",
          "0.9.2"
        ],
        "why": "la renovacion del papel comparaba acta.profileId con la llave de la boveda al emparejar y al renovar, y eso solo es verdad en una cuenta que nacio en esa boveda: con una SEGUNDA boveda (multivault) o con una que adopto la cuenta, ningun aparato ni servicio puede emparejarse ni renovar por ella («the record is from a profile other than the one you saw»). Y no protegia: el acta no se verificaba: el agente no renueva nunca contra una segunda boveda, y los permisos que le cambies no le llegan",
        "fix": "sube a @dotrino/remote-agent 0.10.0"
      },
      {
        "product": "env",
        "versions": [
          "0.60.2",
          "0.60.3",
          "0.60.4",
          "0.61.0",
          "0.62.0",
          "0.62.1",
          "0.63.0"
        ],
        "why": "es un envoltorio de @dotrino/vault y pide ^0.6x.y, o sea que se queda en una version rota de vault: un servicio no puede emparejarse con una segunda boveda ni con una que adopto la cuenta, y al renovar guardaba el papel sin verificar su firma",
        "fix": "sube a @dotrino/env 0.64.0"
      },
      {
        "product": "env",
        "versions": [
          "0.33.2"
        ],
        "why": "pide @dotrino/vault ^0.33.2, que es anterior al acta de perfil: al enrolar contesta «invalid cert: no-acta», que es verdad y no es la causa",
        "fix": "sube a @dotrino/env 0.64.0"
      },
      {
        "product": "identity",
        "versions": [
          "0.96.0"
        ],
        "why": "core.js importa @dotrino/vault/login-client con el nombre escrito, y ese archivo lo empaqueta cada app: el build se cae con «Rollup failed to resolve import», sin llegar a ejecutar esa linea",
        "fix": "sube a @dotrino/identity 0.96.1, que pone el especificador en una variable"
      }
    ]
  }
})
