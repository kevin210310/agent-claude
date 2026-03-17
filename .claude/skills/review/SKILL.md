---
name: review
description: Revisa el código del archivo actual o especificado. Busca bugs, problemas de tipos TypeScript, seguridad, rendimiento y legibilidad. Úsalo antes de hacer un commit o abrir un PR.
disable-model-invocation: false
allowed-tools: Read, Bash(git diff:*), Bash(npx tsc --noEmit:*), Bash(npx eslint:*)
---

## Contexto

- Archivo(s) a revisar: $ARGUMENTS (si vacío, usa el archivo activo)
- Diff reciente: !`git diff HEAD -- $ARGUMENTS 2>/dev/null | head -100`
- Errores de tipos: !`npx tsc --noEmit --skipLibCheck 2>&1 | head -30`
- Errores de lint: !`npx eslint $ARGUMENTS --format compact 2>&1 | head -30`

## Tarea

Revisa el código con mentalidad de senior engineer en code review. No busques
perfección estilística — busca problemas reales que podrían causar bugs,
vulnerabilidades o deuda técnica costosa.

### Orden de evaluación (de más a menos crítico)

#### 1. Bugs y errores lógicos

Lo más importante. Busca:

- Condiciones que siempre son true/false
- Race conditions en código async
- Mutación accidental de parámetros o estado compartido
- Null/undefined no manejados en rutas de ejecución reales
- Comparaciones con `==` donde debería ser `===`
- Índices fuera de rango, arrays vacíos no verificados
- Retornos implícitos `undefined` donde se espera un valor

#### 2. Problemas de TypeScript

- Uso de `any` o `as unknown as X` (type assertion insegura)
- Tipos opcionales (`T | undefined`) usados sin verificación
- Enums numéricos que podrían recibir valores fuera de rango
- Generics sin restricciones donde deberían tenerlas (`<T>` vs `<T extends object>`)
- `!` non-null assertion sin justificación

#### 3. Seguridad

- Inputs del usuario usados sin sanitización
- SQL/NoSQL injection posible (concatenación de strings en queries)
- Secretos o tokens hardcodeados
- Datos sensibles en logs (`console.log(user)` con passwords)
- Dependencias de `process.env` sin validación en runtime

#### 4. Rendimiento

- Llamadas a DB o API dentro de loops
- Re-renders innecesarios (si es React)
- Objetos o arrays recreados en cada ejecución cuando podrían ser constantes
- Operaciones O(n²) donde existe alternativa O(n)
- Promesas no paralelizadas con `Promise.all` cuando podrían serlo

#### 5. Legibilidad y mantenibilidad

- Funciones de más de 40 líneas que hacen demasiadas cosas
- Nombres de variables de una letra fuera de contextos obvios (loops, math)
- Lógica negada encadenada (`if (!a && !b && !c)`)
- Magic numbers sin constante nombrada
- Código duplicado que podría extraerse

#### 6. Tests faltantes

- Funciones públicas sin cobertura
- Edge cases críticos no testeados (vacío, null, límites)
- Errores esperados no verificados

---

## Formato de respuesta

Usa exactamente este formato, sin secciones vacías:

// problema
[código actual]

// corrección
[código corregido]

```

---

### 🟡 Mejora recomendada
[Si no hay nada, omite esta sección]

**[Descripción]** (`línea X`)
[Explicación breve]
Sugerencia: [código o patrón alternativo]

---

### 🟢 Está bien
[Lista de 2-3 cosas concretas que están correctamente implementadas]
- [cosa específica bien hecha]

---

### Veredicto
[Una de estas tres opciones:]
- Listo para commit — sin problemas críticos
- Revisar antes de commitear — N problema(s) crítico(s)
- Requiere refactor — problemas estructurales que van más allá de este archivo
```

---

## Comportamiento según $ARGUMENTS

- Sin argumentos → revisa el archivo más reciente en la conversación
- `src/utils/email.ts` → revisa solo ese archivo
- `--pr` → revisa todos los archivos en `git diff main...HEAD`
- `--quick` → solo secciones 1 y 2 (bugs + TypeScript), respuesta corta
- `--security` → enfoca el 80% del análisis en sección 3

## Lo que NO hacer

- No comentar estilo si ESLint ya lo cubre
- No sugerir cambios de nombres sin razón funcional
- No marcar como 🔴 algo que es preferencia personal
- No repetir errores que `tsc` o `eslint` ya reportaron en el contexto
- No inventar bugs hipotéticos — solo lo que el código muestra claramente
