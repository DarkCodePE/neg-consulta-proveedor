// src/modules/consulta-proveedor/domain/entities/proveedor-sucursal.entity.ts

import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { ProveedorEntity } from './proveedor.entity';
import { PersonaEntity } from './persona.entity';

@Entity('PROVEEDOR_SUCURSAL')
export class ProveedorSucursalEntity {
  @PrimaryColumn({ name: 'PROVEEDORSUCURSALID' })
  id: string;

  @Column({ name: 'NUMID' })
  personaId: string;

  @ManyToOne(() => PersonaEntity)
  @JoinColumn({ name: 'NUMID' })
  persona: PersonaEntity;

  @Column({ name: 'COD_PROVEEDOR' })
  codigoProveedor: string;

  @ManyToOne(() => ProveedorEntity, { primary: true })
  @JoinColumn({
    name: 'COD_PROVEEDOR',
    referencedColumnName: 'codigoProveedor',
  })
  proveedor: ProveedorEntity;

  @Column({ name: 'NRO_SUCURSAL_PROVEEDOR' })
  numeroSucursalProveedor: number;

  @Column({ name: 'DESCRIPCION' })
  descripcion: string;

  @Column({ name: 'IND_PRINCIPAL_SUCURSAL' })
  indicadorPrincipalSucursal: string;

  @Column({ name: 'COD_SUCURSAL_SEPS', nullable: true })
  codigoSucursalSeps: string;

  @Column({ name: 'REGISTRO_SEPS', nullable: true })
  registroSeps: string;

  @Column({ name: 'CATEGORIA_SUCURSAL', nullable: true })
  categoriaSucursal: string;

  @Column({ name: 'IND_EXON_IGV', nullable: true })
  indicadorExoneracionIgv: string;

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
