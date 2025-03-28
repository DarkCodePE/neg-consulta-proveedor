// src/modules/consulta-proveedor/application/services/proveedor.service.ts

import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { ProveedorSearchRequestDto } from '../../application/dtos/proveedor-search-request.dto';
import { ProveedorSearchResponseDto } from '../../application/dtos/proveedor-search-response.dto';
import { ProveedorResumenDto } from '../../application/dtos/proveedor-resumen.dto';
import { RedisService } from '@/lib/external/redis/Redis.service';
import { ProveedorRepository } from '@/modules/consulta-proveedor/domain/repositories/proveedor.repository';

@Injectable()
export class ProveedorService {
  private readonly logger = new Logger(ProveedorService.name);

  constructor(
    private readonly proveedorRepository: ProveedorRepository,
    private readonly redisService: RedisService,
  ) {}

  async getProveedorById(
    id: string,
    correlationId: string,
    requestId: string,
  ): Promise<any> {
    this.logger.log(
      `[INFO] ProveedorService:getProveedorById - [correlationId=${correlationId} requestId=${requestId}] [INICIO getProveedorById]`,
    );

    const startTime = Date.now();

    try {
      // Intenta obtener del caché primero
      const cacheKey = `proveedor:${id}`;
      const cachedProveedor = await this.redisService.get<any>(cacheKey);

      if (cachedProveedor) {
        this.logger.log(
          `[INFO] ProveedorService:getProveedorById - [correlationId=${correlationId} requestId=${requestId}] Proveedor encontrado en caché`,
        );
        return cachedProveedor;
      }

      // Si no está en caché, buscar en BD
      const proveedor = await this.proveedorRepository.findProveedorById(
        id,
        correlationId,
        requestId,
      );

      if (!proveedor) {
        throw new NotFoundException(`No se encontró proveedor con ID: ${id}`);
      }

      // Guardar en caché para futuras consultas
      await this.redisService.set(cacheKey, proveedor);

      return proveedor;
    } finally {
      const endTime = Date.now();
      this.logger.log(
        `[INFO] ProveedorService:getProveedorById - [correlationId=${correlationId} requestId=${requestId}] [FIN getProveedorById] Tiempo total del proceso de ejecución: ${endTime - startTime} ms`,
      );
    }
  }

  async buscarProveedoresFacetado(
    searchRequest: ProveedorSearchRequestDto,
    correlationId: string,
    requestId: string,
  ): Promise<ProveedorSearchResponseDto> {
    this.logger.log(
      `[INFO] ProveedorService:buscarProveedoresFacetado - [correlationId=${correlationId} requestId=${requestId}] [INICIO buscarProveedoresFacetado]`,
    );

    const startTime = Date.now();

    try {
      // Intentar recuperar del caché
      const cacheKey = this.redisService.generateKey(
        'proveedores:search',
        searchRequest,
      );
      const cachedResults =
        await this.redisService.get<ProveedorSearchResponseDto>(cacheKey);

      if (cachedResults) {
        this.logger.log(
          `[INFO] ProveedorService:buscarProveedoresFacetado - [correlationId=${correlationId} requestId=${requestId}] Resultados encontrados en caché`,
        );
        return cachedResults;
      }

      // Convertir DTO a criterios para el repositorio
      const criteria = {
        eps: searchRequest.eps,
        amed: searchRequest.amed,
        codigoProveedor: searchRequest.codigoProveedor,
        estado: searchRequest.estado,
        tipoDocumento: searchRequest.tipoDocumento,
        numeroDocumento: searchRequest.numeroDocumento,
        ruc: searchRequest.ruc,
        tipoProveedor: searchRequest.tipoProveedor,
        indicadorNacional: searchRequest.indicadorNacional,
        tipoPersona: searchRequest.tipoPersona,
        razonSocial: searchRequest.razonSocial,
        indicadorRedSelecta: searchRequest.indicadorRedSelecta,
        indicadorCertificacion: searchRequest.indicadorCertificacion,
        pageSize: searchRequest.pageSize || 20,
        pageStartIndex: searchRequest.pageStartIndex || 0,
        sort: searchRequest.sort,
      };

      // Ejecutar búsqueda facetada
      const result = await this.proveedorRepository.findProveedoresByCriteria(
        criteria,
        correlationId,
        requestId,
      );

      // Componer los links para HATEOAS
      const baseUrl = '/proveedores/search';
      const selfLink = {
        href: baseUrl,
        rel: 'http://api.relations.wrml.org/common/self',
      };

      // Determinar si hay página siguiente
      let nextLink = null;
      if (
        result.pageInfo.totalElements >
        criteria.pageStartIndex + criteria.pageSize
      ) {
        nextLink = {
          href: `${baseUrl}?pageStartIndex=${criteria.pageStartIndex + criteria.pageSize}`,
          rel: 'http://api.relations.wrml.org/common/next',
        };
      }

      // Determinar si hay página anterior
      let previousLink = null;
      if (criteria.pageStartIndex > 0) {
        const prevIndex = Math.max(
          0,
          criteria.pageStartIndex - criteria.pageSize,
        );
        previousLink = {
          href: `${baseUrl}?pageStartIndex=${prevIndex}`,
          rel: 'http://api.relations.wrml.org/common/previous',
        };
      }

      // Mapear a DTO de respuesta
      const response: ProveedorSearchResponseDto = {
        elements: result.elements as ProveedorResumenDto[],
        size: result.elements.length,
        totalElements: result.pageInfo.totalElements,
        pageSize: result.pageInfo.pageSize,
        pageStartIndex: result.pageInfo.pageStartIndex,
        currentPage: result.pageInfo.currentPage,
        totalPages: result.pageInfo.totalPages,
        facets: result.facets,
        links: {
          self: selfLink,
          next: nextLink,
          previous: previousLink,
        },
      };

      // Guardar en caché para futuras consultas (solo guardamos resultados si no son demasiado grandes)
      if (response.elements.length <= 100) {
        await this.redisService.set(cacheKey, response, 300); // 5 minutos
      }

      return response;
    } finally {
      const endTime = Date.now();
      this.logger.log(
        `[INFO] ProveedorService:buscarProveedoresFacetado - [correlationId=${correlationId} requestId=${requestId}] [FIN buscarProveedoresFacetado] Tiempo total del proceso de ejecución: ${endTime - startTime} ms`,
      );
    }
  }
}
