# 🚀 Guía de Despliegue del Backend en Render

## 📋 Pasos para Desplegar tu Backend

### 1. **Preparar el Código**

Tu código ya está listo. Solo necesitas:

1. **Crear un repositorio en GitHub**
2. **Subir tu código** (sin la carpeta `node_modules`)
3. **Configurar Render**

### 2. **Crear Cuenta en GitHub**

1. Ve a [GitHub.com](https://github.com)
2. Crea una cuenta si no tienes
3. Crea un nuevo repositorio llamado `tienda-keylor-backend`

### 3. **Subir Código a GitHub**

```bash
# En tu terminal, desde la carpeta del proyecto
git init
git add .
git commit -m "Primer commit - Backend TiendaKeylor"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/tienda-keylor-backend.git
git push -u origin main
```

### 4. **Desplegar en Render**

1. Ve a [Render.com](https://render.com)
2. Crea una cuenta gratuita
3. Click en "New +" → "Web Service"
4. Conecta con tu repositorio de GitHub
5. Configura:
   - **Name**: `tienda-keylor-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### 5. **Configurar Variables de Entorno**

En Render, ve a tu servicio → Environment → Add Environment Variable:

```
NODE_ENV=production
MP_WEBHOOK_SECRET=4738f96f7dc68a19093d350c8a16548ce5ec98b3b7e2cfd8d4703a204f0f3435
```

### 6. **Obtener URL del Backend**

Una vez desplegado, Render te dará una URL como:
```
https://tienda-keylor-backend.onrender.com
```

### 7. **Actualizar Configuración**

En tu archivo `config.js`, cambia la URL de producción:

```javascript
production: {
    baseUrl: 'https://tienda-keylor-backend.onrender.com', // TU URL REAL
    webhookUrl: 'https://tienda-keylor-backend.onrender.com/webhook',
    adminUrl: 'https://tienda-keylor-backend.onrender.com/admin',
    loginUrl: 'https://tienda-keylor-backend.onrender.com/login',
    apiBaseUrl: 'https://tienda-keylor-backend.onrender.com/api'
}
```

### 8. **Configurar Webhook en MercadoPago**

En tu dashboard de MercadoPago:
- **URL del Webhook**: `https://tienda-keylor-backend.onrender.com/webhook?token=4738f96f7dc68a19093d350c8a16548ce5ec98b3b7e2cfd8d4703a204f0f3435`
- **Eventos**: `payment`

## 🎯 **Resultado Final**

- **Frontend (Netlify)**: https://tienda-keylor.netlify.app/
- **Backend (Render)**: https://tienda-keylor-backend.onrender.com
- **Panel Admin**: https://tienda-keylor-backend.onrender.com/login
- **Webhook**: https://tienda-keylor-backend.onrender.com/webhook

## 🔧 **Comandos Útiles**

```bash
# Ver logs del backend
# En Render Dashboard → Logs

# Reiniciar servicio
# En Render Dashboard → Manual Deploy
```

## 🛡️ **Seguridad**

- ✅ Token de webhook configurado
- ✅ Variables de entorno seguras
- ✅ HTTPS automático en Render
- ✅ Base de datos SQLite local

## 📞 **Soporte**

Si tienes problemas:
1. Revisa los logs en Render
2. Verifica que las variables de entorno estén configuradas
3. Asegúrate de que el repositorio esté sincronizado

---

**¡Tu backend estará funcionando en minutos! 🚀** 