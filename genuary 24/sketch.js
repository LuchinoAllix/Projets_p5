const side = 800;
const nb = 45; // nombre de carré par côté
const rap = side / nb; // taille de chaque carré
const rap2 = rap * 0.5; // taille de chaque carré / 2

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
}

function skwair(x, y) {
  push();
  rand = random() *0.7;
  translate(x + rap2, y + rap2);
  rotate(rand * 45);
  translate(-x - rap2, -y - rap2);
  fill(160, 100 , 100 * (1 - rand));
  noStroke();
  rect(x, y, rap*0.9);
  pop();
}

// Rotation :
// https://stackoverflow.com/questions/65900807/how-do-i-rotate-a-rectangle-shape-from-a-specific-point-in-p5-js