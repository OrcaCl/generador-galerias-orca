const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { obtenerIgnoreList, obtenerCarpetas } = require('./utils');

const AUTOR = "Orlando / orca.cl";
const COPYRIGHT = "© 2026 orca.cl - Todos los derechos reservados.";

// Función para obtener la lista negra desde .optignore
function obtenerIgnoreList() {
    const rutaIgnore = './.optignore';
    if (!fs.existsSync(rutaIgnore)) return [];

    return fs.readFileSync(rutaIgnore, 'utf-8')
        .split('\n')
        .map(linea => linea.trim())
        .filter(linea => linea && !linea.startsWith('#')); // Ignora líneas vacías y comentarios
}

const ignoreList = obtenerIgnoreList();

// 1. Obtener carpetas con el filtro de .optignore
const carpetas = fs.readdirSync('./').filter(f => {
    const esCarpeta = fs.statSync(f).isDirectory();
    const esIgnoradaPorNombre = /^[._]/.test(f); // . o _
    const estaEnListaNegra = ignoreList.includes(f);

    return esCarpeta && !esIgnoradaPorNombre && !estaEnListaNegra;
});

//const carpetas = obtenerCarpetas();






async function procesar() {
    console.log(`🔍 Carpetas a procesar: ${carpetas.join(', ') || 'Ninguna'}`);

    for (const carpeta of carpetas) {
        const rutaCheck = path.join(carpeta, '.optimizado');

        if (fs.existsSync(rutaCheck)) {
            console.log(`⏩ Saltando "${carpeta}": ya está optimizada.`);
            continue;
        }

        console.log(`\n📸 Optimizando: ${carpeta}`);
        const archivos = fs.readdirSync(carpeta);
        const fotos = archivos.filter(f =>
            ['.jpg', '.jpeg', '.png'].includes(path.extname(f).toLowerCase())
        );

        for (const foto of fotos) {
            const rutaOriginal = path.join(carpeta, foto);
            const rutaTemporal = path.join(carpeta, `opt_${foto}`);

            try {
                await sharp(rutaOriginal)
                    .resize({
                        width: 1200,
                        height: 1200,
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                    .jpeg({
                        quality: 80,
                        mozjpeg: true,
                        progressive: true
                    })
                    .withMetadata({
                        exif: {
                            IFD0: {
                                Artist: AUTOR,
                                Copyright: COPYRIGHT,
                                ImageDescription: `Galeria orca.cl - ${carpeta}`
                            }
                        }
                    })
                    .toFile(rutaTemporal);

                //Evitar errores de conexión que me borren las fotos originales
                fs.unlinkSync(rutaOriginal);
                fs.renameSync(rutaTemporal, rutaOriginal);
                console.log(` ✅ ${foto} lista.`);
            } catch (err) {
                console.error(` ❌ Error en ${foto}:`, err);
            }
        }
        fs.writeFileSync(rutaCheck, `Optimizado el: ${new Date().toLocaleString()}`);
    }
    console.log("\n🚀 Proceso terminado con éxito.");
}

procesar();
