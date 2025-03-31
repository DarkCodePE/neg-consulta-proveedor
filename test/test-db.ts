#!/usr/bin/env ts-node

import 'dotenv/config';
import { ClientSecretCredential } from '@azure/identity';
import { Connection, Request } from 'tedious';
import * as tedious from 'tedious';
// --- CORRECCIÓN AQUÍ ---
// El tipo correcto para la configuración de la conexión principal es ConnectionConfiguration
type ConnectionConfig = tedious.ConnectionConfiguration;
// ConnectionOptions es el tipo para el objeto *dentro* de la propiedad 'options'

// Cargar variables de entorno (las mismas que usas para KeyVault)
const {
    AZURE_TENANT_ID,
    AZURE_CLIENT_ID,
    AZURE_CLIENT_SECRET,
} = process.env;

// Datos de la base de datos
const DB_HOST = 'db-srv-eu1-datos-desa-01.database.windows.net';
const DB_NAME = 'db-sql-eu1-datos-desa01'; // Reemplaza con el nombre correcto o añádelo al .env

async function main() {
    console.log('\n🔐 Conectando a Azure SQL Database con Service Principal...');
    console.log('--------------------------------------------------------------------');

    // Validar variables de entorno
    if (!AZURE_TENANT_ID || !AZURE_CLIENT_ID || !AZURE_CLIENT_SECRET) {
        console.error('❌ Faltan variables de entorno del Service Principal.');
        console.log('Asegúrate de que las siguientes variables estén definidas en tu archivo .env:');
        console.log('  - AZURE_TENANT_ID');
        console.log('  - AZURE_CLIENT_ID');
        console.log('  - AZURE_CLIENT_SECRET');
        return;
    }

    // Mostrar configuración (sin exponer secretos)
    console.log(`🔗 Servidor de base de datos: ${DB_HOST}`);
    console.log(`📂 Nombre de la base de datos: ${DB_NAME}`);
    console.log(`👤 Tenant ID: ${AZURE_TENANT_ID}`);
    console.log(`🪪 Client ID: ${AZURE_CLIENT_ID}`);
    console.log(`🔑 Client Secret: ${AZURE_CLIENT_SECRET ? '[PROVIDED]' : '[MISSING]'}`);

    try {
        // Crear las credenciales del Service Principal
        console.log('\n🔑 Creando credenciales del Service Principal...');
        const credential = new ClientSecretCredential(
            AZURE_TENANT_ID,
            AZURE_CLIENT_ID,
            AZURE_CLIENT_SECRET
        );

        // Obtener token para la base de datos
        console.log('🔑 Obteniendo token para Azure SQL Database...');
        const token = await credential.getToken('https://database.windows.net/.default'); // Usar .default scope es más común
        console.log('✅ Token obtenido correctamente');

        // Configurar conexión a la base de datos usando el token
        console.log('\n📡 Configurando conexión a la base de datos...');
        // Ahora 'config' se ajusta correctamente al tipo ConnectionConfiguration
        const config: ConnectionConfig = {
            server: DB_HOST, // Esta propiedad ahora es válida según ConnectionConfiguration
            authentication: {
                type: 'azure-active-directory-access-token',
                options: {
                    token: token.token
                }
            },
            options: { // Esto se ajusta a tedious.ConnectionOptions
                database: DB_NAME,
                encrypt: true,
                trustServerCertificate: false, // Mantener en false por seguridad en producción
                connectTimeout: 30000,
                rowCollectionOnRequestCompletion: true // Útil para obtener todas las filas en el callback
            }
        };

        // Crear conexión
        console.log('📡 Creando instancia de conexión...');
        // Ahora 'config' es del tipo correcto esperado por el constructor
        const connection = new Connection(config);

        // Configurar eventos de conexión
        connection.on('connect', (err) => {
            if (err) {
                console.error('❌ Conexión a la base de datos fallida:', err.message);
                return;
            }

            console.log('✅ Conectado a la base de datos correctamente!');

            // Ejecutar una consulta simple para probar la funcionalidad
            console.log('\n🔍 Ejecutando consulta de prueba (SELECT @@VERSION)...');
            const requestVersion = new Request('SELECT @@VERSION', (err, rowCount) => {
                if (err) {
                    console.error('❌ Error al ejecutar la consulta SELECT @@VERSION:', err.message);
                    connection.close(); // Cerrar conexión en caso de error
                    return;
                }
                console.log(`✅ Consulta SELECT @@VERSION ejecutada. Filas: ${rowCount}.`);

                // Si la primera consulta fue exitosa, intentar listar tablas
                console.log('\n📋 Consultando tablas en la base de datos...');
                const requestTables = new Request(`
          SELECT TABLE_SCHEMA, TABLE_NAME
          FROM INFORMATION_SCHEMA.TABLES
          WHERE TABLE_TYPE = 'BASE TABLE'
          ORDER BY TABLE_SCHEMA, TABLE_NAME
        `, (tablesErr, tablesRowCount) => {
                    if (tablesErr) {
                        // Es posible que el SP no tenga permisos para ver INFORMATION_SCHEMA
                        console.warn(`⚠️ No se pudieron listar las tablas: ${tablesErr.message}. Verifica los permisos del Service Principal en la BD.`);
                    } else {
                        console.log(`✅ Consulta de tablas ejecutada. Se encontraron ${tablesRowCount} tablas.`);
                    }

                    console.log('\n--------------------------------------------------------------------');
                    console.log('🏁 Prueba de conexión completada.');
                    connection.close(); // Asegúrate de cerrar la conexión al final
                });

                requestTables.on('row', (columns) => {
                    // Imprime esquema y nombre de tabla
                    console.log(`  - ${columns[0].value}.${columns[1].value}`);
                });

                // Ejecutar la consulta de tablas *después* de configurar el evento 'row'
                connection.execSql(requestTables);

            }); // Fin callback requestVersion

            requestVersion.on('row', (columns) => {
                console.log('\nVersión de SQL Server detectada:');
                console.log(`   ${columns[0].value}`);
            });

            // Ejecutar la consulta de versión *después* de configurar el evento 'row'
            connection.execSql(requestVersion);

        }); // Fin connection.on('connect')

        connection.on('error', (err) => {
            // Captura errores generales que puedan ocurrir en la conexión después de establecida
            console.error('❌ Error general de conexión:', err.message);
        });

        // Iniciar conexión
        console.log('🔌 Intentando conectar...');
        connection.connect();

    } catch (error) {
        // Captura errores durante la obtención del token o configuración inicial
        console.error('❌ Error general en el proceso:', error.message);

        if (error.name === 'CredentialUnavailableError') {
            console.error('   Causa probable: Variables de entorno (AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET) no encontradas o inválidas.');
        } else if (error.name === 'AuthenticationError') {
            console.error('   Causa probable: Problema de autenticación con Azure AD. Verifica las credenciales del SP y sus permisos.');
            if (error.statusCode) console.error(`   Status Code: ${error.statusCode}`);
        } else if (error.code) { // Errores de red u otros
            console.error(`   Código de error: ${error.code}`);
        }
        // console.error(error); // Descomentar para ver el objeto de error completo

        console.log('\nPosibles soluciones generales:');
        console.log('1. Verifica que las credenciales del Service Principal (variables .env) sean correctas.');
        console.log('2. Asegúrate de que el Service Principal tenga permisos en Azure AD para autenticarse.');
        console.log('3. Confirma que el Service Principal esté añadido como usuario en la base de datos SQL específica (`' + DB_NAME + '`) y tenga permisos (ej. db_datareader).');
        console.log('4. Verifica la conectividad de red y que el firewall de Azure SQL permita conexiones desde tu IP o red.');
    }
}

// Ejecutar el script
main().catch((error) => {
    // Captura errores no manejados dentro de main() - menos probable con el try/catch interno
    console.error('💥 Error no controlado en la ejecución principal:', error.message);
    // console.error(error); // Descomentar para stack trace completo
});