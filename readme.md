# Orca Galería Sandbox 📸

Sistema modular de gestión de galerías fotográficas para `orca.cl`.
Este motor permite procesar imágenes localmente, generar metadatos automáticos
y servir una web estática optimizada.

## 🛠️ Estructura del Proyecto

- `/galerias`: Carpeta raíz para los eventos (excluida de Git, excepto los archivos .json).
- `generador.js`: Script que escanea carpetas y construye el índice global.
- `optimizar.js`: Script que procesa las imágenes usando Sharp.
- `gen-metadata.js`: Herramienta de CLI para editar títulos y fechas.
- `utils.js`: Funciones compartidas y configuración centralizada.

## 🚀 Flujo de Trabajo (Local)

1. **Añadir Fotos:**
   Crear subcarpeta en `galerias/` (ej: `galerias/boda-juan-y-paz`).

2. **Configurar Metadata (Opcional):**
   Si quieres personalizar el título o la fecha, ejecuta:

   node gen-metadata.js --galeria=N --title="Título Pro" --fecha="2026-04-08"

   (Ejecuta el script sin parámetros para ver el listado de carpetas).

3. **Generar Datos:**
   node generador.js

4. **Optimizar:**
   node optimizar.js

### Despliegue y Configuración

## 📤 Despliegue (VPS)

Este proyecto se despliega de forma **estática**. Para actualizar la web en producción, subir vía SFTP únicamente:

- `index.html` y `galeria.html`
- `index.js` y `galeria.js`
- `estilos.css`
- La carpeta `galerias/` completa (con fotos optimizadas y archivos .json).

> **IMPORTANTE:** No es necesario subir `node_modules` ni los scripts `.js` de generación al VPS.

## Archivos de Configuración

- `.optignore`: Carpetas que el optimizador debe ignorar.
- `.gitignore`: Configurado para respaldar código y JSONs, excluyendo fotos pesadas.

---

Mantenido por **Orca** - 2026
orca.cl
