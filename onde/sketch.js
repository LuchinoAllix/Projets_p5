const side = 800;
const nb = 100; // nombre de carré par côté
const rap = side / nb; // taille de chaque carré
const rap2 = rap * 0.5; // taille de chaque carré / 2

let grid = new Array(nb).fill().map(() => new Array(nb).fill([]));
let radius = 0;
let initiate = true;
const color = {"H" :120, "S":50, "B" : 25};



function setup() {
  createCanvas(side, side);
  colorMode(HSB, 360, 100, 100, 250);
  angleMode(DEGREES);
  frameRate(5);
}

function draw() {
  background("white");

  if (initiate) {
    initiate_grid();
    initiate = false;
  } else {
    update_grid();
  }
  randomize()
  draw_grid()
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
  c = Object.assign({},color);
  c.B = c.B + (100-c.B) * (1-random())
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
      grid[i][j] = make_skwair(i * rap, j * rap);
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
      grid[i][j].c = averageHsb(get_colors(i,j));
    }
  }
}

function get_colors(a,b){
  var next_colors = [] ;
  if (a != 0){
    next_colors.push(grid[a-1][b].c)
  } if (a != nb-1){
    next_colors.push(grid[a+1][b].c)
  } if (b != 0){
    next_colors.push(grid[a][b-1].c)
  } if (b != nb-1){
    next_colors.push(grid[a][b+1].c)
  } return next_colors ;
}

function averageHsb(colors) {
  let totalH = 0, totalS = 0, totalB = 0;

  for (let i = 0; i < colors.length; i++) {
      totalH += colors[i].H;
      totalS += colors[i].S;
      totalB += colors[i].B;
  }

  let avgH = totalH / colors.length;
  let avgS = totalS / colors.length;
  let avgB = totalB / colors.length;

  return { H: avgH, S: avgS, B: avgB };
}

function randomize(){
  var i = floor(random(nb));
  var j = floor(random(nb));
  var h = random()*360;
  var s = random()*360;
  var bb = random()*360;
  var radius = floor(random(side/10));
  for (a=0;a<=radius;a++){
    for (b=0;b<=radius;b++){
      if (i+a < nb -1){
        if (j+b < nb -1){
          grid[i+a][j+b].c.H += h
          grid[i+a][j+b].c.H %= 360
          grid[i+a][j+b].c.S += s
          grid[i+a][j+b].c.S %= 100
          grid[i+a][j+b].c.B += bb
          grid[i+a][j+b].c.B %= 100
        }
      }
    }
  }
}

