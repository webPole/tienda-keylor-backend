// Configuración del entorno
const config = {
    // Configuración de desarrollo (localhost)
    development: {
        baseUrl: 'http://localhost:3000',
        webhookUrl: 'http://localhost:3000/webhook',
        adminUrl: 'http://localhost:3000/admin',
        loginUrl: 'http://localhost:3000/login',
        apiBaseUrl: 'http://localhost:3000/api'
    },
    
    // Configuración de producción (tu backend en Render/Railway)
    production: {
        baseUrl: 'https://tienda-keylor-backend.onrender.com', // CAMBIA ESTO POR TU URL REAL
        webhookUrl: 'https://tienda-keylor-backend.onrender.com/webhook',
        adminUrl: 'https://tienda-keylor-backend.onrender.com/admin',
        loginUrl: 'https://tienda-keylor-backend.onrender.com/login',
        apiBaseUrl: 'https://tienda-keylor-backend.onrender.com/api'
    }
};

// Detectar entorno automáticamente
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const currentConfig = isDevelopment ? config.development : config.production;

// Función para obtener la configuración actual
function getConfig() {
    return currentConfig;
}

// Función para obtener URL específica
function getApiUrl(endpoint) {
    return `${currentConfig.apiBaseUrl}${endpoint}`;
}

// Función para obtener URL del backend
function getBackendUrl(path = '') {
    return `${currentConfig.baseUrl}${path}`;
}

// Exportar para uso en otros archivos
window.BackendConfig = {
    config,
    getConfig,
    getApiUrl,
    getBackendUrl,
    isDevelopment
}; 