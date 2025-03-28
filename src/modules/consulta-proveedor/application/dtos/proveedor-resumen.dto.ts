// src/modules/consulta-proveedor/application/dtos/proveedor-resumen.dto.ts

/**
 * Información resumida de un proveedor para listar en resultados de búsqueda
 */
export class ProveedorResumenDto {
  /**
   * Código único del proveedor (COD_PROVEEDOR)
   */
  codigoProveedor: string;

  /**
   * RUC del proveedor (NUMERO_DOCUMENTO)
   */
  ruc: string;

  /**
   * Razón social del proveedor (NOMTER)
   */
  razonSocial: string;

  /**
   * Razón social abreviada del proveedor (NOMCORTER)
   */
  razonSocialAbreviada?: string;

  /**
   * Estado del proveedor (STATUS_REGISTRO)
   */
  estado: string;

  /**
   * Nombre de la EPS asociada (Si DESCRIPCION de TABLA_AGRUPA_DATO_DETALLE = 'EPS')
   */
  eps?: string;

  /**
   * Código AMED asociado (Si DESCRIPCION de TABLA_AGRUPA_DATO_DETALLE = 'AMED')
   */
  amed?: string;

  /**
   * Tipo de proveedor (TIPO_PROVEEDOR)
   */
  tipoProveedor: string;

  /**
   * Tipo de persona (TIPOPER - N=Natural, J=Jurídica)
   */
  tipoPersona: string;

  /**
   * Indica si el proveedor es nacional (N) o extranjero (E) (IND_NACIONAL)
   */
  indicadorNacional: string;

  /**
   * Indica si el proveedor pertenece a la red selecta (IND_RED_SELECTA - S=Sí, N=No)
   */
  indicadorRedSelecta: string;

  /**
   * Indica si el proveedor tiene certificación (IND_CERTIFICACION - S=Sí, N=No)
   */
  indicadorCertificacion: string;
}
