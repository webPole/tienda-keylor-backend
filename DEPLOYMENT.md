# 🚀 Guía de Despliegue en Producción

## 📋 Pasos para Desplegar tu Tienda en Producción

### 1. 🔧 Configurar URLs de Producción

**Opción A: Usar el script automático (Recomendado)**
```bash
npm run setup
```
Sigue las instrucciones y proporciona tu dominio.

**Opción B: Configuración manual**
Edita el archivo `config.js` y cambia las URLs de producción:
```javascript
production: {
    baseUrl: 'https://tudominio.com',
    webhookUrl: 'https://tudominio.com/webhook',
    adminUrl: 'https://tudominio.com/admin',
    loginUrl: 'https://tudominio.com/login',
    apiBaseUrl: 'https://tudominio.com/api'
}
```

### 2. 🌐 Preparar tu Dominio

- ✅ **Dominio configurado** con DNS apuntando a tu servidor
- ✅ **Certificado SSL** instalado (HTTPS obligatorio)
- ✅ **Puerto 80/443** abierto en el firewall

### 3. 📦 Subir Archivos al Servidor

```bash
# Opción A: Git (recomendado)
git clone tu-repositorio
cd tu-proyecto

# Opción B: FTP/SFTP
# Sube todos los archivos a tu servidor
```

### 4. 🔧 Instalar Dependencias

```bash
npm install --production
```

### 5. ⚙️ Configurar Variables de Entorno

Crea un archivo `.env` en tu servidor:
```env
NODE_ENV=production
PORT=3000
MERCADOPAGO_ACCESS_TOKEN=TU_ACCESS_TOKEN_AQUI
```

### 6. 🔗 Configurar Webhook en MercadoPago

1. Ve a tu [Dashboard de MercadoPago](https://www.mercadopago.com.ar/developers/panel)
2. Navega a **Configuración > Webhooks**
3. Agrega la URL: `https://tudominio.com/webhook`
4. Selecciona el evento: `payment`
5. Guarda la configuración

### 7. 🚀 Iniciar el Servidor

**Opción A: Directo**
```bash
npm run prod
```

**Opción B: Con PM2 (Recomendado para producción)**
```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar la aplicación
pm2 start server.js --name "tienda-mercadopago" --env production

# Configurar para que inicie automáticamente
pm2 startup
pm2 save
```

**Opción C: Con systemd (Linux)**
```bash
# Crear servicio systemd
sudo nano /etc/systemd/system/tienda-mercadopago.service
```

Contenido del servicio:
```ini
[Unit]
Description=TiendaKeylor MercadoPago
After=network.target

[Service]
Type=simple
User=tu-usuario
WorkingDirectory=/ruta/a/tu/proyecto
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Habilitar y iniciar el servicio
sudo systemctl enable tienda-mercadopago
sudo systemctl start tienda-mercadopago
```

### 8. 🔍 Verificar el Despliegue

```bash
# Verificar que el servidor esté corriendo
curl https://tudominio.com/health

# Verificar el panel de administración
curl https://tudominio.com/login

# Verificar la API
curl https://tudominio.com/api/pagos
```

### 9. 📊 URLs Importantes

Una vez desplegado, tus URLs serán:

- **🌐 Tienda Principal**: `https://tudominio.com/`
- **🔐 Login Admin**: `https://tudominio.com/login`
- **📊 Panel Admin**: `https://tudominio.com/admin`
- **🔗 Webhook**: `https://tudominio.com/webhook`
- **💚 Health Check**: `https://tudominio.com/health`

### 10. 🔐 Credenciales de Acceso

**Email**: `admin@tiendakeylor.com`
**Contraseña**: `admin123`

⚠️ **IMPORTANTE**: Cambia estas credenciales en el archivo `user.json` antes de desplegar.

## 🔄 Comandos Útiles

### Desarrollo
```bash
npm run dev          # Desarrollo con auto-reload
```

### Producción
```bash
npm run prod         # Producción
npm run setup        # Configurar URLs
```

### PM2 (Gestión de procesos)
```bash
pm2 start server.js --name "tienda-mercadopago"
pm2 stop tienda-mercadopago
pm2 restart tienda-mercadopago
pm2 logs tienda-mercadopago
pm2 monit
```

## 🛡️ Seguridad en Producción

### 1. 🔐 Cambiar Credenciales
Edita `user.json`:
```json
{
  "admin": {
    "email": "tu-email@tudominio.com",
    "password": "tu-contraseña-segura",
    "nombre": "Tu Nombre"
  }
}
```

### 2. 🔒 Configurar Firewall
```bash
# Solo permitir puertos necesarios
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### 3. 📝 Logs y Monitoreo
```bash
# Ver logs en tiempo real
pm2 logs tienda-mercadopago --lines 100

# Monitorear recursos
pm2 monit
```

## 🚨 Solución de Problemas

### Error: "Cannot GET /admin"
- ✅ Verificar que el servidor esté corriendo
- ✅ Verificar que las rutas estén configuradas correctamente
- ✅ Verificar logs del servidor

### Error: "No autorizado"
- ✅ Verificar que hayas iniciado sesión
- ✅ Verificar que las cookies estén habilitadas
- ✅ Verificar la configuración de sesiones

### Webhook no funciona
- ✅ Verificar que la URL del webhook sea correcta
- ✅ Verificar que el servidor sea accesible desde internet
- ✅ Verificar logs del servidor para errores

### Base de datos no funciona
- ✅ Verificar permisos de escritura en el directorio
- ✅ Verificar que SQLite esté instalado
- ✅ Verificar logs de errores

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs del servidor
2. Verifica la configuración de URLs
3. Asegúrate de que todas las dependencias estén instaladas
4. Verifica que el puerto esté disponible y abierto

---

**¡Tu tienda está lista para producción! 🎉** 