const config = {
  strokeWidth: 2,
  strokeColor: "#f0f",
};

const gameHTML = document.getElementById("gameBackground");
const ctx = gameHTML.getContext("2d");
const dpi = window.devicePixelRatio;

const fix_dpi = () => {
  //get CSS height
  //the + prefix casts it to an integer
  //the slice method gets rid of "px"
  const style_height = +getComputedStyle(gameHTML)
    .getPropertyValue("height")
    .slice(0, -2);
  //get CSS width
  const style_width = +getComputedStyle(gameHTML)
    .getPropertyValue("width")
    .slice(0, -2);
  //scale the ctx
  gameHTML.setAttribute("height", style_height * dpi);
  gameHTML.setAttribute("width", style_width * dpi);
};

const draw = {
  drawRect: (x, y, size, colorStyle, fillColor) => {
    ctx.beginPath();
    ctx.rect(x, y, size, size);
    if (colorStyle === 1) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    } else if (colorStyle === 2) {
      ctx.lineWidth = config.strokeWidth;
      ctx.strokeStyle = config.strokeColor;
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.lineWidth = config.strokeWidth;
      ctx.strokeStyle = fillColor;
      ctx.stroke();
    }
  },
  drawChar: (x, y, angle, size, colorStyle, fillColor) => {
    if (angle === 90) {
      //UP
      draw.drawRect(x, y, size, colorStyle, fillColor);
      draw.drawRect(x - size, y, size, colorStyle, fillColor);
      draw.drawRect(x + size, y, size, colorStyle, fillColor);
      draw.drawRect(x, y - size, size, colorStyle, fillColor);
      draw.drawRect(x - size, y + size, size, colorStyle, fillColor);
      draw.drawRect(x + size, y + size, size, colorStyle, fillColor);
    } else if (angle === 270) {
      // down
      draw.drawRect(x, y, size, colorStyle, fillColor);
      draw.drawRect(x - size, y, size, colorStyle, fillColor);
      draw.drawRect(x + size, y, size, colorStyle, fillColor);
      draw.drawRect(x, y + size, size, colorStyle, fillColor);
      draw.drawRect(x - size, y - size, size, colorStyle, fillColor);
      draw.drawRect(x + size, y - size, size, colorStyle, fillColor);
    } else if (angle === 180) {
      //left
      draw.drawRect(x, y, size, colorStyle, fillColor);
      draw.drawRect(x, y - size, size, colorStyle, fillColor);
      draw.drawRect(x - size, y, size, colorStyle, fillColor);
      draw.drawRect(x, y + size, size, colorStyle, fillColor);
      draw.drawRect(x + size, y - size, size, colorStyle, fillColor);
      draw.drawRect(x + size, y + size, size, colorStyle, fillColor);
    } else if (angle === 0) {
      //right
      draw.drawRect(x, y, size, colorStyle, fillColor);
      draw.drawRect(x, y - size, size, colorStyle, fillColor);
      draw.drawRect(x, y + size, size, colorStyle, fillColor);
      draw.drawRect(x + size, y, size, colorStyle, fillColor);
      draw.drawRect(x - size, y - size, size, colorStyle, fillColor);
      draw.drawRect(x - size, y + size, size, colorStyle, fillColor);
    }
  },
  clearScreen: () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  },
};

fix_dpi();

// const charPrinter = (angle) => {
//   draw.clearScreen();
//   draw.drawChar(20, 50, angle, 6, 1, "##000");
// };
// const bulletPrinter = () => {
//   draw.clearScreen();
//   draw.drawRect(Math.random() * 500, Math.random() * 500, 10, 1, "#f00");
// };

document.onkeypress = (e) => {
  e.key === "w" || e.key === "W" ? charPrinter(90) : "";
  e.key === "s" || e.key === "S" ? charPrinter(270) : "";
  e.key === "a" || e.key === "A" ? charPrinter(180) : "";
  e.key === "d" || e.key === "D" ? charPrinter(0) : "";
  e.key === " " ? bulletPrinter() : "";
  e.key === "p" || e.key === "P" ? console.log("pause") : "";
};
