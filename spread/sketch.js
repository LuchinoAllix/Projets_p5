const side = 800;
const nb = 50; // nombre de carré par côté
const rap = side / nb; // taille de chaque carré
const rap2 = rap * 0.5; // taille de chaque carré / 2

let grid = new Array(nb).fill().map(() => new Array(nb).fill([]));
const color0 = { "H": 60, "S": 100, "B": 65 };
const color1 = { "H": 160, "S": 100, "B": 25 };
const color2 = { "H": 340, "S": 50, "B": 50 };
const colors = [color0, color1, color2]
let color_index = 2;
let angle = -10;
let up = true;
let max_angle = 15;

function setup() {
  createCanvas(side, side);
  colorMode(HSB, 360, 100, 100, 250);
  //noLoop();
  angleMode(DEGREES);
  frameRate(15)
}

function draw() {
  background("white");
  initiate_grid();
  draw_grid();
  maj_angle();
  console.log(angle);
}

function draw_skwair(sq) {
  push();
  translate(sq.x + rap2, sq.y + rap2);
  rotate(sq.a);
  translate(-sq.x - rap2, -sq.y - rap2);
  fill(sq.c.H, sq.c.S, sq.c.B)
  noStroke();
  rect(sq.x, sq.y, rap);
  pop();
}

function make_skwair(x, y, c) {
  c = Object.assign({}, colors[c]);
  //rand = (((nb - (x / rap))) / (nb - (y / rap)) + (angle/max_angle)*2) * random() * 0.8
  rand = (((nb - (x / rap))) / (nb - (y / rap))) * random() * 0.8
  c.B = c.B + (100 - c.B) * (1 - rand)
  c.S = c.S + (100 - c.S) * (1 - rand)
  c.H = c.H + (200 - c.H) * (1 - rand)
  return {
    "x": x,
    "y": y,
    "a": random() * 25, // angle
    "c": c, // couleur
  }
}

function initiate_grid() {
  for (i = 0; i < nb; i++) {
    for (j = 0; j < nb; j++) {
      grid[i][j] = make_skwair(i * rap, j * rap, color_index);
    }
  }
}

function draw_grid() {
  for (i = 0; i < nb; i++) {
    for (j = 0; j < nb; j++) {
      draw_skwair(grid[i][j]);
    }
  }
}

function maj_angle() {
  if (angle == max_angle) {
    up = false;
  } else if (angle == -max_angle)
    up = true;
  if (up) {
    angle += 1
  } else {
    angle -= 1
  }
}
