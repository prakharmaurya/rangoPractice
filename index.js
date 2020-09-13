const config = {
  playerSize: 8,
  playerColor: "#9d65c9",
  playerColorStyle: 2,
  playerSpeed: 10,
  playerHealth: 20,
  playerBulletSize: 6,
  playerBulletColor: "#5d54a4",
  playerBulletColorStyle: 0,
  playerBulletSpeed: 10,
  playerBulletDamage: 2,

  enemySize: 8,
  enemyColor: "#f0a500",
  enemyColorStyle: 0,
  enemySpeed: 10,
  enemyHealth: 4,
  enemyBulletSize: 6,
  enemyBulletColor: "#cf7500",
  enemyBulletColorStyle: 0,
  enemyBulletSpeed: 10,
  enemyBulletDamage: 10,

  bossSize: 12,
  bossColor: "#d57149",
  bossColorStyle: 0,
  bossSpeed: 10,
  bossHealth: 50,
  bossBulletSize: 6,
  bossBulletColor: "#aa4a30",
  bossBulletColorStyle: 0,
  bossBulletSpeed: 10,
  bossBulletDamage: 10,

  randomScale: 10,

  enemyMovingFrequency: 5,
  bossMovingFrequency: 5,
  enemyFiringFrequency: 5,
  bossFiringFrequency: 5,

  enemySpwanFrequency: 5,
  bossSpwanFrequency: 5,
  totalEnemyAtaTime: 6,

  margin: 15,
  fps: 60,
  strokeWidth: 2,
  strokeColor: "#000",
};

const gameState = {
  paused: false,
  clock: 0,
  gameOver: false,
};

charState = [];
bulletState = [];

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

const bulletPrinter = () => {
  bulletState.forEach((e) => {
    draw.drawRect(
      e.position.x,
      e.position.y,
      e.bulletSize,
      e.bulletColorStyle,
      e.bulletColor
    );
  });
};

document.onkeypress = (e) => {
  e.key === "w" || e.key === "W" ? charMover(0, 90) : "";
  e.key === "s" || e.key === "S" ? charMover(0, 270) : "";
  e.key === "a" || e.key === "A" ? charMover(0, 180) : "";
  e.key === "d" || e.key === "D" ? charMover(0, 0) : "";
  e.key === " " ? bulletMaker(charState[0]) : "";
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

  if (charState[pos].position.x <= config.margin) {
    charState[pos].position.x = config.margin;
  } else if (charState[pos].position.x >= ctx.canvas.width - config.margin) {
    charState[pos].position.x = ctx.canvas.width - config.margin;
  }
  if (charState[pos].position.y <= config.margin) {
    charState[pos].position.y = config.margin;
  } else if (charState[pos].position.y >= ctx.canvas.height - config.margin) {
    charState[pos].position.y = ctx.canvas.height - config.margin;
  }
};

const bulletMaker = (char) => {
  bulletState.push({
    position: {
      x: char.position.x,
      y: char.position.y,
      angle: char.position.angle,
    },
    bulletSize: char.bulletSize,
    bulletColor: char.bulletColor,
    bulletColorStyle: char.bulletColorStyle,
    bulletSpeed: char.bulletSpeed,
    bulletDamage: char.bulletDamage,
    owner: char.characterId,
  });
};

const bulletMover = () => {
  bulletState.forEach((e) => {
    if (
      e.position.x <= 0 ||
      e.position.y <= 0 ||
      e.position.y >= ctx.canvas.width ||
      e.position.y >= ctx.canvas.height
    ) {
      bulletState.splice(bulletState.indexOf(e), 1);
    }

    e.position.x =
      e.position.x +
      Math.cos((e.position.angle / 180) * Math.PI).toFixed(2) * e.bulletSpeed;
    e.position.y =
      e.position.y -
      Math.sin((e.position.angle / 180) * Math.PI).toFixed(2) * e.bulletSpeed;
  });
};

const bulletManager = () => {
  bulletState.forEach((e) => {
    if (e.owner === 0) {
      // this is bullet of player
      for (let i = 1; i < charState.length; i++) {
        if (
          Math.abs(charState[i].position.x - e.position.x) <
            (charState[i].charSize / 2 + e.bulletSize / 2) * 2 &&
          Math.abs(charState[i].position.y - e.position.y) <
            (charState[i].charSize / 2 + e.bulletSize / 2) * 2
        ) {
          // remove bullet
          bulletState.splice(bulletState.indexOf(e), 1);
          // readuce health
          charState[i].charHealth -= e.bulletDamage;
        }
      }
    } else {
      // this is bullet of enemy
      if (
        Math.abs(charState[0].position.x - e.position.x) <
          (charState[0].charSize / 2 + e.bulletSize / 2) * 2 &&
        Math.abs(charState[0].position.y - e.position.y) <
          (charState[0].charSize / 2 + e.bulletSize / 2) * 2
      ) {
        // remove bullet
        bulletState.splice(bulletState.indexOf(e), 1);
        // readuce health
        charState[0].charHealth -= e.bulletDamage;
      }
    }
  });
};

const charManager = () => {
  for (let i = 1; i < charState.length; i++) {
    if (charState[i].charHealth <= 0) {
      charState.splice(charState.indexOf(charState[i]), 1);
    }
  }

  if (charState[0].charHealth <= 0) {
    gameState.gameOver = true;
  }
};

const gameManager = () => {
  if (gameState.gameOver && !gameState.paused) {
    pause();
    gameState.paused = true;
    console.log("Game Over");
    if (confirm("Want to play again?")) {
      // restart
      init();
    }
  }
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

const robotManager = () => {
  // Spwan
  if (charState.length < config.totalEnemyAtaTime + 1) {
    if (Math.random() * config.randomScale < config.enemySpwanFrequency) {
      spawanEnemy();
    }
    if (Math.random() * config.randomScale < config.bossSpwanFrequency) {
      spawanBoss();
    }
  }
};

const mainGame = () => {
  robotManager();
  bulletMover();
  bulletManager();
  charManager();
  gameManager();
  draw.clearScreen();
  charPrinter();
  bulletPrinter();
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
  // claer variables
  clearInterval(gameState.clock);
  gameState.paused = false;
  gameState.gameOver = false;
  gameState.clock = 0;

  charState.length = 0;
  bulletState.length = 0;

  // creating player
  spawanPlayer();

  clock();
};

const spawanPlayer = () => {
  charState.push({
    position: {
      x: ctx.canvas.width / 2,
      y: ctx.canvas.height / 2,
      angle: 90,
    },
    charSize: config.playerSize,
    charColor: config.playerColor,
    charColorStyle: config.playerColorStyle,
    characterId: 0,
    charSpeed: config.playerSpeed,
    charHealth: config.playerHealth,
    bulletSize: config.playerBulletSize,
    bulletColor: config.playerBulletColor,
    bulletColorStyle: config.playerBulletColorStyle,
    bulletSpeed: config.playerBulletSpeed,
    bulletDamage: config.playerBulletDamage,
  });
};

const spawanEnemy = () => {
  charState.push({
    position: {
      x: Math.random() * ctx.canvas.width,
      y: Math.random() * ctx.canvas.height,
      angle: 90,
    },
    charSize: config.enemySize,
    charColor: config.enemyColor,
    charColorStyle: config.enemyColorStyle,
    characterId: 1,
    charSpeed: config.enemySpeed,
    charHealth: config.enemyHealth,
    bulletSize: config.enemyBulletSize,
    bulletColor: config.enemyBulletColor,
    bulletColorStyle: config.enemyBulletColorStyle,
    bulletSpeed: config.enemyBulletSpeed,
    bulletDamage: config.enemyBulletDamage,
  });
};

const spawanBoss = () => {
  charState.push({
    position: {
      x: Math.random() * ctx.canvas.width,
      y: Math.random() * ctx.canvas.height,
      angle: 90,
    },
    charSize: config.bossSize,
    charColor: config.bossColor,
    charColorStyle: config.bossColorStyle,
    characterId: 2,
    charSpeed: config.bossSpeed,
    charHealth: config.bossHealth,
    bulletSize: config.bossBulletSize,
    bulletColor: config.bossBulletColor,
    bulletColorStyle: config.bossBulletColorStyle,
    bulletSpeed: config.bossBulletSpeed,
    bulletDamage: config.bossBulletDamage,
  });
};

init();
