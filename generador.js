const fs = require('fs');
const path = require('path');
const { obtenerCarpetasValidas, CARPETA_GALERIAS } = require('./utils.js');


// Capturar argumentos para modo depuración
const args = process.argv.slice(2);
const isVerbose = args.includes('--verbose');

function log(msg) {
    if (isVerbose) console.log(`[DEBUG] ${msg}`);
}
exports.log = log;

log("Iniciando escaneo de directorios...");

//Buscar carpetas válidas no censuradas ni puntos ni _
const carpetas = obtenerCarpetasValidas();
log(`Se encontraron ${carpetas.length} carpetas válidas. (respetando .optignore)`);


const indiceGlobal = [];

carpetas.forEach((carpeta, index) => {
    log(`-------------------------------------------`);
    log(`Procesando [${index + 1}/${carpetas.length}]: ${carpeta}`);

    const rutaCarpeta = path.join(CARPETA_GALERIAS, carpeta);
    const rutaMeta = path.join(rutaCarpeta, 'metadata.json');
    let metaActual;

    //************************************** */
    // 2. Leer o Crear Metadata (Fuente de la verdad)
    if (fs.existsSync(rutaMeta)) {
        try {
            metaActual = JSON.parse(fs.readFileSync(rutaMeta, 'utf8'));
        } catch (e) {
            console.error(`[ERROR] JSON corrupto en ${carpeta}: ${e.message}`);
            metaActual = { titulo: carpeta, fecha: "0000-00-00" };
        }
    } else {
        log(`Creando metadata.json inicial para ${carpeta}...`);
        metaActual = {
            titulo: carpeta.replace(/[-_]/g, ' '),
            fecha: new Date().toISOString().split('T')[0]
        };
        fs.writeFileSync(rutaMeta, JSON.stringify(metaActual, null, 2));
    }

    //**************************************** */
    // 3. Escanear Fotos con ORDEN NATURAL (1, 2, 10...)
    const archivos = fs.readdirSync(rutaCarpeta);
    const fotos = archivos
        .filter(f => ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(f).toLowerCase()))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    log(`Fotos encontradas: ${fotos.length}`);


    //********************************************* */
    // 4. Crear/Actualizar galeria.json (Lista de archivos para el JS)
    const rutaJSONGaleria = path.join(rutaCarpeta, 'galeria.json');
    const listaFotos = fotos.map((f, i) => ({
        url: `${CARPETA_GALERIAS}/${carpeta}/${f}`,
        label: `Foto ${i + 1}`
    }));
    fs.writeFileSync(rutaJSONGaleria, JSON.stringify(listaFotos, null, 2));

    // 5. Alimentar el índice global
    indiceGlobal.push({
        slug: carpeta,
        titulo: metaActual.titulo,
        fecha: metaActual.fecha,
        portada: `${CARPETA_GALERIAS}/${carpeta}/${fotos[0] || ''}`, // Primera foto como portada
        cantidad: fotos.length
    });
});

// 6. Ordenar índice por fecha (descendente) y guardar
log(`Ordenando álbumes por fecha...`);
indiceGlobal.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

const rutaIndexGlobal = path.join(CARPETA_GALERIAS, 'index.json');
fs.writeFileSync(rutaIndexGlobal, JSON.stringify(indiceGlobal, null, 2));

console.log(`\n🚀 Proceso finalizado. Catálogo actualizado con ${indiceGlobal.length} galerías.`);
