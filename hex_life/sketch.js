const side = 800; // w & h of canva
const nb = 25 // number of hexagons in top line


// Calcul des constantes géométriques
const apo = side / (2 * nb);
const sq3 = Math.sqrt(3);
const radius = 2 * apo / sq3;
const radius2 = radius / 2;

// calcul du nombre d'hexagones par ligne et colone 
const nb_rows = 2 * nb - 1;
const nb_cols = nb

var pos = 0 // position dans la liste 'alive' (états)

// grille des cases hexagonales
let grid = new Array(nb_rows).fill().map(() => new Array(nb_cols).fill());

const fr = 5; // frame rate
var started = false ;

function setup() {
  createCanvas(0, 0); 
  // pour pas avoir le default canvas et pouvoir centrer le bouton
  
  colorMode(HSB, 360, 100, 100, 250)
  frameRate(fr)
  
  const button = select('#startButton'); // run quand on appuie sur le bouton
  button.mousePressed(() => {
    createCanvas(side, side);
    button.hide();
    start()
  });

  make_grid()
  initiate()
}

function draw() {
  if (started){
    draw_grid()
    update_all()
  }
}

function start(){
  started = true
}

// pour dessiner un hexagone
function draw_hex(hex) {
  const p = hex.points ;
  stroke("white")
  if (hex.alive[pos]){
    fill("green")
  } else {
    fill("grey");
  }

  beginShape();
  vertex(p[0][0], p[0][1])
  vertex(p[1][0], p[1][1])
  vertex(p[2][0], p[2][1])
  vertex(p[3][0], p[3][1])
  vertex(p[4][0], p[4][1])
  vertex(p[5][0], p[5][1])
  endShape();
  
}

function draw_grid(){
  grid.forEach(i => {
    i.forEach(j => {
      if (j !== undefined) {
        draw_hex(j);
      }
    });
  });
}

// pour obtenir les points d'un hexagone basé sur son centre
function get_points(x, y) {
  return [
    [x - apo, y - radius2],
    [x, y - apo * 2 / sq3],
    [x + apo, y - radius2],
    [x + apo, y + radius2],
    [x, y + apo * 2 / sq3],
    [x - apo, y + radius2]
  ]
}

// pour créer la grille
function make_grid() {
  for (var i = 0; i < nb_rows; i++) {
    for (var j = (i % 2); j < nb_cols; j += 2) {
      grid[i][j] = make_hex(i, j);
    }
  }
  for (var i = 0; i < nb_rows; i++) {
    for (var j = (i % 2); j < nb_cols; j += 2) {
      if (i - 1 >= 0) {
        if (j - 1 >= 0) {
          grid[i][j].links.push([i - 1, j - 1])
        } if (j + 1 < nb_cols) {
          grid[i][j].links.push([i - 1, j + 1])
        }
      }
      if (i - 2 >= 0) {
        grid[i][j].links.push([i - 2, j])
      }
      if (i + 1 < nb_rows) {
        if (j - 1 >= 0) {
          grid[i][j].links.push([i + 1, j - 1])
        } if (j + 1 < nb_cols) {
          grid[i][j].links.push([i + 1, j + 1])
        }
      }
      if (i + 2 < nb_rows) {
        grid[i][j].links.push([i + 2, j])
      }
    }
  }
  grad = 360 / count_cells()
}

// pour créer l'objet hexagone
function make_hex(i, j) {
  var x = (i + 1) * apo
  var y = apo * 2 / sq3 + j * (apo * 2 / sq3 + radius2)
  return {
    i: i,
    j: j,
    x: x,
    y: y,
    links: [],
    alive: [false,false],
    points: get_points(x,y)
  }
}

function initiate(){
  //todo
}

function update_cell(cell){
  var cnt = 0
  cell.links.forEach(link => {
    if (grid[link[0]][link[1]].alive[pos]){
      cnt +=1
    }
  });
  if (cnt >= 2 && cnt < 5){
    cell.alive[(pos+1)%2]=true;
  } else {
    cell.alive[(pos+1)%2]=false;
  }
  return cnt;
}

function update_all(){
  grid.forEach(i => {
    i.forEach(j => {
      if (j !== undefined) {
        update_cell(j);
      }
    });
  });
  pos = (pos + 1)%2
}