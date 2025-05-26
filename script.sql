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

https://kveu1datosdesa01.vault.azure.net/


# compiled output
/dist
/node_modules
/build
package-lock.json
.npmrc

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# temp directory
.temp
.tmp

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

curl --location --request POST 'http://localhost:3000/v1.0.0/beneficios' \
--header 'ocp-apim-subscription-key: <TU_CLAVE_DE_SUSCRIPCION>' \
--header 'X-Correlation-Id: <TU_CORRELATION_ID>' \
--header 'X-Request-Id: <TU_REQUEST_ID>' \
--header 'nombreAplicacion: <NOMBRE_APLICACION>' \
--header 'procesoNegocio: <PROCESO_NEGOCIO>' \
--header 'usuarioAplicacion: <USUARIO_APLICACION>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "filtroxCompania": "EPS",
    "filtroxSistema": "SALUD",
    "filtroxCodBeneficio": [],
    "filtroxIdBeneficio": [],
    "filtroxCoTipoCobertura": "TC001",
    "filtroxCodSubTipoCobertura": "STC001",
    "filtroxGrupoBeneficio": "GB001",
    "filtroxEstadoBeneficio": "ACTIVO",
    "pageSize": 10,
    "pageStartIndex": 0,
    "sort": [
      {
        "field": "codBeneficio",
        "direction": "asc"
      }
    ]
}'

curl --location --request POST 'http://localhost:3000/v1.0.0/beneficios/diagnosticos' \
--header 'ocp-apim-subscription-key: <TU_CLAVE_DE_SUSCRIPCION>' \
--header 'X-Correlation-Id: <TU_CORRELATION_ID>' \
--header 'X-Request-Id: <TU_REQUEST_ID>' \
--header 'nombreAplicacion: <NOMBRE_APLICACION>' \
--header 'procesoNegocio: <PROCESO_NEGOCIO>' \
--header 'usuarioAplicacion: <USUARIO_APLICACION>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "filtroxCompania": "EPS",
    "filtroxSistema": "SALUD",
    "filtroxCodBeneficio": [],
    "filtroxIdBeneficio": [],
    "filtroxEstadoBeneficio": "ACTIVO",
    "pageSize": 10,
    "pageStartIndex": 0,
    "sort": [
      {
        "field": "codDiagnostico",
        "direction": "asc"
      }
    ]
}'


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [convenio].[Mae_Beneficio](
	[idBeneficio] [nvarchar](max) NULL,
	[idGrupoBeneficio] [nvarchar](max) NULL,
	[idTipoCobertura] [nvarchar](max) NULL,
	[idSubtipoCobertura] [nvarchar](max) NULL,
	[codBeneficio] [nvarchar](max) NULL,
	[descripcion] [nvarchar](max) NULL,
	[desResumida] [nvarchar](max) NULL,
	[codGrupoBeneficio] [nvarchar](max) NULL,
	[codCobertura] [nvarchar](max) NULL,
	[subtipoCobert] [nvarchar](max) NULL,
	[estRegistro] [nvarchar](max) NULL,
	[codSistema] [nvarchar](max) NULL,
	[compania] [nvarchar](max) NULL,
	[codUsuarioCreadorSistema] [nvarchar](max) NULL,
	[fecCreacionSistema] [datetime] NULL,
	[codUsuarioUpdateSistema] [nvarchar](max) NULL,
	[fecUpdateSistema] [datetime] NULL,
	[codUsuarioCreador] [nvarchar](max) NULL,
	[fecCreacion] [datetime] NULL,
	[codUsuarioUpdate] [nvarchar](max) NULL,
	[fecUpdate] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [convenio].[Mae_SubtipoCobertura](
	[idSubtipoCobertura] [nvarchar](max) NULL,
	[idTipoCobertura] [nvarchar](max) NULL,
	[codCobertura] [nvarchar](max) NULL,
	[subtipoCobert] [nvarchar](max) NULL,
	[descripcionSubTipo] [nvarchar](max) NULL,
	[codDatoDetalle] [nvarchar](max) NULL,
	[estRegistro] [nvarchar](max) NULL,
	[codUsuarioCreador] [nvarchar](max) NULL,
	[fecCreacion] [datetime] NULL,
	[codUsuarioUpdate] [nvarchar](max) NULL,
	[fecUpdate] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [convenio].[Mae_BeneficioEPS](
	[idBeneficioEps] [nvarchar](max) NULL,
	[idBeneficio] [nvarchar](max) NULL,
	[codBeneficio] [nvarchar](max) NULL,
	[tipoGastoPrestacion] [nvarchar](max) NULL,
	[indRequiereCartaGarantia] [nvarchar](max) NULL,
	[indBeneficioAdicional] [nvarchar](max) NULL,
	[indBeneficioPrincipal] [nvarchar](max) NULL,
	[indProcEspeciales] [nvarchar](max) NULL,
	[tipoPEAS] [nvarchar](max) NULL,
	[indBeneficioComun] [nvarchar](max) NULL,
	[codGrupoServicio] [int] NULL,
	[indMostrarCG] [nvarchar](max) NULL,
	[codSistema] [nvarchar](max) NULL,
	[estRegistro] [nvarchar](max) NULL,
	[codUsuarioCreadorSistema] [nvarchar](max) NULL,
	[fecCreacionSistema] [datetime] NULL,
	[codUsuarioUpdateSistema] [nvarchar](max) NULL,
	[fecUpdateSistema] [datetime] NULL,
	[codUsuarioCreador] [nvarchar](max) NULL,
	[fecCreacion] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [convenio].[Mae_TipoCobertura](
	[idTipoCobertura] [nvarchar](max) NULL,
	[codCobertura] [nvarchar](max) NULL,
	[descripcionTipo] [nvarchar](max) NULL,
	[estRegistro] [nvarchar](max) NULL,
	[codUsuarioCreador] [nvarchar](max) NULL,
	[fecCreacion] [datetime] NULL,
	[codUsuarioUpdate] [nvarchar](max) NULL,
	[fecUpdate] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [convenio].[Diagnostico](
	[idDiagnostico] [nvarchar](max) NULL,
	[codDiagnostico] [nvarchar](max) NULL,
	[descripcionDiagnostico] [nvarchar](max) NULL,
	[desTipDiagnostico] [nvarchar](max) NULL,
	[codGrupoDiagnostico] [nvarchar](max) NULL,
	[nivelDiagnostico] [nvarchar](max) NULL,
	[codFrecuenciaDiagnostico] [int] NULL,
	[indBeneficioCompartido] [nvarchar](max) NULL,
	[indRequiereCartaGarantia] [nvarchar](max) NULL,
	[indBeneficioExclusivo] [nvarchar](max) NULL,
	[tipoPEAS] [nvarchar](max) NULL,
	[numVersion] [int] NULL,
	[sexoExclusivo] [nvarchar](max) NULL,
	[indDiagnosticoNoRepetible] [int] NULL,
	[codSistema] [nvarchar](max) NULL,
	[fecStatus] [datetime] NULL,
	[estRegistro] [nvarchar](max) NULL,
	[codUsuarioCreadorSistema] [nvarchar](max) NULL,
	[fecCreacionSistema] [datetime] NULL,
	[codUsuarioUpdateSistema] [nvarchar](max) NULL,
	[fecUpdateSistema] [datetime] NULL,
	[codUsuarioCreador] [nvarchar](max) NULL,
	[fecCreacion] [datetime] NULL,
	[codUsuarioUpdate] [nvarchar](max) NULL,
	[fecUpdate] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [convenio].[DiagnosticoBeneficio](
	[idDiagnosticoBeneficio] [nvarchar](max) NULL,
	[idDiagnostico] [nvarchar](max) NULL,
	[idBeneficio] [nvarchar](max) NULL,
	[codDiagnostico] [nvarchar](max) NULL,
	[codBeneficio] [nvarchar](max) NULL,
	[codSistema] [nvarchar](max) NULL,
	[estRegistro] [nvarchar](max) NULL,
	[codUsuarioCreadorSistema] [nvarchar](max) NULL,
	[fecCreacionsSistema] [datetime] NULL,
	[codUsuarioUpdateSistema] [nvarchar](max) NULL,
	[fecUpdateSistema] [datetime] NULL,
	[codUsuarioCreador] [nvarchar](max) NULL,
	[fecCreacion] [datetime] NULL,
	[codUsuarioUpdate] [nvarchar](max) NULL,
	[fecUpdate] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
 // Mapeo de nombres de campos del DTO a nombres de columnas en la consulta
        const fieldMapping = {
            'codBeneficio': 'b.codigo',
            'nombreBeneficio': 'b.desResumida',
            'descripcionBeneficio': 'b.descripcion',
            'codTipoCobertura': 'tc.codigo',
            'nombreTipoCobertura': 'tc.descripcionTipo',
            'codSubTipoCobertura': 'stc.codigo',
            'nombreSubTipoCobertura': 'stc.descripcionSubTipo',
            'grupoBeneficio': 'b.codGrupoBeneficio',
            'estadoBeneficio': 'b.estRegistro'
        };

 */
 */
