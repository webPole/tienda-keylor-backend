const productos = [
    { id: 1, nombre: "Remera Manga corta azul", precio: 500, precioOriginal: 800, imagen: "img/remera1.jpg", descripcion: "de algodón 100%", descuento: 37 },
    { id: 2, nombre: "Remera manga corta azul oscuro", precio: 1500, precioOriginal: 2000, imagen: "img/remera2.webp", descripcion: "algodón 75% licra 25%", descuento: 25 },
    { id: 3, nombre: "Remera manga corta blanca", precio: 2000, precioOriginal: 2800, imagen: "img/remera3.jpg", descripcion: "algodón 100% con estampado", descuento: 29 },
    { id: 4, nombre: "Remera manga corta negra", precio: 2500, precioOriginal: 3500, imagen: "img/remera4.jpg", descripcion: "algodón 75% licra 25%", descuento: 29 },
    { id: 5, nombre: "Remera manga corta gris", precio: 3000, precioOriginal: 4000, imagen: "img/remera5.webp", descripcion: "algodón 100%", descuento: 25 }
];

let carrito = [];

// Mostrar productos en la página
function mostrarProductos() {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";
    productos.forEach(producto => {
        contenedor.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card h-100 border-0 shadow-lg" style="border-radius: 15px; overflow: hidden; transition: all 0.3s ease;">
                    <div style="position: relative; overflow: hidden;">
                        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 250px; object-fit: cover; transition: transform 0.3s ease;">
                        
                        <!-- Precio actual -->
                        <div style="position: absolute; top: 10px; right: 10px; background: linear-gradient(45deg, #00ff9d, #004e92); color: white; padding: 8px 12px; border-radius: 20px; font-size: 0.9em; font-weight: bold; box-shadow: 0 4px 12px rgba(0,255,157,0.3); z-index: 2;">
                            $${producto.precio}
                        </div>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold mb-3" style="color: #000428;">${producto.nombre}</h5>
                        <p class="card-text text-muted mb-3 flex-grow-1">${producto.descripcion}</p>
                        
                        <!-- Precio -->
                        <div class="mb-3 text-center">
                            <div class="d-flex align-items-center justify-content-center mb-1">
                                <span class="precio-actual" style="color: #00ff9d; font-weight: bold; font-size: 1.5rem;">$${producto.precio}</span>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="fw-bold mb-2 d-block" style="color: #555;">Cantidad:</label>
                            <div class="d-flex align-items-center justify-content-center cantidad-container" style="background: #f8f9fa; border-radius: 25px; padding: 5px; border: 2px solid #e9ecef;">
                                <button class="btn btn-sm cantidad-btn" onclick="cambiarCantidad(${producto.id}, -1)" style="width: 35px; height: 35px; border-radius: 50%; background: linear-gradient(45deg, #ff6b6b, #ee5a52); color: white; border: none; font-weight: bold; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                                    <i class="fas fa-minus" style="font-size: 0.8rem;"></i>
                                </button>
                                <input type="number" id="cantidad-${producto.id}" class="form-control text-center" value="1" min="1" style="width: 60px; border: none; background: transparent; font-weight: bold; color: #000428; font-size: 1.1rem;">
                                <button class="btn btn-sm cantidad-btn" onclick="cambiarCantidad(${producto.id}, 1)" style="width: 35px; height: 35px; border-radius: 50%; background: linear-gradient(45deg, #00ff9d, #004e92); color: white; border: none; font-weight: bold; display: flex; align-items: center; justify-content: center; margin-left: 10px;">
                                    <i class="fas fa-plus" style="font-size: 0.8rem;"></i>
                                </button>
                            </div>
                        </div>
                        <button class="btn w-100" onclick="agregarAlCarrito(${producto.id})" style="background: linear-gradient(45deg, #00ff9d, #004e92); color: white; border-radius: 10px; font-weight: bold; border: none;">
                            <i class="fas fa-shopping-cart me-2"></i>Agregar al Carrito
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Agregar producto al carrito con cantidad
function agregarAlCarrito(id) {
    const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value);
    const producto = productos.find(p => p.id === id);

    if (producto) {
        const existeEnCarrito = carrito.find(item => item.id === id);
        if (existeEnCarrito) {
            existeEnCarrito.cantidad += cantidad;
        } else {
            carrito.push({ ...producto, cantidad });
        }
        mostrarCarrito();
        
        // Resetear la cantidad a 1 después de agregar al carrito
        document.getElementById(`cantidad-${id}`).value = 1;
        
        Swal.fire("Agregado", `${producto.nombre} x${cantidad} agregado al carrito`, "success");
    }
}

// Función para cambiar la cantidad con los botones
function cambiarCantidad(id, cambio) {
    const input = document.getElementById(`cantidad-${id}`);
    let valor = parseInt(input.value) + cambio;
    
    // Asegurar que la cantidad no sea menor a 1
    if (valor < 1) {
        valor = 1;
    }
    
    input.value = valor;
    
    // Agregar efecto visual al botón
    const boton = event.target.closest('.cantidad-btn');
    boton.style.transform = 'scale(0.9)';
    setTimeout(() => {
        boton.style.transform = 'scale(1)';
    }, 150);
}

// Mostrar los productos en el carrito con cantidad
function mostrarCarrito() {
    const lista = document.getElementById("carrito");
    lista.innerHTML = "";
    
    let total = 0;
    let totalItems = 0;
    carrito.forEach((producto, index) => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;
        totalItems += producto.cantidad;
        lista.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center" style="border-radius: 10px; margin-bottom: 10px; border: 1px solid #e9ecef; background: white;">
                <div class="d-flex align-items-center">
                    <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
                    <div>
                        <h6 class="mb-1 fw-bold" style="color: #000428;">${producto.nombre}</h6>
                        <small class="text-muted">Cantidad: ${producto.cantidad} | $${producto.precio} c/u</small>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <span class="fw-bold me-3" style="color: #00ff9d;">$${subtotal}</span>
                    <button class="btn btn-sm" onclick="eliminarDelCarrito(${index})" style="background: linear-gradient(45deg, #ff6b6b, #ee5a52); color: white; border-radius: 8px; border: none;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
        `;
    });
    
    // Agregar el total
    lista.innerHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-center" style="border-radius: 10px; background: linear-gradient(45deg, #000428, #004e92); color: white; font-weight: bold; border: none;">
            <span>TOTAL:</span>
            <span>$${total}</span>
        </li>
    `;
    
    // Actualizar badge del carrito
    const badge = document.getElementById('carrito-badge');
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'block' : 'none';
}

// Eliminar producto del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    mostrarCarrito();
}

// Función para ocultar el carrito emergente
function ocultarCarritoEmergente() {
    document.getElementById('carritoOverlay').style.display = 'none';
    document.getElementById('carritoEmergente').style.display = 'none';
}

// Verificar que todos los scripts necesarios estén cargados
function verificarScriptsCargados() {
    const scriptsNecesarios = [
        'MercadoPago',
        'Swal',
        'fetch'
    ];
    
    const scriptsFaltantes = scriptsNecesarios.filter(script => {
        switch(script) {
            case 'MercadoPago':
                return typeof MercadoPago === 'undefined';
            case 'Swal':
                return typeof Swal === 'undefined';
            case 'fetch':
                return typeof fetch === 'undefined';
            default:
                return false;
        }
    });
    
    if (scriptsFaltantes.length > 0) {
        console.error('❌ Scripts faltantes:', scriptsFaltantes);
        return false;
    }
    
    console.log('✅ Todos los scripts necesarios están cargados');
    return true;
}

// Función para esperar a que los scripts se carguen
function esperarScripts() {
    return new Promise((resolve) => {
        const checkScripts = () => {
            if (verificarScriptsCargados()) {
                resolve(true);
            } else {
                setTimeout(checkScripts, 100);
            }
        };
        checkScripts();
    });
}

// Pagar con Mercado Pago
async function pagar() {
    try {
        console.log('🚀 Iniciando proceso de pago...');
        console.log('Carrito actual:', carrito);
        
        // Verificar que los scripts estén cargados
        await esperarScripts();
        
        if (carrito.length === 0) {
            Swal.fire("Carrito vacío", "Agrega productos antes de pagar", "warning");
            return;
        }

        // Verificar si se han completado los datos de envío
        const datosEnvio = localStorage.getItem('datosEnvio');
        console.log('📋 Datos de envío en localStorage:', datosEnvio);
        
        if (!datosEnvio) {
            Swal.fire({
                icon: 'warning',
                title: 'Datos de envío requeridos',
                text: 'Por favor, completa tus datos de envío antes de pagar',
                confirmButtonText: 'Completar datos',
                confirmButtonColor: '#00ff9d'
            });
            mostrarFormularioEnvio();
            return;
        }

        // Mostrar loading mientras se procesa
        Swal.fire({
            title: 'Procesando pago...',
            text: 'Preparando tu orden y enviando datos',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        console.log('📤 Enviando datos a Formspree antes del pago...');
        // Enviar datos del pedido a Formspree ANTES de procesar el pago
        const formspreeResult = await enviarDatosPedidoFormspree();
        console.log('📨 Resultado de Formspree:', formspreeResult);

        const items = carrito.map(producto => ({
            title: producto.nombre,
            quantity: producto.cantidad,
            unit_price: producto.precio,
            currency_id: "ARS"
        }));

        const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
        console.log('💰 Total del pedido:', total);

        // Configura el public_key de Mercado Pago
        const mp = new MercadoPago('APP_USR-2e63e1ff-d8c3-4511-a7ef-fb3d2bb1adae', {
            locale: 'es-AR'
        });

        console.log('💳 Creando preferencia de pago en MercadoPago...');
        // Crear la preferencia de pago
        const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer APP_USR-7662969524140814-022018-66e03b6ad76524a1f0b34d6121a47817-254665851"
            },
            body: JSON.stringify({
                items: items,
                back_urls: {
                    success: "https://tienda-keylor.netlify.app/success",
                    failure: "https://tienda-keylor.netlify.app/failure",
                    pending: "https://tienda-keylor.netlify.app/pending"
                },
                auto_return: "approved"
            })
        });

        const data = await response.json();
        console.log('📊 Respuesta de MercadoPago:', data);  // Verifica la respuesta de la API

        if (data.init_point) {
            console.log('✅ Redirigiendo a MercadoPago...');
            // Cerrar el loading y redirigir
            Swal.close();
            window.location.href = data.init_point;
        } else {
            console.error('❌ Error en la respuesta de MercadoPago:', data);
            Swal.fire("Error", "Hubo un problema al procesar el pago", "error");
        }
    } catch (error) {
        console.error('❌ Error en el proceso de pago:', error);
        
        // Detectar problemas de extensiones
        const problemas = detectarProblemasExtensiones();
        console.log('🔍 Problemas detectados:', problemas);
        
        // Mostrar error específico si es de conexión
        if (error.message && error.message.includes('connection')) {
            const recomendaciones = mostrarRecomendacionesSolucion(problemas);
            Swal.fire({
                title: "Error de Conexión",
                text: recomendaciones,
                icon: "error",
                confirmButtonText: "Entendido",
                width: '600px'
            });
        } else if (problemas.length > 0) {
            const recomendaciones = mostrarRecomendacionesSolucion(problemas);
            Swal.fire({
                title: "Problema Detectado",
                text: recomendaciones,
                icon: "warning",
                confirmButtonText: "Entendido",
                width: '600px'
            });
        } else {
            Swal.fire("Error", "Hubo un problema al procesar el pago. Por favor, intenta nuevamente.", "error");
        }
    }
}

// Función para enviar datos del pedido a Formspree
async function enviarDatosPedidoFormspree() {
    try {
        const datosEnvio = JSON.parse(localStorage.getItem('datosEnvio'));
        if (!datosEnvio) {
            console.error('❌ No se encontraron datos de envío en localStorage');
            return;
        }

        const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
        
        // Crear lista de productos para el email
        const productosLista = carrito.map(producto => 
            `• ${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: $${producto.precio} - Subtotal: $${producto.precio * producto.cantidad}`
        ).join('\n');

        // Crear FormData con todos los datos del pedido
        const formData = new FormData();
        formData.append('_subject', '🛒 NUEVO PEDIDO - TiendaKeylor');
        formData.append('nombre', datosEnvio.nombre || 'No especificado');
        formData.append('apellido', datosEnvio.apellido || 'No especificado');
        formData.append('email', datosEnvio.email || 'pedido@tiendakeylor.com');
        formData.append('telefono', datosEnvio.telefono || 'No especificado');
        formData.append('direccion', datosEnvio.direccion || 'No especificada');
        formData.append('total_pedido', `$${total}`);
        formData.append('cantidad_productos', carrito.reduce((acc, producto) => acc + producto.cantidad, 0).toString());
        formData.append('productos', productosLista);
        formData.append('fecha_pedido', new Date().toLocaleString('es-AR'));
        formData.append('estado', 'Pendiente de Pago');
        formData.append('metodo_pago', 'MercadoPago');
        formData.append('pagina_origen', 'Página Principal');

        console.log('📤 Enviando datos a Formspree...');
        console.log('Datos del pedido:', {
            nombre: datosEnvio.nombre,
            apellido: datosEnvio.apellido,
            email: datosEnvio.email,
            telefono: datosEnvio.telefono,
            direccion: datosEnvio.direccion,
            total: total,
            productos: carrito.length
        });

        const response = await fetch('https://formspree.io/f/xeoklbzw', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log('📨 Respuesta de Formspree:', response);
        console.log('Status:', response.status);
        console.log('OK:', response.ok);

        if (response.ok) {
            console.log('✅ Datos del pedido enviados a Formspree correctamente');
            return true;
        } else {
            console.error('❌ Error enviando datos del pedido a Formspree:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error('❌ Error en el envío de datos del pedido:', error);
        return false;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    mostrarProductos();
    
    // Verificar si ya existen datos de envío para habilitar el botón de pagar
    const datosEnvio = localStorage.getItem('datosEnvio');
    if (datosEnvio) {
        const btnPagar = document.getElementById('btnPagar');
        if (btnPagar) {
            btnPagar.disabled = false;
        }
    }

    // Mostrar botón de admin si está autenticado
    const adminAutenticado = localStorage.getItem('adminAutenticado');
    if (adminAutenticado) {
        document.getElementById('admin-link').style.display = 'block';
        document.getElementById('admin-float').style.display = 'flex';
    }
});

// Funciones para el formulario de envío
function mostrarFormularioEnvio() {
    // Verificar si ya están registrados los datos
    const datosRegistrados = localStorage.getItem('datosEnvio');
    if (datosRegistrados) {
        const datos = JSON.parse(datosRegistrados);
        Swal.fire({
            title: '✅ Datos Ya Registrados',
            html: `
                <p><strong>${datos.nombre} ${datos.apellido}</strong></p>
                <p>Email: ${datos.email || 'No registrado'}</p>
                <p>Teléfono: ${datos.telefono}</p>
                <p>Dirección: ${datos.direccion}</p>
                <hr>
                <p class="text-muted">¿Deseas actualizar tus datos de envío?</p>
            `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Actualizar Datos',
            cancelButtonText: 'Mantener Actuales',
            confirmButtonColor: '#00ff9d',
            cancelButtonColor: '#6c757d'
        }).then((result) => {
            if (result.isConfirmed) {
                // Mostrar formulario para actualizar
                document.getElementById('formularioOverlay').style.display = 'block';
                document.getElementById('formularioEnvio').style.display = 'block';
                
                // Llenar el formulario con los datos actuales
                document.querySelector('input[name="nombre"]').value = datos.nombre;
                document.querySelector('input[name="apellido"]').value = datos.apellido;
                document.querySelector('input[name="email"]').value = datos.email;
                document.querySelector('input[name="telefono"]').value = datos.telefono;
                document.querySelector('input[name="direccion"]').value = datos.direccion;
            }
        });
        return;
    }
    
    // Si no están registrados, mostrar formulario normal
    document.getElementById('formularioOverlay').style.display = 'block';
    document.getElementById('formularioEnvio').style.display = 'block';
}

function ocultarFormularioEnvio() {
    document.getElementById('formularioOverlay').style.display = 'none';
    document.getElementById('formularioEnvio').style.display = 'none';
}

// Evento para enviar el formulario de envío
document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formularioDatosEnvio');
    if (formulario) {
        formulario.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Obtener los datos del formulario
            const formData = new FormData(this);
            const datosEnvio = {
                nombre: formData.get('nombre'),
                apellido: formData.get('apellido'),
                email: formData.get('email'),
                telefono: formData.get('telefono'),
                direccion: formData.get('direccion')
            };
            
            // Guardar datos en localStorage
            localStorage.setItem('datosEnvio', JSON.stringify(datosEnvio));
            localStorage.setItem('formularioEnviado', 'true');
            
            // Agregar información adicional al formData
            formData.append('pagina', 'Página Principal');
            formData.append('fecha', new Date().toLocaleString('es-AR'));
            
            // Si hay productos en el carrito, agregar esa información
            if (carrito.length > 0) {
                const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
                const productosLista = carrito.map(producto => 
                    `• ${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: $${producto.precio} - Subtotal: $${producto.precio * producto.cantidad}`
                ).join('\n');
                
                formData.append('_subject', '📋 Datos de Envío con Carrito - TiendaKeylor');
                formData.append('total_carrito', `$${total}`);
                formData.append('cantidad_productos', carrito.reduce((acc, producto) => acc + producto.cantidad, 0).toString());
                formData.append('productos_carrito', productosLista);
                formData.append('tipo_formulario', 'Datos de Envío con Carrito');
            } else {
                formData.append('_subject', '📋 Datos de Envío - TiendaKeylor');
                formData.append('tipo_formulario', 'Datos de Envío');
            }
            
            // Enviar datos por Formspree
            fetch('https://formspree.io/f/xeoklbzw', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                console.log('Respuesta de Formspree:', response);
                console.log('Status:', response.status);
                console.log('OK:', response.ok);
                
                if (response.ok) {
                    // Limpiar formulario y cerrar
                    this.reset();
                    ocultarFormularioEnvio();
                    
                    // Mensaje personalizado según si hay carrito o no
                    let mensaje = `Gracias ${datosEnvio.nombre}, tus datos han sido registrados correctamente y enviados por email`;
                    if (carrito.length > 0) {
                        mensaje += `\n\nTu carrito con ${carrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos está listo para pagar.`;
                    }
                    
                    Swal.fire({
                        title: '¡Datos Confirmados!',
                        text: mensaje,
                        icon: 'success',
                        confirmButtonText: 'Perfecto',
                        confirmButtonColor: '#00ff9d',
                        customClass: {
                            popup: 'swal-high-z-index'
                        }
                    }).then(() => {
                        // Habilitar botón de pago
                        document.getElementById('btnPagar').disabled = false;
                    });
                } else {
                    console.error('Error en respuesta de Formspree:', response.status, response.statusText);
                    // Si falla el envío por email, solo guardar localmente
                    this.reset();
                    ocultarFormularioEnvio();
                    
                    Swal.fire({
                        title: '¡Datos Confirmados!',
                        text: `Gracias ${datosEnvio.nombre}, tus datos han sido guardados localmente. Puedes proceder con el pago.`,
                        icon: 'success',
                        confirmButtonText: 'Perfecto',
                        confirmButtonColor: '#00ff9d',
                        customClass: {
                            popup: 'swal-high-z-index'
                        }
                    }).then(() => {
                        // Habilitar botón de pago
                        document.getElementById('btnPagar').disabled = false;
                    });
                }
            })
            .catch(error => {
                console.error('Error enviando email:', error);
                // Si hay error, solo guardar localmente
                this.reset();
                ocultarFormularioEnvio();
                
                Swal.fire({
                    title: '¡Datos Confirmados!',
                    text: `Gracias ${datosEnvio.nombre}, tus datos han sido guardados localmente. Puedes proceder con el pago.`,
                    icon: 'success',
                    confirmButtonText: 'Perfecto',
                    confirmButtonColor: '#00ff9d',
                    customClass: {
                        popup: 'swal-high-z-index'
                    }
                }).then(() => {
                    // Habilitar botón de pago
                    document.getElementById('btnPagar').disabled = false;
                });
            });
        });
    }
    
    // Evento para ocultar el formulario al hacer clic fuera de él
    const overlay = document.getElementById('formularioOverlay');
    if (overlay) {
        overlay.addEventListener('click', ocultarFormularioEnvio);
    }
});

// ===== PANEL DE ADMINISTRACIÓN =====

// Variable para controlar el modo de edición
let editandoProducto = false;

// Función para mostrar el panel de administración
function mostrarPanelProductos() {
    // Verificar si el usuario está autenticado
    const adminAutenticado = localStorage.getItem('adminAutenticado');
    
    if (!adminAutenticado) {
        // Mostrar modal de autenticación
        Swal.fire({
            title: '🔐 Acceso Administrador',
            html: `
                <div class="mb-3">
                    <label class="form-label">Contraseña de Administrador:</label>
                    <input type="password" id="admin-password" class="form-control" placeholder="Ingresa la contraseña">
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Acceder',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#00ff9d',
            cancelButtonColor: '#6c757d',
            preConfirm: () => {
                const password = document.getElementById('admin-password').value;
                if (password === 'admin12032015') { // Contraseña simple para demo
                    localStorage.setItem('adminAutenticado', 'true');
                    return true;
                } else {
                    Swal.showValidationMessage('Contraseña incorrecta');
                    return false;
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                mostrarPanelProductosInterno();
            }
        });
    } else {
        mostrarPanelProductosInterno();
    }
}

// Función interna para mostrar el panel
function mostrarPanelProductosInterno() {
    // Ocultar todas las secciones
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar el panel de administración
    document.getElementById('panel-admin').style.display = 'block';
    
    // Mostrar el botón de volver
    document.getElementById('admin-link').innerHTML = '<span><i class="fas fa-arrow-left me-1"></i>Volver</span>';
    document.getElementById('admin-link').onclick = volverATienda;
    
    // Mostrar el botón flotante
    document.getElementById('admin-float').style.display = 'flex';
    
    // Cargar la lista de productos
    cargarListaProductos();
    
    // Limpiar el formulario
    limpiarFormulario();
}

// Función para volver a la tienda
function volverATienda() {
    // Ocultar el panel de administración
    document.getElementById('panel-admin').style.display = 'none';
    
    // Mostrar todas las secciones
    document.querySelectorAll('section').forEach(section => {
        if (section.id !== 'panel-admin') {
            section.style.display = 'block';
        }
    });
    
    // Restaurar el botón de admin
    document.getElementById('admin-link').innerHTML = '<span><i class="fas fa-cog me-1"></i>Admin</span>';
    document.getElementById('admin-link').onclick = mostrarPanelProductos;
    
    // Recargar productos en la tienda
    mostrarProductos();
}

// Función para cargar la lista de productos en la tabla
function cargarListaProductos() {
    const tbody = document.getElementById('productos-lista');
    tbody.innerHTML = '';
    
    productos.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="padding: 15px;">
                <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
            </td>
            <td style="padding: 15px; vertical-align: middle;">
                <strong>${producto.nombre}</strong><br>
                <small class="text-muted">${producto.descripcion}</small>
            </td>
            <td style="padding: 15px; vertical-align: middle;">
                <span class="text-success fw-bold">$${producto.precio}</span><br>
                <small class="text-muted text-decoration-line-through">$${producto.precioOriginal}</small>
            </td>
            <td style="padding: 15px; vertical-align: middle;">
                <span class="badge bg-danger">${producto.descuento}%</span>
            </td>
            <td style="padding: 15px; vertical-align: middle;">
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-primary" onclick="editarProducto(${producto.id})" style="border-radius: 5px;">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${producto.id})" style="border-radius: 5px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Función para limpiar el formulario
function limpiarFormulario() {
    document.getElementById('producto-form').reset();
    document.getElementById('producto-id').value = '';
    document.getElementById('form-title').textContent = 'Agregar Nuevo Producto';
    document.getElementById('submit-text').textContent = 'Guardar Producto';
    editandoProducto = false;
}

// Función para editar un producto
function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        // Llenar el formulario con los datos del producto
        document.getElementById('producto-id').value = producto.id;
        document.getElementById('producto-nombre').value = producto.nombre;
        document.getElementById('producto-precio').value = producto.precio;
        document.getElementById('producto-precio-original').value = producto.precioOriginal;
        document.getElementById('producto-descuento').value = producto.descuento;
        document.getElementById('producto-descripcion').value = producto.descripcion;
        document.getElementById('producto-imagen').value = producto.imagen;
        
        // Cambiar el título del formulario
        document.getElementById('form-title').textContent = 'Editar Producto';
        document.getElementById('submit-text').textContent = 'Actualizar Producto';
        
        editandoProducto = true;
        
        // Hacer scroll al formulario
        document.getElementById('producto-form').scrollIntoView({ behavior: 'smooth' });
    }
}

// Función para eliminar un producto
function eliminarProducto(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const index = productos.findIndex(p => p.id === id);
            if (index !== -1) {
                productos.splice(index, 1);
                cargarListaProductos();
                Swal.fire(
                    '¡Eliminado!',
                    'El producto ha sido eliminado.',
                    'success'
                );
            }
        }
    });
}

// Función para generar un nuevo ID
function generarNuevoId() {
    return Math.max(...productos.map(p => p.id), 0) + 1;
}

// Event listener para el formulario de productos
document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('producto-form');
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                id: document.getElementById('producto-id').value || generarNuevoId(),
                nombre: document.getElementById('producto-nombre').value,
                precio: parseFloat(document.getElementById('producto-precio').value),
                precioOriginal: parseFloat(document.getElementById('producto-precio-original').value),
                descuento: parseInt(document.getElementById('producto-descuento').value),
                descripcion: document.getElementById('producto-descripcion').value,
                imagen: document.getElementById('producto-imagen').value
            };
            
            if (editandoProducto) {
                // Actualizar producto existente
                const index = productos.findIndex(p => p.id == formData.id);
                if (index !== -1) {
                    productos[index] = formData;
                    Swal.fire('¡Actualizado!', 'El producto ha sido actualizado correctamente.', 'success');
                }
            } else {
                // Agregar nuevo producto
                productos.push(formData);
                Swal.fire('¡Agregado!', 'El producto ha sido agregado correctamente.', 'success');
            }
            
            // Limpiar formulario y recargar lista
            limpiarFormulario();
            cargarListaProductos();
        });
        
        // Agregar event listeners para calcular descuento automáticamente
        const precioInput = document.getElementById('producto-precio');
        const precioOriginalInput = document.getElementById('producto-precio-original');
        const descuentoInput = document.getElementById('producto-descuento');
        
        if (precioInput && precioOriginalInput && descuentoInput) {
            // Calcular descuento cuando cambien los precios
            precioInput.addEventListener('input', calcularDescuento);
            precioOriginalInput.addEventListener('input', calcularDescuento);
            
            // Calcular precio cuando cambie el descuento
            descuentoInput.addEventListener('input', calcularPrecio);
        }
    }
    
    // Los botones de admin siempre están visibles ahora
});

// Función para calcular el descuento automáticamente
function calcularDescuento() {
    const precioOriginal = parseFloat(document.getElementById('producto-precio-original').value) || 0;
    const precio = parseFloat(document.getElementById('producto-precio').value) || 0;
    
    if (precioOriginal > 0 && precio > 0) {
        const descuento = Math.round(((precioOriginal - precio) / precioOriginal) * 100);
        document.getElementById('producto-descuento').value = descuento;
    }
}

// Función para calcular el precio basado en el descuento
function calcularPrecio() {
    const precioOriginal = parseFloat(document.getElementById('producto-precio-original').value) || 0;
    const descuento = parseFloat(document.getElementById('producto-descuento').value) || 0;
    
    if (precioOriginal > 0 && descuento >= 0 && descuento <= 100) {
        const precio = precioOriginal * (1 - descuento / 100);
        document.getElementById('producto-precio').value = Math.round(precio);
    }
}

// Función para cerrar sesión de admin
function cerrarSesionAdmin() {
    localStorage.removeItem('adminAutenticado');
    volverATienda();
}

// Función para detectar problemas de extensiones
function detectarProblemasExtensiones() {
    const problemas = [];
    
    // Verificar si hay extensiones que puedan estar interfiriendo
    if (typeof chrome !== 'undefined' && chrome.runtime) {
        console.log('⚠️ Extensiones de Chrome detectadas');
        problemas.push('Extensiones de Chrome activas');
    }
    
    if (typeof browser !== 'undefined' && browser.runtime) {
        console.log('⚠️ Extensiones de Firefox detectadas');
        problemas.push('Extensiones de Firefox activas');
    }
    
    // Verificar si hay scripts de terceros que puedan estar causando problemas
    const scriptsExternos = Array.from(document.scripts).filter(script => 
        script.src && (
            script.src.includes('google') ||
            script.src.includes('facebook') ||
            script.src.includes('analytics') ||
            script.src.includes('tracking')
        )
    );
    
    if (scriptsExternos.length > 0) {
        console.log('⚠️ Scripts de terceros detectados:', scriptsExternos.map(s => s.src));
        problemas.push('Scripts de terceros activos');
    }
    
    return problemas;
}

// Función para mostrar recomendaciones de solución
function mostrarRecomendacionesSolucion(problemas) {
    let mensaje = 'Para solucionar el problema:\n\n';
    
    if (problemas.includes('Extensiones de Chrome activas') || problemas.includes('Extensiones de Firefox activas')) {
        mensaje += '• Desactiva temporalmente las extensiones del navegador\n';
        mensaje += '• Intenta en una ventana de incógnito\n';
    }
    
    if (problemas.includes('Scripts de terceros activos')) {
        mensaje += '• Desactiva bloqueadores de anuncios\n';
        mensaje += '• Verifica que no haya bloqueadores de scripts\n';
    }
    
    mensaje += '\n• Verifica tu conexión a internet\n';
    mensaje += '• Intenta recargar la página\n';
    mensaje += '• Si el problema persiste, contacta soporte';
    
    return mensaje;
}
