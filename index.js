const config = {
  fps: 60,
  strokeWidth: 2,
  strokeColor: "#f0f",
};

const gameState = {
  paused: false,
  clock: 0,
};

charState = [];
// bulletState = [];

const gameHTML = document.getElementById("gameBackground");
const scoreHTML = document.getElementById("score");
const healthHTML = document.getElementById("health");
const fpsHTML = document.getElementById("fps");
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

const charPrinter = () => {
  charState.forEach((e) => {
    draw.drawChar(
      e.position.x,
      e.position.y,
      e.position.angle,
      e.charSize,
      e.charColorStyle,
      e.charColor
    );
  });
};

// const bulletPrinter = () => {
//   draw.drawRect(Math.random() * 500, Math.random() * 500, 10, 1, "#f00");
// };

document.onkeypress = (e) => {
  e.key === "w" || e.key === "W" ? charMover(0, 90) : "";
  e.key === "s" || e.key === "S" ? charMover(0, 270) : "";
  e.key === "a" || e.key === "A" ? charMover(0, 180) : "";
  e.key === "d" || e.key === "D" ? charMover(0, 0) : "";
  e.key === " " ? bulletPrinter() : "";
  e.key === "p" || e.key === "P" ? pause() : "";
};

const charMover = (pos, angle) => {
  charState[pos].position.angle = angle;

  charState[pos].position.x =
    charState[pos].position.x +
    Math.cos((angle / 180) * Math.PI).toFixed(2) * charState[pos].charSpeed;
  charState[pos].position.y =
    charState[pos].position.y -
    Math.sin((angle / 180) * Math.PI).toFixed(2) * charState[pos].charSpeed;
};

const pause = () => {
  if (gameState.paused) {
    console.log("Resumed");
    clock();
    gameState.paused = false;
  } else {
    console.log("Paused");
    clearInterval(gameState.clock);
    gameState.paused = true;
  }
};

const mainGame = () => {
  draw.clearScreen();
  // Robot
  // bulletMng
  // charMng
  //gameMng
  charPrinter();
  //bulletPrinter();
};

// clock
const clock = () => {
  gameState.clock = setInterval(() => {
    const t = new Date().getTime();
    mainGame();
    fpsHTML.innerHTML = `FPS: ${(
      1000 /
      (new Date().getTime() - t + 1000 / config.fps)
    ).toFixed(2)}`;
  }, 1000 / config.fps);
};

const init = () => {
  // creating player
  charState.push({
    position: {
      x: 20,
      y: 50,
      angle: 90,
    },
    charSize: 7,
    charColor: "#0ac",
    charColorStyle: 1,
    characterId: 0,
    charSpeed: 10,
  });

  // creating enemy
  charState.push({
    position: {
      x: 60,
      y: 200,
      angle: 0,
    },
    charSize: 12,
    charColor: "#000",
    charColorStyle: 0,
    characterId: 1,
    charSpeed: 10,
  });

  // creating enemy
  charState.push({
    position: {
      x: 60,
      y: 300,
      angle: 270,
    },
    charSize: 20,
    charColor: "#f00",
    charColorStyle: 0,
    characterId: 2,
    charSpeed: 10,
  });
  clock();
};

init();
