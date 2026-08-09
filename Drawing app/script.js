const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

// ===== GLOBAL VARIABLES =====
let prevMouseX, prevMouseY, snapshot;
let isDrawing = false;
let selectedTool = "brush";
let brushWidth = 5;
let selectedColor = "#000";

// ===== SET CANVAS BACKGROUND =====
const setCanvasBackground = () => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
};

// ===== FULLSCREEN CANVAS RESIZE =====
const resizeCanvas = () => {
    const sidebarWidth = 250; // match CSS sidebar width
    canvas.width = window.innerWidth - sidebarWidth;
    canvas.height = window.innerHeight;

    setCanvasBackground();
};

// Load + Resize
window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

// ===== SHAPES =====
const drawRect = (e) => {
    if (!fillColor.checked) {
        return ctx.strokeRect(
            e.offsetX,
            e.offsetY,
            prevMouseX - e.offsetX,
            prevMouseY - e.offsetY
        );
    }
    ctx.fillRect(
        e.offsetX,
        e.offsetY,
        prevMouseX - e.offsetX,
        prevMouseY - e.offsetY
    );
};

const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(
        Math.pow(prevMouseX - e.offsetX, 2) +
        Math.pow(prevMouseY - e.offsetY, 2)
    );

    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();

    fillColor.checked ? ctx.fill() : ctx.stroke();
};

// ===== START DRAW =====
const startDraw = (e) => {
    isDrawing = true;

    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;

    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;

    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

// ===== DRAWING =====
const drawing = (e) => {
    if (!isDrawing) return;

    ctx.putImageData(snapshot, 0, 0);

    if (selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#ffffff" : selectedColor;

        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();

    } else if (selectedTool === "rectangle") {
        drawRect(e);

    } else if (selectedTool === "circle") {
        drawCircle(e);

    } else if (selectedTool === "triangle") {
        drawTriangle(e);
    }
};

// ===== TOOL SELECTION =====
toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active")?.classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

// ===== BRUSH SIZE =====
sizeSlider.addEventListener("input", () => {
    brushWidth = sizeSlider.value;
});

// ===== COLOR SELECTION =====
colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected")?.classList.remove("selected");
        btn.classList.add("selected");

        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

// ===== COLOR PICKER =====
colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

// ===== CLEAR CANVAS =====
clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

// ===== SAVE IMAGE =====
saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
});

// ===== MOUSE EVENTS =====
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mouseleave", () => isDrawing = false);