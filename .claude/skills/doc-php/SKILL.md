name: docs
description: Genera documentación PHPDoc para funciones, métodos, clases, interfaces, traits, enums y propiedades PHP del archivo especificado o del archivo actual.
disable-model-invocation: false
allowed-tools: Read, Edit, Bash(vendor/bin/phpstan analyse:*)
Tarea

Genera documentación PHPDoc completa para: $ARGUMENTS (si no se especifica, usa el archivo activo en contexto).

Paso 1 — leer el archivo

Lee el archivo completo. Identifica todos los elementos que necesitan documentación:

Funciones y métodos
Clases
Interfaces
Traits
Enums
Propiedades de clases cuando su propósito o restricciones no sean obvios
Constantes con lógica o significado no obvio

Ignora:

use / imports
Re-exports
Constantes triviales
Elementos cuyo propósito sea completamente obvio por su nombre y tipo
Paso 2 — evaluar qué ya está documentado
Si un elemento ya tiene PHPDoc completo y correcto → no lo toques
Si tiene PHPDoc incompleto (falta @param, @return, @throws, etc.) → complétalo
Si no tiene PHPDoc → agrégalo
No reemplaces documentación existente que sea correcta solo para cambiar su estilo
Paso 3 — escribir el PHPDoc

Formato base para funciones y métodos:

/**
 * Descripción breve en una línea, en indicativo.
 *
 * Descripción extendida opcional si la función tiene comportamiento
 * no obvio, casos borde importantes o lógica compleja.
 *
 * @param Tipo $nombreParam Qué es y qué representa. Incluir restricciones si las hay.
 * @return Tipo Qué devuelve y bajo qué condiciones.
 * @throws TipoDeExcepcion Cuándo y por qué lanza esta excepción.
 *
 * @example
 * $result = miFuncion('valor');
 * // $result === 'resultado esperado'
 */


Reglas de escritura:

Primera línea: frase corta, indicativo, sin "Esta función..." o "Este método...".
Escribe directamente la acción: "Valida el formato de un email."
@param: incluye el tipo PHPDoc, el nombre del parámetro y su descripción.
@return: incluye el tipo PHPDoc y describe qué devuelve y bajo qué condiciones.
Usa @return void cuando el método no devuelve ningún valor.
@throws: solo si el código puede lanzar explícitamente esa excepción o si la excepción forma parte clara del contrato del método.
No inventes excepciones que el código no pueda lanzar.
@example: obligatorio para funciones públicas de utilidad. Opcional para métodos internos.
@deprecated: si aplica, indica qué usar en su lugar.
Usa tipos PHPDoc precisos cuando el tipo nativo de PHP no exprese toda la información disponible:
array<string, mixed>
array<int, User>
list<string>
?string
User|null
callable
class-string<Foo>
iterable<int, User>
Si el proyecto utiliza tipos genéricos, templates u otras convenciones PHPDoc, respétalas.
Aprovecha los tipos nativos de PHP y no dupliques información innecesariamente.

Ejemplo:

/**
 * Calcula el total de una compra.
 *
 * @param float $precio Precio unitario del producto.
 * @param int $cantidad Cantidad de unidades.
 * @return float Total de la compra.
 */
function calcularTotal(float $precio, int $cantidad): float
{
    return $precio * $cantidad;
}

Formato para clases
/**
 * Gestiona las operaciones relacionadas con usuarios.
 *
 * Proporciona métodos para crear, consultar y actualizar usuarios.
 *
 * @example
 * $servicio = new UserService($repository);
 * $usuario = $servicio->findById(123);
 */
class UserService
{
    /**
     * Crea una nueva instancia del servicio.
     *
     * @param UserRepository $repository Repositorio utilizado para acceder a los usuarios.
     */
    public function __construct(
        private UserRepository $repository
    ) {}
}

Formato para interfaces
/**
 * Define las operaciones disponibles para un repositorio de usuarios.
 */
interface UserRepository
{
    /**
     * Busca un usuario por su identificador.
     *
     * @param int $id Identificador único del usuario.
     * @return User|null Usuario encontrado o null si no existe.
     */
    public function findById(int $id): ?User;
}

Formato para propiedades

Documenta propiedades cuando su propósito, formato o restricciones no sean evidentes:

class User
{
    /**
     * Identificador único generado por la base de datos.
     */
    private int $id;

    /**
     * Email utilizado para iniciar sesión.
     *
     * Debe ser único dentro del sistema.
     */
    private string $email;
}


No agregues PHPDoc redundante cuando la declaración ya comunica claramente su propósito:

private string $name;

Formato para enums
/**
 * Define los estados posibles de un pedido.
 */
enum OrderStatus: string
{
    /** Pedido creado pero todavía no procesado. */
    case Pending = 'pending';

    /** Pedido procesado correctamente. */
    case Completed = 'completed';

    /** Pedido cancelado. */
    case Cancelled = 'cancelled';
}

Formato para constantes

Documenta constantes cuando su significado no sea evidente:

/**
 * Tiempo máximo de espera de una solicitud HTTP, en segundos.
 */
private const REQUEST_TIMEOUT = 30;


No documentes constantes triviales cuyo nombre y valor sean suficientes para entenderlas.

Paso 4 — verificar tipos

Después de editar, ejecuta:

vendor/bin/phpstan analyse


Si el proyecto tiene una configuración específica de PHPStan, respétala.

Si vendor/bin/phpstan no existe, no instales dependencias ni modifiques la configuración. Indica en el resumen que la verificación estática no pudo ejecutarse.

La documentación PHPDoc no debe introducir errores de tipos. Si PHPStan detecta problemas relacionados con los comentarios agregados, corrígelos sin modificar la lógica del código.

Paso 5 — resumen

Al terminar, muestra:

Cuántos elementos fueron documentados por primera vez
Cuántos PHPDoc existentes fueron actualizados
Si algún elemento fue omitido y por qué
Si la verificación con PHPStan se ejecutó correctamente
Si hay funciones, métodos o clases complejas que merecerían documentación más extensa
Opciones vía $ARGUMENTS
Sin argumentos → documenta el archivo PHP activo en la conversación
src/Utils/Email.php → documenta ese archivo específico
src/Utils/ → documenta todos los .php de esa carpeta
--public → documenta solo clases, métodos, funciones y elementos públicos; ignora elementos internos
--brief → solo primera línea PHPDoc, sin @example ni descripción extendida

Las opciones pueden combinarse, por ejemplo:

src/Utils/ --public --brief

Lo que NO hacer
No inventes comportamiento que no está en el código.
No inventes tipos, excepciones, parámetros ni valores de retorno.
No documentes lo obvio:
/** Suma dos números. */
function add(int $a, int $b): int

si el proyecto no requiere explícitamente documentación para funciones tan simples.
No uses "Esta función", "Este método", "Esta clase", "Este parámetro" — ve directo a la descripción.
No cambies la lógica, estructura ni comportamiento del código; modifica únicamente los comentarios PHPDoc.
No cambies tipos nativos, nombres, visibilidad ni firmas de métodos.
No agregues @author, @version ni @since salvo que el proyecto ya los utilice.
No agregues etiquetas PHPDoc innecesarias o redundantes.
Respeta las convenciones de documentación existentes en el proyecto.
