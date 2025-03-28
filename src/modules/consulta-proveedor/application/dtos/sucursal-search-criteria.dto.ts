// src/modules/consulta-proveedor/application/dtos/sucursal-search-criteria.dto.ts

import { SortCriteriaDto } from './sort-criteria.dto';

/**
 * Criterios para búsqueda facetada de sucursales
 */
export class SucursalSearchCriteria {
  /**
   * ID del proveedor para filtrar sucursales
   */
  proveedorId?: string;

  /**
   * Tipo de proveedor (CLINICA, HOSPITAL, LABORATORIO, etc.)
   */
  tipoProveedor?: string;

  /**
   * Departamento de ubicación de la sucursal
   */
  departamento?: string;

  /**
   * Provincia de ubicación de la sucursal
   */
  provincia?: string;

  /**
   * Distrito de ubicación de la sucursal
   */
  distrito?: string;

  /**
   * Código o nombre del servicio ofrecido por la sucursal
   */
  servicio?: string;

  /**
   * Día de atención (LUNES, MARTES, etc.) para filtrar sucursales que atienden ese día
   */
  horarioAtencion?: string;

  /**
   * Hora mínima de atención (formato HH:MM) para filtrar sucursales
   */
  horaAtencionDesde?: string;

  /**
   * Hora máxima de atención (formato HH:MM) para filtrar sucursales
   */
  horaAtencionHasta?: string;

  /**
   * Nombre o parte del nombre de la sucursal
   */
  nombreSucursal?: string;

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
