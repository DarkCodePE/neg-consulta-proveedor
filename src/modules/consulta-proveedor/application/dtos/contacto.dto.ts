// src/modules/consulta-proveedor/application/dtos/contacto.dto.ts

/**
 * Representa información de contacto
 */
export class ContactoDto {
  /**
   * Tipo de contacto (TELEFONO, EMAIL, etc.)
   */
  tipo: string;

  /**
   * Valor del contacto
   */
  valor: string;
}
