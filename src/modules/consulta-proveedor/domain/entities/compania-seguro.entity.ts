// src/modules/consulta-proveedor/domain/entities/compania-seguro.entity.ts

import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { PersonaJuridicaEntity } from './persona-juridica.entity';

@Entity('COMPANIA_SEGURO')
export class CompaniaSeguroEntity {
  @PrimaryColumn({ name: 'COMPANIASEGUROSID' })
  id: string;

  @Column({ name: 'PERSONAJURIDICAID' })
  personaJuridicaId: string;

  @ManyToOne(() => PersonaJuridicaEntity)
  @JoinColumn({ name: 'PERSONAJURIDICAID' })
  personaJuridica: PersonaJuridicaEntity;

  @Column({ name: 'IAFA' })
  iafa: string;

  @Column({ name: 'DESCRIPCION' })
  descripcion: string;

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
