// AI Image & Logo Editor Studio Logic

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('editor-canvas');
    const ctx = canvas.getContext('2d');
    
    // Inputs & Sliders
    const mainInput = document.getElementById('main-input');
    const logoInput = document.getElementById('logo-input');
    const sizeSlider = document.getElementById('size-slider');
    const sizeVal = document.getElementById('size-val');
    const posXSlider = document.getElementById('pos-x-slider');
    const posXVal = document.getElementById('pos-x-val');
    const posYSlider = document.getElementById('pos-y-slider');
    const posYVal = document.getElementById('pos-y-val');
    const opacitySlider = document.getElementById('opacity-slider');
    const opacityVal = document.getElementById('opacity-val');
    
    // Toggles & Actions
    const hdToggle = document.getElementById('hd-toggle');
    const vibrantToggle = document.getElementById('vibrant-toggle');
    const metadataToggle = document.getElementById('metadata-toggle');
    const formatSelect = document.getElementById('format-select');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const ratioBtns = document.querySelectorAll('.ratio-btn');
    
    // Info display
    const infoDim = document.getElementById('info-dim');
    const infoLogoPos = document.getElementById('info-logo-pos');

    // Default Images
    let mainImg = new Image();
    let logoImg = new Image();
    
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let logoStartX = 0;
    let logoStartY = 0;

    // Load Default 4:5 Image (Modul 1/2/1.png)
    mainImg.src = 'brevet-ab/modul 1/2/1.png';
    logoImg.src = 'brevet-ab/logo/logo.png';

    mainImg.onload = () => {
        canvas.width = mainImg.naturalWidth || 1122;
        canvas.height = mainImg.naturalHeight || 1402;
        posXSlider.max = canvas.width;
        posYSlider.max = canvas.height;
        infoDim.textContent = `Dimensi: ${canvas.width} x ${canvas.height} px (4:5 Vertikal)`;
        renderCanvas();
    };

    logoImg.onload = () => {
        renderCanvas();
    };

    // Render Canvas
    function renderCanvas() {
        if (!mainImg.complete || mainImg.width === 0) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 1. Draw Main Image
        ctx.save();
        
        // Filter effects
        let filterStr = '';
        if (vibrantToggle.checked) {
            filterStr += 'saturate(120%) contrast(110%) ';
        }
        if (hdToggle.checked) {
            filterStr += 'contrast(105%) ';
        }
        ctx.filter = filterStr.trim() || 'none';
        
        ctx.drawImage(mainImg, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        // 2. Draw Logo
        if (logoImg.complete && logoImg.width > 0) {
            ctx.save();
            
            const targetW = parseInt(sizeSlider.value);
            const aspect = logoImg.naturalHeight / logoImg.naturalWidth;
            const targetH = Math.round(targetW * aspect);
            
            const posX = parseInt(posXSlider.value);
            const posY = parseInt(posYSlider.value);
            
            const topLeftX = posX - Math.round(targetW / 2);
            const topLeftY = posY - Math.round(targetH / 2);
            
            ctx.globalAlpha = parseInt(opacitySlider.value) / 100;
            ctx.drawImage(logoImg, topLeftX, topLeftY, targetW, targetH);
            
            // Draw visual selection ring indicator
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            ctx.strokeRect(topLeftX - 2, topLeftY - 2, targetW + 4, targetH + 4);
            
            ctx.restore();
            
            infoLogoPos.textContent = `Logo Center: (${posX}, ${posY}) | Size: ${targetW}px`;
        }
    }

    // Update Slider Value Displays
    sizeSlider.addEventListener('input', () => {
        sizeVal.textContent = `${sizeSlider.value} px`;
        renderCanvas();
    });

    posXSlider.addEventListener('input', () => {
        posXVal.textContent = `${posXSlider.value} px`;
        renderCanvas();
    });

    posYSlider.addEventListener('input', () => {
        posYVal.textContent = `${posYSlider.value} px`;
        renderCanvas();
    });

    opacitySlider.addEventListener('input', () => {
        opacityVal.textContent = `${opacitySlider.value}%`;
        renderCanvas();
    });

    [hdToggle, vibrantToggle].forEach(toggle => {
        toggle.addEventListener('change', renderCanvas);
    });

    // Ratio Selector Buttons
    ratioBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            ratioBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const ratio = btn.getAttribute('data-ratio');
            if (ratio === '9:16') {
                mainImg.src = 'brevet-ab/modul 1/1/1.png';
                sizeSlider.value = 292;
                posXSlider.value = 830;
                posYSlider.value = 126;
            } else if (ratio === '4:5') {
                mainImg.src = 'brevet-ab/modul 1/2/1.png';
                sizeSlider.value = 240;
                posXSlider.value = 1019;
                posYSlider.value = 101;
            }
            sizeVal.textContent = `${sizeSlider.value} px`;
            posXVal.textContent = `${posXSlider.value} px`;
            posYVal.textContent = `${posYSlider.value} px`;
        });
    });

    // Preset Position Actions
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            presetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const preset = btn.getAttribute('data-preset');
            const targetW = parseInt(sizeSlider.value);
            const aspect = logoImg.naturalHeight / (logoImg.naturalWidth || 1);
            const targetH = Math.round(targetW * aspect);

            if (preset === 'top-right-placeholder') {
                // Golden circle 9:16 center alignment
                posXSlider.value = 830;
                posYSlider.value = 126;
                sizeSlider.value = 292;
            } else if (preset === 'top-right-45') {
                // 4:5 Vertical top-right logo spot
                posXSlider.value = 1019;
                posYSlider.value = 101;
                sizeSlider.value = 240;
            } else if (preset === 'top-right') {
                posXSlider.value = canvas.width - Math.round(targetW / 2) - 30;
                posYSlider.value = Math.round(targetH / 2) + 30;
            } else if (preset === 'top-left') {
                posXSlider.value = Math.round(targetW / 2) + 30;
                posYSlider.value = Math.round(targetH / 2) + 30;
            } else if (preset === 'bottom-right') {
                posXSlider.value = canvas.width - Math.round(targetW / 2) - 30;
                posYSlider.value = canvas.height - Math.round(targetH / 2) - 30;
            } else if (preset === 'bottom-left') {
                posXSlider.value = Math.round(targetW / 2) + 30;
                posYSlider.value = canvas.height - Math.round(targetH / 2) - 30;
            } else if (preset === 'center') {
                posXSlider.value = Math.round(canvas.width / 2);
                posYSlider.value = Math.round(canvas.height / 2);
            }

            sizeVal.textContent = `${sizeSlider.value} px`;
            posXVal.textContent = `${posXSlider.value} px`;
            posYVal.textContent = `${posYSlider.value} px`;
            renderCanvas();
        });
    });

    // Interactive Dragging on Canvas
    function getCanvasCoords(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        let clientX = e.clientX;
        let clientY = e.clientY;
        if (e.touches && e.touches[0]) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
        
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        const coords = getCanvasCoords(e);
        dragStartX = coords.x;
        dragStartY = coords.y;
        logoStartX = parseInt(posXSlider.value);
        logoStartY = parseInt(posYSlider.value);
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const coords = getCanvasCoords(e);
        const deltaX = Math.round(coords.x - dragStartX);
        const deltaY = Math.round(coords.y - dragStartY);
        
        posXSlider.value = Math.max(0, Math.min(canvas.width, logoStartX + deltaX));
        posYSlider.value = Math.max(0, Math.min(canvas.height, logoStartY + deltaY));
        
        posXVal.textContent = `${posXSlider.value} px`;
        posYVal.textContent = `${posYSlider.value} px`;
        renderCanvas();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Custom File Uploads
    mainInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            document.getElementById('main-label').textContent = file.name;
            const reader = new FileReader();
            reader.onload = (event) => {
                mainImg = new Image();
                mainImg.onload = () => {
                    canvas.width = mainImg.naturalWidth;
                    canvas.height = mainImg.naturalHeight;
                    posXSlider.max = canvas.width;
                    posYSlider.max = canvas.height;
                    infoDim.textContent = `Dimensi: ${canvas.width} x ${canvas.height} px`;
                    renderCanvas();
                };
                mainImg.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    logoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            document.getElementById('logo-label').textContent = file.name;
            const reader = new FileReader();
            reader.onload = (event) => {
                logoImg = new Image();
                logoImg.onload = () => {
                    renderCanvas();
                };
                logoImg.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Reset Action
    resetBtn.addEventListener('click', () => {
        sizeSlider.value = 240;
        posXSlider.value = 980;
        posYSlider.value = 110;
        opacitySlider.value = 100;
        sizeVal.textContent = '240 px';
        posXVal.textContent = '980 px';
        posYVal.textContent = '110 px';
        opacityVal.textContent = '100%';
        renderCanvas();
    });

    // High Quality Export Download
    downloadBtn.addEventListener('click', () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');

        // Draw Main Image
        let filterStr = '';
        if (vibrantToggle.checked) {
            filterStr += 'saturate(120%) contrast(110%) ';
        }
        if (hdToggle.checked) {
            filterStr += 'contrast(105%) ';
        }
        tempCtx.filter = filterStr.trim() || 'none';
        tempCtx.drawImage(mainImg, 0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.filter = 'none';

        // Draw Logo Clean
        if (logoImg.complete && logoImg.width > 0) {
            const targetW = parseInt(sizeSlider.value);
            const aspect = logoImg.naturalHeight / logoImg.naturalWidth;
            const targetH = Math.round(targetW * aspect);
            
            const posX = parseInt(posXSlider.value);
            const posY = parseInt(posYSlider.value);
            
            const topLeftX = posX - Math.round(targetW / 2);
            const topLeftY = posY - Math.round(targetH / 2);
            
            tempCtx.globalAlpha = parseInt(opacitySlider.value) / 100;
            tempCtx.drawImage(logoImg, topLeftX, topLeftY, targetW, targetH);
        }

        const mimeType = formatSelect.value;
        const ext = mimeType === 'image/png' ? 'png' : 'jpg';
        const dataUrl = tempCanvas.toDataURL(mimeType, 0.95);
        
        const link = document.createElement('a');
        link.download = `edited_45_image_${Date.now()}.${ext}`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
