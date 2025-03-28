// src/modules/consulta-proveedor/application/dtos/faceted-search-result.dto.ts

import { FacetGroup } from './facet.dto';

/**
 * Información de un enlace HATEOAS
 */
export class Link {
  /**
   * URI del recurso
   */
  href: string;

  /**
   * Relación del enlace con el recurso actual
   */
  rel: string;
}

/**
 * Colección de enlaces relacionados
 */
export class Links {
  /**
   * Enlace a sí mismo
   */
  self?: Link;

  /**
   * Enlace a la página siguiente
   */
  next?: Link;

  /**
   * Enlace a la página anterior
   */
  previous?: Link;
}

/**
 * Información de paginación
 */
export class PageInfo {
  /**
   * Número máximo de elementos por página
   */
  pageSize: number;

  /**
   * Índice de inicio para la paginación (basado en 0)
   */
  pageStartIndex: number;

  /**
   * Número total de elementos encontrados
   */
  totalElements: number;

  /**
   * Número total de páginas
   */
  totalPages: number;

  /**
   * Número de página actual
   */
  currentPage: number;
}

/**
 * Resultado de búsqueda facetada genérico para cualquier tipo de entidad
 */
export class FacetedSearchResult<T> {
  /**
   * Lista de elementos encontrados
   */
  elements: T[];

  /**
   * Facetas disponibles para filtrar
   */
  facets: FacetGroup;

  /**
   * Información de paginación
   */
  pageInfo: PageInfo;

  /**
   * Enlaces relacionados (HATEOAS)
   */
  links: Links;
}
