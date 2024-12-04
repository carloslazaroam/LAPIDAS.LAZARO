function changeStone(stone) {
    document.getElementById('stone').src = stone;
}

function openTab(event, tabName) {
    // Verificar si se intenta abrir la pestaña "Diseño" sin haber elegido un material
    if (tabName === 'Diseño' && !document.getElementById('stone-preview').src) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Por favor, selecciona un material antes de acceder al diseño.",
            
        });
        return; // Evitar abrir la pestaña
    }

    // Ocultar todas las pestañas
    var tabPanels = document.getElementsByClassName('tab-panel');
    for (var i = 0; i < tabPanels.length; i++) {
        tabPanels[i].style.display = 'none';
    }

    // Quitar la clase "active" de todos los botones
    var tabButtons = document.getElementsByClassName('tab-button');
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }

    // Mostrar la pestaña seleccionada
    document.getElementById(tabName).style.display = 'block';
    event.currentTarget.classList.add('active');
}


document.addEventListener('DOMContentLoaded', function() {
    // Activar la pestaña "Material" por defecto
    document.getElementById('Material').style.display = 'block';
    document.querySelector('.tab-button').classList.add('active');

    // Seleccionar el primer material por defecto
    const firstMaterial = document.querySelector('.stone-thumbnails img');
    if (firstMaterial) {
        changeStone(firstMaterial.src); // Esto cambiará la imagen de la previsualización
    }

    // Seleccionar los diseños de "Cruces" por defecto en la pestaña "Diseño"
    const crossButton = document.querySelector('.design-button:first-child'); // Suponiendo que el botón de cruces es el primero
    if (crossButton) {
        crossButton.click(); // Simula un clic en el botón de "Cruces" para cargar esos diseños por defecto
    }
});


function changeStone(stonePath) {
    // Cambiar la imagen de la previsualización
    document.getElementById('stone').src = stonePath;
    document.getElementById('stone-preview').src = stonePath;
}


// Variables globales para manejar la interacción
let selectedElement = null;
let offsetX = 0, offsetY = 0;
let isResizing = false;

const MAX_DESIGNS = 3;

function addDesignToPreview(imageSrc) {

    const designCount = document.querySelectorAll('.design-element').length;

    // Verificar si el número de diseños excede el máximo permitido
    if (designCount >= MAX_DESIGNS) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Solo se puede agregar un máximo de 3 diseños."
        });
        return; // Evitar añadir más diseños
    }
    const img = document.createElement("div");
    img.classList.add("design-element");
    
    const image = document.createElement("img");
    image.src = imageSrc;
    image.style.width = "100%";
    image.style.height = "100%";
    img.appendChild(image);
    
    img.style.position = "absolute";
    img.style.left = "100px";
    img.style.top = "100px";
    img.style.width = "100px"; 
    img.style.cursor = "move";

    // Añadir eventos de manipulación
    img.addEventListener('mousedown', startDrag);
    img.addEventListener('click', (e) => {
        e.stopPropagation();  // Evitar que otros clics afecten
        showHandles(img);  // Mostrar el nodo al hacer clic en la imagen
    });

    // Añadir el diseño al área de previsualización
    document.querySelector('#Diseño #preview-area').appendChild(img);
    showHandles(img); // Mostrar el nodo al añadir la imagen
}


// Función para mostrar el nodo de redimensionamiento
function showHandles(element) {
    // Eliminar cualquier nodo existente
    document.querySelectorAll('.resize-handle').forEach(handle => handle.remove());

    // Crear el único nodo de redimensionamiento (esquina inferior derecha)
    const handle = document.createElement('div');
    handle.classList.add('resize-handle', 'bottom-right');
    handle.style.position = 'absolute';
    handle.style.width = '10px';
    handle.style.height = '10px';
    handle.style.background = 'blue';
    handle.style.cursor = 'nwse-resize';
    handle.style.right = '-5px';
    handle.style.bottom = '-5px';

    // Añadir evento para redimensionar
    handle.addEventListener('mousedown', startResize);
    element.appendChild(handle);

    // Agregar el botón para eliminar el diseño
    addDeleteButton(element);
}

// Ocultar los nodos cuando se deselecciona la imagen
document.addEventListener('click', (e) => {
    // Eliminar nodos si se hace clic fuera de un elemento seleccionado
    if (!e.target.closest('.design-element')) {
        document.querySelectorAll('.resize-handle').forEach(handle => handle.remove());
        document.querySelectorAll('.delete-button').forEach(btn => btn.remove());
    }
});

// Iniciar el arrastre
function startDrag(e) {
    selectedElement = e.target.closest('.design-element');
    offsetX = e.clientX - selectedElement.offsetLeft;
    offsetY = e.clientY - selectedElement.offsetTop;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
}

// Función para mover el diseño
function drag(e) {
    if (!isResizing && selectedElement) {
        selectedElement.style.left = (e.clientX - offsetX) + 'px';
        selectedElement.style.top = (e.clientY - offsetY) + 'px';
    }
}

// Detener el arrastre
function stopDrag() {
    document.removeEventListener('mousemove', drag);
    selectedElement = null;
}

// Iniciar la redimensión
function startResize(e) {
    e.preventDefault();
    e.stopPropagation();  // Para evitar que el evento clic cause otros problemas
    isResizing = true;
    selectedElement = e.target.closest('.design-element');
    document.addEventListener('mousemove', resizeElement);
    document.addEventListener('mouseup', stopResize);
}

function resizeElement(e) {
    if (isResizing && selectedElement) {
        const rect = selectedElement.getBoundingClientRect();
        selectedElement.style.width = (e.clientX - rect.left) + 'px';
        selectedElement.style.height = (e.clientY - rect.top) + 'px';
    }
}

// Detener la redimensión
function stopResize() {
    document.removeEventListener('mousemove', resizeElement);
    isResizing = false;
}

// Función para agregar el botón de eliminar al diseño
function addDeleteButton(element) {
    // Eliminar cualquier botón de eliminación existente
    document.querySelectorAll('.delete-button').forEach(btn => btn.remove());

    const deleteBtn = document.createElement('div');
    deleteBtn.classList.add('delete-button');
    deleteBtn.innerText = 'X';
    deleteBtn.style.position = 'absolute';
    deleteBtn.style.top = '-10px';
    deleteBtn.style.right = '-10px';
    deleteBtn.style.width = '20px';
    deleteBtn.style.height = '20px';
    deleteBtn.style.background = 'red';
    deleteBtn.style.color = 'white';
    deleteBtn.style.textAlign = 'center';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.borderRadius = '50%';

    // Eliminar el elemento al hacer clic en el botón de eliminación
    deleteBtn.addEventListener('click', () => {
        element.remove();
        loadPreviousDesignAndMaterial();
    });

    element.appendChild(deleteBtn);
}

// Eliminar el diseño con la tecla 'Suprimir' (Delete)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' && selectedElement) {
        selectedElement.remove();
        selectedElement = null;
    }
});

// Añadir el diseño al hacer clic en una miniatura de diseño
document.querySelectorAll('.thumbnail-design img').forEach(img => {
    img.addEventListener('click', function() {
        addDesignToPreview(this.src);
    });
});


function filterDesigns(category) {
    // Obtener todas las miniaturas de diseño
    const thumbnails = document.querySelectorAll('.thumbnail-design');
    
    thumbnails.forEach(thumbnail => {
        // Mostrar u ocultar dependiendo de la categoría seleccionada
        if (thumbnail.getAttribute('data-category') === category) {
            thumbnail.style.display = 'block'; // Mostrar
        } else {
            thumbnail.style.display = 'none'; // Ocultar
        }
    });
}
function loadPreviousDesignAndMaterial() {
    // Cargar la piedra seleccionada previamente
    const stonePreview = document.getElementById('stone-preview').src;
    document.getElementById('stone-preview-text').src = stonePreview;

    // Limpiar el contenedor antes de cargar los nuevos diseños
    const designPreviewTextContainer = document.getElementById('designs-preview-text');
    designPreviewTextContainer.innerHTML = '';

    // Cargar los diseños actuales
    const designs = document.querySelectorAll('.design-element');

    designs.forEach(design => {
        const newDesign = design.cloneNode(true); // Clonar el diseño
        designPreviewTextContainer.appendChild(newDesign); // Añadir el diseño clonado
    });
}

// Asegúrate de llamar a esta función al abrir la pestaña "Texto"
document.querySelector('.tab-button[onclick*="Texto"]').addEventListener('click', loadPreviousDesignAndMaterial);

document.addEventListener("DOMContentLoaded", function () {
    const nombreInput = document.getElementById("nombre");
    const apellidoInput = document.getElementById("apellido");
    const fechaInput = document.getElementById("fecha");
    const fraseInput = document.getElementById("frase");
    const mensajeInput = document.getElementById("texto-personalizado");
    const btnAgregarTexto = document.getElementById("btn-agregar-texto");

    const btnIncreaseFont = document.getElementById("btn-increase-font");
    const btnDecreaseFont = document.getElementById("btn-decrease-font");

    const colorPicker = document.getElementById("color-picker");
    colorPicker.value = "#ffffff"; // Color blanco por defecto
    const fontStyleSelector = document.getElementById("font-style");
    const fontFamilySelector = document.getElementById("font-family");

    const previewNombre = document.getElementById("preview-nombre");
    const previewApellido = document.getElementById("preview-apellido");
    const previewFecha = document.getElementById("preview-fecha");
    const previewFrase = document.getElementById("preview-frase");
    const previewArea = document.getElementById("preview-area-text");

    let selectedTextElement = null;
    const minFontSize = 10; // Tamaño mínimo de fuente en px
    const maxFontSize = 60; // Tamaño máximo de fuente en px

    // Actualizar la previsualización
    function updatePreview() {
        previewNombre.textContent = nombreInput.value;
        previewApellido.textContent = apellidoInput.value;
        previewFecha.textContent = fechaInput.value;
        previewFrase.textContent = fraseInput.value;
    }

    // Inicializar los textos
    nombreInput.addEventListener("input", updatePreview);
    apellidoInput.addEventListener("input", updatePreview);
    fechaInput.addEventListener("input", updatePreview);
    fraseInput.addEventListener("input", updatePreview);
    updatePreview();

    // Hacer movibles y eliminables los elementos de texto
    [previewNombre, previewApellido, previewFecha, previewFrase].forEach(textElement => {
        makeTextMovableAndDeletable(textElement);
    });

    function makeTextMovableAndDeletable(textElement) {
        textElement.style.position = 'absolute';
        textElement.style.cursor = 'move';
        textElement.addEventListener('mousedown', startDragText);
        textElement.addEventListener('click', (e) => {
            e.stopPropagation();
            showDeleteButton(textElement);
            selectedTextElement = textElement;
        });
    }

    function showDeleteButton(element) {
        const deleteButton = document.createElement('div');
        deleteButton.classList.add('delete-button');
        deleteButton.style.position = 'absolute';
        deleteButton.style.right = '10px';
        deleteButton.style.top = '-10px';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.color = 'red';

        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            element.remove();
        });

        element.appendChild(deleteButton);
    }

    // Funciones de arrastre
    function startDragText(e) {
        if (!e.target.classList.contains('resize-handle-text')) {
            selectedTextElement = e.target;
            const offsetX = e.clientX - selectedTextElement.offsetLeft;
            const offsetY = e.clientY - selectedTextElement.offsetTop;

            function dragText(e) {
                if (selectedTextElement) {
                    const newLeft = e.clientX - offsetX;
                    const newTop = e.clientY - offsetY;

                    // Limitar dentro del contenedor
                    const maxLeft = previewArea.clientWidth - selectedTextElement.offsetWidth;
                    const maxTop = previewArea.clientHeight - selectedTextElement.offsetHeight;

                    selectedTextElement.style.left = Math.min(Math.max(0, newLeft), maxLeft) + 'px';
                    selectedTextElement.style.top = Math.min(Math.max(0, newTop), maxTop) + 'px';
                }
            }

            function stopDragText() {
                document.removeEventListener('mousemove', dragText);
                document.removeEventListener('mouseup', stopDragText);
            }

            document.addEventListener('mousemove', dragText);
            document.addEventListener('mouseup', stopDragText);
        }
    }

    // Añadir texto personalizado
    btnAgregarTexto.addEventListener('click', function () {
        const newText = document.createElement('div');
        newText.textContent = mensajeInput.value;
        newText.classList.add('draggable-text');
        newText.style.position = 'absolute';
        newText.style.left = '50px';
        newText.style.top = '50px';
        newText.style.cursor = 'move';
        newText.style.fontSize = '20px'; // Tamaño inicial

        previewArea.appendChild(newText);
        makeTextMovableAndDeletable(newText);
    });

    // Cambiar color, estilo y fuente
    function applyStyleToAllTexts() {
        const allTextElements = [previewNombre, previewApellido, previewFecha, previewFrase, ...document.querySelectorAll('.draggable-text')];

        allTextElements.forEach(textElement => {
            textElement.style.color = colorPicker.value;
            textElement.style.fontWeight = fontStyleSelector.value === 'bold' ? 'bold' : 'normal';
            textElement.style.fontStyle = fontStyleSelector.value === 'italic' ? 'italic' : 'normal';
            textElement.style.textDecoration = fontStyleSelector.value === 'underline' ? 'underline' : 'none';
            textElement.style.fontFamily = fontFamilySelector.value;
        });
    }

    colorPicker.addEventListener('input', applyStyleToAllTexts);
    fontStyleSelector.addEventListener('change', applyStyleToAllTexts);
    fontFamilySelector.addEventListener('change', applyStyleToAllTexts);

    // Cambiar tamaño del texto
    btnIncreaseFont.addEventListener('click', function () {
        if (selectedTextElement) {
            const currentSize = parseInt(window.getComputedStyle(selectedTextElement).fontSize);
            if (currentSize < maxFontSize) {
                selectedTextElement.style.fontSize = (currentSize + 2) + 'px';
            }
        }
    });

    btnDecreaseFont.addEventListener('click', function () {
        if (selectedTextElement) {
            const currentSize = parseInt(window.getComputedStyle(selectedTextElement).fontSize);
            if (currentSize > minFontSize) {
                selectedTextElement.style.fontSize = (currentSize - 2) + 'px';
            }
        }
    });

    // Menú de fuentes
    const fontFamilyContainer = document.getElementById("font-family");
    const dropdownList = document.querySelector(".dropdown-list");

    fontFamilyContainer.addEventListener("click", function () {
        dropdownList.style.display = dropdownList.style.display === "none" ? "block" : "none";
    });

    dropdownList.addEventListener("click", function (e) {
        if (e.target.tagName === "LI") {
            const selectedFont = e.target.dataset.font;
            fontFamilyContainer.querySelector("span").textContent = e.target.textContent;
            fontFamilySelector.value = selectedFont;
            applyStyleToAllTexts();
        }
    });

    // Cerrar el menú al hacer clic fuera
    document.addEventListener("click", function (e) {
        if (!fontFamilyContainer.contains(e.target)) {
            dropdownList.style.display = "none";
        }
    });
});

function addCeramicImage(src) {
    const previewContainer = document.getElementById('preview-area-text');

    if (previewContainer) {
        // Crear el elemento de la imagen
        const ceramicImage = document.createElement('div');
        ceramicImage.classList.add('movable-ceramic');
        ceramicImage.style.position = 'absolute';
        ceramicImage.style.left = '50px';
        ceramicImage.style.top = '50px';
        ceramicImage.style.width = '100px';
        ceramicImage.style.height = '100px';
        ceramicImage.style.cursor = 'move';
        ceramicImage.style.backgroundImage = `url(${src})`;
        ceramicImage.style.backgroundSize = 'cover';
        ceramicImage.style.backgroundPosition = 'center';

        // Crear el botón de eliminación
        const deleteButton = document.createElement('div');
        deleteButton.innerText = 'X';
        deleteButton.style.position = 'absolute';
        deleteButton.style.top = '-10px';
        deleteButton.style.right = '-10px';
        deleteButton.style.backgroundColor = 'red';
        deleteButton.style.color = 'white';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.padding = '5px';
        deleteButton.style.borderRadius = '50%';
        deleteButton.style.display = 'none'; // Oculto hasta hacer clic en la imagen

        deleteButton.onclick = (e) => {
            e.stopPropagation(); // Evitar que el clic en el botón cierre los nodos
            previewContainer.removeChild(ceramicImage);
        };

        ceramicImage.appendChild(deleteButton);

        // Mostrar el botón de eliminación al hacer clic en la imagen
        ceramicImage.onclick = (e) => {
            e.stopPropagation(); // Evitar el clic en el contenedor
            deleteButton.style.display = deleteButton.style.display === 'block' ? 'none' : 'block';
        };

        previewContainer.appendChild(ceramicImage);

        // Hacer la imagen movible con restricción
        makeMovable(ceramicImage, previewContainer);
    } else {
        console.error("No se encontró el contenedor de previsualización para el texto.");
    }
}

// Función para hacer la imagen movible con restricción
function makeMovable(element, container) {
    let posX = 0, posY = 0, initialX = 0, initialY = 0;

    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        posX = initialX - e.clientX;
        posY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;

        let newTop = element.offsetTop - posY;
        let newLeft = element.offsetLeft - posX;

        // Restringir movimiento dentro del contenedor
        if (newTop >= 0 && newTop + element.offsetHeight <= container.clientHeight) {
            element.style.top = newTop + "px";
        }
        if (newLeft >= 0 && newLeft + element.offsetWidth <= container.clientWidth) {
            element.style.left = newLeft + "px";
        }
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Ocultar el botón de eliminación al hacer clic fuera de la imagen
document.onclick = (e) => {
    const ceramics = document.querySelectorAll('.movable-ceramic');
    ceramics.forEach(ceramic => {
        const deleteButton = ceramic.querySelector('div');
        if (deleteButton) {
            deleteButton.style.display = 'none';
        }
    });
};


const button = document.getElementById('help-logo');
const button2 = document.getElementById('help-logo2');
const button3 = document.getElementById('help-logo3');

button.addEventListener('click', () => {
    Swal.fire({
        title: '1. Materiales',
        text: "Selecciona un material del contedor de la izquierda para ver como queda en el visor. Si solamente te interesa ver un diseño ya hecho puedes optar por los que estan en el contenedor derecho, de esa forma puedes evadir las pestañas 'Diseño' y 'Texto'",
        icon: 'question'
      });
});


button2.addEventListener('click', () => {
    Swal.fire({
        title: '2. Diseño',
        text: "Al hacer click sobre un diseño, puedes moverlo libremente con el ratón por el visor y, manteniendo el nodo azul, alterar el tamaño del mismo. Al hacer click en el botón rojo se elimina. Solo se permite un máximo de 8 imágenes, contando diseños y complementos.'",
        icon: 'question'
      });
});


button3.addEventListener('click', () => {
    Swal.fire({
        title: '3. Texto',
        text: "Modifica el texto estándar desde las casillas de la izquierda, usa las herramientas del editor para cambiar el texto a tu gusto. Puedes eliminar el texto presente haciendo click en el y luego al boton rojo. Finalmente, puedes inyectar el texto que tu quieras rellenando la casilla 'Texto' y pulsando el botón de añadir texto. Para poder usar el botón de  aumentar o reducir tamaño, primero se debe de hacer click sobre el texto que queremos manipular.",
        icon: 'question'
      });
});

window.onload = function() {
    Swal.fire({
        title: 'Bienvenido al creador de lápidas!!!',
        text: "Aquí podrás seleccionar y diseñar tu prototipo de piedra como tú quieras, elige los diferentes materiales y diseños que más te gusten.",
        icon: 'info'
    });
};