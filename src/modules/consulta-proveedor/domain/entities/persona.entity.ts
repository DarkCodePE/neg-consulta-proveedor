// src/modules/consulta-proveedor/domain/entities/persona.entity.ts

import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('PERSONA')
export class PersonaEntity {
  @PrimaryColumn({ name: 'PERSONAID' })
  id: string;

  @Column({ name: 'TIPOPERSONA' })
  tipoPersona: string;

  @Column({ name: 'NOMBRECOMPLETO' })
  nombreCompleto: string;

  @Column({ name: 'NOMBREABREVIADO' })
  nombreAbreviado: string;

  @Column({ name: 'TIPO_DOC' })
  tipoDocumento: string;

  @Column({ name: 'NRO_DOC' })
  numeroDocumento: string;

  @Column({ name: 'WEB', nullable: true })
  web?: string;

  @Column({ name: 'TIPOTRABAJADOR', nullable: true })
  tipoTrabajador?: string;

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
