// src/modules/consulta-proveedor/infrastructure/controllers/proveedor.controller.ts

import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    Query,
    Headers,
    HttpStatus,
    HttpException,
    Logger,
    Res
} from '@nestjs/common';
import { Response } from 'express';
import { ProveedorService } from '../../application/services/proveedor.service';
import { ProveedorSearchRequestDto } from '../../application/dtos/proveedor-search-request.dto';
import { ProveedorSearchResponseDto } from '../../application/dtos/proveedor-search-response.dto';

@Controller('proveedores')
export class ProveedorController {
    private readonly logger = new Logger(ProveedorController.name);

    constructor(private readonly proveedorService: ProveedorService) {}

    @Get(':id')
    async getProveedorById(
        @Param('id') id: string,
        @Headers('X-Correlation-Id') correlationId: string,
        @Headers('X-Request-Id') requestId: string,
        @Headers('nombreAplicacion') nombreAplicacion: string,
        @Headers('procesoNegocio') procesoNegocio: string,
        @Headers('usuarioAplicacion') usuarioAplicacion: string,
        @Res() res: Response
    ): Promise<void> {
        this.logger.log(`[INFO] ProveedorController:getProveedorById - [correlationId=${correlationId} requestId=${requestId}] [INICIO getProveedorById]`);
        this.logger.log(`[INFO] ProveedorController:getProveedorById - [correlationId=${correlationId} requestId=${requestId}] Datos de entrada: id=${id}`);

        try {
            const startTime = Date.now();
            const proveedor = await this.proveedorService.getProveedorById(id, correlationId, requestId);

            res.setHeader('X-Correlation-Id', correlationId);
            res.status(HttpStatus.OK).json(proveedor);

            const endTime = Date.now();
            this.logger.log(`[INFO] ProveedorController:getProveedorById - [correlationId=${correlationId} requestId=${requestId}] [FIN getProveedorById] Tiempo total del proceso de ejecución: ${endTime - startTime} ms`);
        } catch (error) {
            this.logger.error(`[ERROR] ProveedorController:getProveedorById - [correlationId=${correlationId} requestId=${requestId}]`, error);

            if (error instanceof HttpException) {
                res.setHeader
            }
        }
    }