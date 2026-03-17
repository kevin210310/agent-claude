---
name: commit
description: Crea un commit de Git semántico siguiendo Conventional Commits. Úsalo cuando el usuario quiera commitear cambios, guardar progreso o registrar una modificación.
disable-model-invocation: true
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git log:*)
---

## Contexto actual

- Estado del repositorio: !`git status --short`
- Rama actual: !`git branch --show-current`
- Cambios pendientes: !`git diff HEAD --stat`
- Último commit: !`git log --oneline -1`

## Tarea

Crea un commit semántico siguiendo estos pasos en orden:

### Paso 1 — analizar los cambios

Lee `git diff HEAD` completo para entender qué cambió, en qué archivos y por qué.
Agrupa los archivos por tipo de cambio. Si hay cambios mezclados (ej: feat + fix),
prioriza el tipo más significativo o sugiere dividir en dos commits.

### Paso 2 — elegir tipo y scope

Tipos disponibles:

- `feat` — nueva funcionalidad visible para el usuario
- `fix` — corrección de un bug
- `refactor` — reorganización sin cambiar comportamiento
- `test` — agregar o corregir tests
- `docs` — solo documentación
- `chore` — tareas de mantenimiento (deps, config, build)
- `style` — formato, espacios, comas (sin cambio lógico)
- `perf` — mejora de rendimiento

Scope (opcional): nombre del módulo afectado en minúsculas.
Ejemplos: `auth`, `api`, `ui`, `db`, `utils`, `types`

Si hay breaking changes, agrega `!` después del tipo: `feat!:`

### Paso 3 — redactar el mensaje

Formato obligatorio:

```
tipo(scope): descripción en imperativo, presente, español

[cuerpo opcional si los cambios son complejos]

[BREAKING CHANGE: descripción si aplica]
```

Reglas del mensaje:

- Descripción en imperativo: "agregar", "corregir", "extraer" — no "agregado" ni "se agrega"
- Máximo 72 caracteres en la primera línea
- Sin punto final
- Sin mayúscula inicial (el tipo ya define el tono)

Ejemplos correctos:

```
feat(auth): agregar validación de token JWT
fix(api): corregir manejo de errores 404 en /users
refactor(utils): extraer función parseDate a helpers
test(auth): agregar tests para middleware de sesión
chore: actualizar dependencias de desarrollo
```

### Paso 4 — ejecutar

```bash
git add .
git commit -m "tipo(scope): descripción"
```

Si se pasa `$ARGUMENTS`:

- `--amend` → agrega `--amend --no-edit` al commit
- `--scope <nombre>` → usa ese scope aunque no lo detecte
- `--dry-run` → muestra el mensaje propuesto sin ejecutar
- `--push` → ejecuta `git push` después del commit

### Paso 5 — confirmar

Muestra al usuario:

1. El mensaje de commit usado
2. Los archivos incluidos (resumen de `git show --stat HEAD`)
3. El hash corto del commit

## Si no hay cambios

Si `git status` está limpio, informar: "No hay cambios para commitear."
Mostrar el último commit como referencia.
