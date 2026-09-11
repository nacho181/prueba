# Municipalidad de Concordia - Sistema de Registro de Incidencias

## Módulo 1: Panel de Empleados Municipales

Este repositorio contiene el **Módulo de Empleados Municipales** para el Trabajo Final Integrador de Programación. El sistema permite a los empleados de la Municipalidad de Concordia (Entre Ríos, Argentina) reportar fallas e incidencias técnicas en sus equipos de trabajo, dar seguimiento al estado de sus solicitudes y gestionar cancelaciones.

---

## 🚀 Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3 (Diseño responsivo con tema institucional verde), JavaScript nativo (Fetch API).
- **Backend:** Node.js, Express.js.
- **Base de Datos:** PostgreSQL (Soporta fallback local integrado para desarrollo/demostración).
- **Middlewares & Librerías:** `cors`, `dotenv`, `morgan`, `pg`.

---

## 📁 Estrategia y Estructura del Proyecto

```text
├── database/
│   ├── schema.sql      # Definición de tablas y relaciones según el diagrama ER
│   └── seed.sql        # Datos de prueba iniciales (áreas, categorías, artículos, usuarios y estados)
├── public/             # Interfaz Web Frontend
│   ├── index.html      # Estructura principal y navegación por pestañas
│   ├── css/styles.css  # Estilos responsivos en paleta verde corporativa
│   └── js/app.js       # Consumo de API REST e interactividad
├── src/
│   ├── config/db.js    # Conexión a base de datos PostgreSQL
│   ├── controllers/    # Lógica de negocio (empleadoController.js)
│   ├── routes/         # Definición de rutas REST (empleadoRoutes.js)
│   └── server.js       # Servidor Express
├── tests/              # Pruebas integradas
│   └── empleado.test.js
├── .env.example        # Ejemplo de variables de entorno
├── package.json
└── README.md
```

---

## ⚙️ Requisitos Previos

- **Node.js** v18 o superior.
- **npm** (incluido con Node.js).
- **PostgreSQL** (opcional para ejecución en producción, el sistema cuenta con fallback para pruebas inmediatas si no hay PostgreSQL activo).

---

## 🛠️ Instalación y Configuración

1. **Clonar el repositorio o extraer el archivo ZIP:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_PROYECTO>
   ```

2. **Instalar dependencias de Node.js:**
   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno (Opcional):**
   Crea un archivo `.env` en la raíz tomando como base `.env.example`:
   ```env
   PORT=3000
   PGHOST=localhost
   PGPORT=5432
   PGUSER=postgres
   PGPASSWORD=postgres
   PGDATABASE=incidencias_concordia
   ```

4. **Configurar la Base de Datos PostgreSQL:**
   Si dispones de PostgreSQL instalado y corriendo:
   ```bash
   psql -U postgres -d incidencias_concordia -f database/schema.sql
   psql -U postgres -d incidencias_concordia -f database/seed.sql
   ```

---

## 💻 Cómo Iniciar y Usar la Aplicación

1. **Iniciar el Servidor:**
   ```bash
   npm start
   ```
   O para desarrollo con recarga automática:
   ```bash
   npm run dev
   ```

2. **Acceder a la Aplicación:**
   Abre tu navegador web e ingresa a:
   [http://localhost:3000](http://localhost:3000)

3. **Funcionalidades Disponibles en el Panel de Empleados:**
   - **Simulación de Empleado Activo:** En el margen superior derecho de la cabecera puedes alternar entre distintos empleados municipales (ej: María González, Juan Pérez).
   - **Pestaña "Mis Incidencias":**
     - Muestra el listado de incidencias creadas por el empleado seleccionado con su fecha, artículo, descripción, prioridad y estado.
     - Permite **Cancelar** aquellas incidencias propias que se encuentren en estado **Pendiente**.
   - **Pestaña "Reportar Nueva Incidencia":**
     - Permite seleccionar un artículo o equipo municipal, asignar la prioridad (Baja, Media, Alta) y detallar el problema observado.
   - **Pestaña "Catálogo de Artículos":**
     - Muestra el listado de todos los equipos y elementos registrados por área y categoría, con opción de búsqueda rápida y botón directo para *"Reportar Falla"*.

---

## 🧪 Pruebas Automatizadas

Puedes ejecutar el conjunto de pruebas unitarias/de integración mediante:
```bash
node tests/empleado.test.js
```

---

## 📡 Endpoints de la API REST (`/api/v1`)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/v1/usuarios/empleados` | Obtiene el listado de empleados municipales |
| `GET` | `/api/v1/articulos` | Obtiene el catálogo de artículos activos |
| `GET` | `/api/v1/incidencias/mis-incidencias?id_usuario=1` | Obtiene las incidencias reportadas por un empleado |
| `POST` | `/api/v1/incidencias` | Crea una nueva incidencia técnica |
| `PUT` | `/api/v1/incidencias/:id/cancelar` | Cancela una incidencia propia en estado Pendiente |
| `GET` | `/api/v1/health` | Estado del servicio API |

---

## 📄 Créditos y Autores
- **Institución:** Municipalidad de Concordia - Entre Ríos.
- **Trabajo Practico Integrador de Programación.**
