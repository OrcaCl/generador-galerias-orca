document.addEventListener('DOMContentLoaded', async () => {
    const contenedor = document.getElementById('contenedor-indice');

    try {
        const respuesta = await fetch('galerias/index.json');
        const galerias = await respuesta.json();

        galerias.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        galerias.forEach(galeria => {
            // Creamos un enlace que envuelve la tarjeta
            const enlace = document.createElement('a');
            enlace.href = `galeria.html?g=${galeria.slug}`;
            enlace.className = 'tarjeta-polaroid'; // Usamos la misma clase que en galeria.html

            enlace.innerHTML = `
                <img src="${galeria.portada}" class="foto-polaroid" alt="${galeria.titulo}">
                <div class="etiqueta-polaroid">
                    <strong>${galeria.titulo}</strong><br>
                    <small>${galeria.fecha} (${galeria.cantidad} fotos)</small>
                </div>
            `;

            contenedor.appendChild(enlace);
        });
    } catch (error) {
        console.error("Error cargando el índice:", error);
    }
});