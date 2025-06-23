#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🚀 Configurador de URLs para Producción');
console.log('=====================================\n');

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function setupProduction() {
    try {
        console.log('📝 Por favor, proporciona la información de tu dominio:');
        
        const domain = await question('🌐 Tu dominio (ej: midominio.com): ');
        
        if (!domain) {
            console.log('❌ Error: Debes proporcionar un dominio válido');
            rl.close();
            return;
        }
        
        // Leer el archivo de configuración actual
        const configPath = path.join(__dirname, 'config.js');
        let configContent = fs.readFileSync(configPath, 'utf8');
        
        // Actualizar las URLs de producción
        const newProductionConfig = {
            baseUrl: `https://${domain}`,
            webhookUrl: `https://${domain}/webhook`,
            adminUrl: `https://${domain}/admin`,
            loginUrl: `https://${domain}/login`,
            apiBaseUrl: `https://${domain}/api`
        };
        
        // Reemplazar la configuración de producción
        const productionRegex = /production:\s*{[^}]+}/s;
        const newProductionString = `production: {
        baseUrl: '${newProductionConfig.baseUrl}',
        webhookUrl: '${newProductionConfig.webhookUrl}',
        adminUrl: '${newProductionConfig.adminUrl}',
        loginUrl: '${newProductionConfig.loginUrl}',
        apiBaseUrl: '${newProductionConfig.apiBaseUrl}'
    }`;
        
        configContent = configContent.replace(productionRegex, newProductionString);
        
        // Guardar el archivo actualizado
        fs.writeFileSync(configPath, configContent);
        
        console.log('\n✅ Configuración actualizada exitosamente!');
        console.log('\n📋 URLs configuradas:');
        console.log(`   🌐 Base URL: ${newProductionConfig.baseUrl}`);
        console.log(`   🔗 Webhook: ${newProductionConfig.webhookUrl}`);
        console.log(`   📊 Admin Panel: ${newProductionConfig.adminUrl}`);
        console.log(`   🔐 Login: ${newProductionConfig.loginUrl}`);
        console.log(`   📡 API: ${newProductionConfig.apiBaseUrl}`);
        
        console.log('\n📝 Pasos para activar en producción:');
        console.log('1. Sube todos los archivos a tu servidor');
        console.log('2. Configura las variables de entorno:');
        console.log('   NODE_ENV=production');
        console.log('3. Configura el webhook en MercadoPago con la URL:');
        console.log(`   ${newProductionConfig.webhookUrl}`);
        console.log('4. Inicia el servidor: npm start');
        
        console.log('\n🔧 Para cambiar entre desarrollo y producción:');
        console.log('   Desarrollo: NODE_ENV=development npm start');
        console.log('   Producción: NODE_ENV=production npm start');
        
    } catch (error) {
        console.error('❌ Error al configurar:', error.message);
    } finally {
        rl.close();
    }
}

setupProduction(); 