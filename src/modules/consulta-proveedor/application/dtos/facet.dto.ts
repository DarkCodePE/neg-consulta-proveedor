// src/modules/consulta-proveedor/application/dtos/facet.dto.ts

/**
 * Representa un valor de faceta con su conteo
 */
export class Facet {
  /**
   * Valor de la faceta
   */
  value: string;

  /**
   * Cantidad de elementos que tienen este valor
   */
  count: number;
}

/**
 * Grupo de facetas organizadas por categoría
 */
export class FacetGroup {
  /**
   * Colección de facetas indexadas por nombre de categoría
   */
  [key: string]: Facet[];
}
