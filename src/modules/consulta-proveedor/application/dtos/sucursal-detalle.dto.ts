// src/modules/consulta-proveedor/application/dtos/sucursal-detalle.dto.ts

import { ContactoDto } from './contacto.dto';
import { ServicioSucursalDto } from './servicio-sucursal.dto';

/**
 * Detalles completos de una sucursal de proveedor
 */
export class SucursalDetalleDto {
  /**
   * Identificador único de la sucursal
   */
  id: string;

  /**
   * Nombre de la sucursal
   */
  nombre: string;

  /**
   * Dirección completa de la sucursal
   */
  direccion: string;

  /**
   * Distrito de la sucursal
   */
  distrito: string;

  /**
   * Provincia de la sucursal
   */
  provincia: string;

  /**
   * Departamento de la sucursal
   */
  departamento: string;

  /**
   * Identificador del proveedor asociado
   */
  proveedorId: string;

  /**
   * Nombre del proveedor asociado
   */
  nombreProveedor: string;

  /**
   * Tipo del proveedor asociado
   */
  tipoProveedor: string;

  /**
   * Lista de información de contacto de la sucursal
   */
  contactos: ContactoDto[];

  /**
   * Lista de servicios disponibles en la sucursal
   */
  servicios: ServicioSucursalDto[];

  /**
   * Lista de horarios de atención (Opcional)
   */
  horarios?: any[];
}
