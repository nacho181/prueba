const API_BASE_URL = '/api/v1';

// Global State
let currentUsuarioId = 1;
let empleados = [];
let articulos = [];
let incidencias = [];

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    setupEventListeners();
    await cargarEmpleados();
    await cargarArticulos();
    await cargarMisIncidencias();
}

function setupEventListeners() {
    // Navigation Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetTab = btn.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // Employee Switcher
    const selectEmpleado = document.getElementById('selectEmpleado');
    selectEmpleado.addEventListener('change', (e) => {
        currentUsuarioId = parseInt(e.target.value);
        cargarMisIncidencias();
        showToast('Empleado activo actualizado', 'success');
    });

    // Refresh Button
    document.getElementById('btnRefreshIncidencias').addEventListener('click', () => {
        cargarMisIncidencias();
        showToast('Incidencias actualizadas', 'success');
    });

    // Create Incident Form
    const formNuevaIncidencia = document.getElementById('formNuevaIncidencia');
    formNuevaIncidencia.addEventListener('submit', handleCrearIncidencia);

    // Search Articles
    const searchArticulos = document.getElementById('searchArticulos');
    searchArticulos.addEventListener('input', (e) => {
        filtrarArticulos(e.target.value);
    });
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === tabId);
    });
}

// 1. Fetch Employees
async function cargarEmpleados() {
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios/empleados`);
        const result = await response.json();

        if (result.status === 'success') {
            empleados = result.data;
            const selectEmpleado = document.getElementById('selectEmpleado');
            selectEmpleado.innerHTML = '';

            empleados.forEach(emp => {
                const option = document.createElement('option');
                option.value = emp.id_usuario;
                option.textContent = `${emp.nombres} ${emp.apellidos} (${emp.area_nombre || 'Empleado Municipal'})`;
                selectEmpleado.appendChild(option);
            });

            if (empleados.length > 0) {
                currentUsuarioId = empleados[0].id_usuario;
            }
        }
    } catch (error) {
        showToast('Error al cargar la lista de empleados', 'error');
    }
}

// 2. Fetch Articles
async function cargarArticulos() {
    try {
        const response = await fetch(`${API_BASE_URL}/articulos`);
        const result = await response.json();

        if (result.status === 'success') {
            articulos = result.data;
            renderArticulosSelect(articulos);
            renderArticulosGrid(articulos);
        }
    } catch (error) {
        showToast('Error al cargar el catálogo de artículos', 'error');
    }
}

function renderArticulosSelect(lista) {
    const selectArticulo = document.getElementById('selectArticulo');
    selectArticulo.innerHTML = '<option value="">-- Seleccionar Artículo --</option>';

    lista.forEach(art => {
        const option = document.createElement('option');
        option.value = art.id_articulo;
        option.textContent = `${art.descripcion} - [${art.categoria_nombre || 'Gral'} / ${art.area_nombre || 'Gral'}]`;
        selectArticulo.appendChild(option);
    });
}

function renderArticulosGrid(lista) {
    const gridContainer = document.getElementById('gridArticulos');
    gridContainer.innerHTML = '';

    if (lista.length === 0) {
        gridContainer.innerHTML = '<div class="text-muted text-center" style="grid-column: 1/-1;">No se encontraron artículos.</div>';
        return;
    }

    lista.forEach(art => {
        const card = document.createElement('div');
        card.className = 'article-card';
        card.innerHTML = `
            <div>
                <h4>${escapeHtml(art.descripcion)}</h4>
                <div class="article-meta">
                    <strong>Categoría:</strong> ${escapeHtml(art.categoria_nombre || 'N/A')}<br>
                    <strong>Área:</strong> ${escapeHtml(art.area_nombre || 'N/A')}
                </div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="seleccionarArticuloParaReporte(${art.id_articulo})">
                Reportar Falla
            </button>
        `;
        gridContainer.appendChild(card);
    });
}

function filtrarArticulos(query) {
    const q = query.toLowerCase();
    const filtrados = articulos.filter(art =>
        art.descripcion.toLowerCase().includes(q) ||
        (art.categoria_nombre && art.categoria_nombre.toLowerCase().includes(q)) ||
        (art.area_nombre && art.area_nombre.toLowerCase().includes(q))
    );
    renderArticulosGrid(filtrados);
}

function seleccionarArticuloParaReporte(idArticulo) {
    switchTab('tab-nueva-incidencia');
    const selectArticulo = document.getElementById('selectArticulo');
    selectArticulo.value = idArticulo;
}

// 3. Fetch Incidents
async function cargarMisIncidencias() {
    const tbody = document.getElementById('tbodyIncidencias');
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Cargando incidencias...</td></tr>';

    try {
        const response = await fetch(`${API_BASE_URL}/incidencias/mis-incidencias?id_usuario=${currentUsuarioId}`);
        const result = await response.json();

        if (result.status === 'success') {
            incidencias = result.data;
            renderIncidenciasTabla(incidencias);
        }
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Error al obtener las incidencias.</td></tr>';
        showToast('Error al obtener las incidencias', 'error');
    }
}

function renderIncidenciasTabla(lista) {
    const tbody = document.getElementById('tbodyIncidencias');
    tbody.innerHTML = '';

    if (lista.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No tienes incidencias registradas.</td></tr>';
        return;
    }

    lista.forEach(inc => {
        const tr = document.createElement('tr');

        const fechaFormateada = new Date(inc.creado).toLocaleDateString('es-AR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        // Priority Badge
        let prioBadge = '<span class="badge badge-prio-2">Media</span>';
        if (inc.prioridad === 1) prioBadge = '<span class="badge badge-prio-1">Alta</span>';
        if (inc.prioridad === 3) prioBadge = '<span class="badge badge-prio-3">Baja</span>';

        // Status Badge
        const estadoNombre = inc.estado_nombre || getEstadoNombre(inc.id_estado);
        let estadoBadge = `<span class="badge badge-pendiente">${estadoNombre}</span>`;
        if (inc.id_estado === 2) estadoBadge = `<span class="badge badge-proceso">${estadoNombre}</span>`;
        if (inc.id_estado === 3) estadoBadge = `<span class="badge badge-finalizada">${estadoNombre}</span>`;
        if (inc.id_estado === 4) estadoBadge = `<span class="badge badge-cancelada">${estadoNombre}</span>`;

        // Action Button
        let accionesHtml = '<span class="text-muted">-</span>';
        if (inc.id_estado === 1) { // Only allow cancel if 'Pendiente'
            accionesHtml = `
                <button class="btn btn-danger" onclick="cancelarIncidencia(${inc.id_incidencia})">
                    Cancelar
                </button>
            `;
        }

        tr.innerHTML = `
            <td><strong>#${inc.id_incidencia}</strong></td>
            <td>${fechaFormateada}</td>
            <td>${escapeHtml(inc.articulo_nombre || 'Artículo #' + inc.id_articulo)}</td>
            <td>${escapeHtml(inc.descripcion_pedido)}</td>
            <td>${prioBadge}</td>
            <td>${estadoBadge}</td>
            <td>${accionesHtml}</td>
        `;

        tbody.appendChild(tr);
    });
}

function getEstadoNombre(idEstado) {
    switch (idEstado) {
        case 1: return 'Pendiente';
        case 2: return 'En Proceso';
        case 3: return 'Finalizada';
        case 4: return 'Cancelada';
        default: return 'Desconocido';
    }
}

// 4. Create Incident
async function handleCrearIncidencia(e) {
    e.preventDefault();

    const id_articulo = document.getElementById('selectArticulo').value;
    const prioridad = document.getElementById('selectPrioridad').value;
    const descripcion_pedido = document.getElementById('txtDescripcion').value.trim();

    if (!id_articulo || !descripcion_pedido) {
        showToast('Por favor completa todos los campos requeridos', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/incidencias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_articulo: parseInt(id_articulo),
                creado_por: currentUsuarioId,
                prioridad: parseInt(prioridad),
                descripcion_pedido
            })
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
            showToast('Incidencia registrada con éxito', 'success');
            document.getElementById('formNuevaIncidencia').reset();
            await cargarMisIncidencias();
            switchTab('tab-mis-incidencias');
        } else {
            showToast(result.message || 'Error al crear la incidencia', 'error');
        }
    } catch (error) {
        showToast('Error de conexión al servidor', 'error');
    }
}

// 5. Cancel Pending Incident
async function cancelarIncidencia(idIncidencia) {
    if (!confirm(`¿Está seguro de que desea cancelar la incidencia #${idIncidencia}?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/incidencias/${idIncidencia}/cancelar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_usuario: currentUsuarioId
            })
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
            showToast(`Incidencia #${idIncidencia} cancelada exitosamente`, 'success');
            await cargarMisIncidencias();
        } else {
            showToast(result.message || 'No se pudo cancelar la incidencia', 'error');
        }
    } catch (error) {
        showToast('Error de conexión al servidor', 'error');
    }
}

// Helper Functions
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3500);
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
