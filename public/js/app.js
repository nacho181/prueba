/**
 * ============================================================================
 * MUNICIPALIDAD DE CONCORDIA - MÓDULO PANEL DE EMPLEADOS
 * Lógica de Frontend en JavaScript Nativo e Integración con Bootstrap 5
 * ============================================================================
 */

// URL Base para las peticiones a la API REST de incidencias
const API_BASE_URL = '/api/v1';

// Estado global de la aplicación cliente
let currentEmpleadoId = 4; // Identificador por defecto: Esteban Reniero (ID 4)
let listaArticulosCache = []; // Caché local para filtrado de artículos en cliente
let bsToast = null; // Instancia global de la notificación Toast de Bootstrap

/**
 * Evento principal DOMContentLoaded: Se gatilla cuando la estructura DOM del HTML está lista.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Paso 1: Inicializar el componente Toast de Bootstrap si existe en el DOM
    const toastEl = document.getElementById('toast');
    if (toastEl && window.bootstrap) {
        bsToast = new bootstrap.Toast(toastEl, { delay: 4000 });
    }

    // Paso 2: Cargar datos iniciales desde el servidor
    cargarEmpleados();
    cargarArticulos();
    cargarMisIncidencias();

    // Paso 3: Registrar escuchadores de eventos para interactividad
    setupEventListeners();
});

/**
 * Registra los escuchadores de eventos para la interacción con la interfaz.
 */
function setupEventListeners() {
    // Evento de cambio en el desplegable de empleado activo (Simulación de sesión)
    const selectEmpleado = document.getElementById('selectEmpleado');
    if (selectEmpleado) {
        selectEmpleado.addEventListener('change', (e) => {
            currentEmpleadoId = parseInt(e.target.value, 10);
            cargarMisIncidencias();
            mostrarToast(`Empleado activo cambiado a: ${selectEmpleado.options[selectEmpleado.selectedIndex].text}`, 'info');
        });
    }

    // Evento para el botón de actualización manual de la lista de incidencias
    const btnRefresh = document.getElementById('btnRefreshIncidencias');
    if (btnRefresh) {
        btnRefresh.addEventListener('click', () => {
            cargarMisIncidencias();
            mostrarToast('Lista de incidencias actualizada', 'info');
        });
    }

    // Evento para el formulario de reporte de nueva incidencia
    const formNuevaIncidencia = document.getElementById('formNuevaIncidencia');
    if (formNuevaIncidencia) {
        formNuevaIncidencia.addEventListener('submit', crearIncidencia);
    }

    // Evento de búsqueda dinámica sobre la lista de artículos
    const searchArticulos = document.getElementById('searchArticulos');
    if (searchArticulos) {
        searchArticulos.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            filtrarArticulos(query);
        });
    }
}

/**
 * Muestra una notificación emergente (Toast de Bootstrap) en la esquina inferior.
 * @param {string} mensaje - Texto explicativo de la notificación.
 * @param {string} tipo - Tipo de notificación ('exito', 'error', 'info').
 */
function mostrarToast(mensaje, tipo = 'exito') {
    const toastEl = document.getElementById('toast');
    const toastBody = document.getElementById('toastBody');

    if (!toastEl || !toastBody) return;

    // Configurar color de fondo según la categoría del mensaje
    toastEl.className = 'toast align-items-center text-white border-0';
    if (tipo === 'exito') {
        toastEl.classList.add('bg-concordia-light');
    } else if (tipo === 'error' || tipo === 'danger') {
        toastEl.classList.add('bg-danger');
    } else {
        toastEl.classList.add('bg-secondary');
    }

    toastBody.textContent = mensaje;
    if (bsToast) bsToast.show();
}

/**
 * Obtiene del backend la lista de empleados activos y llena el selector superior.
 * @returns {Promise<void>}
 */
async function cargarEmpleados() {
    try {
        // Paso 1: Petición HTTP GET al endpoint de usuarios empleados
        const response = await fetch(`${API_BASE_URL}/usuarios/empleados`);
        if (!response.ok) throw new Error('Error al obtener empleados');

        // Paso 2: Parsear respuesta del servidor
        const result = await response.json();
        const empleados = Array.isArray(result) ? result : (result.data || []);

        const select = document.getElementById('selectEmpleado');
        if (!select) return;

        select.innerHTML = '';

        // Paso 3: Renderizar cada empleado como opción del desplegable
        empleados.forEach(emp => {
            const option = document.createElement('option');
            option.value = emp.id_usuario;
            option.textContent = `${emp.nombres} ${emp.apellidos} (${emp.area_descripcion || emp.area_nombre || 'Empleado Municipal'})`;
            if (emp.id_usuario === currentEmpleadoId) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando empleados:', error);
    }
}

/**
 * Obtiene del backend el catálogo de artículos y actualiza el formulario y las tarjetas.
 * @returns {Promise<void>}
 */
async function cargarArticulos() {
    try {
        // Paso 1: Petición HTTP GET al endpoint de artículos
        const response = await fetch(`${API_BASE_URL}/articulos`);
        if (!response.ok) throw new Error('Error al obtener artículos');

        // Paso 2: Parsear la lista de artículos
        const result = await response.json();
        listaArticulosCache = Array.isArray(result) ? result : (result.data || []);

        // Paso 3: Poblar el menú desplegable del formulario
        const selectArticulo = document.getElementById('selectArticulo');
        if (selectArticulo) {
            selectArticulo.innerHTML = '<option value="">-- Seleccionar Artículo --</option>';

            listaArticulosCache.forEach(art => {
                const option = document.createElement('option');
                option.value = art.id_articulo;
                option.textContent = `${art.descripcion} - [Categoría: ${art.categoria_descripcion || art.categoria_nombre || 'Gral'}, Área: ${art.area_descripcion || art.area_nombre || 'Gral'}]`;
                selectArticulo.appendChild(option);
            });
        }

        // Paso 4: Renderizar la cuadrícula de tarjetas de artículos
        renderizarGridArticulos(listaArticulosCache);
    } catch (error) {
        console.error('Error cargando artículos:', error);
    }
}

/**
 * Renderiza el catálogo de artículos en una grilla de tarjetas Bootstrap.
 * @param {Array<Object>} articulos - Lista de artículos a visualizar.
 */
function renderizarGridArticulos(articulos) {
    const container = document.getElementById('gridArticulos');
    if (!container) return;

    container.innerHTML = '';

    // Manejo de estado vacío sin resultados
    if (!articulos || articulos.length === 0) {
        container.innerHTML = `<div class="col-12 text-center text-muted py-4">No se encontraron artículos que coincidan con la búsqueda.</div>`;
        return;
    }

    // Generar tarjeta para cada artículo registrado
    articulos.forEach(art => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = `
            <div class="card card-articulo h-100 shadow-sm rounded-3">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-concordia-light text-white">${art.categoria_descripcion || art.categoria_nombre || 'Periféricos'}</span>
                        <small class="text-muted">ID: #${art.id_articulo}</small>
                    </div>
                    <h5 class="card-title fw-bold text-concordia-dark mb-1">${escapeHtml(art.descripcion)}</h5>
                    <p class="card-text small text-muted mb-3">Área asignada: <strong>${escapeHtml(art.area_descripcion || art.area_nombre || 'General')}</strong></p>
                    <div class="mt-auto">
                        <button onclick="seleccionarArticuloParaIncidencia(${art.id_articulo})" class="btn btn-sm btn-outline-concordia w-100 fw-semibold">
                            Reportar Falla
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

/**
 * Filtra los artículos en tiempo real según la consulta ingresada.
 * @param {string} query - Término de búsqueda.
 */
function filtrarArticulos(query) {
    if (!query) {
        renderizarGridArticulos(listaArticulosCache);
        return;
    }

    // Filtrar por coincidencia en descripción, categoría o área
    const filtrados = listaArticulosCache.filter(art =>
        (art.descripcion && art.descripcion.toLowerCase().includes(query)) ||
        (art.categoria_descripcion && art.categoria_descripcion.toLowerCase().includes(query)) ||
        (art.categoria_nombre && art.categoria_nombre.toLowerCase().includes(query)) ||
        (art.area_descripcion && art.area_descripcion.toLowerCase().includes(query)) ||
        (art.area_nombre && art.area_nombre.toLowerCase().includes(query))
    );

    renderizarGridArticulos(filtrados);
}

/**
 * Preselecciona un artículo y cambia a la pestaña del formulario de incidencias.
 * @param {number} idArticulo - Identificador del artículo a seleccionar.
 */
function seleccionarArticuloParaIncidencia(idArticulo) {
    const selectArticulo = document.getElementById('selectArticulo');
    if (selectArticulo) {
        selectArticulo.value = idArticulo;
    }

    // Cambiar a la pestaña "Reportar Nueva Incidencia" usando Bootstrap Tab
    const tabBtn = document.getElementById('btn-nueva-incidencia');
    if (tabBtn && window.bootstrap) {
        const tabTrigger = new bootstrap.Tab(tabBtn);
        tabTrigger.show();
    }

    mostrarToast('Artículo seleccionado. Describe la falla a continuación.', 'info');
}

/**
 * Consulta al servidor la lista de incidencias asociadas al empleado activo.
 * @returns {Promise<void>}
 */
async function cargarMisIncidencias() {
    const tbody = document.getElementById('tbodyIncidencias');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">Cargando incidencias...</td></tr>`;

    try {
        // Paso 1: Petición HTTP GET parametrizada con id_usuario
        const response = await fetch(`${API_BASE_URL}/incidencias/mis-incidencias?id_usuario=${currentEmpleadoId}`);
        if (!response.ok) throw new Error('Error al obtener incidencias');

        // Paso 2: Parsear el listado de incidencias
        const result = await response.json();
        const incidencias = Array.isArray(result) ? result : (result.data || []);
        tbody.innerHTML = '';

        if (incidencias.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No tienes incidencias registradas.</td></tr>`;
            return;
        }

        // Paso 3: Renderizar filas de la tabla de incidencias
        incidencias.forEach(inc => {
            const tr = document.createElement('tr');

            // Determinar etiqueta visual (Badge) para el estado
            let badgeEstado = '';
            const estadoNom = (inc.estado_descripcion || inc.estado_nombre || 'Pendiente').toLowerCase();
            if (estadoNom.includes('pendiente') || inc.id_estado === 1) {
                badgeEstado = '<span class="badge bg-warning text-dark">Pendiente</span>';
            } else if (estadoNom.includes('proceso') || inc.id_estado === 2) {
                badgeEstado = '<span class="badge bg-info text-dark">En Proceso</span>';
            } else if (estadoNom.includes('resuela') || estadoNom.includes('resuelta') || estadoNom.includes('finalizada') || inc.id_estado === 3) {
                badgeEstado = '<span class="badge bg-success">Resuelta</span>';
            } else if (estadoNom.includes('cancelada') || inc.id_estado === 4) {
                badgeEstado = '<span class="badge bg-secondary">Cancelada</span>';
            } else {
                badgeEstado = `<span class="badge bg-light text-dark">${escapeHtml(inc.estado_descripcion || 'Sin estado')}</span>`;
            }

            // Determinar etiqueta visual para el nivel de prioridad
            let badgePrioridad = '';
            if (inc.prioridad === 1) {
                badgePrioridad = '<span class="badge bg-danger">Alta</span>';
            } else if (inc.prioridad === 2) {
                badgePrioridad = '<span class="badge bg-warning text-dark">Media</span>';
            } else {
                badgePrioridad = '<span class="badge bg-info text-dark">Baja</span>';
            }

            // Formatear la fecha de creación
            const fechaFormateada = new Date(inc.creado).toLocaleDateString('es-AR', {
                year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
            });

            // Permitir cancelación sólo si la incidencia está en estado Pendiente
            const esPendiente = (inc.id_estado === 1 || estadoNom.includes('pendiente'));
            const botonAccion = esPendiente
                ? `<button onclick="cancelarIncidencia(${inc.id_incidencia})" class="btn btn-sm btn-outline-danger fw-semibold">Cancelar</button>`
                : `<span class="text-muted small">Sin acciones</span>`;

            tr.innerHTML = `
                <td class="fw-bold">#${inc.id_incidencia}</td>
                <td class="small">${fechaFormateada}</td>
                <td class="fw-semibold">${escapeHtml(inc.articulo_descripcion || inc.articulo_nombre || 'Artículo #' + inc.id_articulo)}</td>
                <td class="small text-wrap" style="max-width: 250px;">${escapeHtml(inc.descripcion_pedido || '')}</td>
                <td>${badgePrioridad}</td>
                <td>${badgeEstado}</td>
                <td class="text-end">${botonAccion}</td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Error cargando incidencias:', error);
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-4">Error al cargar datos. Intente nuevamente.</td></tr>`;
    }
}

/**
 * Maneja el envío del formulario para crear un nuevo registro de incidencia.
 * @param {Event} e - Evento de submit del formulario.
 * @returns {Promise<void>}
 */
async function crearIncidencia(e) {
    e.preventDefault();

    const id_articulo = parseInt(document.getElementById('selectArticulo').value, 10);
    const prioridad = parseInt(document.getElementById('selectPrioridad').value, 10);
    const descripcion_pedido = document.getElementById('txtDescripcion').value.trim();

    // Validar campos requeridos
    if (!id_articulo || !descripcion_pedido) {
        mostrarToast('Por favor completa todos los campos requeridos.', 'error');
        return;
    }

    try {
        // Paso 1: Petición HTTP POST al backend con el cuerpo JSON
        const response = await fetch(`${API_BASE_URL}/incidencias`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_articulo,
                creado_por: currentEmpleadoId,
                prioridad,
                descripcion_pedido
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.mensaje || errData.message || 'Error al crear la incidencia');
        }

        // Paso 2: Notificar éxito y limpiar formulario
        mostrarToast('¡Incidencia creada exitosamente!', 'exito');
        document.getElementById('formNuevaIncidencia').reset();

        // Paso 3: Recargar incidencias y alternar a la pestaña principal
        await cargarMisIncidencias();
        const tabBtn = document.getElementById('btn-mis-incidencias');
        if (tabBtn && window.bootstrap) {
            const tabTrigger = new bootstrap.Tab(tabBtn);
            tabTrigger.show();
        }

    } catch (error) {
        console.error('Error creando incidencia:', error);
        mostrarToast(`Error: ${error.message}`, 'error');
    }
}

/**
 * Envía una solicitud PUT para cancelar una incidencia propia en estado Pendiente.
 * @param {number} idIncidencia - ID de la incidencia a cancelar.
 * @returns {Promise<void>}
 */
async function cancelarIncidencia(idIncidencia) {
    if (!confirm(`¿Estás seguro de que deseas cancelar la incidencia #${idIncidencia}?`)) {
        return;
    }

    try {
        // Paso 1: Petición HTTP PUT para cancelar la incidencia
        const response = await fetch(`${API_BASE_URL}/incidencias/${idIncidencia}/cancelar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: currentEmpleadoId })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.mensaje || data.message || 'No se pudo cancelar la incidencia');
        }

        // Paso 2: Notificar éxito y refrescar la tabla
        mostrarToast(`Incidencia #${idIncidencia} cancelada correctamente.`, 'exito');
        await cargarMisIncidencias();

    } catch (error) {
        console.error('Error cancelando incidencia:', error);
        mostrarToast(`Error: ${error.message}`, 'error');
    }
}

/**
 * Función de utilidad para sanear cadenas de caracteres HTML y prevenir ataques XSS.
 * @param {string} str - Cadena de texto a procesar.
 * @returns {string} Cadena sanitizada.
 */
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
