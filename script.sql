PRINT 'Iniciando inserción de datos...';

-- Insertar tipos de roles
PRINT 'Insertando roles...';
INSERT INTO Tip_Rol (IdTipoRol, CodigoLval, DescripcionRol, EstadoRegistro,
                     CodigoUsuarioCreador, FechaCreacion, CodigoUsuarioCreadorSistema, FechaCreacionSistema)
VALUES
    ('ROL001', 'F', 'PROVEEDOR MÉDICO', 'V', @UsuarioCreador, @FechaActual, @UsuarioSistema, @FechaActual),
    ('ROL002', 'I', 'ASEGURADORA', 'V', @UsuarioCreador, @FechaActual, @UsuarioSistema, @FechaActual),
    ('ROL003', 'E', 'ENTIDAD PÚBLICA', 'V', @UsuarioCreador, @FechaActual, @UsuarioSistema, @FechaActual),
    ('ROL004', 'P', 'PERSONA NATURAL', 'V', @UsuarioCreador, @FechaActual, @UsuarioSistema, @FechaActual);

-- Insertar tipos de proveedores
PRINT 'Insertando tipos de proveedores...';
DECLARE @TipoProveedor1 UNIQUEIDENTIFIER = NEWID();
DECLARE @TipoProveedor2 UNIQUEIDENTIFIER = NEWID();
DECLARE @TipoProveedor3 UNIQUEIDENTIFIER = NEWID();

INSERT INTO Tip_TipoProveedor (IdTipoProveedor, TipoProveedor, DescripcionTipoProveedor, EstadoRegistro,
                               CodigoUsuarioCreador, FechaCreacion, CodigoUsuarioCreadorSistema, FechaCreacionSistema)
VALUES
    (@TipoProveedor1, 1, 'CLÍNICA', 'V', @UsuarioCreador, @FechaActual, @UsuarioSistema, @FechaActual),
    (@TipoProveedor2, 2, 'CENTRO MÉDICO', 'V', @UsuarioCreador, @FechaActual, @UsuarioSistema, @FechaActual),
    (@TipoProveedor3, 3, 'LABORATORIO', 'V', @UsuarioCreador, @FechaActual, @UsuarioSistema, @FechaActual);

-- Insertar personas
PRINT 'Insertando personas...';
DECLARE @Persona1 UNIQUEIDENTIFIER = NEWID(); -- Clínica San Pablo
DECLARE @Persona2 UNIQUEIDENTIFIER = NEWID(); -- Clínica Ricardo Palma
DECLARE @Persona3 UNIQUEIDENTIFIER = NEWID(); -- Pacífico Salud
DECLARE @Persona4 UNIQUEIDENTIFIER = NEWID(); -- Pacífico Seguros
DECLARE @Persona5 UNIQUEIDENTIFIER = NEWID(); -- Laboratorio Suiza Lab

INSERT INTO Mae_Persona (IdPersona, TipoPersona, NombreCompletoPersona, NombreAbreviadoPersona,
                         CodigoTipoDocumento, NumeroDocumento, DescripcionPaginaWeb, CodigoTipoTrabajador,
                         EstadoRegistro, FechaCreacion, CodigoUsuarioCreador,
                         CodigoUsuarioCreadorSistema, FechaCreacionSistema)
VALUES
    (@Persona1, 'J', 'CLÍNICA SAN PABLO S.A.', 'CSP', 'RUC', '20107564328', 'www.clinicasanpablo.com.pe', NULL,
     'V', @FechaActual, @UsuarioCreador, @UsuarioSistema, @FechaActual),

    (@Persona2, 'J', 'CLÍNICA RICARDO PALMA S.A.', 'CRP', 'RUC', '20100121809', 'www.crp.com.pe', NULL,
     'V', @FechaActual, @UsuarioCreador, @UsuarioSistema, @FechaActual),

    (@Persona3, 'J', 'PACÍFICO SALUD EPS', 'PSEPS', 'RUC', '20332970411', 'www.pacificosalud.com.pe', NULL,
     'V', @FechaActual, @UsuarioCreador, @UsuarioSistema, @FechaActual),

    (@Persona4, 'J', 'PACÍFICO COMPAÑÍA DE SEGUROS Y REASEGUROS', 'PCSR', 'RUC', '20332970412', 'www.pacifico.com.pe', NULL,
     'V', @FechaActual, @UsuarioCreador, @UsuarioSistema, @FechaActual),

    (@Persona5, 'J', 'SUIZA LAB S.A.C.', 'SUIZA', 'RUC', '20107856952', 'www.suizalab.com', NULL,
     'V', @FechaActual, @UsuarioCreador, @UsuarioSistema, @FechaActual);

-- Insertar personas jurídicas
PRINT 'Insertando personas jurídicas...';
INSERT INTO Mae_PersonaJuridica (IdPersona, FechaAniversario, NombreRazonSocial, NombreRazonSocialAbreviada,
                                 CodigoGrupoEconomico, EstadoRegistro, CodigoUsuarioCreador, FechaCreacion,
                                 CodigoUsuarioCreadorSistema, FechaCreacionSistema)
VALUES
    (@Persona1, '1980-03-15', 'CLÍNICA SAN PABLO S.A.', 'CSP', NULL,
     'V', @UsuarioCreador, @FechaActual, @UsuarioSistema, @FechaActual),

    (@Persona2, '1975-06-22', 'CLÍNICA RICARDO PALMA S.A.', 'CRP', NULL,
     'V', @UsuarioCreador, @FechaActual, @UsuarioSistema, @FechaActual),

    (@Persona3, '1989-11-10', 'PACÍFICO SALUD EPS', 'PSEPS', 'GE001',
     'V', @UsuarioCreador, @FechaActual, @UsuarioSistema, @FechaActual),

    (@Persona4, '1992-05-17', 'PACÍFICO COMPAÑÍA DE SEGUROS Y REASEGUROS', 'PCSR', 'GE001',
     'V', @UsuarioCreador, @FechaActual, @UsuarioSistema, @FechaActual),

    (@Persona5, '1995-08-30', 'SUIZA LAB S.A.C.', 'SUIZA', NULL,
     'V', @UsuarioCreador, @FechaActual, @UsuarioSistema, @FechaActual);

-- Insertar compañías de seguros
PRINT 'Insertando compañías de seguros...';
DECLARE @CompaniaSeguros1 UNIQUEIDENTIFIER = NEWID(); -- Pacífico Salud
DECLARE @CompaniaSeguros2 UNIQUEIDENTIFIER = NEWID(); -- Pacífico Seguros

INSERT INTO Mae_CompaniaSeguros (IdCompaniaSeguros, IdPersonaJuridica, CodigoIAFA, DescripcionCompaniaSeguros,
                                 EstadoRegistro, CodigoUsuarioCreador, FechaCreacion,
                                 CodigoUsuarioCreadorSistema, FechaCreacionSistema)
VALUES
    (@CompaniaSeguros1, @Persona3, '20002', 'PACÍFICO SALUD EPS',
     'V', @UsuarioCreador, @FechaActual, @UsuarioSistema, @FechaActual),

    (@CompaniaSeguros2, @Persona4, '40004', 'PACÍFICO SEGUROS',
     'V', @UsuarioCreador, @FechaActual, @UsuarioSistema, @FechaActual);

-- Insertar proveedores
PRINT 'Insertando proveedores...';
DECLARE @Proveedor1 UNIQUEIDENTIFIER = NEWID(); -- Clínica San Pablo
DECLARE @Proveedor2 UNIQUEIDENTIFIER = NEWID(); -- Clínica Ricardo Palma
DECLARE @Proveedor3 UNIQUEIDENTIFIER = NEWID(); -- Suiza Lab

INSERT INTO Mae_Proveedor (IdProveedor, IdPersona, IdTipoProveedor, CodigoProveedor, TipoProveedor,
                           IndicadorCertificacion, IndicadorRedSelecta, EstadoRegistro,
                           CodigoUsuarioCreador, FechaCreacion,
                           CodigoUsuarioCreadorSistema, FechaCreacionSistema)
VALUES
    (@Proveedor1, @Persona1, @TipoProveedor1, '10001', 1,
     'S', 'S', 'V',
     @UsuarioCreador, @FechaActual,
     @UsuarioSistema, @FechaActual),

    (@Proveedor2, @Persona2, @TipoProveedor1, '10002', 1,
     'S', 'N', 'V',
     @UsuarioCreador, @FechaActual,
     @UsuarioSistema, @FechaActual),

    (@Proveedor3, @Persona5, @TipoProveedor3, '10003', 3,
     'S', 'S', 'V',
     @UsuarioCreador, @FechaActual,
     @UsuarioSistema, @FechaActual);

-- Insertar sucursales
PRINT 'Insertando sucursales...';
DECLARE @Sucursal1 UNIQUEIDENTIFIER = NEWID(); -- San Pablo Surco
DECLARE @Sucursal2 UNIQUEIDENTIFIER = NEWID(); -- San Pablo San Miguel
DECLARE @Sucursal3 UNIQUEIDENTIFIER = NEWID(); -- Ricardo Palma San Isidro
DECLARE @Sucursal4 UNIQUEIDENTIFIER = NEWID(); -- Suiza Lab San Borja

INSERT INTO Mae_Sucursal (IdSucursal, IdProveedor, CodigoProveedor, NumeroSucursalProveedor,
                          DescripcionSucursal, IndicadorPrincipalSucursal, CategoriaSucursal,
                          CodigoSucursalSeps, RegistroSeps, IndicadorEPS, CodigoSeps, CodigoClinicaEps,
                          IndicadorRedSelecta, IndicadorExoneracionIgv, IndicadorDetraccion, TipoInstitucion,
                          EstadoRegistro, CodigoUsuarioCreador, FechaCreacion,
                          CodigoUsuarioCreadorSistema, FechaCreacionSistema)
VALUES
    (@Sucursal1, @Proveedor1, '10001', '1',
     'CLÍNICA SAN PABLO - SEDE SURCO', 'P', 'A',
     'CSP-SURCO', 'R1001', 'S', 'SEPS1001', 'CSP-001',
     'S', 'N', 'N', 'CLINICA',
     'V', @UsuarioCreador, @FechaActual,
     @UsuarioSistema, @FechaActual),

    (@Sucursal2, @Proveedor1, '10001', '2',
     'CLÍNICA SAN PABLO - SEDE SAN MIGUEL', 'S', 'A',
     'CSP-SANMIG', 'R1002', 'S', 'SEPS1002', 'CSP-002',
     'S', 'N', 'N', 'CLINICA',
     'V', @UsuarioCreador, @FechaActual,
     @UsuarioSistema, @FechaActual),

    (@Sucursal3, @Proveedor2, '10002', '1',
     'CLÍNICA RICARDO PALMA - SEDE PRINCIPAL', 'P', 'A',
     'CRP-MAIN', 'R2001', 'S', 'SEPS2001', 'CRP-001',
     'N', 'N', 'N', 'CLINICA',
     'V', @UsuarioCreador, @FechaActual,
     @UsuarioSistema, @FechaActual),

    (@Sucursal4, @Proveedor3, '10003', '1',
     'SUIZA LAB - SEDE SAN BORJA', 'P', 'B',
     'SL-SBORJA', 'R3001', 'S', 'SEPS3001', 'SL-001',
     'S', 'N', 'N', 'LABORATORIO',
     'V', @UsuarioCreador, @FechaActual,
     @UsuarioSistema, @FechaActual);

-- Insertar roles de personas
PRINT 'Insertando roles de personas...';
INSERT INTO Tbt_PersonaRol (IdPersonaRol, IdPersona, IdTipoRol,
                            EstadoRegistro, CodigoUsuarioCreador, FechaCreacion,
                            CodigoUsuarioCreadorSistema, FechaCreacionSistema)
VALUES
    (NEWID(), @Persona1, 'ROL001',
     'V', @UsuarioCreador, @FechaActual,
     @UsuarioSistema, @FechaActual),

    (NEWID(), @Persona2, 'ROL001',
     'V', @UsuarioCreador, @FechaActual,
     @UsuarioSistema, @FechaActual),

    (NEWID(), @Persona3, 'ROL002',
     'V', @UsuarioCreador, @FechaActual,
     @UsuarioSistema, @FechaActual),

    (NEWID(), @Persona4, 'ROL002',
     'V', @UsuarioCreador, @FechaActual,
     @UsuarioSistema, @FechaActual),

    (NEWID(), @Persona5, 'ROL001',
     'V', @UsuarioCreador, @FechaActual,
     @UsuarioSistema, @FechaActual);

-- Insertar relaciones entre personas y compañías de seguros
PRINT 'Insertando relaciones entre personas y compañías de seguros...';
INSERT INTO Tbt_PersonaCompaniaSeguro (IdPersonaCompaniaSeguro, IdPersona, IdCompaniaSeguro,
                                       EstadoRegistro, CodigoUsuarioCreador, FechaCreacion,
                                       CodigoUsuarioCreadorSistema, FechaCreacionSistema)
VALUES
    (NEWID(), @Persona1, @CompaniaSeguros1,
     'V', @UsuarioCreador, @FechaActual,
     @UsuarioSistema, @FechaActual),

    (NEWID(), @Persona1, @CompaniaSeguros2,
     'V', @UsuarioCreador, @FechaActual,
     @UsuarioSistema, @FechaActual),

    (NEWID(), @Persona2, @CompaniaSeguros1,
     'V', @UsuarioCreador, @FechaActual,
     @UsuarioSistema, @FechaActual),

    (NEWID(), @Persona5, @CompaniaSeguros1,
     'V', @UsuarioCreador, @FechaActual,
     @UsuarioSistema, @FechaActual);

-- Insertar relaciones entre sucursales y compañías de seguros
PRINT 'Insertando relaciones entre sucursales y compañías de seguros...';
INSERT INTO Mae_SucursalCompaniaSeguro (IdSucursalCompaniaSeguro, IdSucursal, IdCompaniaSeguro,
                                        CodigoProveedor, NumeroSucursalProveedor,
                                        EstadoRegistro, CodigoUsuarioCreador, FechaCreacion,
                                        CodigoUsuarioCreadorSistema, FechaCreacionSistema)
VALUES
    (NEWID(), @Sucursal1, @CompaniaSeguros1,
     '10001', '1',
     'V', @UsuarioCreador, @FechaActual,
     @UsuarioSistema, @FechaActual),

    (NEWID(), @Sucursal1, @CompaniaSeguros2,
     '10001', '1',
     'V', @UsuarioCreador, @FechaActual,
     @UsuarioSistema, @FechaActual),

    (NEWID(), @Sucursal2, @CompaniaSeguros1,
     '10001', '2',
     'V', @UsuarioCreador, @FechaActual,
     @UsuarioSistema, @FechaActual),

    (NEWID(), @Sucursal3, @CompaniaSeguros1,
     '10002', '1',
     'V', @UsuarioCreador, @FechaActual,
     @UsuarioSistema, @FechaActual),

    (NEWID(), @Sucursal4, @CompaniaSeguros1,
     '10003', '1',
     'V', @UsuarioCreador, @FechaActual,
     @UsuarioSistema, @FechaActual);

PRINT 'Inserción de datos completada con éxito.';

-- Reactivar mensajes de conteo de filas
SET NOCOUNT OFF;
GO