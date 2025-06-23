const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('.')); // Servir archivos estáticos

// Crear base de datos SQLite
const db = new sqlite3.Database('pagos.db');

// Crear tabla para almacenar pagos
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS pagos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        payment_id TEXT UNIQUE,
        external_reference TEXT,
        status TEXT,
        status_detail TEXT,
        amount REAL,
        currency TEXT,
        payer_email TEXT,
        payer_name TEXT,
        payment_method TEXT,
        installments INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        datos_envio TEXT,
        productos TEXT
    )`);
});

// Función para cargar usuarios desde user.json
function loadUsers() {
    try {
        const userData = fs.readFileSync('user.json', 'utf8');
        return JSON.parse(userData);
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        return { admin: { email: 'admin@tiendakeylor.com', password: 'admin123', nombre: 'Administrador' } };
    }
}

// Configurar sesiones simples (en producción usar express-session)
const sessions = new Map();

// Ruta de login
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// API de login (DEBE ESTAR ANTES DEL MIDDLEWARE DE SESIÓN)
app.post('/api/login', (req, res) => {
    console.log('🔐 Intento de login recibido:', req.body);
    
    const { email, password } = req.body;
    const users = loadUsers();
    
    console.log('📧 Email recibido:', email);
    console.log('🔑 Contraseña recibida:', password);
    console.log('👤 Usuario configurado:', users.admin.email);
    
    // Verificar credenciales
    if (users.admin && users.admin.email === email && users.admin.password === password) {
        // Crear sesión
        const sessionId = Date.now().toString();
        sessions.set(sessionId, {
            authenticated: true,
            user: users.admin,
            createdAt: new Date()
        });
        
        // Establecer cookie
        res.cookie('sessionId', sessionId, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        });
        
        console.log('✅ Login exitoso para:', email);
        res.json({ success: true, message: 'Login exitoso' });
    } else {
        console.log('❌ Login fallido para:', email);
        res.status(401).json({ success: false, message: 'Email o contraseña incorrectos' });
    }
});

// API de logout
app.post('/api/logout', (req, res) => {
    const sessionId = req.cookies?.sessionId;
    if (sessionId) {
        sessions.delete(sessionId);
        res.clearCookie('sessionId');
    }
    res.json({ success: true, message: 'Logout exitoso' });
});

// API para agregar pago de prueba (para desarrollo)
app.post('/api/pago-prueba', (req, res) => {
    try {
        const paymentData = {
            payment_id: 'TEST-' + Date.now(),
            external_reference: 'REF-' + Date.now(),
            status: 'approved',
            status_detail: 'accredited',
            amount: Math.floor(Math.random() * 5000) + 1000,
            currency: 'ARS',
            payer_email: 'cliente@ejemplo.com',
            payer_name: 'Cliente Prueba',
            payment_method: 'credit_card',
            installments: 1,
            datos_envio: JSON.stringify({
                nombre: 'Cliente',
                apellido: 'Prueba',
                email: 'cliente@ejemplo.com'
            }),
            productos: JSON.stringify([
                { title: 'Producto de Prueba', unit_price: 1000 }
            ])
        };

        const stmt = db.prepare(`
            INSERT INTO pagos (
                payment_id, external_reference, status, status_detail, 
                amount, currency, payer_email, payer_name, 
                payment_method, installments, datos_envio, productos
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run([
            paymentData.payment_id,
            paymentData.external_reference,
            paymentData.status,
            paymentData.status_detail,
            paymentData.amount,
            paymentData.currency,
            paymentData.payer_email,
            paymentData.payer_name,
            paymentData.payment_method,
            paymentData.installments,
            paymentData.datos_envio,
            paymentData.productos
        ], function(err) {
            if (err) {
                console.error('❌ Error al guardar pago de prueba:', err);
                res.status(500).json({ error: 'Error al procesar el pago' });
            } else {
                console.log('✅ Pago de prueba guardado exitosamente');
                res.json({ 
                    success: true, 
                    message: 'Pago de prueba agregado correctamente',
                    payment_id: paymentData.payment_id
                });
            }
        });
        
        stmt.finalize();
    } catch (error) {
        console.error('❌ Error en pago de prueba:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Middleware para verificar sesión
function checkSession(req, res, next) {
    const sessionId = req.cookies?.sessionId;
    if (sessionId && sessions.has(sessionId)) {
        req.session = sessions.get(sessionId);
        next();
    } else {
        req.session = null;
        next();
    }
}

app.use(checkSession);

// Ruta principal - página de administración (protegida)
app.get('/admin', (req, res) => {
    if (req.session && req.session.authenticated) {
        res.sendFile(__dirname + '/admin.html');
    } else {
        res.redirect('/login');
    }
});

// Ruta alternativa para el panel
app.get('/admin-panel', (req, res) => {
    if (req.session && req.session.authenticated) {
        res.sendFile(__dirname + '/admin.html');
    } else {
        res.redirect('/login');
    }
});

// API para obtener todos los pagos (protegida)
app.get('/api/pagos', (req, res) => {
    if (!req.session || !req.session.authenticated) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    
    db.all(`SELECT * FROM pagos ORDER BY created_at DESC`, (err, rows) => {
        if (err) {
            console.error('Error al obtener pagos:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
        } else {
            res.json(rows);
        }
    });
});

// API para obtener un pago específico (protegida)
app.get('/api/pagos/:paymentId', (req, res) => {
    if (!req.session || !req.session.authenticated) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    
    const paymentId = req.params.paymentId;
    db.get(`SELECT * FROM pagos WHERE payment_id = ?`, [paymentId], (err, row) => {
        if (err) {
            console.error('Error al obtener pago:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
        } else if (!row) {
            res.status(404).json({ error: 'Pago no encontrado' });
        } else {
            res.json(row);
        }
    });
});

const WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET || '4738f96f7dc68a19093d350c8a16548ce5ec98b3b7e2cfd8d4703a204f0f3435';

// Webhook de MercadoPago (versión simplificada con validación de token)
app.post('/webhook', async (req, res) => {
    // MercadoPago puede enviar el token en header o query
    const signature = req.headers['x-signature'] || req.query.token;
    if (signature !== WEBHOOK_SECRET) {
        console.log('❌ Webhook rechazado: token inválido');
        return res.status(401).json({ error: 'Token inválido' });
    }
    try {
        console.log('📨 Webhook recibido:', req.body);
        
        const { type, data } = req.body;
        
        if (type === 'payment') {
            const paymentId = data.id;
            
            // Para desarrollo, creamos datos simulados
            const paymentData = {
                id: paymentId,
                status: 'approved',
                status_detail: 'accredited',
                transaction_amount: 1000,
                currency_id: 'ARS',
                payer: {
                    email: 'cliente@ejemplo.com',
                    first_name: 'Cliente',
                    last_name: 'Ejemplo'
                },
                payment_method: {
                    type: 'credit_card'
                },
                installments: 1,
                external_reference: 'REF-' + Date.now()
            };
            
            // Insertar o actualizar en la base de datos
            const stmt = db.prepare(`
                INSERT OR REPLACE INTO pagos (
                    payment_id, external_reference, status, status_detail, 
                    amount, currency, payer_email, payer_name, 
                    payment_method, installments, datos_envio, productos
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            stmt.run([
                paymentId,
                paymentData.external_reference,
                paymentData.status,
                paymentData.status_detail,
                paymentData.transaction_amount,
                paymentData.currency_id,
                paymentData.payer.email,
                `${paymentData.payer.first_name} ${paymentData.payer.last_name}`,
                paymentData.payment_method.type,
                paymentData.installments,
                JSON.stringify(paymentData.payer),
                JSON.stringify([])
            ], function(err) {
                if (err) {
                    console.error('❌ Error al guardar pago:', err);
                    res.status(500).json({ error: 'Error al procesar el pago' });
                } else {
                    console.log('✅ Pago guardado exitosamente');
                    res.json({ 
                        success: true, 
                        message: 'Pago procesado correctamente',
                        payment_id: paymentId
                    });
                }
            });
            
            stmt.finalize();
        } else {
            console.log('⚠️ Tipo de webhook no reconocido:', type);
            res.json({ success: true, message: 'Webhook recibido pero no procesado' });
        }
    } catch (error) {
        console.error('❌ Error en webhook:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para verificar estado del servidor
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
    console.log(`🔐 Login: http://localhost:${PORT}/login`);
    console.log(`📊 Panel de administración: http://localhost:${PORT}/admin`);
    console.log(`🔗 Webhook URL: http://localhost:${PORT}/webhook`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
    console.log(`🧪 Pago de prueba: POST http://localhost:${PORT}/api/pago-prueba`);
    console.log(`🔑 Credenciales: admin@tiendakeylor.com / admin123`);
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
    console.error('❌ Error no capturado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada no manejada:', reason);
}); 