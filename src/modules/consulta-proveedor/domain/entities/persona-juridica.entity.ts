// src/modules/consulta-proveedor/domain/entities/persona-juridica.entity.ts

import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { PersonaEntity } from './persona.entity';

@Entity('PERSONA_JURIDICA')
export class PersonaJuridicaEntity {
  @PrimaryColumn({ name: 'PERSONAJURIDICAID' })
  id: string;

  @Column({ name: 'PERSONAID' })
  personaId: string;

  @ManyToOne(() => PersonaEntity)
  @JoinColumn({ name: 'PERSONAID' })
  persona: PersonaEntity;

  @Column({ name: 'RAZONSOCIAL' })
  razonSocial: string;

  @Column({ name: 'RAZONSOCIALABREVIADA', nullable: true })
  razonSocialAbreviada?: string;

  @Column({ name: 'ANIVERSARIO', nullable: true })
  aniversario?: Date;

  @Column({ name: 'CODGRUPECO', nullable: true })
  codigoGrupoEconomico?: string;

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
