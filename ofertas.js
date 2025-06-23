// Variables globales
let carrito = [];
let productosOferta = [];
let configuracionOfertas = {
    fechaFin: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 días por defecto
    activa: true,
    duracionOferta: 2, // días de oferta
    duracionPausa: 2   // días de pausa
};
let adminAutenticado = false;
let intervaloContador, intervaloVisualizacion;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    cargarProductosOferta();
    cargarConfiguracion();
    iniciarContador();
    actualizarCarrito();
    
    // Verificar estado de ofertas inmediatamente
    setTimeout(() => {
        const ahora = new Date().getTime();
        const fechaFin = new Date(configuracionOfertas.fechaFin).getTime();
        const ofertasActivas = configuracionOfertas.activa && fechaFin > ahora;
        
        if (!ofertasActivas) {
            console.log('Ofertas inactivas detectadas al cargar la página');
            actualizarHeaderOfertas();
            mostrarProductosOferta();
        }
    }, 100);
    
    // Cargar carrito desde localStorage
    const carritoGuardado = localStorage.getItem('carritoOfertas');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
    
    // Verificar si ya están registrados los datos de envío
    if (localStorage.getItem('formularioEnviado')) {
        document.getElementById('btnPagarCarrito').disabled = false;
    }
    
    // Manejar retorno de Mercado Pago
    manejarRetornoMercadoPago();
    
    // Actualizar visualización automáticamente cada minuto
    setInterval(actualizarVisualizacionAutomatica, 60000);
});

// Productos en oferta
function cargarProductosOferta() {
    productosOferta = [
        {
            id: 1,
            nombre: "Remera Deportiva Premium",
            precio: 2500,
            precioOferta: 1800,
            imagen: "img/remera1.jpg",
            descripcion: "Remera deportiva de alta calidad con tecnología de secado rápido"
        },
        {
            id: 2,
            nombre: "Remera Casual Estilo Urbano",
            precio: 2200,
            precioOferta: 1500,
            imagen: "img/remera2.jpg",
            descripcion: "Remera casual perfecta para el día a día"
        },
        {
            id: 3,
            nombre: "Remera Fitness Pro",
            precio: 2800,
            precioOferta: 2000,
            imagen: "img/remera3.jpg",
            descripcion: "Remera especializada para entrenamientos intensos"
        },
        {
            id: 4,
            nombre: "Remera Running Elite",
            precio: 3200,
            precioOferta: 2400,
            imagen: "img/remera4.jpg",
            descripcion: "Remera diseñada para corredores profesionales"
        },
        {
            id: 5,
            nombre: "Remera Street Style",
            precio: 1900,
            precioOferta: 1200,
            imagen: "img/remera5.webp",
            descripcion: "Remera con estilo urbano y moderno"
        },
        {
            id: 6,
            nombre: "Remera Training Plus",
            precio: 2600,
            precioOferta: 1900,
            imagen: "img/remera6.jpg",
            descripcion: "Remera para entrenamientos de alta intensidad"
        }
    ];
    
    mostrarProductosOferta();
}

// Mostrar productos en oferta
function mostrarProductosOferta() {
    const contenedor = document.getElementById('productosOferta');
    contenedor.innerHTML = '';
    
    // Verificar si las ofertas están activas y dentro del tiempo
    const ahora = new Date().getTime();
    const fechaFin = new Date(configuracionOfertas.fechaFin).getTime();
    const ofertasActivas = configuracionOfertas.activa && fechaFin > ahora;
    
    productosOferta.forEach(producto => {
        const descuento = Math.round(((producto.precio - producto.precioOferta) / producto.precio) * 100);
        const ahorro = producto.precio - producto.precioOferta;
        
        // Determinar el precio a mostrar
        const precioAMostrar = ofertasActivas ? producto.precioOferta : producto.precio;
        const mostrarDescuento = ofertasActivas;
        
        const productoHTML = `
            <div class="col-lg-4 col-md-6 mb-4 fade-in">
                <div class="card oferta-card h-100">
                    ${mostrarDescuento ? `<div class="oferta-badge">-${descuento}%</div>` : ''}
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 250px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold">${producto.nombre}</h5>
                        <p class="card-text text-muted">${producto.descripcion}</p>
                        
                        <div class="mb-3">
                            ${mostrarDescuento ? `
                                <span class="precio-original">$${producto.precio.toLocaleString()}</span>
                                <span class="precio-oferta ms-2">$${precioAMostrar.toLocaleString()}</span>
                                <span class="ahorro-badge ms-2">Ahorras $${ahorro.toLocaleString()}</span>
                            ` : `
                                <span class="precio-oferta" style="color: #000428; font-size: 1.5rem;">$${precioAMostrar.toLocaleString()}</span>
                                ${!configuracionOfertas.activa ? `<div class="text-muted mt-1"><small>Precio normal - Ofertas en pausa</small></div>` : ''}
                            `}
                        </div>
                        
                        <div class="cantidad-container d-flex align-items-center justify-content-center mb-3">
                            <button class="btn cantidad-btn btn-menos" onclick="cambiarCantidad(${producto.id}, -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="form-control text-center mx-2" id="cantidad-${producto.id}" value="1" min="1" max="10" style="width: 60px; border: none; background: transparent;">
                            <button class="btn cantidad-btn btn-mas" onclick="cambiarCantidad(${producto.id}, 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        
                        <button class="btn btn-agregar-oferta mt-auto" onclick="agregarAlCarrito(${producto.id})" style="${!ofertasActivas ? 'background: linear-gradient(45deg, #6c757d, #495057);' : ''}">
                            <i class="fas fa-cart-plus me-2"></i>${ofertasActivas ? 'Agregar al Carrito' : 'Agregar al Carrito (Precio Normal)'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        contenedor.innerHTML += productoHTML;
    });
    
    // Activar animaciones
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    }, 100);
}

// Cambiar cantidad de productos
function cambiarCantidad(productoId, cambio) {
    const input = document.getElementById(`cantidad-${productoId}`);
    let cantidad = parseInt(input.value) + cambio;
    
    if (cantidad < 1) cantidad = 1;
    if (cantidad > 10) cantidad = 10;
    
    input.value = cantidad;
}

// Agregar al carrito
function agregarAlCarrito(productoId) {
    const producto = productosOferta.find(p => p.id === productoId);
    const cantidad = parseInt(document.getElementById(`cantidad-${productoId}`).value);
    
    if (!producto) return;
    
    // Verificar si las ofertas están activas
    const ahora = new Date().getTime();
    const fechaFin = new Date(configuracionOfertas.fechaFin).getTime();
    const ofertasActivas = configuracionOfertas.activa && fechaFin > ahora;
    
    // Usar el precio correcto según el estado de las ofertas
    const precioFinal = ofertasActivas ? producto.precioOferta : producto.precio;
    
    const itemExistente = carrito.find(item => item.id === productoId);
    
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
        itemExistente.precioOferta = precioFinal; // Actualizar precio si cambió
    } else {
        carrito.push({
            ...producto,
            cantidad: cantidad,
            precioOferta: precioFinal // Usar precio actualizado
        });
    }
    
    // Resetear cantidad
    document.getElementById(`cantidad-${productoId}`).value = 1;
    
    // Guardar en localStorage
    localStorage.setItem('carritoOfertas', JSON.stringify(carrito));
    
    // Actualizar carrito
    actualizarCarrito();
    
    // Mostrar notificación
    const mensajeOferta = ofertasActivas ? 'se agregó al carrito' : 'se agregó al carrito (sin oferta)';
    Swal.fire({
        icon: 'success',
        title: '¡Agregado al carrito!',
        text: `${producto.nombre} ${mensajeOferta}`,
        showConfirmButton: false,
        timer: 1500,
        position: 'top-end',
        toast: true,
        customClass: {
            popup: 'swal-high-z-index'
        }
    });
}

// Actualizar carrito
function actualizarCarrito() {
    const badge = document.getElementById('carrito-badge');
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    if (totalItems > 0) {
        badge.style.display = 'block';
        badge.textContent = totalItems;
    } else {
        badge.style.display = 'none';
    }
    
    // Actualizar carrito emergente
    actualizarCarritoEmergente();
}

// Actualizar carrito emergente
function actualizarCarritoEmergente() {
    const lista = document.getElementById('carritoLista');
    const total = document.getElementById('carritoTotal');
    const btnPagar = document.getElementById('btnPagarCarrito');
    
    lista.innerHTML = '';
    
    if (carrito.length === 0) {
        lista.innerHTML = '<li class="list-group-item text-center text-muted">No hay productos en el carrito</li>';
        total.textContent = '$0';
        btnPagar.disabled = true;
        return;
    }
    
    let totalPrecio = 0;
    
    carrito.forEach(item => {
        const precioItem = item.precioOferta * item.cantidad;
        totalPrecio += precioItem;
        
        const itemHTML = `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <img src="${item.imagen}" alt="${item.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
                    <div>
                        <h6 class="mb-0">${item.nombre}</h6>
                        <small class="text-muted">$${item.precioOferta.toLocaleString()} x ${item.cantidad}</small>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <span class="fw-bold me-3">$${precioItem.toLocaleString()}</span>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
        `;
        
        lista.innerHTML += itemHTML;
    });
    
    total.textContent = `$${totalPrecio.toLocaleString()}`;
    btnPagar.disabled = false;
}

// Eliminar del carrito
function eliminarDelCarrito(productoId) {
    carrito = carrito.filter(item => item.id !== productoId);
    localStorage.setItem('carritoOfertas', JSON.stringify(carrito));
    actualizarCarrito();
    
    Swal.fire({
        icon: 'success',
        title: 'Producto eliminado',
        showConfirmButton: false,
        timer: 1000,
        position: 'top-end',
        toast: true,
        customClass: {
            popup: 'swal-high-z-index'
        }
    });
}

// Mostrar carrito emergente
function mostrarCarritoEmergente() {
    document.getElementById('carritoOverlay').style.display = 'block';
    document.getElementById('carritoEmergente').style.display = 'block';
}

// Ocultar carrito emergente
function ocultarCarritoEmergente() {
    document.getElementById('carritoOverlay').style.display = 'none';
    document.getElementById('carritoEmergente').style.display = 'none';
}

// Contador regresivo
function iniciarContador() {
    console.log('Iniciando contador con configuración:', configuracionOfertas);
    
    // Actualizar inmediatamente
    actualizarContador();
    
    // Actualizar cada segundo
    if (intervaloContador) {
        clearInterval(intervaloContador);
    }
    
    intervaloContador = setInterval(actualizarContador, 1000);
    
    // Actualizar visualización cada minuto
    if (intervaloVisualizacion) {
        clearInterval(intervaloVisualizacion);
    }
    
    intervaloVisualizacion = setInterval(() => {
        mostrarProductosOferta();
        actualizarHeaderOfertas();
    }, 60000);
}

function actualizarContador() {
    const ahora = new Date().getTime();
    const fechaFin = new Date(configuracionOfertas.fechaFin).getTime();
    const diferencia = fechaFin - ahora;
    
    console.log('Temporizador - Ahora:', new Date(ahora));
    console.log('Temporizador - Fecha fin:', new Date(fechaFin));
    console.log('Temporizador - Diferencia:', diferencia);
    
    if (diferencia <= 0) {
        // La oferta ha terminado, calcular la próxima fecha
        if (configuracionOfertas.activa) {
            // Si las ofertas estaban activas, ahora van a pausa
            console.log('Ofertas terminadas, iniciando período de pausa');
            configuracionOfertas.activa = false;
            
            // Calcular fecha de fin de pausa (duracionPausa días desde ahora)
            const fechaFinPausa = new Date(ahora + configuracionOfertas.duracionPausa * 24 * 60 * 60 * 1000);
            configuracionOfertas.fechaFin = fechaFinPausa.toISOString();
            
            // Mostrar mensaje de oferta terminada
            Swal.fire({
                icon: 'info',
                title: '¡Ofertas Terminadas!',
                text: `Las ofertas especiales han finalizado. Volverán en ${configuracionOfertas.duracionPausa} días.`,
                confirmButtonText: 'Entendido',
                customClass: {
                    popup: 'swal-high-z-index'
                }
            });
            
            // Guardar nueva configuración
            guardarConfiguracionLocal();
            
        } else {
            // Si las ofertas estaban en pausa, ahora vuelven a activarse
            console.log('Período de pausa terminado, reactivando ofertas');
            configuracionOfertas.activa = true;
            
            // Calcular fecha de fin de oferta (duracionOferta días desde ahora)
            const fechaFinOferta = new Date(ahora + configuracionOfertas.duracionOferta * 24 * 60 * 60 * 1000);
            configuracionOfertas.fechaFin = fechaFinOferta.toISOString();
            
            // Mostrar mensaje de ofertas reactivadas
            Swal.fire({
                icon: 'success',
                title: '¡Ofertas Reactivadas! 🎉',
                text: `¡Las ofertas especiales han vuelto! Disfruta de ${configuracionOfertas.duracionOferta} días de descuentos increíbles.`,
                confirmButtonText: '¡Perfecto!',
                customClass: {
                    popup: 'swal-high-z-index'
                }
            });
            
            // Guardar nueva configuración
            guardarConfiguracionLocal();
        }
        
        // Actualizar la visualización
        mostrarProductosOferta();
        actualizarHeaderOfertas();
        return;
    }
    
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
    
    // Actualizar elementos del DOM
    const diasElement = document.getElementById('dias');
    const horasElement = document.getElementById('horas');
    const minutosElement = document.getElementById('minutos');
    const segundosElement = document.getElementById('segundos');
    
    if (diasElement) diasElement.textContent = dias.toString().padStart(2, '0');
    if (horasElement) horasElement.textContent = horas.toString().padStart(2, '0');
    if (minutosElement) minutosElement.textContent = minutos.toString().padStart(2, '0');
    if (segundosElement) segundosElement.textContent = segundos.toString().padStart(2, '0');
    
    console.log(`Temporizador: ${dias}d ${horas}h ${minutos}m ${segundos}s`);
}

// Guardar configuración localmente
function guardarConfiguracionLocal() {
    localStorage.setItem('configuracionOfertas', JSON.stringify(configuracionOfertas));
    console.log('Configuración guardada localmente:', configuracionOfertas);
}

// Cargar configuración
async function cargarConfiguracion() {
    try {
        // Primero intentar cargar desde localStorage
        const configLocal = localStorage.getItem('configuracionOfertas');
        if (configLocal) {
            const configLocalParsed = JSON.parse(configLocal);
            // Verificar si la configuración local es más reciente
            const fechaLocal = new Date(configLocalParsed.fechaFin).getTime();
            const ahora = new Date().getTime();
            
            if (fechaLocal > ahora || configLocalParsed.activa !== configuracionOfertas.activa) {
                configuracionOfertas = configLocalParsed;
                console.log('Configuración cargada desde localStorage:', configuracionOfertas);
            }
        }
        
        // Luego cargar desde user.json para obtener la configuración base
        const response = await fetch('user.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar user.json');
        }
        const data = await response.json();
        
        // Solo actualizar si no hay configuración local válida
        if (!configLocal) {
            configuracionOfertas = data.ofertas;
            console.log('Configuración cargada desde user.json:', configuracionOfertas);
        }
        
        // Actualizar contador
        iniciarContador();
    } catch (error) {
        console.log('Error cargando configuración, usando valores por defecto:', error);
        // Usar configuración por defecto
        configuracionOfertas = {
            fechaFin: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            activa: true,
            duracionOferta: 2,
            duracionPausa: 2
        };
        iniciarContador();
    }
}

// Panel de administración
function mostrarPanelAdmin() {
    document.getElementById('adminOverlay').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'block';
    
    if (!adminAutenticado) {
        document.getElementById('adminLogin').style.display = 'block';
        document.getElementById('adminControl').style.display = 'none';
    } else {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminControl').style.display = 'block';
        cargarConfiguracionAdmin();
    }
}

function ocultarPanelAdmin() {
    document.getElementById('adminOverlay').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'none';
}

async function loginAdmin() {
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    try {
        const response = await fetch('user.json');
        const data = await response.json();
        
        if (email === data.admin.email && password === data.admin.password) {
            adminAutenticado = true;
            document.getElementById('adminLogin').style.display = 'none';
            document.getElementById('adminControl').style.display = 'block';
            cargarConfiguracionAdmin();
            
            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: `Hola ${data.admin.nombre}`,
                timer: 1500,
                showConfirmButton: false,
                customClass: {
                    popup: 'swal-high-z-index'
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error de autenticación',
                text: 'Email o contraseña incorrectos',
                customClass: {
                    popup: 'swal-high-z-index'
                }
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar la configuración',
            customClass: {
                popup: 'swal-high-z-index'
            }
        });
    }
}

function logoutAdmin() {
    adminAutenticado = false;
    document.getElementById('adminEmail').value = '';
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminControl').style.display = 'none';
    ocultarPanelAdmin();
}

function cargarConfiguracionAdmin() {
    const fechaFin = new Date(configuracionOfertas.fechaFin);
    const fechaLocal = fechaFin.toISOString().slice(0, 16);
    
    document.getElementById('fechaFinOferta').value = fechaLocal;
    document.getElementById('ofertaActiva').checked = configuracionOfertas.activa;
}

async function guardarConfiguracion() {
    const fechaFin = document.getElementById('fechaFinOferta').value;
    const activa = document.getElementById('ofertaActiva').checked;
    
    configuracionOfertas.fechaFin = fechaFin;
    configuracionOfertas.activa = activa;
    
    // En un entorno real, aquí se guardaría en el servidor
    // Por ahora, solo actualizamos la configuración local
    
    Swal.fire({
        icon: 'success',
        title: 'Configuración guardada',
        text: 'Los cambios se han aplicado correctamente',
        timer: 1500,
        showConfirmButton: false,
        customClass: {
            popup: 'swal-high-z-index'
        }
    });
    
    // Reiniciar contador y actualizar visualización
    iniciarContador();
    mostrarProductosOferta();
    actualizarHeaderOfertas();
}

// Formulario de envío
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
            confirmButtonColor: '#ff6b6b',
            cancelButtonColor: '#6c757d',
            customClass: {
                popup: 'swal-high-z-index'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Mostrar formulario para actualizar
                document.getElementById('formularioOverlay').style.display = 'block';
                document.getElementById('formularioEnvio').style.display = 'block';
                
                // Llenar el formulario con los datos actuales
                document.querySelector('input[name="nombre"]').value = datos.nombre;
                document.querySelector('input[name="apellido"]').value = datos.apellido;
                document.querySelector('input[name="email"]').value = datos.email || '';
                document.querySelector('input[name="telefono"]').value = datos.telefono;
                document.querySelector('input[name="direccion"]').value = datos.direccion;
            } else {
                // Usar datos existentes
                Swal.fire({
                    icon: 'success',
                    title: '¡Perfecto!',
                    text: `Gracias ${datos.nombre}, tus datos de envío están confirmados`,
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'swal-high-z-index'
                    }
                });
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

// Manejo del formulario de envío
document.getElementById('formularioDatosEnvio').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener datos del formulario
    const formData = new FormData(this);
    const datos = {
        nombre: formData.get('nombre'),
        apellido: formData.get('apellido'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        direccion: formData.get('direccion')
    };
    
    // Guardar en localStorage
    localStorage.setItem('datosEnvio', JSON.stringify(datos));
    localStorage.setItem('formularioEnviado', 'true');
    
    // Agregar información adicional al formData
    formData.append('pagina', 'Página de Ofertas');
    formData.append('fecha', new Date().toLocaleString('es-AR'));
    
    // Si hay productos en el carrito, agregar esa información
    if (carrito.length > 0) {
        const ahora = new Date().getTime();
        const fechaFin = new Date(configuracionOfertas.fechaFin).getTime();
        const ofertasActivas = configuracionOfertas.activa && fechaFin > ahora;
        
        const total = carrito.reduce((acc, producto) => {
            const precioFinal = ofertasActivas ? producto.precioOferta : producto.precio;
            return acc + precioFinal * producto.cantidad;
        }, 0);
        
        const productosLista = carrito.map(producto => {
            const precioFinal = ofertasActivas ? producto.precioOferta : producto.precio;
            const subtotal = precioFinal * producto.cantidad;
            return `• ${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: $${precioFinal} - Subtotal: $${subtotal}${ofertasActivas ? ' (OFERTA)' : ' (Precio Normal)'}`;
        }).join('\n');
        
        formData.append('_subject', '📋 Datos de Envío con Carrito de Ofertas - TiendaKeylor');
        formData.append('total_carrito', `$${total}`);
        formData.append('cantidad_productos', carrito.reduce((acc, producto) => acc + producto.cantidad, 0).toString());
        formData.append('productos_carrito', productosLista);
        formData.append('tipo_formulario', 'Datos de Envío con Carrito de Ofertas');
        formData.append('ofertas_activas', ofertasActivas ? 'Sí' : 'No');
    } else {
        formData.append('_subject', '📋 Datos de Envío - TiendaKeylor Ofertas');
        formData.append('tipo_formulario', 'Datos de Envío de Ofertas');
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
            let mensaje = `Gracias ${datos.nombre}, tus datos han sido registrados correctamente y enviados por email`;
            if (carrito.length > 0) {
                mensaje += `\n\nTu carrito con ${carrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos está listo para pagar.`;
            }
            
            // Mostrar alerta personalizada
            Swal.fire({
                icon: 'success',
                title: '¡Datos Confirmados! 🔥',
                text: mensaje,
                confirmButtonText: '¡Perfecto!',
                confirmButtonColor: '#ff6b6b',
                customClass: {
                    popup: 'swal-high-z-index'
                }
            }).then(() => {
                // Habilitar botón de pago
                document.getElementById('btnPagarCarrito').disabled = false;
            });
        } else {
            console.error('Error en respuesta de Formspree:', response.status, response.statusText);
            // Si falla el envío por email, solo guardar localmente
            this.reset();
            ocultarFormularioEnvio();
            
            Swal.fire({
                icon: 'success',
                title: '¡Datos Confirmados! 🔥',
                text: `Gracias ${datos.nombre}, tus datos han sido guardados localmente. Ya puedes proceder con el pago de tus ofertas`,
                confirmButtonText: '¡Perfecto!',
                confirmButtonColor: '#ff6b6b',
                customClass: {
                    popup: 'swal-high-z-index'
                }
            }).then(() => {
                // Habilitar botón de pago
                document.getElementById('btnPagarCarrito').disabled = false;
            });
        }
    })
    .catch(error => {
        console.error('Error enviando email:', error);
        // Si hay error, solo guardar localmente
        this.reset();
        ocultarFormularioEnvio();
        
        Swal.fire({
            icon: 'success',
            title: '¡Datos Confirmados! 🔥',
            text: `Gracias ${datos.nombre}, tus datos han sido guardados localmente. Ya puedes proceder con el pago de tus ofertas`,
            confirmButtonText: '¡Perfecto!',
            confirmButtonColor: '#ff6b6b',
            customClass: {
                popup: 'swal-high-z-index'
            }
        }).then(() => {
            // Habilitar botón de pago
            document.getElementById('btnPagarCarrito').disabled = false;
        });
    });
});

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

// Pagar con Mercado Pago (exactamente igual que en tienda.js)
async function pagarOfertas() {
    try {
        console.log('🚀 Iniciando proceso de pago de ofertas...');
        console.log('Carrito actual:', carrito);
        
        // Verificar que los scripts estén cargados
        await esperarScripts();
        
        if (carrito.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Carrito vacío',
                text: 'Agrega productos antes de pagar',
                confirmButtonText: 'Entendido',
                customClass: {
                    popup: 'swal-high-z-index'
                }
            });
            return;
        }

        // Verificar si se han registrado los datos de envío
        const datosEnvio = localStorage.getItem('datosEnvio');
        console.log('📋 Datos de envío en localStorage:', datosEnvio);
        
        if (!datosEnvio) {
            Swal.fire({
                icon: 'warning',
                title: 'Datos de envío requeridos',
                text: 'Por favor, completa tus datos de envío antes de pagar',
                confirmButtonText: 'Completar datos',
                customClass: {
                    popup: 'swal-high-z-index'
                }
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

        console.log('📤 Enviando datos de ofertas a Formspree antes del pago...');
        // Enviar datos del pedido a Formspree ANTES de procesar el pago
        const formspreeResult = await enviarDatosPedidoFormspreeOfertas();
        console.log('📨 Resultado de Formspree (Ofertas):', formspreeResult);

        // Verificar si las ofertas están activas para usar el precio correcto
        const ahora = new Date().getTime();
        const fechaFin = new Date(configuracionOfertas.fechaFin).getTime();
        const ofertasActivas = configuracionOfertas.activa && fechaFin > ahora;

        const items = carrito.map(producto => ({
            title: producto.nombre,
            quantity: producto.cantidad,
            unit_price: ofertasActivas ? producto.precioOferta : producto.precio,
            currency_id: "ARS"
        }));

        const total = carrito.reduce((acc, producto) => {
            const precioFinal = ofertasActivas ? producto.precioOferta : producto.precio;
            return acc + precioFinal * producto.cantidad;
        }, 0);
        console.log('💰 Total del pedido de ofertas:', total);
        console.log('🔥 Ofertas activas:', ofertasActivas);

        // Configurar Mercado Pago (exactamente igual que en tienda.js)
        const mp = new MercadoPago('APP_USR-2e63e1ff-d8c3-4511-a7ef-fb3d2bb1adae', {
            locale: 'es-AR'
        });

        console.log('💳 Creando preferencia de pago en MercadoPago (Ofertas)...');
        // Crear la preferencia de pago (exactamente igual que en tienda.js)
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
        console.log('📊 Respuesta de MercadoPago (Ofertas):', data);  // Verifica la respuesta de la API

        if (data.init_point) {
            console.log('✅ Redirigiendo a MercadoPago (Ofertas)...');
            // Cerrar el loading y redirigir
            Swal.close();
            window.location.href = data.init_point;
        } else {
            console.error('❌ Error en la respuesta de MercadoPago (Ofertas):', data);
            Swal.fire({
                icon: 'error',
                title: 'Error en el pago',
                text: 'Hubo un problema al procesar el pago. Por favor, intenta nuevamente.',
                confirmButtonText: 'Entendido',
                customClass: {
                    popup: 'swal-high-z-index'
                }
            });
        }
    } catch (error) {
        console.error('❌ Error en el proceso de pago de ofertas:', error);
        
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
                width: '600px',
                customClass: {
                    popup: 'swal-high-z-index'
                }
            });
        } else if (problemas.length > 0) {
            const recomendaciones = mostrarRecomendacionesSolucion(problemas);
            Swal.fire({
                title: "Problema Detectado",
                text: recomendaciones,
                icon: "warning",
                confirmButtonText: "Entendido",
                width: '600px',
                customClass: {
                    popup: 'swal-high-z-index'
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error en el pago',
                text: 'Hubo un problema al procesar el pago. Por favor, intenta nuevamente.',
                confirmButtonText: 'Entendido',
                customClass: {
                    popup: 'swal-high-z-index'
                }
            });
        }
    }
}

// Función para enviar datos del pedido a Formspree (Ofertas)
async function enviarDatosPedidoFormspreeOfertas() {
    try {
        const datosEnvio = JSON.parse(localStorage.getItem('datosEnvio'));
        if (!datosEnvio) {
            console.error('❌ No se encontraron datos de envío en localStorage');
            return;
        }

        const ahora = new Date().getTime();
        const fechaFin = new Date(configuracionOfertas.fechaFin).getTime();
        const ofertasActivas = configuracionOfertas.activa && fechaFin > ahora;
        
        const total = carrito.reduce((acc, producto) => {
            const precioFinal = ofertasActivas ? producto.precioOferta : producto.precio;
            return acc + precioFinal * producto.cantidad;
        }, 0);
        
        // Crear lista de productos para el email
        const productosLista = carrito.map(producto => {
            const precioFinal = ofertasActivas ? producto.precioOferta : producto.precio;
            const subtotal = precioFinal * producto.cantidad;
            return `• ${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: $${precioFinal} - Subtotal: $${subtotal}${ofertasActivas ? ' (OFERTA)' : ' (Precio Normal)'}`;
        }).join('\n');

        // Crear FormData con todos los datos del pedido
        const formData = new FormData();
        formData.append('_subject', '🔥 PEDIDO DE OFERTAS - TiendaKeylor');
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
        formData.append('pagina_origen', 'Página de Ofertas');
        formData.append('ofertas_activas', ofertasActivas ? 'Sí' : 'No');
        formData.append('tiempo_restante_ofertas', ofertasActivas ? `${Math.ceil((fechaFin - ahora) / (1000 * 60 * 60 * 24))} días` : 'Ofertas en pausa');

        console.log('📤 Enviando datos de ofertas a Formspree...');
        console.log('Datos del pedido de ofertas:', {
            nombre: datosEnvio.nombre,
            apellido: datosEnvio.apellido,
            email: datosEnvio.email,
            telefono: datosEnvio.telefono,
            direccion: datosEnvio.direccion,
            total: total,
            productos: carrito.length,
            ofertasActivas: ofertasActivas
        });

        const response = await fetch('https://formspree.io/f/xeoklbzw', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log('📨 Respuesta de Formspree (Ofertas):', response);
        console.log('Status:', response.status);
        console.log('OK:', response.ok);

        if (response.ok) {
            console.log('✅ Datos del pedido de ofertas enviados a Formspree correctamente');
            return true;
        } else {
            console.error('❌ Error enviando datos del pedido de ofertas a Formspree:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error('❌ Error en el envío de datos del pedido de ofertas:', error);
        return false;
    }
}

// Manejar retorno de Mercado Pago
function manejarRetornoMercadoPago() {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const payment_id = urlParams.get('payment_id');
    
    if (status && payment_id) {
        if (status === 'approved') {
            // Pago exitoso
            Swal.fire({
                icon: 'success',
                title: '¡Pago Exitoso! 🎉',
                html: `
                    <p>Tu pago ha sido procesado correctamente</p>
                    <p><strong>ID de Pago: ${payment_id}</strong></p>
                    <p class="text-muted">Te enviaremos un email de confirmación</p>
                `,
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#ff6b6b',
                customClass: {
                    popup: 'swal-high-z-index'
                }
            }).then(() => {
                // Limpiar carrito
                carrito = [];
                localStorage.removeItem('carritoOfertas');
                actualizarCarrito();
                ocultarCarritoEmergente();
                
                // Limpiar parámetros de URL
                window.history.replaceState({}, document.title, window.location.pathname);
            });
        } else if (status === 'rejected') {
            // Pago rechazado
            Swal.fire({
                icon: 'error',
                title: 'Pago Rechazado',
                text: 'Tu pago fue rechazado. Por favor, intenta con otro método de pago.',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#ff6b6b',
                customClass: {
                    popup: 'swal-high-z-index'
                }
            }).then(() => {
                // Limpiar parámetros de URL
                window.history.replaceState({}, document.title, window.location.pathname);
            });
        } else if (status === 'pending') {
            // Pago pendiente
            Swal.fire({
                icon: 'warning',
                title: 'Pago Pendiente',
                text: 'Tu pago está siendo procesado. Te notificaremos cuando se confirme.',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#ff6b6b',
                customClass: {
                    popup: 'swal-high-z-index'
                }
            }).then(() => {
                // Limpiar parámetros de URL
                window.history.replaceState({}, document.title, window.location.pathname);
            });
        }
    }
}

// Actualizar header según estado de ofertas
function actualizarHeaderOfertas() {
    const ahora = new Date().getTime();
    const fechaFin = new Date(configuracionOfertas.fechaFin).getTime();
    const ofertasActivas = configuracionOfertas.activa && fechaFin > ahora;
    
    const headerTitle = document.querySelector('.ofertas-header h1');
    const headerSubtitle = document.querySelector('.ofertas-header .subtitle');
    const countdownContainer = document.querySelector('.countdown');
    
    if (ofertasActivas) {
        headerTitle.innerHTML = '🔥 OFERTAS ESPECIALES 🔥';
        headerSubtitle.textContent = '¡No te pierdas estas increíbles ofertas por tiempo limitado!';
        countdownContainer.style.display = 'block';
        
        // Restaurar estilo original del header
        const headerElement = document.querySelector('.ofertas-header');
        if (headerElement) {
            headerElement.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 50%, #ff8e53 100%)';
        }
    } else {
        // Calcular días restantes para la próxima oferta
        const diasRestantes = Math.ceil((fechaFin - ahora) / (1000 * 60 * 60 * 24));
        
        headerTitle.innerHTML = '⏰ OFERTAS EN PAUSA ⏰';
        headerSubtitle.textContent = `Las ofertas especiales volverán en ${diasRestantes} días. ¡No te las pierdas!`;
        countdownContainer.style.display = 'block';
        
        // Cambiar el estilo del header para indicar pausa
        const headerElement = document.querySelector('.ofertas-header');
        if (headerElement) {
            headerElement.style.background = 'linear-gradient(135deg, #6c757d 0%, #495057 50%, #343a40 100%)';
        }
        
        // Actualizar texto del contador
        const countdownTitle = document.querySelector('.countdown h5');
        if (countdownTitle) {
            countdownTitle.textContent = '⏰ Próximas ofertas en:';
        }
    }
}

// Actualizar automáticamente la visualización
function actualizarVisualizacionAutomatica() {
    const ahora = new Date().getTime();
    const fechaFin = new Date(configuracionOfertas.fechaFin).getTime();
    const ofertasActivas = configuracionOfertas.activa && fechaFin > ahora;
    
    // Solo actualizar si el estado cambió
    const estadoAnterior = localStorage.getItem('ofertasActivasEstado');
    const estadoActual = ofertasActivas ? 'activa' : 'inactiva';
    
    if (estadoAnterior !== estadoActual) {
        localStorage.setItem('ofertasActivasEstado', estadoActual);
        mostrarProductosOferta();
        actualizarHeaderOfertas();
        
        // Si las ofertas se acabaron, mostrar notificación
        if (estadoAnterior === 'activa' && estadoActual === 'inactiva') {
            Swal.fire({
                icon: 'info',
                title: 'Ofertas Finalizadas',
                text: 'Las ofertas especiales han terminado. Los productos ahora se muestran a precio normal.',
                confirmButtonText: 'Entendido',
                customClass: {
                    popup: 'swal-high-z-index'
                }
            });
        }
    }
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