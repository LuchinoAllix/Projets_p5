const side = 800; // w & h of canva
const nb = 50 // number of hexagons in top line
const thick = 0; // épaisseur entre chaque hexagone

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

let stack = []; // utilisé dans la création du "maze"

let osc1, osc2;
let isPlaying = false;

const octave = 1.05946;


var doo = 261.63
var ree = 293.66
var mii = 329.63
var faa = 349.23
var sol = 392.00
var laa = 440.00
var sii = 493.88

var note_index = 1;
var notes = [doo,ree,mii,faa,sol,laa,sii]
var all_notes = []

const fr = 42;

function setup() {
  createCanvas(side, side);
  colorMode(HSB, 360, 100, 100, 250)

  frameRate(fr);

  osc1 = new p5.Oscillator('triangle');
  osc2 = new p5.Oscillator('sine');

  make_grid(); // création de la grille
  init()
  console.log(all_notes)
}

// Démarre les oscillateurs lors du clic
function mousePressed() {
  if (!isPlaying) {
    osc1.start();
    osc2.start()
    osc1.amp(0, 0)
    osc2.amp(0, 0)
    isPlaying = true;
  }
}

function init() {
  // selection de la case de départ
  var a = Math.floor(random(2, nb_rows) / 2)
  if (a % 2) { a += 1 }
  console.log(a)
  stack = [grid[a][a - 2]]
  make_all_notes()
}

function draw() {
  if (isPlaying) {
    draw_next()
  }
}

function make_all_notes(){
  for(i=2; i>0;i--){
    for(j=0;j<notes.length;j++){
      all_notes.push(notes[j] / (octave * i))
    }
  }
  for(j=0;j<notes.length;j++){
    all_notes.push(notes[j] )
  }
  for(i=1; i<3;i++){
    for(j=0;j<notes.length;j++){
      all_notes.push(notes[j] * (octave * i))
    }
  }
}

function draw_next() {
  var current_cell = stack[stack.length - 1]
  if (!current_cell.visited) {
    draw_hex(current_cell);
    play_note();
    current_cell.visited = true;
  } else {
    osc1.amp(0.3, 0.1)
    osc2.amp(0.1, 0.1)
  }
  var next_cell_index = get_random_unvisited_neighbour(current_cell);
  if (next_cell_index == -1) {
    stack.pop()
    if (stack.length == 0) {
      osc1.stop()
      osc2.stop()
      stopp // error pour stop
    }
  } else {
    open(current_cell, next_cell_index);
    var l = current_cell.links[next_cell_index]
    stack.push(grid[l[0]][l[1]]);
  }
}

function play_note() {
  var freq = all_notes[note_index]
  console.log(note_index)
  osc1.freq(freq);
  osc2.freq(freq / octave);
  osc1.amp(0.6, 0.1);
  osc2.amp(0.3, 0.1);

  if(random()>0.5){
    note_index++;
    if (note_index>=all_notes.length){
      note_index-=2;
    }
  } else {
    note_index--;
    if (note_index<0){
      note_index+=2;
    }
  }
}


// pour dessiner un hexagone
function draw_hex(hex) {
  const p = get_points(hex.x, hex.y);
  noStroke()
  fill(color_index, 25 + color_index % 75, 60 + color_index % 40);

  beginShape();
  vertex(p[0][0], p[0][1])
  vertex(p[1][0], p[1][1])
  vertex(p[2][0], p[2][1])
  vertex(p[3][0], p[3][1])
  vertex(p[4][0], p[4][1])
  vertex(p[5][0], p[5][1])
  endShape();

  color_index += grad;
}

// pour compter le nombre de cells au total dans la grille
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
  return {
    i: i,
    j: j,
    x: (i + 1) * apo_thick,
    y: apo_thick * 2 / sq3 + j * (apo_thick * 2 / sq3 + radius_thick2),
    walls: [true, true, true, true, true, true],
    links: [],
    visited: false
  }
}

// pour obtenir un hexagone voisin non visité
function get_random_unvisited_neighbour(hex) {
  var fails = 0;
  var n = Math.floor(random(0, hex.links.length));
  while (fails < hex.links.length) {
    var l = hex.links[n]
    if (grid[l[0]][l[1]].visited == false) {
      return n;
    } else {
      n = (n + 1) % hex.links.length
      fails += 1
    }
  }
  return -1
}

// pour indiquer quel chemin est déjà pris
function open(hex, n) {
  var index = hex.links[n]
  var door = -1;
  if (index[0] == hex.i + 1) {
    if (index[1] == hex.j + 1) {
      door = 3;
    } else if (index[1] == hex.j - 1) {
      door = 1;
    }
  } else if (index[0] == hex.i - 2 && index[1] == hex.j) {
    door = 5;
  } else if (index[0] == hex.i + 2 && index[1] == hex.j) {
    door = 2;
  } else if (index[0] == hex.i - 1) {
    if (index[1] == hex.j + 1) {
      door = 4;
    } else if (index[1] == hex.j - 1) {
      door = 0;
    }
  }
  hex.walls[door] = false;
  var l = hex.links[n]
  grid[l[0]][l[1]].walls[(door + 3) % 6] = false
}