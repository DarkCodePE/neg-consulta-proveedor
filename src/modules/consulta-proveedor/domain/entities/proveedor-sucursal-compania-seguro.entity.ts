// src/modules/consulta-proveedor/domain/entities/proveedor-sucursal-compania-seguro.entity.ts

import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { ProveedorSucursalEntity } from './proveedor-sucursal.entity';
import { PersonaCompaniaSeguroEntity } from './persona-compania-seguro.entity';

@Entity('PROVEEDOR_SUCURSAL_COMPANIA_SEGURO')
export class ProveedorSucursalCompaniaSeguroEntity {
  @PrimaryColumn({ name: 'PROVEEDORSUCURSALCOMPANIASEGUROID' })
  id: string;

  @Column({ name: 'PERSONACOMPANIASEGUROID' })
  personaCompaniaSeguroId: string;

  @ManyToOne(() => PersonaCompaniaSeguroEntity)
  @JoinColumn({ name: 'PERSONACOMPANIASEGUROID' })
  personaCompaniaSeguro: PersonaCompaniaSeguroEntity;

  @Column({ name: 'NUMID' })
  personaId: string;

  @Column({ name: 'COD_PROVEEDOR' })
  codigoProveedor: string;

  @Column({ name: 'NRO_SUCURSAL_PROVEEDOR' })
  numeroSucursalProveedor: number;

  @ManyToOne(() => ProveedorSucursalEntity, { primary: true })
  @JoinColumn([
    { name: 'COD_PROVEEDOR', referencedColumnName: 'codigoProveedor' },
    {
      name: 'NRO_SUCURSAL_PROVEEDOR',
      referencedColumnName: 'numeroSucursalProveedor',
    },
  ])
  proveedorSucursal: ProveedorSucursalEntity;

  @Column({ name: 'COMPANIASEGUROID' })
  companiaSeguroId: string;

  @Column({ name: 'STATUS_REGISTRO' })
  statusRegistro: string;

  @Column({ name: 'FEC_CREACION' })
  fechaCreacion: Date;

  @Column({ name: 'COD_USUARIO_CREADOR' })
  usuarioCreador: string;

  @Column({ name: 'FEC_UPDATE', nullable: true })
  fechaModificacion?: Date;

  @Column({ name: 'COD_USUARIO_UPDATE', nullable: true })
  usuarioModificacion?: string;
}
