const side = 800; // w & h of canva
const nb = 25 // number of hexagons in top line
const thick = 0.2; // épaisseur entre chaque hexagone

// Calcul des constantes géométriques
const apo_thick = side / (2 * nb);
const apo = apo_thick - thick;
const sq3 = Math.sqrt(3);
const radius_thick = 2 * apo_thick / sq3;
const radius_thick2 = radius_thick / 2;
const radius = 2 * apo / sq3;
const radius2 = radius / 2;

// calcul du nombre d'hexagones par ligne et colone 
const nb_rows = 2 * nb - 1;
const nb_cols = nb

var grad = 0 // variables d'icrémentation du garient
var color_index = 0 // couleur de la case

// grille des cases hexagonales
let grid = new Array(nb_rows).fill().map(() => new Array(nb_cols).fill());

const fr = 0.2; // frame rate
var started = false ;

function setup() {
  createCanvas(0, 0); 
  // pour pas avoir le default canvas et pouvoir centrer le bouton
  
  colorMode(HSB, 360, 100, 100, 250)
  //noLoop()
  frameRate(fr)
  const button = select('#startButton'); // run quand on appuie sur le bouton
  button.mousePressed(() => {
    createCanvas(side, side);
    button.hide();
    start()
  });
  count_cells()
  make_grid()
}

function draw() {
  if (started){
    draw_grid()
    update_all()
    //noLoop()
  }
}

function start(){
  started = true
}

// pour dessiner un hexagone
function draw_hex(hex) {
  const p = hex.points ;
  noStroke()
  if (hex.alive){
    fill("red")
  } else {
    fill("black");
  }

  beginShape();
  vertex(p[0][0], p[0][1])
  vertex(p[1][0], p[1][1])
  vertex(p[2][0], p[2][1])
  vertex(p[3][0], p[3][1])
  vertex(p[4][0], p[4][1])
  vertex(p[5][0], p[5][1])
  endShape();
  
  fill("white")
  text(update_cell(hex),hex.x,hex.y)
  
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

// pour compter le nombre de cells au total dans la grille
// utile pour le gradient
function count_cells() {
  var cnt = 0;
  grid.forEach(i => {
    i.forEach(j => {
      if (j !== undefined) {
        cnt += 1
      }
    });
  });
  return cnt;
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
  var x = (i + 1) * apo_thick
  var y = apo_thick * 2 / sq3 + j * (apo_thick * 2 / sq3 + radius_thick2)
  var alive = false ;
  if (random()*i/j< 0.5){
    alive = true;
  }
  return {
    i: i,
    j: j,
    x: x,
    y: y,
    links: [],
    alive: alive,
    points: get_points(x,y)
  }
}

function update_cell(cell){
  var cnt = 0
  cell.links.forEach(link => {
    if (grid[link[0]][link[1]].alive){
      cnt +=1
    }
  });
  if (cnt == 2 || cnt == 4){
    cell.alive=true;
  } else {
    cell.alive=false;
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
}