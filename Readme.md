# System Accountant

Este es un proyecto de aplicación web full-stack que utiliza React para el frontend y Node.js con Express para el backend.

## Estructura del Proyecto

El proyecto está organizado como un monorepo con dos directorios principales:

-   `frontend-system-accountant/`: Contiene la aplicación de frontend desarrollada con React, Vite y TypeScript.
-   `backennd-system-accountant/`: Contiene el servidor de backend desarrollado con Node.js y Express.

## Tecnologías Utilizadas

-   **Frontend**:
    -   React
    -   Vite
    -   TypeScript
    -   ESLint
-   **Backend**:
    -   Node.js
    -   Express.js

## Desarrollo Local

Para ejecutar este proyecto en tu máquina local, sigue estos pasos.

### Prerrequisitos

-   [Node.js](https://nodejs.org/) (versión 20.x o superior recomendada)
-   [npm](https://www.npmjs.com/) (generalmente se instala con Node.js)

### 1. Configurar el Backend

```bash
# Navega al directorio del backend
cd backennd-system-accountant

# Instala las dependencias
npm install

# Inicia el servidor de desarrollo
npm start
```

El servidor backend se ejecutará en `http://localhost:3000`.

### 2. Configurar el Frontend

```bash
# Abre una nueva terminal y navega al directorio del frontend
cd frontend-system-accountant

# Instala las dependencias
npm install

# Inicia el servidor de desarrollo de Vite
npm run dev
```

La aplicación de frontend estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

## Despliegue

Este proyecto está configurado para un despliegue sencillo en [Render](https://render.com/) utilizando el archivo `render.yaml` incluido.

Para desplegar la aplicación:

1.  **Sube tu código**: Asegúrate de que todos tus cambios estén subidos a un repositorio de Git (GitHub, GitLab, etc.).
2.  **Crea un Blueprint en Render**:
    -   Ve a tu dashboard de Render.
    -   Haz clic en **New** > **Blueprint**.
    -   Conecta tu repositorio.
3.  **Despliega**: Render detectará y utilizará automáticamente el archivo `render.yaml` para configurar y desplegar los servicios del frontend y el backend.

El backend se desplegará como un servicio web y el frontend como un sitio estático.
