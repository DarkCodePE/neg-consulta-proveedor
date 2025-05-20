/*====================================================================
NÚMERO DE REQUERIMIENTO: REQ-2025-002
NOMBRE ARTEFACTO: ScriptInsertInicial_EsquemaPersona_V1.sql
AUTOR: [Su Nombre]                           FECHA CREACIÓN: 2025-05-07
OBJETIVO: Insertar datos iniciales en el esquema persona
          para pruebas y desarrollo del nuevo modelo

DESCRIPCION FUNCIONAL:
Este script inserta datos de ejemplo en todas las tablas del esquema 
"persona", manteniendo la integridad referencial y respetando 
las restricciones definidas.

HISTORIAL DE CAMBIOS:
Fecha       | Autor            | Descripción
------------|------------------|---------------------------------------------------
2025-05-07  | [Su Nombre]      | Creación inicial del script
===================================================================================*/

-- Desactivar mensajes de conteo de filas para hacer más limpia la ejecución
SET NOCOUNT ON;
GO

-- Crear o utilizar el esquema persona si no existe
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'persona')
BEGIN
EXEC('CREATE SCHEMA persona');
    PRINT 'Esquema persona creado exitosamente';
END
GO

-- Variables para auditoría
DECLARE @UsuarioCreador VARCHAR(15) = 'ADMIN';
DECLARE @UsuarioSistema VARCHAR(15) = 'SYSTEM';
DECLARE @FechaActual DATETIME = GETDATE();

-- Limpiar datos existentes (en orden inverso a la inserción para respetar las FK)
-- ADVERTENCIA: Elimina todos los datos de las tablas. Usar solo en entornos de prueba.
/*
DELETE FROM persona.Mae_SucursalCompaniaSeguro;
DELETE FROM persona.Tbt_PersonaCompaniaSeguro;
DELETE FROM persona.Tbt_PersonaRol;
DELETE FROM persona.Mae_Sucursal;
DELETE FROM persona.Mae_Proveedor;
DELETE FROM persona.Mae_CompaniaSeguro;
DELETE FROM persona.Mae_PersonaJuridica;
DELETE FROM persona.Mae_Persona;
DELETE FROM persona.Tip_TipoProveedor;
DELETE FROM persona.Tip_Rol;
*/

PRINT 'Iniciando inserción de datos...';

-- Insertar tipos de roles
PRINT 'Insertando roles...';
INSERT INTO persona.Tip_Rol (IdTipoRol, CodigoLval, DescripcionRol, EstadoRegistro,
                             CodigoUsuarioCreador, FechaCreacion, CodigoUsuarioModificador, FechaModificacion,
                             CodigoUsuarioCreadorSistema, FechaCreacionSistema, CodigoUsuarioUpdateSistema, FechaUpdateSistema)
VALUES
    ('ROL001', 'F', 'PROVEEDOR MÉDICO', 'V',
     @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    ('ROL002', 'I', 'ASEGURADORA', 'V',
     @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    ('ROL003', 'E', 'ENTIDAD PÚBLICA', 'V',
     @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    ('ROL004', 'P', 'PERSONA NATURAL', 'V',
     @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL);

-- Insertar tipos de proveedores
PRINT 'Insertando tipos de proveedores...';
DECLARE @TipoProveedor1 UNIQUEIDENTIFIER = NEWID();
DECLARE @TipoProveedor2 UNIQUEIDENTIFIER = NEWID();
DECLARE @TipoProveedor3 UNIQUEIDENTIFIER = NEWID();

INSERT INTO persona.Tip_TipoProveedor (IdTipoProveedor, TipoProveedor, DescripcionTipoProveedor, EstadoRegistro,
                                       CodigoUsuarioCreador, FechaCreacion, CodigoUsuarioModificador, FechaModificacion,
                                       CodigoUsuarioCreadorSistema, FechaCreacionSistema, CodigoUsuarioUpdateSistema, FechaUpdateSistema)
VALUES
    (@TipoProveedor1, 1, 'CLÍNICA', 'V',
     @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (@TipoProveedor2, 2, 'CENTRO MÉDICO', 'V',
     @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (@TipoProveedor3, 3, 'LABORATORIO', 'V',
     @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL);

-- Insertar personas
PRINT 'Insertando personas...';
DECLARE @Persona1 UNIQUEIDENTIFIER = NEWID(); -- Clínica San Pablo
DECLARE @Persona2 UNIQUEIDENTIFIER = NEWID(); -- Clínica Ricardo Palma
DECLARE @Persona3 UNIQUEIDENTIFIER = NEWID(); -- Pacífico Salud
DECLARE @Persona4 UNIQUEIDENTIFIER = NEWID(); -- Pacífico Seguros
DECLARE @Persona5 UNIQUEIDENTIFIER = NEWID(); -- Laboratorio Suiza Lab

INSERT INTO persona.Mae_Persona (IdPersona, TipoPersona, NombreCompletoPersona, NombreAbreviadoPersona,
                                 CodigoTipoDocumento, NumeroDocumento, DescripcionPaginaWeb, CodigoTipoTrabajador,
                                 EstadoRegistro, CodigoUsuarioCreador, FechaCreacion, CodigoUsuarioModificador, FechaModificacion,
                                 CodigoUsuarioCreadorSistema, FechaCreacionSistema, CodigoUsuarioUpdateSistema, FechaUpdateSistema)
VALUES
    (@Persona1, 'J', 'CLÍNICA SAN PABLO S.A.', 'CSP',
     'RUC', '20107564328', 'www.clinicasanpablo.com.pe', NULL,
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (@Persona2, 'J', 'CLÍNICA RICARDO PALMA S.A.', 'CRP',
     'RUC', '20100121809', 'www.crp.com.pe', NULL,
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (@Persona3, 'J', 'PACÍFICO SALUD EPS', 'PSEPS',
     'RUC', '20332970411', 'www.pacificosalud.com.pe', NULL,
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (@Persona4, 'J', 'PACÍFICO COMPAÑÍA DE SEGUROS Y REASEGUROS', 'PCSR',
     'RUC', '20332970412', 'www.pacifico.com.pe', NULL,
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (@Persona5, 'J', 'SUIZA LAB S.A.C.', 'SUIZA',
     'RUC', '20107856952', 'www.suizalab.com', NULL,
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL);

-- Insertar personas jurídicas
PRINT 'Insertando personas jurídicas...';
INSERT INTO persona.Mae_PersonaJuridica (IdPersona, FechaAniversario, NombreRazonSocial, NombreRazonSocialAbreviada,
                                         CodigoGrupoEconomico, EstadoRegistro, CodigoUsuarioCreador, FechaCreacion, CodigoUsuarioModificador, FechaModificacion,
                                         CodigoUsuarioCreadorSistema, FechaCreacionSistema, CodigoUsuarioUpdateSistema, FechaUpdateSistema)
VALUES
    (@Persona1, '1980-03-15', 'CLÍNICA SAN PABLO S.A.', 'CSP',
     NULL, 'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (@Persona2, '1975-06-22', 'CLÍNICA RICARDO PALMA S.A.', 'CRP',
     NULL, 'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (@Persona3, '1989-11-10', 'PACÍFICO SALUD EPS', 'PSEPS',
     'GE001', 'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (@Persona4, '1992-05-17', 'PACÍFICO COMPAÑÍA DE SEGUROS Y REASEGUROS', 'PCSR',
     'GE001', 'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (@Persona5, '1995-08-30', 'SUIZA LAB S.A.C.', 'SUIZA',
     NULL, 'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL);

-- Insertar compañías de seguros
PRINT 'Insertando compañías de seguros...';
DECLARE @CompaniaSeguros1 UNIQUEIDENTIFIER = NEWID(); -- Pacífico Salud
DECLARE @CompaniaSeguros2 UNIQUEIDENTIFIER = NEWID(); -- Pacífico Seguros

INSERT INTO persona.Mae_CompaniaSeguro (IdCompaniaSeguro, IdPersonaJuridica, CodigoIAFA, DescripcionCompaniaSeguro,
                                        EstadoRegistro, CodigoUsuarioCreador, FechaCreacion, CodigoUsuarioModificador, FechaModificacion,
                                        CodigoUsuarioCreadorSistema, FechaCreacionSistema, CodigoUsuarioUpdateSistema, FechaUpdateSistema)
VALUES
    (@CompaniaSeguros1, @Persona3, '20002', 'PACÍFICO SALUD EPS',
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (@CompaniaSeguros2, @Persona4, '40004', 'PACÍFICO SEGUROS',
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL);

-- Insertar proveedores
PRINT 'Insertando proveedores...';
DECLARE @Proveedor1 UNIQUEIDENTIFIER = NEWID(); -- Clínica San Pablo
DECLARE @Proveedor2 UNIQUEIDENTIFIER = NEWID(); -- Clínica Ricardo Palma
DECLARE @Proveedor3 UNIQUEIDENTIFIER = NEWID(); -- Suiza Lab

INSERT INTO persona.Mae_Proveedor (IdProveedor, IdPersona, IdTipoProveedor, CodigoProveedor, TipoProveedor,
                                   IndicadorCertificacion, IndicadorRedSelecta, EstadoRegistro,
                                   CodigoUsuarioCreador, FechaCreacion, CodigoUsuarioModificador, FechaModificacion,
                                   CodigoUsuarioCreadorSistema, FechaCreacionSistema, CodigoUsuarioUpdateSistema, FechaUpdateSistema)
VALUES
    (@Proveedor1, @Persona1, @TipoProveedor1, '10001', 1,
     'S', 'S', 'V',
     @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (@Proveedor2, @Persona2, @TipoProveedor1, '10002', 1,
     'S', 'N', 'V',
     @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (@Proveedor3, @Persona5, @TipoProveedor3, '10003', 3,
     'S', 'S', 'V',
     @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL);

-- Insertar sucursales
PRINT 'Insertando sucursales...';
DECLARE @Sucursal1 UNIQUEIDENTIFIER = NEWID(); -- San Pablo Surco
DECLARE @Sucursal2 UNIQUEIDENTIFIER = NEWID(); -- San Pablo San Miguel
DECLARE @Sucursal3 UNIQUEIDENTIFIER = NEWID(); -- Ricardo Palma San Isidro
DECLARE @Sucursal4 UNIQUEIDENTIFIER = NEWID(); -- Suiza Lab San Borja

INSERT INTO persona.Mae_Sucursal (IdSucursal, IdProveedor, CodigoProveedor, NumeroSucursalProveedor,
                                  DescripcionSucursal, IndicadorPrincipalSucursal, CategoriaSucursal,
                                  CodigoSucursalSeps, RegistroSeps, IndicadorEPS, CodigoSeps, CodigoClinicaEps,
                                  IndicadorRedSelecta, IndicadorExoneracionIgv, IndicadorDetraccion, TipoInstitucion,
                                  EstadoRegistro, CodigoUsuarioCreador, FechaCreacion, CodigoUsuarioModificador, FechaModificacion,
                                  CodigoUsuarioCreadorSistema, FechaCreacionSistema, CodigoUsuarioUpdateSistema, FechaUpdateSistema)
VALUES
    (@Sucursal1, @Proveedor1, '10001', '1',
     'CLÍNICA SAN PABLO - SEDE SURCO', 'P', 'A',
     'CSP-SURCO', 'R1001', 'S', 'SEPS1001', 'CSP-001',
     'S', 'N', 'N', 'CLINICA',
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (@Sucursal2, @Proveedor1, '10001', '2',
     'CLÍNICA SAN PABLO - SEDE SAN MIGUEL', 'S', 'A',
     'CSP-SANMIG', 'R1002', 'S', 'SEPS1002', 'CSP-002',
     'S', 'N', 'N', 'CLINICA',
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (@Sucursal3, @Proveedor2, '10002', '1',
     'CLÍNICA RICARDO PALMA - SEDE PRINCIPAL', 'P', 'A',
     'CRP-MAIN', 'R2001', 'S', 'SEPS2001', 'CRP-001',
     'N', 'N', 'N', 'CLINICA',
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (@Sucursal4, @Proveedor3, '10003', '1',
     'SUIZA LAB - SEDE SAN BORJA', 'P', 'B',
     'SL-SBORJA', 'R3001', 'S', 'SEPS3001', 'SL-001',
     'S', 'N', 'N', 'LABORATORIO',
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL);

-- Insertar roles de personas
PRINT 'Insertando roles de personas...';
INSERT INTO persona.Tbt_PersonaRol (IdPersonaRol, IdPersona, IdTipoRol,
                                    EstadoRegistro, CodigoUsuarioCreador, FechaCreacion, CodigoUsuarioModificador, FechaModificacion,
                                    CodigoUsuarioCreadorSistema, FechaCreacionSistema, CodigoUsuarioUpdateSistema, FechaUpdateSistema)
VALUES
    (NEWID(), @Persona1, 'ROL001',
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (NEWID(), @Persona2, 'ROL001',
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (NEWID(), @Persona3, 'ROL002',
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (NEWID(), @Persona4, 'ROL002',
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (NEWID(), @Persona5, 'ROL001',
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL);

-- Insertar relaciones entre personas y compañías de seguros
PRINT 'Insertando relaciones entre personas y compañías de seguros...';
INSERT INTO persona.Tbt_PersonaCompaniaSeguro (IdPersonaCompaniaSeguro, IdPersona, IdCompaniaSeguro,
                                               EstadoRegistro, CodigoUsuarioCreador, FechaCreacion, CodigoUsuarioModificador, FechaModificacion,
                                               CodigoUsuarioCreadorSistema, FechaCreacionSistema, CodigoUsuarioUpdateSistema, FechaUpdateSistema)
VALUES
    (NEWID(), @Persona1, @CompaniaSeguros1,
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (NEWID(), @Persona1, @CompaniaSeguros2,
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (NEWID(), @Persona2, @CompaniaSeguros1,
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (NEWID(), @Persona5, @CompaniaSeguros1,
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL);

-- Insertar relaciones entre sucursales y compañías de seguros
PRINT 'Insertando relaciones entre sucursales y compañías de seguros...';
INSERT INTO persona.Mae_SucursalCompaniaSeguro (IdSucursalCompaniaSeguro, IdSucursal, IdCompaniaSeguro,
                                                CodigoProveedor, NumeroSucursalProveedor,
                                                EstadoRegistro, CodigoUsuarioCreador, FechaCreacion, CodigoUsuarioModificador, FechaModificacion,
                                                CodigoUsuarioCreadorSistema, FechaCreacionSistema, CodigoUsuarioUpdateSistema, FechaUpdateSistema)
VALUES
    (NEWID(), @Sucursal1, @CompaniaSeguros1,
     '10001', '1',
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (NEWID(), @Sucursal1, @CompaniaSeguros2,
     '10001', '1',
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (NEWID(), @Sucursal2, @CompaniaSeguros1,
     '10001', '2',
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (NEWID(), @Sucursal3, @CompaniaSeguros1,
     '10002', '1',
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL),

    (NEWID(), @Sucursal4, @CompaniaSeguros1,
     '10003', '1',
     'V', @UsuarioCreador, @FechaActual, NULL, NULL,
     @UsuarioSistema, @FechaActual, NULL, NULL);

PRINT 'Inserción de datos completada con éxito.';

-- Reactivar mensajes de conteo de filas
SET NOCOUNT OFF;
GO

-- Consultas de verificación (opcional, comentar si no se desea ejecutar)
/*
SELECT 'Roles' AS Tabla, COUNT(*) AS TotalRegistros FROM persona.Tip_Rol
UNION ALL
SELECT 'Tipos de Proveedor', COUNT(*) FROM persona.Tip_TipoProveedor
UNION ALL
SELECT 'Personas', COUNT(*) FROM persona.Mae_Persona
UNION ALL
SELECT 'Personas Jurídicas', COUNT(*) FROM persona.Mae_PersonaJuridica
UNION ALL
SELECT 'Compañías de Seguros', COUNT(*) FROM persona.Mae_CompaniaSeguro
UNION ALL
SELECT 'Proveedores', COUNT(*) FROM persona.Mae_Proveedor
UNION ALL
SELECT 'Sucursales', COUNT(*) FROM persona.Mae_Sucursal
UNION ALL
SELECT 'Roles de Personas', COUNT(*) FROM persona.Tbt_PersonaRol
UNION ALL
SELECT 'Persona-CompañíaSeguro', COUNT(*) FROM persona.Tbt_PersonaCompaniaSeguro
UNION ALL
SELECT 'Sucursal-CompañíaSeguro', COUNT(*) FROM persona.Mae_SucursalCompaniaSeguro;
*/

/*

curl -X POST "https://apim-eu1-border-service-desa.azure-api.net/ne-consulta-personaProveedores-eps/persona/v1.0.0/proveedor/search" \
  -H "Ocp-Apim-Subscription-Key: 356891414ddd41148bb80c4e69e26fd6" \
  -H "Content-Type: application/json" \
  -H "X-Correlation-Id: test-correlation-id" \
  -H "X-Request-Id: test-request-id" \
  -H "nombreAplicacion: TestApp" \
  -H "procesoNegocio: Testing" \
  -H "usuarioAplicacion: TestUser" \
  -d '{
    "pageSize": 10,
    "pageStartIndex": 0
  }'

curl -X GET "https://apim-eu1-border-service-desa.azure-api.net/ne-consulta-personaProveedores-eps/persona/v1.0.0/proveedor/health" \
  -H "Ocp-Apim-Subscription-Key: 356891414ddd41148bb80c4e69e26fd6"

curl -X GET "https://apim-eu1-border-service-desa.azure-api.net/ne-consulta-personaProveedores-eps/persona/v1.0.0/proveedor/health" \
  -H "Ocp-Apim-Subscription-Key: 356891414ddd41148bb80c4e69e26fd6" \
  -H "X-Correlation-Id: test-correlation-id" \
  -H "X-Request-Id: test-request-id"



$token = "tu-token-personal-de-acceso"
$encodedToken = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($token))
Write-Output $encodedToken


curl -X POST "https://apim-eu1-border-service-desa.azure-api.net/ne-consulta-personaProveedores-eps/persona/v1.0.0/proveedor/search" \
  -H "Ocp-Apim-Subscription-Key: 356891414ddd41148bb80c4e69e26fd6" \
  -H "Content-Type: application/json" \
  -H "X-Correlation-Id: test-correlation-id" \
  -H "X-Request-Id: test-request-id" \
  -H "nombreAplicacion: TestApp" \
  -H "procesoNegocio: Testing" \
  -H "usuarioAplicacion: TestUser" \
  -d '{
    "pageSize": 10,
    "pageStartIndex": 0
  }'

curl -X GET "https://apim-eu1-border-service-desa.azure-api.net/ne-consulta-personaProveedores-eps/persona/v1.0.0/proveedor/health" \
  -H "Ocp-Apim-Subscription-Key: 356891414ddd41148bb80c4e69e26fd6"

curl -X GET "https://apim-eu1-border-service-desa.azure-api.net/ne-consulta-personaProveedores-eps/persona/v1.0.0/proveedor/health" \
  -H "Ocp-Apim-Subscription-Key: 356891414ddd41148bb80c4e69e26fd6" \
  -H "X-Correlation-Id: test-correlation-id" \
  -H "X-Request-Id: test-request-id"

curl -X POST "http://localhost:3000/ne-consulta-personaProveedores-eps/persona/v1.0.0/proveedor/search" -H "Ocp-Apim-Subscription-Key: 356891414ddd4148bb80c4e69e26fd6" -H "Content-Type: application/json" -d "{\"pageSize\": 10, \"pageStartIndex\": 0}"
curl -X POST 'http://localhost:3000/ne-consulta-personaProveedores-eps/persona/v1.0.0/proveedor/search' -H 'Ocp-Apim-Subscription-Key: 356891414ddd4148bb80c4e69e26fd6' -H 'Content-Type: application/json' -d '{"pageSize": 10, "pageStartIndex": 0}'
 curl --location 'https://apim-eu1-border-service-desa.azure-api.net/ot-configServer/config/srv-ms-sm-ne-ods-consultaProveedor/development?files=application.yml' \
--header 'x-api-key: df584e6f4dcc46e183a100d16da13c54' \
--header 'ocp-apim-subscription-key: df584e6f4dcc46e183a100d16da13c54' \
--data ''


Endpoints de Proveedores
1. Búsqueda de Proveedores con Filtros
bashcurl -X POST \
  'http://localhost:3000/api/v1/proveedores/buscar' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "codigoProveedor": "10001",
    "tipoProveedor": "1",
    "estado": "V",
    "tipoPersona": "J",
    "numeroDocumento": "20507264108",
    "tipoDocumento": "RUC",
    "razonSocial": "Clínica San Pablo",
    "eps": "PACIFICO SALUD",
    "indicadorRedSelecta": "S",
    "pageSize": 10,
    "pageStartIndex": 0,
    "sort": [
      {
        "field": "razonSocial",
        "direction": "asc"
      }
    ]
  }'
2. Obtener Proveedor por Código
bashcurl -X GET \
  'http://localhost:3000/api/v1/proveedores/10001' \
  -H 'Accept: application/json'
3. Búsqueda Simplificada de Proveedores
bashcurl -X GET \
  'http://localhost:3000/api/v1/proveedores?eps=PACIFICO%20SALUD&tipoPersona=J&estado=V&pagina=1&registrosPorPagina=20' \
  -H 'Accept: application/json'
Endpoints de Sucursales
1. Búsqueda de Sucursales con Filtros
bashcurl -X POST \
  'http://localhost:3000/api/v1/sucursales/buscar' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "codigoProveedor": "10001",
    "numeroSucursalProveedor": "1",
    "codIpress": "CSP-SURCO",
    "estado": "V",
    "indicadorPrincipalSucursal": "P",
    "eps": "PACIFICO SALUD",
    "pageSize": 10,
    "pageStartIndex": 0,
    "sort": [
      {
        "field": "descripcion",
        "direction": "asc"
      }
    ]
  }'
2. Obtener Sucursal por Código
bashcurl -X GET \
  'http://localhost:3000/api/v1/sucursales/SUC001' \
  -H 'Accept: application/json'
3. Obtener Sucursales por Proveedor
bashcurl -X GET \
  'http://localhost:3000/api/v1/proveedores/10001/sucursales' \
  -H 'Accept: application/json'
Endpoints de Compañías de Seguros
1. Obtener Todas las Compañías de Seguros
bashcurl -X GET \
  'http://localhost:3000/api/v1/companiaseguros' \
  -H 'Accept: application/json'
2. Obtener Compañía de Seguros por ID
bashcurl -X GET \
  'http://localhost:3000/api/v1/companiaseguros/1' \
  -H 'Accept: application/json'
Endpoints de Tipos de Proveedor
bashcurl -X GET \
  'http://localhost:3000/api/v1/tipos-proveedor' \
  -H 'Accept: application/json'
Endpoints de Roles
bashcurl -X GET \
  'http://localhost:3000/api/v1/roles' \
  -H 'Accept: application/json'
Prueba de Manejo de Errores
Petición con ID Inexistente
bashcurl -X GET \
  'http://localhost:3000/api/v1/proveedores/99999' \
  -H 'Accept: application/json'
Petición con Parámetros Inválidos
bashcurl -X POST \
  'http://localhost:3000/api/v1/proveedores/buscar' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "estado": "ESTADO_INVALIDO",
    "pageSize": -1
  }'
Estos comandos curl están diseñados para probar las diferentes funcionalidades de la API, incluyendo búsquedas con filtros, obtención de datos específicos y manejo de errores. Puedes modificarlos según las necesidades específicas de tu entorno de desarrollo.


Endpoints de Proveedores
Búsqueda de Proveedores con Filtros
bashcurl -X POST 'http://localhost:3000/api/v1/proveedores/buscar' -H 'Content-Type: application/json' -H 'Accept: application/json' -d '{"codigoProveedor": "10001", "tipoProveedor": "1", "estado": "V", "tipoPersona": "J", "numeroDocumento": "20507264108", "tipoDocumento": "RUC", "razonSocial": "Clínica San Pablo", "eps": "PACIFICO SALUD", "indicadorRedSelecta": "S", "pageSize": 10, "pageStartIndex": 0, "sort": [{"field": "razonSocial", "direction": "asc"}]}'
Obtener Proveedor por Código
bashcurl -X GET 'http://localhost:3000/api/v1/proveedores/10001' -H 'Accept: application/json'
Búsqueda Simplificada de Proveedores
bashcurl -X GET 'http://localhost:3000/api/v1/proveedores?eps=PACIFICO%20SALUD&tipoPersona=J&estado=V&pagina=1&registrosPorPagina=20' -H 'Accept: application/json'
Endpoints de Sucursales
Búsqueda de Sucursales con Filtros (v1.0.0)
bashcurl -X POST 'http://localhost:3000/v1.0.0/sucursal/search' -H 'Content-Type: application/json' -H 'Accept: application/json' -d '{"codigoProveedor": "10001", "numeroSucursalProveedor": "1", "codIpress": "CSP-SURCO", "estado": "V", "indicadorPrincipalSucursal": "P", "eps": "PACIFICO SALUD", "pageSize": 10, "pageStartIndex": 0, "sort": [{"field": "descripcion", "direction": "asc"}]}'
Listar Sucursales (v1)
bashcurl -X POST 'http://localhost:3000/api/v1/sucursales' -H 'Content-Type: application/json' -H 'Accept: application/json' -d '{"codigoProveedor": "10001", "numeroSucursalProveedor": "1", "codIpress": "CSP-SURCO", "estado": "V", "indicadorPrincipalSucursal": "P", "eps": "PACIFICO SALUD", "pageSize": 10, "pageStartIndex": 0, "sort": [{"field": "descripcion", "direction": "asc"}]}'
Obtener Sucursal por Código
bashcurl -X GET 'http://localhost:3000/api/v1/sucursales/SUC001' -H 'Accept: application/json'
Health Check Sucursales
bashcurl -X GET 'http://localhost:3000/api/v1/sucursales/health' -H 'Accept: application/json'
Otros Endpoints
Obtener Todas las Compañías de Seguros
bashcurl -X GET 'http://localhost:3000/api/v1/companiaseguros' -H 'Accept: application/json'
Obtener Compañía de Seguros por ID
bashcurl -X GET 'http://localhost:3000/api/v1/companiaseguros/1' -H 'Accept: application/json'
Obtener Todos los Tipos de Proveedor
bashcurl -X GET 'http://localhost:3000/api/v1/tipos-proveedor' -H 'Accept: application/json'
Obtener Todos los Roles
bashcurl -X GET 'http://localhost:3000/api/v1/roles' -H 'Accept: application/json'
Pruebas de Manejo de Errores
Petición con ID Inexistente
bashcurl -X GET 'http://localhost:3000/api/v1/proveedores/99999' -H 'Accept: application/json'
Petición con Parámetros Inválidos
bashcurl -X POST 'http://localhost:3000/api/v1/proveedores/buscar' -H 'Content-Type: application/json' -H 'Accept: application/json' -d '{"estado": "ESTADO_INVALIDO", "pageSize": -1}'RetryClaude can make mistakes. Please double-check responses.

osea probe este tambien
ese di deberia estar no?
Si debería estar
Lo válido
Tú tienes postman
En tu vm
?
https://dl.pstmn.io/download/version/11.7.0/win64

*/