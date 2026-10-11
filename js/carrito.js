
const carrito = document.querySelector("#carrito");
const listaInstrumentos = document.querySelector('#lista-libro');
const contenedorCarrito = document.querySelector("tbody");
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');

let articulosCarrito = [];

cargarEventListeners();
function cargarEventListeners() {
    listaInstrumentos.addEventListener('click', agregarInstrumento);
    carrito.addEventListener("click", eliminarInstrumento);
    document.addEventListener("DOMContentLoaded", () => {
        articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carritoHTML();
    });

    vaciarCarritoBtn.addEventListener("click", () => {
        articulosCarrito = []; // reseteamos el arreglo
        limpiarHTML();
        sincronizarStorage();
    });
}

function agregarInstrumento(e) {
    if (e.target.classList.contains("agregar-carrito")) {
        const instrumento = e.target.parentElement.parentElement;
        leerDatosInstrumento(instrumento);
    }
}

function eliminarInstrumento(e) {
    if (e.target.classList.contains("borrar-instrumento")) {
        const instrumentoId = e.target.getAttribute("data-id");
        articulosCarrito = articulosCarrito.filter(instrumento => instrumento.id !== instrumentoId);
        carritoHTML();
    }
}

function leerDatosInstrumento(instrumento) {
    const infoInstrumento = {
        imagen: instrumento.querySelector('img').src,
        titulo: instrumento.querySelector('h4').textContent,
        precio: parseFloat(instrumento.querySelector('.precio span').textContent.replace('$', '')),
        id: instrumento.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    };

    const existe = articulosCarrito.some(instrumentoSeleccionado => instrumentoSeleccionado.id === infoInstrumento.id);

    if (existe) {
        articulosCarrito = articulosCarrito.map(instrumentoSeleccionado => {
            if (instrumentoSeleccionado.id === infoInstrumento.id) {
                instrumentoSeleccionado.cantidad++;
                instrumentoSeleccionado.total = instrumentoSeleccionado.precio * instrumentoSeleccionado.cantidad;
                return instrumentoSeleccionado;
            } else {
                return instrumentoSeleccionado;
            }
        });
    } else {
        infoInstrumento.total = infoInstrumento.precio;
        articulosCarrito = [...articulosCarrito, infoInstrumento];
    }

    carritoHTML();
}

function carritoHTML() {
    limpiarHTML();

    articulosCarrito.forEach(instrumentoSeleccionado => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${instrumentoSeleccionado.imagen}" width="120"></td>
            <td>${instrumentoSeleccionado.titulo}</td>
            <td>$${instrumentoSeleccionado.precio}</td>
            <td>${instrumentoSeleccionado.cantidad}</td>
            <td>$${instrumentoSeleccionado.total}</td>
            <td>
                <a href="#" class="borrar-instrumento" data-id="${instrumentoSeleccionado.id}">borrar</a>
            </td>
        `;

        contenedorCarrito.appendChild(row);
    });

    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

function limpiarHTML() {
    contenedorCarrito.innerHTML = "";
}