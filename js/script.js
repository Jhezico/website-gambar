if (window.screen.width < 1280 && window.screen.height < 768) {
  window.location.pathname = '/phone.html';
  console.log(window.location.href);
} else {
  const canvas = document.querySelector("canvas"),
    toolBtns = document.querySelectorAll(".tool"),
    fillColor = document.querySelector("#warna-dalam"),
    sizeSlider = document.querySelector("#ukuran-slider"),
    colorBtns = document.querySelectorAll(".warna .menu-icon"),
    colorPicker = document.querySelector("#pilih-warna"),
    clearCanvas = document.querySelector(".reset-canvas"),
    saveImg = document.querySelector(".simpan-gambar"),
    ctx = canvas.getContext("2d");

  let prevMouseX, prevMouseY, snapshot,
    isDrawing = false,
    selectedTool = "brush",
    brushWidth = 5,
    selectedColor = "#000";

  window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  });

  const gambarKotak = (e) => {
    if (!fillColor.checked) {
      return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
  }

  const gambarLingkaran = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
  }

  const gambarSegitiga = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
  }

  const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
  };

  const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);

    if (selectedTool === "brush" || selectedTool === "penghapus") {
      ctx.strokeStyle = selectedTool === "penghapus" ? "#fff" : selectedColor;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    } else if (selectedTool === "kotak") {
      gambarKotak(e);
    } else if (selectedTool === "lingkaran") {
      gambarLingkaran(e);
    } else {
      gambarSegitiga(e);
    }
  };

  toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".menu-utama .active").classList.remove("active");
      btn.classList.add("active");
      selectedTool = btn.id;
      console.log(selectedTool);
    });
  });

  sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

  colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".menu-utama .selected").classList.remove("selected");
      btn.classList.add("selected");
      selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
  });

  colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
  });

  clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
  });

  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", drawing);
  canvas.addEventListener("mouseup", () => isDrawing = false);
}



