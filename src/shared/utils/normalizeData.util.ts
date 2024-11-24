export function normalizeData<T>(data: T): any {
  function clean(obj: any): any {
    if (Array.isArray(obj)) {
      // Si es un array, iterar sobre cada elemento y limpiarlo
      return obj.map(clean);
    } else if (obj && typeof obj === 'object') {
      // Si es un objeto, recorrer sus claves
      const cleanedObj: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value && typeof value === 'object' && 'S' in value) {
          cleanedObj[key] = value.S; // Extraer el valor de S
        } else if (value && typeof value === 'object' && 'N' in value) {
          cleanedObj[key] = parseFloat((value as { N: string }).N); // Convertir N a número
        } else if (value && typeof value === 'object' && 'BOOL' in value) {
          cleanedObj[key] = value.BOOL; // Extraer el valor de BOOL
        } else if (value && typeof value === 'object' && 'M' in value) {
          cleanedObj[key] = clean(value.M); // Procesar recursivamente el contenido de M
        } else if (value && typeof value === 'object' && 'L' in value) {
          cleanedObj[key] = clean(value.L); // Procesar recursivamente el contenido de L
        } else {
          cleanedObj[key] = clean(value); // Procesar recursivamente
        }
      }
      return cleanedObj;
    }
    return obj; // Devolver valores que no necesitan limpieza
  }

  return clean(data);
}
