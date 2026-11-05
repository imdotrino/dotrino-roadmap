// Tipos de las dependencias del ecosistema que se publican sin .d.ts. Solo lo que este
// paquete usa, con la firma que documenta su JSDoc.

declare module '@dotrino/compat/ranges' {
  /** `false` también cuando el rango no se entiende. */
  export function satisfies (version: string, range: string | string[]): boolean
}

declare module '@dotrino/compat' {
  export interface BrokenEntry {
    product: string
    versions: string | string[]
    why?: string
    fix?: string
  }
  export function isBroken (
    list: BrokenEntry[] | null | undefined,
    query: { product: string, version: string }
  ): BrokenEntry | null
}

declare module '@dotrino/update/notice' {
  export function printUpdateNotice (opts?: {
    current?: string
    source?: string
    pkg?: string
    product?: string
    how?: string
    [key: string]: unknown
  }): Promise<boolean>
}
