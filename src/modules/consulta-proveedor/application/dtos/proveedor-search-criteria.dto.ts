// src/modules/consulta-proveedor/application/dtos/proveedor-search-criteria.dto.ts

import { SortCriteriaDto } from './sort-criteria.dto';

/**
 * Criterios para búsqueda facetada de proveedores
 */
export class ProveedorSearchCriteria {
  /**
   * Filtro por compañía EPS (DESCRIPCION de TABLA_AGRUPA_DATO_DETALLE = 'EPS')
   */
  eps?: string;

  /**
   * Filtro por compañía AMED (DESCRIPCION de TABLA_AGRUPA_DATO_DETALLE = 'AMED')
   */
  amed?: string;

  /**
   * Código único del proveedor (COD_PROVEEDOR)
   */
  codigoProveedor?: string;

  /**
   * Estado del proveedor (STATUS_REGISTRO)
   */
  estado?: string;

  /**
   * Tipo de documento del proveedor (TIPO_DOCUMENTO)
   */
  tipoDocumento?: string;

  /**
   * Número de documento del proveedor (NUMERO_DOCUMENTO)
   */
  numeroDocumento?: string;

  /**
   * Lista de RUCs para filtrar
   */
  ruc?: string[];

  /**
   * Tipo de proveedor según catálogo (TIPO_PROVEEDOR)
   */
  tipoProveedor?: string;

  /**
   * Indica si el proveedor es nacional (N) o extranjero (E) (IND_NACIONAL)
   */
  indicadorNacional?: string;

  /**
   * Tipo de persona (TIPOPER - N=Natural, J=Jurídica)
   */
  tipoPersona?: string;

  /**
   * Razón social o nombre del proveedor (NOMTER)
   */
  razonSocial?: string;

  /**
   * Indica si el proveedor pertenece a la red selecta (IND_RED_SELECTA - S=Sí, N=No)
   */
  indicadorRedSelecta?: string;

  /**
   * Indica si el proveedor tiene certificación (IND_CERTIFICACION - S=Sí, N=No)
   */
  indicadorCertificacion?: string;

  /**
   * Número máximo de elementos por página
   */
  pageSize: number = 20;

  /**
   * Índice de inicio para la paginación (basado en 0)
   */
  pageStartIndex: number = 0;

  /**
   * Criterios de ordenamiento
   */
  sort?: SortCriteriaDto[];
}
