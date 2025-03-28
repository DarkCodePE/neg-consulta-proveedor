// src/modules/consulta-proveedor/application/dtos/sucursal-search-response.dto.ts

import { SucursalDetalleDto } from './sucursal-detalle.dto';
import { FacetGroup } from './facet.dto';
import { Links } from './faceted-search-result.dto';

/**
 * DTO para respuestas de búsqueda facetada de sucursales
 */
export class SucursalSearchResponseDto {
  /**
   * Lista de sucursales encontradas
   */
  elements: SucursalDetalleDto[];

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
