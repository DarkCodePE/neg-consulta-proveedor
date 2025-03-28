// src/modules/consulta-proveedor/infrastructure/repositories/proveedor.repository.ts

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { ProveedorEntity } from '../../domain/entities/proveedor.entity';
import { PersonaEntity } from '../../domain/entities/persona.entity';
import { PersonaJuridicaEntity } from '../../domain/entities/persona-juridica.entity';
import { PersonaCompaniaSeguroEntity } from '../../domain/entities/persona-compania-seguro.entity';
import { CompaniaSeguroEntity } from '../../domain/entities/compania-seguro.entity';
import { ProveedorSearchCriteria } from '../../application/dtos/proveedor-search-criteria.dto';
import { FacetedSearchResult } from '../../application/dtos/faceted-search-result.dto';
import { ProveedorResumenDto } from '../../application/dtos/proveedor-resumen.dto';
import { Facet } from '../../application/dtos/facet.dto';

@Injectable()
export class ProveedorRepository {
  private readonly logger = new Logger(ProveedorRepository.name);

  constructor(
    @InjectRepository(ProveedorEntity)
    private proveedorRepository: Repository<ProveedorEntity>,
    @InjectRepository(PersonaEntity)
    private personaRepository: Repository<PersonaEntity>,
    @InjectRepository(PersonaJuridicaEntity)
    private personaJuridicaRepository: Repository<PersonaJuridicaEntity>,
    @InjectRepository(PersonaCompaniaSeguroEntity)
    private personaCompaniaSeguroRepository: Repository<PersonaCompaniaSeguroEntity>,
    @InjectRepository(CompaniaSeguroEntity)
    private companiaSeguroRepository: Repository<CompaniaSeguroEntity>,
  ) {}

  /**
   * Busca un proveedor por su ID y devuelve todos sus detalles
   */
  async findProveedorById(
    id: string,
    correlationId: string,
    requestId: string,
  ): Promise<any> {
    this.logger.log(
      `[INFO] ProveedorRepository:findProveedorById - [correlationId=${correlationId} requestId=${requestId}] [Inicio de invocación a findProveedorById]`,
    );

    const startTime = Date.now();

    try {
      const proveedor = await this.proveedorRepository
        .createQueryBuilder('p')
        .innerJoinAndSelect('p.persona', 'pers')
        .leftJoinAndSelect(
          PersonaJuridicaEntity,
          'pj',
          'pj.personaId = pers.id',
        )
        .leftJoinAndSelect(
          PersonaCompaniaSeguroEntity,
          'pcs',
          'pcs.codigoProveedor = p.codigoProveedor',
        )
        .leftJoinAndSelect(
          CompaniaSeguroEntity,
          'cs',
          'cs.id = pcs.companiaSeguroId',
        )
        .where('p.id = :id', { id })
        .getOne();

      return proveedor;
    } finally {
      const endTime = Date.now();
      this.logger.log(
        `[INFO] ProveedorRepository:findProveedorById - [correlationId=${correlationId} requestId=${requestId}] [Fin de invocación a findProveedorById] Tiempo total del proceso de ejecución: ${endTime - startTime} ms`,
      );
    }
  }

  /**
   * Implementa la búsqueda facetada de proveedores según criterios
   */
  async findProveedoresByCriteria(
    criteria: ProveedorSearchCriteria,
    correlationId: string,
    requestId: string,
  ): Promise<FacetedSearchResult<ProveedorResumenDto>> {
    this.logger.log(
      `[INFO] ProveedorRepository:findProveedoresByCriteria - [correlationId=${correlationId} requestId=${requestId}] [Inicio de invocación a findProveedoresByCriteria]`,
    );
    this.logger.log(
      `[INFO] ProveedorRepository:findProveedoresByCriteria - [correlationId=${correlationId} requestId=${requestId}] [JNDI]: CadenaConexionJNDI`,
    );

    const startTime = Date.now();

    try {
      // Construir la consulta principal
      let queryBuilder = this.proveedorRepository
        .createQueryBuilder('p')
        .innerJoin(PersonaEntity, 'pers', 'pers.id = p.personaId')
        .leftJoin(PersonaJuridicaEntity, 'pj', 'pj.personaId = pers.id')
        .leftJoin(
          PersonaCompaniaSeguroEntity,
          'pcs',
          'pcs.codigoProveedor = p.codigoProveedor',
        )
        .leftJoin(CompaniaSeguroEntity, 'cs', 'cs.id = pcs.companiaSeguroId')
        .select([
          'p.codigoProveedor',
          'pers.numeroDocumento as ruc',
          'pj.razonSocial',
          'pj.razonSocialAbreviada',
          'p.statusRegistro as estado',
          'cs.descripcion as companiaSeguros',
          'p.tipoProveedor',
          'pers.tipoPersona',
          'p.indicadorRedSelecta',
          'p.indicadorCertificacion',
        ]);

      // Aplicar filtros según los criterios
      if (criteria.eps) {
        queryBuilder = queryBuilder.andWhere('cs.descripcion = :eps', {
          eps: criteria.eps,
        });
      }

      if (criteria.amed) {
        queryBuilder = queryBuilder.andWhere('cs.iafa = :amed', {
          amed: criteria.amed,
        });
      }

      if (criteria.codigoProveedor) {
        queryBuilder = queryBuilder.andWhere(
          'p.codigoProveedor = :codigoProveedor',
          {
            codigoProveedor: criteria.codigoProveedor,
          },
        );
      }

      if (criteria.estado) {
        queryBuilder = queryBuilder.andWhere('p.statusRegistro = :estado', {
          estado:
            criteria.estado === 'ACTIVO'
              ? 'V'
              : criteria.estado === 'ANULADO'
                ? 'A'
                : criteria.estado,
        });
      }

      if (criteria.tipoDocumento) {
        queryBuilder = queryBuilder.andWhere(
          'pers.tipoDocumento = :tipoDocumento',
          {
            tipoDocumento: criteria.tipoDocumento,
          },
        );
      }

      if (criteria.numeroDocumento) {
        queryBuilder = queryBuilder.andWhere(
          'pers.numeroDocumento = :numeroDocumento',
          {
            numeroDocumento: criteria.numeroDocumento,
          },
        );
      }

      if (criteria.ruc && criteria.ruc.length > 0) {
        queryBuilder = queryBuilder.andWhere(
          'pers.numeroDocumento IN (:...ruc)',
          {
            ruc: criteria.ruc,
          },
        );
      }

      if (criteria.tipoProveedor) {
        queryBuilder = queryBuilder.andWhere(
          'p.tipoProveedor = :tipoProveedor',
          {
            tipoProveedor: criteria.tipoProveedor,
          },
        );
      }

      if (criteria.indicadorNacional) {
        queryBuilder = queryBuilder.andWhere(
          'p.indicadorNacional = :indicadorNacional',
          {
            indicadorNacional: criteria.indicadorNacional,
          },
        );
      }

      if (criteria.tipoPersona) {
        queryBuilder = queryBuilder.andWhere(
          'pers.tipoPersona = :tipoPersona',
          {
            tipoPersona: criteria.tipoPersona,
          },
        );
      }

      if (criteria.razonSocial) {
        queryBuilder = queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('LOWER(pj.razonSocial) LIKE LOWER(:razonSocial)', {
              razonSocial: `%${criteria.razonSocial}%`,
            }).orWhere(
              'LOWER(pers.nombreCompleto) LIKE LOWER(:nombreCompleto)',
              { nombreCompleto: `%${criteria.razonSocial}%` },
            );
          }),
        );
      }

      if (criteria.indicadorRedSelecta) {
        queryBuilder = queryBuilder.andWhere(
          'p.indicadorRedSelecta = :indicadorRedSelecta',
          {
            indicadorRedSelecta: criteria.indicadorRedSelecta,
          },
        );
      }

      if (criteria.indicadorCertificacion) {
        queryBuilder = queryBuilder.andWhere(
          'p.indicadorCertificacion = :indicadorCertificacion',
          {
            indicadorCertificacion: criteria.indicadorCertificacion,
          },
        );
      }

      // Ordenamiento
      if (criteria.sort && criteria.sort.length > 0) {
        criteria.sort.forEach((sortOption) => {
          const field = this.mapSortFieldToColumn(sortOption.field);
          queryBuilder = queryBuilder.addOrderBy(
            field,
            sortOption.direction.toUpperCase() as 'ASC' | 'DESC',
          );
        });
      } else {
        // Ordenamiento por defecto
        queryBuilder = queryBuilder.orderBy('pj.razonSocial', 'ASC');
      }

      // Ejecutar la consulta principal para obtener resultados paginados
      const [proveedores, totalCount] = await queryBuilder
        .skip(criteria.pageStartIndex)
        .take(criteria.pageSize)
        .getManyAndCount();

      // Calcular información de paginación
      const totalPages = Math.ceil(totalCount / criteria.pageSize);
      const currentPage =
        Math.floor(criteria.pageStartIndex / criteria.pageSize) + 1;

      // Obtener facets (facetas)
      const facets = await this.obtenerFacetas(
        criteria,
        correlationId,
        requestId,
      );

      // Mapear los resultados al formato requerido
      const proveedoresResumen = this.mapToProveedorResumen(proveedores);

      return {
        elements: proveedoresResumen,
        facets,
        pageInfo: {
          pageSize: criteria.pageSize,
          pageStartIndex: criteria.pageStartIndex,
          totalElements: totalCount,
          totalPages,
          currentPage,
        },
        links: {}, // Se completa en el servicio
      };
    } finally {
      const endTime = Date.now();
      this.logger.log(
        `[INFO] ProveedorRepository:findProveedoresByCriteria - [correlationId=${correlationId} requestId=${requestId}] [Fin de invocación a findProveedoresByCriteria] Tiempo total del proceso de ejecución: ${endTime - startTime} ms`,
      );
    }
  }

  /**
   * Obtiene las facetas (agregaciones) para la búsqueda
   */
  private async obtenerFacetas(
    criteria: ProveedorSearchCriteria,
    correlationId: string,
    requestId: string,
  ): Promise<any> {
    // Obtener facetas para tipoProveedor
    const tipoProveedorFacets =
      await this.obtenerFacetasTipoProveedor(criteria);

    // Obtener facetas para tipoPersona
    const tipoPersonaFacets = await this.obtenerFacetasTipoPersona(criteria);

    // Obtener facetas para estado
    const estadoFacets = await this.obtenerFacetasEstado(criteria);

    // Obtener facetas para tipoCompaniaSeguro
    const tipoCompaniaSeguroFacets =
      await this.obtenerFacetasCompaniaSeguro(criteria);

    return {
      tipoProveedor: tipoProveedorFacets,
      tipoPersona: tipoPersonaFacets,
      estado: estadoFacets,
      tipoCompaniaSeguro: tipoCompaniaSeguroFacets,
    };
  }

  /**
   * Obtiene las facetas de tipo de proveedor
   */
  private async obtenerFacetasTipoProveedor(
    criteria: ProveedorSearchCriteria,
  ): Promise<Facet[]> {
    // Crear una copia de los criterios para realizar la consulta de facetas
    const facetCriteria = { ...criteria };
    delete facetCriteria.tipoProveedor; // Eliminamos este criterio para obtener todas las facetas

    let queryBuilder = this.proveedorRepository
      .createQueryBuilder('p')
      .select('p.tipoProveedor', 'value')
      .addSelect('COUNT(p.id)', 'count')
      .groupBy('p.tipoProveedor');

    // Aplicar los mismos filtros que la consulta principal
    // (excepto el filtro por tipoProveedor)
    this.aplicarFiltrosComunes(queryBuilder, facetCriteria);

    const facets = await queryBuilder.getRawMany();
    return facets.map((f) => ({ value: f.value, count: parseInt(f.count) }));
  }

  /**
   * Obtiene las facetas de tipo de persona
   */
  private async obtenerFacetasTipoPersona(
    criteria: ProveedorSearchCriteria,
  ): Promise<Facet[]> {
    // Crear una copia de los criterios para realizar la consulta de facetas
    const facetCriteria = { ...criteria };
    delete facetCriteria.tipoPersona; // Eliminamos este criterio para obtener todas las facetas

    let queryBuilder = this.proveedorRepository
      .createQueryBuilder('p')
      .innerJoin(PersonaEntity, 'pers', 'pers.id = p.personaId')
      .select('pers.tipoPersona', 'value')
      .addSelect('COUNT(p.id)', 'count')
      .groupBy('pers.tipoPersona');

    // Aplicar los mismos filtros que la consulta principal
    this.aplicarFiltrosComunes(queryBuilder, facetCriteria);

    const facets = await queryBuilder.getRawMany();

    // Mapear los valores a términos más descriptivos
    return facets.map((f) => ({
      value:
        f.value === 'J' ? 'JURIDICA' : f.value === 'N' ? 'NATURAL' : f.value,
      count: parseInt(f.count),
    }));
  }

  /**
   * Obtiene las facetas de estado
   */
  private async obtenerFacetasEstado(
    criteria: ProveedorSearchCriteria,
  ): Promise<Facet[]> {
    // Crear una copia de los criterios para realizar la consulta de facetas
    const facetCriteria = { ...criteria };
    delete facetCriteria.estado; // Eliminamos este criterio para obtener todas las facetas

    let queryBuilder = this.proveedorRepository
      .createQueryBuilder('p')
      .select('p.statusRegistro', 'value')
      .addSelect('COUNT(p.id)', 'count')
      .groupBy('p.statusRegistro');

    // Aplicar los mismos filtros que la consulta principal
    this.aplicarFiltrosComunes(queryBuilder, facetCriteria);

    const facets = await queryBuilder.getRawMany();

    // Mapear los valores a términos más descriptivos
    return facets.map((f) => ({
      value:
        f.value === 'V'
          ? 'ACTIVO'
          : f.value === 'A'
            ? 'ANULADO'
            : f.value === 'S'
              ? 'SUSPENDIDO'
              : f.value,
      count: parseInt(f.count),
    }));
  }

  /**
   * Obtiene las facetas de compañía de seguro
   */
  private async obtenerFacetasCompaniaSeguro(
    criteria: ProveedorSearchCriteria,
  ): Promise<Facet[]> {
    // Crear una copia de los criterios para realizar la consulta de facetas
    const facetCriteria = { ...criteria };
    delete facetCriteria.eps;
    delete facetCriteria.amed;

    let queryBuilder = this.proveedorRepository
      .createQueryBuilder('p')
      .innerJoin(
        PersonaCompaniaSeguroEntity,
        'pcs',
        'pcs.codigoProveedor = p.codigoProveedor',
      )
      .innerJoin(CompaniaSeguroEntity, 'cs', 'cs.id = pcs.companiaSeguroId')
      .select('cs.descripcion', 'value')
      .addSelect('COUNT(DISTINCT p.id)', 'count')
      .groupBy('cs.descripcion');

    // Aplicar los mismos filtros que la consulta principal
    this.aplicarFiltrosComunes(queryBuilder, facetCriteria);

    const facets = await queryBuilder.getRawMany();
    return facets.map((f) => ({ value: f.value, count: parseInt(f.count) }));
  }

  /**
   * Aplica filtros comunes a las consultas de facetas
   */
  private aplicarFiltrosComunes(
    queryBuilder: any,
    criteria: ProveedorSearchCriteria,
  ): void {
    if (criteria.codigoProveedor) {
      queryBuilder = queryBuilder.andWhere(
        'p.codigoProveedor = :codigoProveedor',
        {
          codigoProveedor: criteria.codigoProveedor,
        },
      );
    }

    if (criteria.estado) {
      queryBuilder = queryBuilder.andWhere('p.statusRegistro = :estado', {
        estado:
          criteria.estado === 'ACTIVO'
            ? 'V'
            : criteria.estado === 'ANULADO'
              ? 'A'
              : criteria.estado,
      });
    }

    if (criteria.tipoProveedor) {
      queryBuilder = queryBuilder.andWhere('p.tipoProveedor = :tipoProveedor', {
        tipoProveedor: criteria.tipoProveedor,
      });
    }

    if (criteria.razonSocial) {
      queryBuilder = queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(pj.razonSocial) LIKE LOWER(:razonSocial)', {
            razonSocial: `%${criteria.razonSocial}%`,
          });
        }),
      );
    }

    // Repetir para los demás criterios...
  }

  /**
   * Mapea los nombres de los campos para ordenamiento
   */
  private mapSortFieldToColumn(field: string): string {
    const fieldMap = {
      razonSocial: 'pj.razonSocial',
      ruc: 'pers.numeroDocumento',
      estado: 'p.statusRegistro',
      tipoProveedor: 'p.tipoProveedor',
      tipoPersona: 'pers.tipoPersona',
      codigoProveedor: 'p.codigoProveedor',
      // Agregar más campos según sea necesario
    };

    return fieldMap[field] || 'pj.razonSocial'; // Valor predeterminado
  }

  /**
   * Mapea los resultados al formato requerido
   */
  private mapToProveedorResumen(proveedores: any[]): ProveedorResumenDto[] {
    return proveedores.map((p) => ({
      codigoProveedor: p.codigoProveedor,
      ruc: p.ruc,
      razonSocial: p.razonSocial,
      razonSocialAbreviada: p.razonSocialAbreviada,
      estado:
        p.estado === 'V'
          ? 'ACTIVO'
          : p.estado === 'A'
            ? 'ANULADO'
            : p.estado === 'S'
              ? 'SUSPENDIDO'
              : p.estado,
      eps: p.companiaSeguros === 'PACIFICO SALUD' ? 'PACIFICO SALUD' : null,
      amed: p.companiaSeguros === 'PACIFICO SEGUROS' ? p.iafa : null,
      tipoProveedor: p.tipoProveedor,
      tipoPersona: p.tipoPersona === 'J' ? 'JURIDICA' : 'NATURAL',
      indicadorNacional: p.indicadorNacional || 'N',
      indicadorRedSelecta: p.indicadorRedSelecta,
      indicadorCertificacion: p.indicadorCertificacion,
    }));
  }
}
