// src/modules/consulta-proveedor/application/dtos/proveedor-search-response.dto.ts

import { ProveedorResumenDto } from './proveedor-resumen.dto';
import { FacetGroup } from './facet.dto';
import { Links } from './faceted-search-result.dto';

/**
 * DTO para respuestas de búsqueda facetada de proveedores
 */
export class ProveedorSearchResponseDto {
  /**
   * Lista de proveedores encontrados
   */
  elements: ProveedorResumenDto[];

  /**
   * Facetas disponibles para filtrar
   */
  facets: FacetGroup;

  /**
   * Número de elementos en la página actual
   */
  size: number;

  /**
   * Número total de elementos que cumplen con los criterios de búsqueda
   */
  totalElements: number;

  /**
   * Número máximo de elementos por página
   */
  pageSize: number;

  /**
   * Índice de inicio de la página actual
   */
  pageStartIndex: number;

  /**
   * Número de página actual
   */
  currentPage: number;

  /**
   * Número total de páginas
   */
  totalPages: number;

  /**
   * Enlaces relacionados (HATEOAS)
   */
  links: Links;
}
