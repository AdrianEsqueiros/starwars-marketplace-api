/**
 * Convierte una cadena a lowercase y elimina tildes.
 * @param str - Cadena a formatear.
 * @returns Cadena formateada.
 */
export function formatQuery(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD') // Descompone caracteres como á en a + ́
    .replace(/[\u0300-\u036f]/g, ''); // Elimina marcas diacríticas
}
