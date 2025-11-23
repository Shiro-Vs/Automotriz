# 🚗 SAF Service - Sistema de Gestión Automotriz

Bienvenido a **SAF Service**, una aplicación web moderna diseñada para la gestión integral de un taller automotriz. Este proyecto permite administrar vehículos, clientes, empleados, asistencias y fichas técnicas de manera eficiente e intuitiva.

![Estado del Proyecto](https://img.shields.io/badge/Estado-Terminado-success)

> **Nota:** Este repositorio contiene el código fuente del **Frontend**.
>
> **Backend Repository:** Puedes encontrar el código del servidor y la base de datos en: [SAF Service Backend](https://github.com/Shiro-Vs/AutomotrizBackend.git)

## 📋 Características Principales

- **🔐 Autenticación y Seguridad:** Sistema de login seguro con gestión de sesiones mediante `AuthContext` y almacenamiento local. Roles diferenciados (Administrador, Mecánico).
- **🚘 Gestión de Vehículos:** Registro, edición, eliminación y filtrado avanzado de vehículos.
- **👥 Gestión de Clientes y Empleados:** Administración completa de la base de datos de personas.
- **📅 Control de Asistencias:** Registro de entradas y salidas del personal.
- **📝 Fichas Técnicas:** Creación y consulta de historiales de servicio.
- **📊 Dashboard:** Panel principal con accesos rápidos y métricas.

## 🛠️ Tecnologías Utilizadas

Este proyecto ha sido construido utilizando las mejores prácticas y herramientas modernas del ecosistema React:

- **Frontend Core:** [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- **Enrutamiento:** [React Router v7](https://reactrouter.com/) (Data Routers)
- **Estado Global:** React Context API (`AuthContext`)
- **Comunicación API:** [Axios](https://axios-http.com/) con interceptores y servicios centralizados.
- **Estilos:** CSS Modules y CSS3 moderno con variables.
- **Iconos:** [React Icons](https://react-icons.github.io/react-icons/)

## 🏗️ Arquitectura del Proyecto

El código sigue una arquitectura limpia y escalable, separando responsabilidades para facilitar el mantenimiento:

```
src/
├── api/            # Configuración de Axios e interceptores
├── Components/     # Componentes UI reutilizables (Modales, Tablas, Inputs)
├── context/        # Estado global (AuthContext)
├── hooks/          # Custom Hooks (Lógica de negocio separada de la UI)
├── Pages/          # Vistas principales de la aplicación
├── Routes/         # Configuración de rutas (React Router)
├── services/       # Comunicación con el Backend (API calls)
├── Styles/         # Archivos CSS y CSS Modules
└── types/          # Definiciones de tipos TypeScript compartidas
```

## 🚀 Instalación y Uso

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

1.  **Clonar el repositorio:**

    ```bash
    git clone https://github.com/Shiro-Vs/Automotriz.git
    cd Automotriz
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y define la URL de tu API (Backend):

    ```env
    VITE_API_URL=http://localhost:8080/api
    ```

4.  **Ejecutar en desarrollo:**

    ```bash
    npm run dev
    ```

5.  **Construir para producción:**
    ```bash
    npm run build
    ```

## 👥 Colaboradores

Este proyecto fue desarrollado en equipo por:

- [**Shiro-Vs**](https://github.com/Shiro-Vs) - _Desarrollador_
- [**jhony-abz**](https://github.com/jhony-abz) - _Desarrollador_
- [**JAZE30**](https://github.com/JAZE30) - _Desarrollador_

---

_Este proyecto fue desarrollado como parte de un trabajo universitario, implementando estándares profesionales de desarrollo web._
