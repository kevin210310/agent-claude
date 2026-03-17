# Mi primera integracion con Claude

## Comandos

- `npm run dev` — servidor con hot reload
- `npm run build` — compilar a dist/
- `npm run test` — Vitest (todos los tests)
- `npm run test:watch` — Vitest en modo watch
- `npm run lint` — ESLint
- `npm run typecheck` — tsc --noEmit (sin compilar)

## Arquitectura

- `src/` — código fuente TypeScript
- `src/types/` — interfaces y tipos globales
- `src/utils/` — funciones puras reutilizables
- `src/services/` — lógica de negocio
- `src/routes/` — endpoints Express
- `tests/` — archivos `.test.ts` (co-localizados)
- `dist/` — salida compilada (NO editar)

## Reglas TypeScript

- strict mode activado — NUNCA usar `any`
- Exportaciones nombradas siempre (`export const`, no `export default`)
- Interfaces para objetos de datos, `type` para uniones y alias
- Async/await obligatorio, nunca `.then()` encadenado
- Manejo de errores con Result pattern, no try/catch desnudo

## Estilo

- 2 espacios de indentación
- Comillas simples
- Punto y coma obligatorio
- Nombres de archivos: kebab-case (`user-service.ts`)
- Nombres de funciones: camelCase descriptivo (`getUserById`, no `getUser`)

## Tests

- Framework: Vitest
- Archivos co-localizados: `src/utils/email.ts` → `src/utils/email.test.ts`
- Nombres: "debería [comportamiento] cuando [condición]"
- Un `it` por comportamiento, nunca probar dos cosas juntas
- Mockear dependencias externas con `vi.mock()`

## Commits (Conventional Commits)

Tipos: feat / fix / refactor / test / docs / chore
Formato: `tipo(scope): descripción en imperativo`
Ejemplo: `feat(auth): agregar validación de token JWT`

## IMPORTANTE

- NUNCA modificar archivos en `dist/` directamente
- Las variables de entorno van SOLO en `.env.local` (no commitear)
- La carpeta `src/migrations/` solo se toca con el CLI de Prisma
