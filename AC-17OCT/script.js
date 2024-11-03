// Referencia al canvas y al contexto de dibujo 2D
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fillColorInput = document.getElementById('fillColor');

// Variables de estado para controlar la activación de Flood Fill y el recorte
let isFloodFillActive = false;
let isClipActive = false;

// Generar figuras aleatorias en el canvas
function generateRandomShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

    for (let i = 0; i < 5; i++) {
        const shapeType = Math.floor(Math.random() * 3); // 0: Rectángulo, 1: Círculo, 2: Triángulo
        let x = Math.random() * 400 + 50;
        let y = Math.random() * 400 + 50;
        let width, height, radius;

        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        // Dibuja figuras aleatorias
        switch (shapeType) {
            case 0: // Rectángulo
                width = Math.random() * 100 + 20;
                height = Math.random() * 100 + 20;
                ctx.fillRect(x, y, width, height);
                ctx.strokeRect(x, y, width, height);
                break;
            case 1: // Círculo
                radius = Math.random() * 30 + 10;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                break;
            case 2: // Triángulo
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + 50, y + 80);
                ctx.lineTo(x - 50, y + 80);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
        }
    }
}

// Alterna la activación del algoritmo Flood Fill
function toggleFloodFill() {
    if (isFloodFillActive) {
        generateRandomShapes(); // Resetear figuras al desactivar Flood Fill
    } else {
        applyFloodFill(); // Aplica Flood Fill si está activado
    }
    isFloodFillActive = !isFloodFillActive;
    document.getElementById('floodFillButton').innerText = isFloodFillActive ? "Desactivar Flood Fill" : "Aplicar Flood Fill";
}

// Aplica el algoritmo Flood Fill en el canvas
function applyFloodFill() {
    const fillColor = fillColorInput.value;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); // Captura los datos de imagen
    const data = imageData.data;
    const targetColor = [data[0], data[1], data[2], data[3]]; // Color del primer pixel

    if (colorsEqual(targetColor, parseColor(fillColor))) return; // Evita aplicar si el color es igual

    floodFill(10, 10, targetColor, parseColor(fillColor), data, canvas.width); // Llama a floodFill
    ctx.putImageData(imageData, 0, 0); // Aplica los cambios al canvas
}

// Compara si dos colores RGBA son iguales
function colorsEqual(color1, color2) {
    return color1.every((value, index) => value === color2[index]);
}

// Convierte un color hexadecimal a RGBA
function parseColor(hexColor) {
    let bigint = parseInt(hexColor.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255];
}

// Implementación básica del algoritmo Flood Fill
function floodFill(x, y, targetColor, fillColor, data, width) {
    const stack = [[x, y]];

    while (stack.length) {
        const [x, y] = stack.pop();
        const index = (y * width + x) * 4;
        const currentColor = [data[index], data[index + 1], data[index + 2], data[index + 3]];

        if (!colorsEqual(currentColor, targetColor)) continue;

        // Cambia el color del pixel
        data[index] = fillColor[0];
        data[index + 1] = fillColor[1];
        data[index + 2] = fillColor[2];
        data[index + 3] = fillColor[3];

        // Añadir pixeles vecinos al stack
        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
    }
}

// Algoritmo de recorte Cohen-Sutherland: límites de recorte
const xMin = 100, yMin = 100, xMax = 400, yMax = 400;
const INSIDE = 0, LEFT = 1, RIGHT = 2, BOTTOM = 4, TOP = 8;

// Calcular el código de posición (outCode) para cada punto
function computeOutCode(x, y) {
    let code = INSIDE;
    if (x < xMin) code |= LEFT;
    else if (x > xMax) code |= RIGHT;
    if (y < yMin) code |= BOTTOM;
    else if (y > yMax) code |= TOP;
    return code;
}

// Implementa el algoritmo de recorte Cohen-Sutherland
function cohenSutherlandClip(x0, y0, x1, y1, color) {
    let outCode0 = computeOutCode(x0, y0);
    let outCode1 = computeOutCode(x1, y1);
    let accept = false;

    while (true) {
        if (!(outCode0 | outCode1)) {
            accept = true; // Ambos puntos están dentro
            break;
        } else if (outCode0 & outCode1) {
            break; // Ambos puntos están fuera y no visibles
        } else {
            let x, y;
            const outCodeOut = outCode0 ? outCode0 : outCode1;

            // Encontrar el punto de intersección
            if (outCodeOut & TOP) {
                x = x0 + (x1 - x0) * (yMax - y0) / (y1 - y0);
                y = yMax;
            } else if (outCodeOut & BOTTOM) {
                x = x0 + (x1 - x0) * (yMin - y0) / (y1 - y0);
                y = yMin;
            } else if (outCodeOut & RIGHT) {
                y = y0 + (y1 - y0) * (xMax - x0) / (x1 - x0);
                x = xMax;
            } else if (outCodeOut & LEFT) {
                y = y0 + (y1 - y0) * (xMin - x0) / (x1 - x0);
                x = xMin;
            }

            // Actualizar el punto fuera del límite
            if (outCodeOut === outCode0) {
                x0 = x;
                y0 = y;
                outCode0 = computeOutCode(x0, y0);
            } else {
                x1 = x;
                y1 = y;
                outCode1 = computeOutCode(x1, y1);
            }
        }
    }

    if (accept) {
        ctx.strokeStyle = color; // Color del borde de recorte
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    }
}

// Alterna la activación del recorte de Cohen-Sutherland
function toggleClip() {
    if (isClipActive) {
        generateRandomShapes(); // Redibuja las figuras al desactivar recorte
    } else {
        const color = getRandomColor(); // Asigna color aleatorio para recorte
        applyClip(color);
    }
    isClipActive = !isClipActive;
    document.getElementById('clipButton').innerText = isClipActive ? "Desactivar Recorte" : "Aplicar Recorte";
}

// Dibuja la región de recorte y aplica el algoritmo de Cohen-Sutherland
function applyClip(color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(xMin, yMin, xMax - xMin, yMax - yMin); // Dibujar el borde del recorte
    cohenSutherlandClip(50, 50, 450, 450, color); // Aplicar recorte en línea de ejemplo
}

// Genera un color aleatorio en formato hexadecimal
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Llama a generateRandomShapes cuando la página se carga
window.onload = generateRandomShapes;
