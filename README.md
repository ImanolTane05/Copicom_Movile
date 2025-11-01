# 🚀 Guía Rápida de Ejecución

Sigue estos tres pasos para levantar y correr la aplicación:

### 1. Instalación de Dependencias
Instala todas las librerías necesarias del proyecto:

npm install

### 2. Configuración de la Conexión (IP)

Es esencial configurar tu IP local para que el móvil se conecte al backend.

1. Enciende el backend (debe estar corriendo en el servidor web).
2. Obtén tu IP en la terminal (ej: ipconfig).
3. Configura la IP en el archivo: utils/constasn.js.

Nota: El proyecto usa el puerto 5000 por defecto. No lo cambies a menos que sea estrictamente necesario.

### 3. Correr el Proyecto

Inicia el proyecto móvil con Expo:

npx expo start
