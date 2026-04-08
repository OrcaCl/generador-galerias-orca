const fs = require('fs');
const path = require('path');

const CARPETA_GALERIAS = 'galerias';

/**
 * Lee el archivo .optignore y devuelve un array de strings
 */
function obtenerIgnoreList() {
    const rutaIgnore = './.optignore';
    if (!fs.existsSync(rutaIgnore)) return [];

    return fs.readFileSync(rutaIgnore, 'utf-8')
        .split('\n')
        .map(linea => linea.trim())
        .filter(linea => linea && !linea.startsWith('#'));
}

/**
 * Filtra las carpetas del directorio actual basado en:
 * 1. Que sea un directorio
 * 2. Que no empiece por . o _
 * 3. Que no esté en .optignore
 */
function obtenerCarpetasValidas() {
    const ignoreList = obtenerIgnoreList();
    const rutaGalerias = path.join(__dirname, CARPETA_GALERIAS);

    if (!fs.existsSync(rutaGalerias)) {
        console.error(`❌ Error: No existe la carpeta ${CARPETA_GALERIAS} en ${__dirname}`);
        return [];
    }

    return fs.readdirSync(rutaGalerias).filter(f => {
        const stats = fs.statSync(path.join(rutaGalerias, f));
        if (!stats.isDirectory()) return false;

        const empiezaConIgnorado = /^[._]/.test(f);
        const estaEnIgnoreList = ignoreList.includes(f);

        return !empiezaConIgnorado && !estaEnIgnoreList;
    });
}

module.exports = {
    obtenerCarpetasValidas,
    CARPETA_GALERIAS
};