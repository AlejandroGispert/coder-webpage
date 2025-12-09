const canvas = document.getElementById("canvas1");

const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

//get mouse pos
let mouse = {
  x: null,
  y: null,
  radius: (canvas.height / 80) * (canvas.width / 80),
};

//event listener for mouse when it moves
window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

//create particle

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  //method to draw individual particle
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = "#002B21";
    ctx.fill();
  }

  // check particle position, check mouse position, move the particle, draw the particle
  update() {
    //check if particle is still within canvas
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    //check collision
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
        this.x += 10;
      }
      if (mouse.x > this.x && this.x > this.size * 10) {
        this.x -= 10;
      }
      if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
        this.y += 10;
      }
      if (mouse.y > this.y && this.y > this.size * 10) {
        this.y -= 10;
      }
    }
    //move particle
    this.x += this.directionX;
    this.y += this.directionY;
    // Draw particle
    this.draw();
  }
}

//create particle array
function init() {
  particlesArray = [];
  let numberOfParticles = (canvas.height * canvas.width) / 9000;
  for (let i = 0; i < numberOfParticles * 2; i++) {
    let size = Math.random() * 5 + 1;
    let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
    let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
    let directionX = Math.random() * 5 - 2.5;
    let directionY = Math.random() * 5 - 2.5;
    let color = "#002B21";

    particlesArray.push(
      new Particle(x, y, directionX, directionY, size, color)
    );
  }
}

//check if particles are close
function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let distance =
        (particlesArray[a].x - particlesArray[b].x) *
          (particlesArray[a].x - particlesArray[b].x) +
        (particlesArray[a].y - particlesArray[b].y) *
          (particlesArray[a].y - particlesArray[b].y);
      if (distance < (canvas.width / 7) * (canvas.height / 7)) {
        opacityValue = 1 - distance / 20000;
        ctx.strokeStyle = "rgba(0,43,33,1" + opacityValue + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

//animation loop
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
}

//resize event
window.addEventListener("resize", function () {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  mouse.radius = (canvas.height / 80) * (canvas.height / 80);
  init();
});

//mouse out event
window.addEventListener("mouseout", function () {
  mouse.x = undefined;
  mouse.y = undefined;
});

//scroll event for Alejandro logo opacity and Portfolio h1
window.addEventListener("scroll", function () {
  const scrollPosition =
    window.pageYOffset || document.documentElement.scrollTop;
  const svg1 = document.querySelector(".svg1-container");
  const svg2 = document.querySelector(".svg2-container");
  const portfolioH1 = document.querySelector("header h1");

  if (svg1 && svg2) {
    // Start fading at scroll position 50, fully faded at 200
    const maxScroll = 200;
    const minOpacity = 0.3;
    const scrollFactor = Math.min(scrollPosition / maxScroll, 1);
    const opacity = 1 - scrollFactor * (1 - minOpacity);

    svg1.style.opacity = opacity;
    svg2.style.opacity = opacity;
  }

  if (portfolioH1) {
    // Start fading Portfolio immediately, fully invisible at 100px scroll
    const maxScroll = 100;
    const scrollFactor = Math.min(scrollPosition / maxScroll, 1);
    const opacity = 0.5 * (1 - scrollFactor); // Start at 0.5, fade to 0

    portfolioH1.style.opacity = opacity;
  }
});

init();
animate();
