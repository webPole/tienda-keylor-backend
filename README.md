# 🛍️ TiendaKeylor - Sistema de Pagos con MercadoPago

Sistema completo de tienda online con integración de MercadoPago, Formspree y webhooks para seguimiento de pagos.

## 🚀 Características

- ✅ Integración completa con MercadoPago
- ✅ Envío automático de datos a Formspree
- ✅ Sistema de webhooks para detectar pagos
- ✅ Panel de administración en tiempo real
- ✅ Base de datos SQLite para almacenar pagos
- ✅ Interfaz moderna y responsive

## 📋 Requisitos

- Node.js (versión 14 o superior)
- npm o yarn
- Cuenta de MercadoPago con webhooks configurados

## 🛠️ Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
Crear un archivo `.env` en la raíz del proyecto:
```env
PORT=3000
MERCADOPAGO_ACCESS_TOKEN=TU_ACCESS_TOKEN_AQUI
DB_PATH=pagos.db
WEBHOOK_URL=http://localhost:3000/webhook
```

3. **Iniciar el servidor:**
```bash
npm start
```

Para desarrollo con auto-reload:
```bash
npm run dev
```

## 🔧 Configuración de Webhooks en MercadoPago

1. Ve a tu [Dashboard de MercadoPago](https://www.mercadopago.com.ar/developers/panel)
2. Navega a **Configuración > Webhooks**
3. Agrega una nueva URL de webhook:
   - **URL:** `https://tienda-keylor.netlify.app/` (en producción)
   - **Eventos:** Selecciona `payment`
4. Guarda la configuración

### Para desarrollo local:
Usa [ngrok](https://ngrok.com/) para exponer tu servidor local:
```bash
ngrok http 3000
```
Luego usa la URL de ngrok en la configuración de webhooks.

## 📊 Panel de Administración

Accede al panel de administración en:
```
http://localhost:3000/admin
```

### Funcionalidades del Panel:
- 📈 Estadísticas en tiempo real
- 📋 Lista completa de pagos
- 🔍 Detalles de cada transacción
- 🔄 Actualización automática cada 30 segundos
- 📱 Diseño responsive

## 🗂️ Estructura del Proyecto

```
prueba mercadopago/
├── server.js              # Servidor principal
├── admin.html             # Panel de administración
├── index.html             # Página principal de la tienda
├── ofertas.html           # Página de ofertas
├── tienda.js              # Lógica de la tienda
├── ofertas.js             # Lógica de ofertas
├── package.json           # Dependencias del proyecto
├── pagos.db               # Base de datos SQLite (se crea automáticamente)
└── README.md              # Este archivo
```

## 🔄 Flujo de Pago

1. **Cliente selecciona productos** en la tienda
2. **Completa formulario** con datos de envío
3. **Presiona "Pagar"** → Datos se envían a Formspree
4. **Redirección a MercadoPago** para completar el pago
5. **MercadoPago envía webhook** al servidor cuando se completa
6. **Servidor guarda pago** en la base de datos
7. **Panel de admin se actualiza** automáticamente

## 📱 URLs Importantes

- **Tienda Principal:** `http://localhost:3000/`
- **Ofertas:** `http://localhost:3000/ofertas.html`
- **Panel Admin:** `http://localhost:3000/admin`
- **Webhook:** `http://localhost:3000/webhook`
- **Health Check:** `http://localhost:3000/health`

## 🛡️ Seguridad

- ✅ Validación de datos en el servidor
- ✅ Manejo seguro de errores
- ✅ Logs detallados para debugging
- ✅ Base de datos SQLite local

## 🔍 Debugging

### Verificar webhooks:
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"payment","data":{"id":"123456"}}'
```

### Verificar estado del servidor:
```bash
curl http://localhost:3000/health
```

### Ver logs del servidor:
Los logs se muestran en la consola donde ejecutas `npm start`

## 🚀 Despliegue en Producción

1. **Configurar dominio y SSL**
2. **Actualizar URL del webhook** en MercadoPago
3. **Configurar variables de entorno** de producción
4. **Usar PM2 o similar** para mantener el servidor activo

### Ejemplo con PM2:
```bash
npm install -g pm2
pm2 start server.js --name "tienda-mercadopago"
pm2 startup
pm2 save
```

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs del servidor
2. Verifica la configuración de webhooks en MercadoPago
3. Asegúrate de que todas las dependencias estén instaladas
4. Verifica que el puerto 3000 esté disponible

## 🔄 Actualizaciones

Para actualizar el sistema:
```bash
git pull
npm install
pm2 restart tienda-mercadopago
```

---

**Desarrollado con ❤️ para TiendaKeylor** 