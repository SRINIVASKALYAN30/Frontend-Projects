const qrText = document.getElementById('qr-text');
const sizes = document.getElementById('sizes');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qrContainer = document.querySelector('.qr-body');

let size = sizes.value;

// Generate QR
generateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    generateQRCode();
});

// Change size
sizes.addEventListener('change', (e) => {
    size = e.target.value;
});

// Generate QR Code
function generateQRCode() {
    if (qrText.value.trim() === "") {
        alert("Please enter text or URL");
        return;
    }

    qrContainer.innerHTML = "";

    new QRCode(qrContainer, {
        text: qrText.value,
        width: size,
        height: size,
        colorDark: "#000",
        colorLight: "#fff",
    });
}

// Download QR
downloadBtn.addEventListener('click', () => {
    let img = document.querySelector('.qr-body img');

    if (img) {
        let url = img.getAttribute("src");
        downloadBtn.setAttribute("onclick", `downloadImage('${url}')`);
    } else {
        let canvas = document.querySelector('canvas');
        if (canvas) {
            let url = canvas.toDataURL();
            downloadBtn.setAttribute("onclick", `downloadImage('${url}')`);
        } else {
            alert("Generate a QR Code first!");
        }
    }
});

// Helper download
function downloadImage(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = "QR_Code.png";
    a.click();
}