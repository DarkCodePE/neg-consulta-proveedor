// src/modules/consulta-proveedor/domain/entities/persona-compania-seguro.entity.ts

import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { PersonaEntity } from './persona.entity';
import { CompaniaSeguroEntity } from './compania-seguro.entity';

@Entity('PERSONA_COMPANIA_SEGURO')
export class PersonaCompaniaSeguroEntity {
  @PrimaryColumn({ name: 'PERSONACOMPANIASEGUROID' })
  id: string;

  @Column({ name: 'PERSONAID' })
  personaId: string;

  @ManyToOne(() => PersonaEntity)
  @JoinColumn({ name: 'PERSONAID' })
  persona: PersonaEntity;

  @Column({ name: 'COD_PROVEEDOR' })
  codigoProveedor: string;

  @Column({ name: 'COMPANIASEGUROID' })
  companiaSeguroId: string;

  @ManyToOne(() => CompaniaSeguroEntity)
  @JoinColumn({ name: 'COMPANIASEGUROID' })
  companiaSeguro: CompaniaSeguroEntity;

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
