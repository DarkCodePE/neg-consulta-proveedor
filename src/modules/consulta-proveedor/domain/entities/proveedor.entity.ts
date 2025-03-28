// src/modules/consulta-proveedor/domain/entities/proveedor.entity.ts

import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { PersonaEntity } from './persona.entity';

@Entity('PROVEEDOR')
export class ProveedorEntity {
  @PrimaryColumn({ name: 'PROVEEDORID' })
  id: string;

  @Column({ name: 'PERSONAID' })
  personaId: string;

  @ManyToOne(() => PersonaEntity)
  @JoinColumn({ name: 'PERSONAID' })
  persona: PersonaEntity;

  @Column({ name: 'COD_PROVEEDOR' })
  codigoProveedor: string;

  @Column({ name: 'TIPO_PROVEEDOR' })
  tipoProveedor: string;

  @Column({ name: 'IND_CERTIFICACION' })
  indicadorCertificacion: string;

  @Column({ name: 'IND_RED_SELECTA' })
  indicadorRedSelecta: string;

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
