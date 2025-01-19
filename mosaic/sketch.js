const side = 800;
const nb = 45; // nombre de carré par côté
const rap = side / nb; // taille de chaque carré
const rap2 = rap * 0.5; // taille de chaque carré / 2

let radius = 200;

function setup() {
  createCanvas(side, side);
  colorMode(HSB, 360, 100, 100, 250);
  noLoop();
  angleMode(DEGREES);
}

function draw() {
  background("white");
  // on prend tous les points de la grille
  for (i = 0; i < nb; i++) {
    for (j = 0; j < nb; j++) {
      skwair(i * rap, j * rap);
    }
  }
  radius = (radius + 1) % 600
}

function skwair(x, y) {
  push();
  translate(x + rap2, y + rap2);
  rotate(random() * 25);
  translate(-x - rap2, -y - rap2);
  rand = random()
  if (power(x-side/2) + power(y-side/2) <= radius * radius) {
    fill(60, 100, 75 + 25 * (1- rand) );
  } else {
    fill(160, 100, 25 + 75 * (1 - rand) );
  }
  noStroke();
  rect(x, y, rap);
  pop();
}

function power(a) {
  return a * a;
}