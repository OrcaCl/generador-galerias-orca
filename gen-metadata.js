const fs = require('fs');
const path = require('path');
// Importamos la lógica centralizada
const { obtenerCarpetasValidas, CARPETA_GALERIAS } = require('./utils.js');

// 1. Obtener carpetas usando la lógica de utils (mirará en galerias/)
const carpetas = obtenerCarpetasValidas().sort();

// 2. Parsear argumentos (igual que antes)
const args = process.argv.slice(2);
const params = {};

args.forEach(arg => {
    const [key, value] = arg.split('=');
    if (key && value) {
        params[key.replace('--', '')] = value;
    }
});

const num = parseInt(params.galeria);
const tit = params.title;
const fec = params.fecha;

// 3. Mostrar ayuda si falta algo
if (!num || !tit || !fec) {
    console.log('\n--- LISTADO DE CARPETAS DISPONIBLES ---');
    if (carpetas.length === 0) {
        console.log(` ❌ No se encontraron carpetas en: ${CARPETA_GALERIAS}`);
    } else {
        carpetas.forEach((c, i) => console.log(` [${i + 1}] ${c}`));
    }
    console.log('\nUSO: node gen-metadata.js --galeria=N --title="X" --fecha="AAAA-MM-DD"');
    process.exit(0);
}

// 4. Crear el archivo en la ruta correcta
if (num > 0 && num <= carpetas.length) {
    const nombreCarpeta = carpetas[num - 1];

    // CONSTRUCCIÓN DE RUTA CORRECTA: galerias/nombre-carpeta/metadata.json
    const rutaCarpetaFisica = path.join(CARPETA_GALERIAS, nombreCarpeta);
    const rutaArchivo = path.join(rutaCarpetaFisica, 'metadata.json');

    const data = { titulo: tit, fecha: fec };

    if (fs.existsSync(rutaArchivo)) {
        console.log(`⚠️  Actualizando metadata existente en: ${nombreCarpeta}`);
    } else {
        console.log(`✨ Creando nueva metadata en: ${nombreCarpeta}`);
    }

    fs.writeFileSync(rutaArchivo, JSON.stringify(data, null, 2));
    console.log(`✅ Metadata guardada con éxito.\n`);
} else {
    console.log('\n❌ El número de galería no existe.\n');
}