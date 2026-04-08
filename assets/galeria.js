/**
 * orca.cl - galeria.js
 * Gestiona el listado (Grid) y el visor (Modal)
 */

// ==========================================
// 1. COMPONENTE VISOR (Lógica del Modal)
// ==========================================
const Visor = {
    indice: 0,
    lista: [],
    elementos: {},

    init() {
        this.elementos = {
            modal: document.getElementById('modal-visor'),
            img: document.getElementById('imagen-modal'),
            txt: document.getElementById('descripcion-modal')
        };
        this.configurarBotones();
    },

    configurarBotones() {
        document.getElementById('siguiente-foto').onclick = (e) => { e.stopPropagation(); this.navegar(1); };
        document.getElementById('anterior-foto').onclick = (e) => { e.stopPropagation(); this.navegar(-1); };
        document.getElementById('cerrar-modal').onclick = () => this.cerrar();
    },

    abrir(fotos, index) {
        this.lista = fotos;
        this.indice = index;
        this.elementos.modal.classList.add('mostrar');
        this.actualizar();
    },

    navegar(dir) {
        this.indice = (this.indice + dir + this.lista.length) % this.lista.length;
        this.actualizar();
    },

    actualizar() {
        const foto = this.lista[this.indice];
        this.elementos.img.src = foto.url;

        // Mostramos la descripción + el contador de posición
        const contador = `(${this.indice + 1} / ${this.lista.length})`;
        this.elementos.txt.innerText = `${foto.label} ${contador}`;
    },

    cerrar() { this.elementos.modal.classList.remove('mostrar'); }
};

// ==========================================
// 2. LÓGICA DE LA GALERÍA (Grid y Fetch)
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    Visor.init(); // Arrancamos el visor

    const contenedor = document.getElementById('contenedor-fotos');
    const btnMas = document.getElementById('boton-cargar-mas');

    let fotosTotales = [];
    let fotosMostradas = 0;
    const INCREMENTO = 15;

    const slug = new URLSearchParams(window.location.search).get('g');
    if (!slug) return window.location.href = 'index.html';

    async function cargarDatos() {
        try {
            const [rMeta, rFotos] = await Promise.all([
                fetch(`galerias/${slug}/metadata.json`),
                fetch(`galerias/${slug}/galeria.json`)
            ]);
            const meta = await rMeta.json();
            fotosTotales = await rFotos.json();

            // Llenar cabecera
            document.title = `${meta.titulo} | orca.cl`;
            document.getElementById('titulo-galeria').innerText = meta.titulo;
            document.getElementById('fecha-galeria').innerText = meta.fecha;
            document.getElementById('nombre-breadcrumb').innerText = meta.titulo;

            renderizar();
        } catch (e) { console.error("Error:", e); }
    }

    function renderizar() {
        const bloque = fotosTotales.slice(fotosMostradas, fotosMostradas + INCREMENTO);

        bloque.forEach(foto => {
            const art = document.createElement('article');
            art.className = 'tarjeta-polaroid';
            art.innerHTML = `
                <img src="${foto.url}" class="foto-polaroid" loading="lazy">
                <div class="etiqueta-polaroid">${foto.label}</div>`;

            art.onclick = () => Visor.abrir(fotosTotales, fotosTotales.indexOf(foto));
            contenedor.appendChild(art);
        });

        fotosMostradas += bloque.length;
        document.getElementById('contenedor-boton-mas').style.display =
            fotosMostradas < fotosTotales.length ? 'block' : 'none';
    }

    btnMas.onclick = renderizar;
    cargarDatos();

    // Atajos de teclado
    window.onkeydown = (e) => {
        if (!Visor.elementos.modal.classList.contains('mostrar')) return;
        if (e.key === "Escape") Visor.cerrar();
        if (e.key === "ArrowRight") Visor.navegar(1);
        if (e.key === "ArrowLeft") Visor.navegar(-1);
    };
});
