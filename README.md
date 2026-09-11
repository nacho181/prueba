# 🏛️ Municipalidad de Concordia — Sistema de Registro de Incidencias

Este repositorio contiene la solución para el **Trabajo Final Integrador de Programación**, desarrollado específicamente para la **Municipalidad de Concordia (Entre Ríos, Argentina)**.

El proyecto consiste en una aplicación web integral disponible en la intranet del municipio que permite gestionar, reportar y hacer seguimiento de incidencias técnicas en el equipamiento informático e infraestructura de la institución.

---

## 📋 1. Descripción General del Sistema

El sistema fue diseñado bajo una arquitectura cliente-servidor (**API REST**) dividida en capas, cumpliendo con los estándares de diseño web responsivo, seguridad y trazabilidad.

### 🎭 Roles y Módulos del Sistema
1. **Empleados Municipales (Módulo Implementado):**
   - **Listar artículos/equipos:** Ver la lista de equipamientos activos por área y categoría.
   - **Reportar una incidencia:** Crear un nuevo ticket de fallas para un artículo específico, asignando un nivel de prioridad y una descripción detallada.
   - **Listar incidencias propias:** Consultar el historial de incidencias creadas por el empleado y visualizar su estado en tiempo real (Pendiente, En Proceso, Finalizada, Cancelada).
   - **Cancelar incidencia propia:** Permitido únicamente para incidencias que se encuentren en estado *"Pendiente"*.

2. **Empleado de Sistemas (Módulos Futuros):**
   - Listar incidencias asignadas a su cargo.
   - Finalizar incidencias ingresando la descripción de resolución.
   - Gestión BREAD (Browse, Read, Edit, Add, Delete) de Categorías y Artículos.

3. **Director de Sistemas (Módulos Futuros):**
   - Dashboard con indicadores y estadísticas por estado, fecha y prioridad.
   - Asignar incidencias a los empleados del área de Sistemas.
   - Generación de reportes en PDF y notificaciones.

---

## 🏗️ 2. Estructura del Código y Archivos Clave

```text
├── database/
│   ├── schema.sql           # Estructura de tablas PostgreSQL (areas, categorias, articulos, usuarios, estados, incidencias, incidencias_estados)
│   └── seed.sql             # Datos iniciales de prueba para la Municipalidad de Concordia
├── public/                  # FRONTEND (Cliente Web)
│   ├── index.html           # Interfaz de usuario (HTML5)
│   ├── css/styles.css       # Estilos responsivos con paleta en verde municipal (CSS3)
│   └── js/app.js            # Lógica cliente y consumo de API REST en JS nativo
├── src/                     # BACKEND (Servidor Node.js + Express)
│   ├── config/
│   │   └── db.js            # Conexión a la base de datos PostgreSQL mediante el módulo 'pg'
│   ├── controllers/
│   │   └── empleadoController.js # Lógica de negocio de incidencias y artículos
│   ├── routes/
│   │   └── empleadoRoutes.js     # Endpoints REST (/api/v1/...)
│   └── server.js            # Archivo PRINCIPAL del servidor Express
├── tests/
│   └── empleado.test.js     # Pruebas integradas de API REST
├── .env                     # Archivo de configuración de variables de entorno
├── .env.example             # Ejemplo de variables de entorno
├── package.json             # Dependencias del proyecto
└── README.md                # Este archivo de instrucciones
```

---

## 🛢️ 3. Cómo Conectar la Base de Datos PostgreSQL con el Código

La conexión entre el servidor Node.js/Express y PostgreSQL se realiza mediante el cliente nativo de Node `pg` (`Pool`).

### Paso A: Crear la Base de Datos en PostgreSQL
Abre tu consola de PostgreSQL (`psql` o PgAdmin) y crea la base de datos:
```sql
CREATE DATABASE incidencias_concordia;
```

### Paso B: Ejecutar los Scripts SQL
Ejecuta los dos archivos contenidos en la carpeta `database/` para crear las tablas e insertar los datos iniciales de prueba:

1. **Crear las Tablas:**
   ```bash
   psql -U postgres -d incidencias_concordia -f database/schema.sql
   ```
2. **Cargar Datos de Prueba (Sembrado/Seed):**
   ```bash
   psql -U postgres -d incidencias_concordia -f database/seed.sql
   ```

### Paso C: Configurar las Credenciales en el Código (`.env`)
El código lee las credenciales del archivo `.env` mediante la librería `dotenv` en el archivo `src/config/db.js`.

Crea un archivo llamado `.env` en la raíz del proyecto (o edita el existente) con tus credenciales locales de PostgreSQL:

```env
PORT=3000
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=tu_contraseña_aqui
PGDATABASE=incidencias_concordia
```

> 💡 **Nota de Resiliencia:** Si la base de datos PostgreSQL no se encuentra ejecutándose al momento de iniciar el servidor, el sistema activará automáticamente un **modo de simulación en memoria** con los mismos datos iniciales, permitiendo probar la interfaz y los endpoints sin bloquear la ejecución.

---

## 🚀 4. Qué Archivos Ejecutar y Cómo Iniciar el Sistema

### 1. Instalación de Dependencias
Abre una terminal en la carpeta raíz del proyecto y ejecuta:
```bash
npm install
```

### 2. Archivo a Ejecutar para Iniciar el Servidor
El archivo principal de la aplicación es **`src/server.js`**. Puedes ejecutarlo de cualquiera de las siguientes formas:

- **Opción Estándar:**
  ```bash
  npm start
  ```
  *(Internamente ejecuta `node src/server.js`)*

- **Opción Modo Desarrollo (Recarga Automática):**
  ```bash
  npm run dev
  ```

En la consola verás un mensaje indicando que el servidor está activo:
```text
Servidor corriendo en el puerto 3000
Accede a la interfaz web en http://localhost:3000
```

### 3. Abrir la Aplicación Web en el Navegador
Una vez iniciado el servidor, abre tu navegador (Chrome, Firefox, Edge, etc.) e ingresa a:
👉 **`http://localhost:3000`**

### 4. Ejecución de Pruebas Automáticas (Opcional)
Para verificar que todos los endpoints de la API funcionen correctamente, ejecuta en otra terminal:
```bash
node tests/empleado.test.js
```

---

## 📖 5. Guía de Uso del Panel de Empleados Municipales

Una vez cargada la página web en `http://localhost:3000`:

1. **Selector de Empleado (Simulación de Sesión):**
   En la esquina superior derecha del encabezado, verás un desplegable con el **"Empleado activo"** (ej: *María González*, *Juan Pérez*). Puedes cambiar de empleado para ver cómo cambian automáticamente sus incidencias asignadas.

2. **Sección "Mis Incidencias":**
   - Muestra la tabla con las incidencias reportadas por el empleado activo.
   - Cada fila incluye la fecha, artículo, descripción, etiqueta de prioridad (Alta, Media, Baja) y estado (Pendiente, Cancelada, etc.).
   - Si una incidencia tiene el estado **"Pendiente"**, aparecerá el botón rojo **"Cancelar"**. Al presionar este botón, el estado cambiará inmediatamente a "Cancelada".

3. **Sección "Reportar Nueva Incidencia":**
   - Haz clic en la pestaña *"Reportar Nueva Incidencia"*.
   - Selecciona el artículo o equipo que presenta la falla.
   - Selecciona el nivel de prioridad.
   - Escribe una descripción detallada del problema y presiona **"Enviar Incidencia"**.
   - El sistema registrará el ticket en estado "Pendiente" y te redirigirá a la tabla de mis incidencias.

4. **Sección "Catálogo de Artículos":**
   - Muestra tarjetas con los equipos registrados en la Municipalidad por categoría y área.
   - Puedes usar el campo de búsqueda en tiempo real.
   - Cada artículo cuenta con un botón *"Reportar Falla"* que te lleva directamente al formulario con ese artículo preseleccionado.

---

## 🛰️ 6. Resumen de Endpoints de la API REST

| Método | Endpoint | Parámetros / Body | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/usuarios/empleados` | Ninguno | Devuelve la lista de empleados municipales activos |
| `GET` | `/api/v1/articulos` | Ninguno | Devuelve el catálogo de artículos registrados |
| `GET` | `/api/v1/incidencias/mis-incidencias` | `?id_usuario=1` | Devuelve las incidencias creadas por el empleado |
| `POST` | `/api/v1/incidencias` | `{ id_articulo, creado_por, prioridad, descripcion_pedido }` | Crea una nueva incidencia técnica |
| `PUT` | `/api/v1/incidencias/:id/cancelar` | `{ id_usuario }` | Cancela una incidencia propia en estado Pendiente |
| `GET` | `/api/v1/health` | Ninguno | Estado de salud del servidor y la API |

---

## 👥 Datos para la Entrega Académica
- **Trabajo Final Integrador — Programación**
- **Institución:** Municipalidad de Concordia - Entre Ríos.
