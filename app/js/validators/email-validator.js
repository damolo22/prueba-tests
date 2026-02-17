/**
 * Valida si un email tiene un formato válido
 * @param {string} email - El email a validar
 * @returns {boolean} - true si el email es válido, false en caso contrario
 */
export function isValidEmail(email) {
    // Validar que sea una cadena
    if (typeof email !== 'string') {
        return false;
    }

    // Eliminar espacios en blanco al inicio y final
    const trimmedEmail = email.trim();

    // Si está vacío después de trim, no es válido
    if (trimmedEmail === '') {
        return false;
    }

    // Rechazar emails con puntos consecutivos
    if (trimmedEmail.includes('..')) {
        return false;
    }

    // Rechazar emails que terminan con punto
    if (trimmedEmail.endsWith('.')) {
        return false;
    }

    // Expresión regular mejorada para validar email
    // - No permite espacios ni @
    // - Requiere al menos un @ en el medio
    // - Requiere al menos un punto en el dominio
    // - No permite que empiece o termine con punto
    const emailRegex = /^[^\s@.][^\s@]*@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(trimmedEmail);
}
