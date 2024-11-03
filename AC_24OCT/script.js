// Obtener referencias al canvas y sus contextos de dibujo
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Obtener referencias a los elementos de la interfaz
const imageLoader = document.getElementById('imageLoader'); // Input para cargar imágenes
const colorPicker = document.getElementById('colorPicker'); // Selector de color
const floodFillButton = document.getElementById('floodFillButton'); // Botón para aplicar el Flood Fill
const scanFillButton = document.getElementById('scanFillButton'); // Botón para aplicar el Scan Fill
let imageData; // Variable para almacenar los datos de la imagen cargada

// Manejar la carga de imagen al seleccionar un archivo
imageLoader.addEventListener('change', (event) => {
    const file = event.target.files[0]; // Obtener el primer archivo seleccionado
    if (file) { // Comprobar si hay un archivo
        const reader = new FileReader(); // Crear un nuevo objeto FileReader
        reader.onload = (e) => { // Función que se ejecuta cuando el archivo se ha leído
            const img = new Image(); // Crear una nueva imagen
            img.onload = () => { // Función que se ejecuta cuando la imagen se ha cargado
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Dibujar la imagen en el canvas
                imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); // Guardar los datos de la imagen
            };
            img.src = e.target.result; // Convertir el archivo a una URL de datos y establecerla como fuente de la imagen
        };
        reader.readAsDataURL(file); // Leer el archivo como una URL de datos
    }
});

// Cambiar el color de toda la imagen de forma lenta
function slowlyChangeImageColor(color) {
    const data = imageData.data; // Obtener los datos de imagen (array de píxeles)
    const fillColor = parseColor(color); // Convertir el color seleccionado a formato RGBA
    let index = 0; // Índice del píxel actual

    // Configurar un intervalo para cambiar el color pixel por pixel
    const interval = setInterval(() => {
        if (index < data.length) { // Comprobar si aún hay píxeles por cambiar
            data[index] = fillColor[0];     // Asignar el valor de rojo
            data[index + 1] = fillColor[1]; // Asignar el valor de verde
            data[index + 2] = fillColor[2]; // Asignar el valor de azul
            data[index + 3] = fillColor[3]; // Asignar el valor de alpha
            index += 4; // Pasar al siguiente píxel (4 valores por píxel)
            ctx.putImageData(imageData, 0, 0); // Actualizar el canvas con el nuevo color
        } else {
            clearInterval(interval); // Detener el intervalo al completar el cambio de color
        }
    }, 10); // Ajusta este valor para cambiar la velocidad (10ms por píxel)
}

// Convierte un color hexadecimal a RGBA
function parseColor(hexColor) {
    let bigint = parseInt(hexColor.slice(1), 16); // Convertir el color hexadecimal a un número
    return [
        (bigint >> 16) & 255, // Extraer el componente rojo
        (bigint >> 8) & 255,  // Extraer el componente verde
        bigint & 255,         // Extraer el componente azul
        255                   // Establecer alpha a 255 (completamente opaco)
    ];
}

// Aplicar Flood Fill al hacer clic en el botón
floodFillButton.addEventListener('click', () => {
    const color = colorPicker.value; // Obtener el color seleccionado del picker
    if (imageData) { // Comprobar si hay datos de imagen
        slowlyChangeImageColor(color); // Cambiar el color de toda la imagen lentamente
    }
});

// Aplicar Scan Fill al hacer clic en el botón
scanFillButton.addEventListener('click', () => {
    const color = colorPicker.value; // Obtener el color seleccionado del picker
    if (imageData) { // Comprobar si hay datos de imagen
        slowlyChangeImageColor(color); // Cambiar el color de toda la imagen lentamente
    }
});
