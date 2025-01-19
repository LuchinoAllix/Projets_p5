const side = 800;
const nb = 45; // nombre de carré par côté
const rap = side / nb; // taille de chaque carré
const rap2 = rap * 0.5; // taille de chaque carré / 2

let grid = new Array(nb).fill().map(() => new Array(nb).fill([]));
let radius = 0;
let initiate = true;
const color0 = {"H" :60, "S":100, "B" : 65};
const color1 = {"H" :160, "S":100, "B" : 25};
const color2 = {"H" :340, "S":100, "B" : 50};
const colors = [color0,color1,color2]
let color_index = 0;

function setup() {
  createCanvas(side, side);
  colorMode(HSB, 360, 100, 100, 250);
  //noLoop();
  angleMode(DEGREES);
  frameRate(30);
}

function draw() {
  background("white");

  if (initiate) {
    initiate_grid();
    initiate = false;
    color_index += 1;
  } else {
    update_grid();
  }
  draw_grid();
  radius = (radius + 1) % (1.5 * side/2) // approx de square root 2
  if (radius == 0){
    color_index = (color_index + 1) % colors.length;
  }
}

function draw_skwair(sq) {
  push();
  translate(sq.x + rap2, sq.y + rap2);
  rotate(sq.a);
  translate(-sq.x - rap2, -sq.y - rap2);
  fill(sq.c.H,sq.c.S,sq.c.B)
  noStroke();
  rect(sq.x, sq.y, rap);
  pop();
}

function make_skwair(x, y, c) {
  c = Object.assign({},colors[c]);
  c.B = c.B + (100-c.B) * (1-random())
  return {
    "x": x,
    "y": y,
    "a": random() * 25, // angle
    "c": c, // couleur
  }
}

function power2(a) {
  return a * a;
}

function initiate_grid() {
  for (i = 0; i < nb; i++) {
    for (j = 0; j < nb; j++) {
      grid[i][j] = make_skwair(i * rap, j * rap, color_index);
    }
  }
}

function draw_grid(){
  for (i = 0; i < nb; i++) {
    for (j = 0; j < nb; j++) {
      draw_skwair(grid[i][j]);
    }
  } 
}

function update_grid(){
  for (i = 0; i < nb; i++) {
    for (j = 0; j < nb; j++) {
      if (power2(i * rap - side / 2) + power2(j * rap - side / 2) <= power2(radius)){
        if (grid[i][j].c.H==colors[mod()].H){
          grid[i][j] = make_skwair(i * rap, j * rap,color_index);
        }
      }
    }
  }
}

function mod(){
  if (color_index == 0){
    return colors.length-1;
  } return color_index-1;
}