// src/modules/consulta-proveedor/application/dtos/sort-criteria.dto.ts

/**
 * Criterio para ordenamiento de resultados
 */
export class SortCriteriaDto {
  /**
   * Campo por el cual ordenar
   */
  field: string;

  /**
   * Dirección del ordenamiento
   */
  direction: 'asc' | 'desc' = 'asc';
}
