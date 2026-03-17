---
name: docs
description: Genera documentación JSDoc para funciones, clases e interfaces TypeScript del archivo especificado o del archivo actual.
disable-model-invocation: false
allowed-tools: Read, Edit, Bash(npx tsc --noEmit:*)
---

## Tarea

Genera documentación JSDoc completa para: $ARGUMENTS (si no se especifica, usa el archivo activo en contexto).

### Paso 1 — leer el archivo

Lee el archivo completo. Identifica todos los elementos exportados que necesitan documentación:

- Funciones y métodos
- Clases e interfaces
- Types y enums
- Constantes exportadas con lógica no obvia

Ignora: imports, re-exports simples, constantes triviales (`const MAX = 100`).

### Paso 2 — evaluar qué ya está documentado

- Si un elemento ya tiene JSDoc completo y correcto → no lo toques
- Si tiene JSDoc incompleto (falta `@param`, `@returns`, etc.) → complétalo
- Si no tiene nada → agrégalo

### Paso 3 — escribir el JSDoc

Formato base para funciones:

```ts
/**
 * Descripción breve en una línea, en español, en indicativo.
 *
 * Descripción extendida opcional si la función tiene comportamiento
 * no obvio, casos borde importantes o lógica compleja.
 *
 * @param nombreParam - Qué es y qué representa. Incluir restricciones si las hay.
 * @returns Qué devuelve y bajo qué condiciones.
 * @throws {TipoDeError} Cuándo y por qué lanza este error.
 *
 * @example
 * const result = miFuncion('valor');
 * // result => 'resultado esperado'
 */
```

Reglas de escritura:

- Primera línea: frase corta, indicativo, sin "Esta función...". Directo: "Valida el formato de un email."
- `@param`: nombre del parámetro seguido de guion y descripción. Si es opcional, indicarlo.
- `@returns`: describe el valor de retorno, no el tipo (el tipo ya está en TypeScript).
- `@throws`: solo si la función lanza errores explícitamente.
- `@example`: obligatorio para funciones públicas de utilidad. Opcional para métodos internos.
- `@deprecated`: si aplica, con nota de qué usar en su lugar.

Formato para interfaces y types:

```ts
/**
 * Representa un usuario autenticado en el sistema.
 */
interface User {
  /** Identificador único, generado por la base de datos. */
  id: string;
  /** Email del usuario, usado como login. Debe ser único. */
  email: string;
  /** Fecha de creación en UTC. */
  createdAt: Date;
}
```

Formato para clases:

```ts
/**
 * Descripción de la clase y su responsabilidad principal.
 *
 * @example
 * const servicio = new MiServicio(config);
 * await servicio.init();
 */
class MiServicio {
  /**
   * Crea una nueva instancia del servicio.
   * @param config - Configuración inicial requerida.
   */
  constructor(config: Config) {}
}
```

### Paso 4 — verificar tipos

Después de editar, ejecuta:

```bash
npx tsc --noEmit --skipLibCheck
```

Si hay errores de tipos introducidos por los comentarios (raro pero posible con `@type` en JSDoc puro), corrígelos.

### Paso 5 — resumen

Al terminar, muestra:

- Cuántos elementos documentados (nuevos vs actualizados)
- Si algún elemento fue omitido y por qué
- Si hay funciones complejas que merecerían documentación más extensa

## Opciones via $ARGUMENTS

- Sin argumentos → documenta el archivo activo en la conversación
- `src/utils/email.ts` → documenta ese archivo específico
- `src/utils/` → documenta todos los `.ts` de esa carpeta
- `--public` → documenta solo exports públicos, ignora funciones internas
- `--brief` → solo primera línea JSDoc, sin `@example` ni descripción extendida

## Lo que NO hacer

- No inventes comportamiento que no está en el código
- No documentes lo obvio: `/** Suma dos números */ function add(a: number, b: number)`
- No uses "Esta función", "Este método", "Este parámetro" — ve directo
- No cambies el código, solo los comentarios
- No agregues `@author`, `@version`, ni `@since` salvo que el proyecto ya los use
