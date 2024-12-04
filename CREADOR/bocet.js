document.addEventListener("DOMContentLoaded", function () {
    const nombreInput = document.getElementById("nombre");
    const apellidoInput = document.getElementById("apellido");
    const fechaInput = document.getElementById("fecha");

    const previewNombre = document.getElementById("preview-nombre");
    const previewApellido = document.getElementById("preview-apellido");
    const previewFecha = document.getElementById("preview-fecha");

    let selectedTextElement = null;
    let isResizingText = false;
    let offsetXText = 0, offsetYText = 0;
    let initialFontSize = 20; // Tamaño de fuente inicial

    // Función para actualizar la previsualización
    function updatePreview() {
        previewNombre.textContent = nombreInput.value;
        previewApellido.textContent = apellidoInput.value;
        previewFecha.textContent = fechaInput.value;
    }

    nombreInput.addEventListener("input", updatePreview);
    apellidoInput.addEventListener("input", updatePreview);
    fechaInput.addEventListener("input", updatePreview);
    updatePreview();

    [previewNombre, previewApellido, previewFecha].forEach(textElement => {
        textElement.style.position = 'absolute';
        textElement.style.cursor = 'move';
        textElement.style.fontSize = `${initialFontSize}px`; // Establecer tamaño de fuente inicial

        textElement.addEventListener('mousedown', startDragText);
        textElement.addEventListener('click', (e) => {
            e.stopPropagation();
            showTextHandles(textElement);
            showDeleteButton(textElement);
        });
    });

    function showTextHandles(element) {
        document.querySelectorAll('.resize-handle-text').forEach(handle => handle.remove());

        const resizeHandle = document.createElement('div');
        resizeHandle.classList.add('resize-handle-text');
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.width = '10px';
        resizeHandle.style.height = '10px';
        resizeHandle.style.background = 'blue';
        resizeHandle.style.cursor = 'nwse-resize';
        resizeHandle.style.right = '-5px';
        resizeHandle.style.bottom = '-5px';

        resizeHandle.addEventListener('mousedown', startResizeText);
        element.appendChild(resizeHandle);
    }

    function showDeleteButton(element) {
        const deleteButton = document.createElement('div');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = '❌'; 
        deleteButton.style.position = 'absolute';
        deleteButton.style.right = '10px';
        deleteButton.style.top = '-10px';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.color = 'red';

        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            element.remove(); 
            deleteButton.remove(); 
        });

        element.appendChild(deleteButton);
    }

    function startDragText(e) {
        selectedTextElement = e.target;
        offsetXText = e.clientX - selectedTextElement.getBoundingClientRect().left;
        offsetYText = e.clientY - selectedTextElement.getBoundingClientRect().top;
        document.addEventListener('mousemove', dragText);
        document.addEventListener('mouseup', stopDragText);
    }

    function dragText(e) {
        if (selectedTextElement && !isResizingText) {
            selectedTextElement.style.left = (e.clientX - offsetXText) + 'px';
            selectedTextElement.style.top = (e.clientY - offsetYText) + 'px';
        }
    }

    function stopDragText() {
        document.removeEventListener('mousemove', dragText);
        selectedTextElement = null;
    }

    function startResizeText(e) {
        e.stopPropagation();
        isResizingText = true;
        selectedTextElement = e.target.parentElement;
        const currentFontSize = parseInt(window.getComputedStyle(selectedTextElement).fontSize);
        
        document.addEventListener('mousemove', (event) => resizeText(event, currentFontSize));
        document.addEventListener('mouseup', stopResizeText);
    }

    function resizeText(e, currentFontSize) {
        // Ajusta el tamaño de fuente basado en la posición del mouse
        const newFontSize = Math.max(10, currentFontSize + (e.clientY - selectedTextElement.getBoundingClientRect().bottom));
        selectedTextElement.style.fontSize = `${newFontSize}px`;
    }

    function stopResizeText() {
        document.removeEventListener('mousemove', resizeText);
        isResizingText = false;
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.resize-handle-text') && !e.target.closest('.delete-button')) {
            document.querySelectorAll('.resize-handle-text').forEach(handle => handle.remove());
            document.querySelectorAll('.delete-button').forEach(button => button.remove());
        }
    });
});
