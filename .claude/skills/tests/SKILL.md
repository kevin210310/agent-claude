---
name: test-gen
description: Genera tests con Vitest para el archivo especificado. Úsalo cuando termines de implementar una función, módulo o endpoint y necesites cobertura de tests.
disable-model-invocation: false
allowed-tools: Read, Write, Bash(npm run test:*), Bash(npx vitest:*), Bash(npx tsc --noEmit:*)
---

## Contexto

- Archivo a testear: $ARGUMENTS (si vacío, usa el archivo activo)
- Chequeo de tipos previo: !`npx tsc --noEmit --skipLibCheck 2>&1 | head -20`

## Tarea

Lee el archivo especificado completo. Genera un archivo `.test.ts` co-localizado
con cobertura real y útil — no tests que solo verifican que el código existe.

### Paso 1 — leer y entender el código

Antes de escribir un solo test:
- Lee el archivo completo
- Identifica todas las funciones y métodos exportados
- Entiende las dependencias externas (DB, APIs, sistema de archivos)
- Busca archivos de test existentes en el proyecto como referencia de estilo
- Revisa el `package.json` para confirmar que Vitest está configurado

### Paso 2 — planificar los casos

Para cada función exportada, lista mentalmente:

**Happy path** — el caso normal que debería funcionar
**Edge cases** — entradas límite, arrays vacíos, strings vacíos, cero, negativos
**Casos de error** — inputs inválidos, fallos de dependencias, excepciones esperadas
**Casos async** — si la función es async, testea resolución y rechazo

Prioridad: cubre primero el comportamiento crítico, no la cobertura de líneas.

### Paso 3 — escribir los tests

Estructura base del archivo:
```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { funcionATestear } from './archivo';

describe('funcionATestear', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('happy path', () => {
    it('debería [comportamiento esperado] cuando [condición normal]', () => {
      // Arrange
      const input = ...;

      // Act
      const result = funcionATestear(input);

      // Assert
      expect(result).toEqual(...);
    });
  });

  describe('edge cases', () => {
    it('debería [comportamiento] cuando recibe array vacío', () => { ... });
    it('debería [comportamiento] cuando recibe string vacío', () => { ... });
    it('debería [comportamiento] cuando recibe null', () => { ... });
  });

  describe('errores', () => {
    it('debería lanzar [TipoError] cuando [condición de error]', () => {
      expect(() => funcionATestear(inputInvalido)).toThrow(TipoError);
    });
  });
});
```

Reglas de escritura:

- Un `it` por comportamiento — nunca dos assertions lógicamente distintas en el mismo test
- Nombres en español, formato: "debería [comportamiento] cuando [condición]"
- Patrón Arrange / Act / Assert con comentarios si el test tiene más de 5 líneas
- `describe` anidado para agrupar happy path, edge cases y errores por separado
- Nunca uses `test()` — siempre `it()` para consistencia

### Paso 4 — mockear dependencias

**Módulos externos** (DB, APIs, filesystem):
```ts
vi.mock('../db/client', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    }
  }
}));
```

**Funciones específicas dentro del módulo**:
```ts
import * as utils from './utils';
vi.spyOn(utils, 'formatDate').mockReturnValue('2024-01-01');
```

**Variables de entorno**:
```ts
beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'test');
});

afterEach(() => {
  vi.unstubAllEnvs();
});
```

**Fechas y tiempo**:
```ts
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2024-01-15'));
});

afterEach(() => {
  vi.useRealTimers();
});
```

Regla importante: mockea en el nivel más bajo posible. Si puedes pasar el mock
como parámetro en lugar de mockear el módulo entero, hazlo — los tests son más
simples y más fáciles de mantener.

### Paso 5 — tests para endpoints Express

Si el archivo contiene rutas Express, usa `supertest`:
```ts
import request from 'supertest';
import { app } from '../app';

describe('POST /users/:id/avatar', () => {
  it('debería retornar 200 con usuario actualizado cuando la imagen es válida', async () => {
    const response = await request(app)
      .post('/users/123/avatar')
      .attach('avatar', Buffer.from('fake-image'), {
        filename: 'avatar.jpg',
        contentType: 'image/jpeg',
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: '123',
      avatarUrl: expect.stringContaining('/uploads/avatars/'),
    });
  });

  it('debería retornar 413 cuando el archivo supera 2MB', async () => {
    const bigBuffer = Buffer.alloc(3 * 1024 * 1024); // 3MB

    const response = await request(app)
      .post('/users/123/avatar')
      .attach('avatar', bigBuffer, {
        filename: 'big.jpg',
        contentType: 'image/jpeg',
      });

    expect(response.status).toBe(413);
  });

  it('debería retornar 404 cuando el usuario no existe', async () => { ... });
  it('debería retornar 400 cuando el formato no es jpg ni png', async () => { ... });
  it('debería retornar 401 cuando no hay token de autenticación', async () => { ... });
});
```

### Paso 6 — correr los tests generados

Después de escribir el archivo, ejecuta:
```bash
npm run test -- --run src/ruta/archivo.test.ts
```

Si hay tests fallando:
1. Lee el error completo
2. Determina si el error está en el test o en el código fuente
3. Si está en el test → corrige el mock o la assertion
4. Si está en el código fuente → reporta el bug encontrado al usuario
   antes de corregirlo (puede ser intencional)

### Paso 7 — resumen final

Al terminar muestra:
- Nombre del archivo de test creado
- Cuántos tests generados y para qué funciones
- Cobertura estimada de los casos críticos
- Si encontraste algún bug real en el código fuente durante el proceso
- Casos que deliberadamente no testeaste y por qué

## Opciones via $ARGUMENTS

- Sin argumentos → testea el archivo activo en la conversación
- `src/utils/email.ts` → genera `src/utils/email.test.ts`
- `src/utils/` → genera tests para todos los `.ts` de esa carpeta
- `--unit` → solo tests unitarios, sin supertest ni integración
- `--integration` → enfoca en tests de integración con DB real o supertest
- `--coverage` → después de generar, corre `vitest --coverage` y muestra el reporte

## Lo que NO hacer

- No generes tests que solo verifican que una función retorna algo
  (`expect(result).toBeDefined()` no prueba nada útil)
- No mockees todo indiscriminadamente — si una función es pura, no necesita mocks
- No uses `any` en los tests aunque el código fuente lo use
- No generes un test por cada línea de código — genera un test por comportamiento
- No ignores los tests que fallan — un test fallando es información valiosa