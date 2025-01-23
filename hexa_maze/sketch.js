const side = 800;
const nb = 21;
const apo_thick = side / ( 2 * nb);
const thick = 3;
const apo = apo_thick - thick;
const sq3 = Math.sqrt(3);
const radius_thick = 2 * apo_thick / sq3;
const radius_thick2 = radius_thick / 2;
const radius = 2 * apo / sq3;
const radius2 = radius / 2;

const nb_rows = 2*nb-1;
const nb_cols = nb

const side_color = "gold";

var start_color_index = 0

let grid = new Array(nb_rows).fill().map(() => new Array(nb_cols).fill());

var start;
var finish;
var stack2;
var finished = false;
var init = false

function setup() {
  createCanvas(side, side);
  colorMode(HSB, 360, 100, 100, 250)
  frameRate(2);
  //noLoop();
  
  
}

function draw() { // to make work
  if (!init){
    make_grid()
    make_maze()
    draw_grid()
    start = grid[0][0];
    finish = grid[nb_rows-1][nb_cols-1];
    stack2 = [start];
    console.log(start)
    console.log(stack2)
    draw_inner_hex(start);
    init = true;
  }
  if(start_color_index > 1){yay}
  console.log("stack2 :")
  console.log(stack2)
  if (finished){ yay } else {
    stack2[0].explored = true;
    draw_inner_hex(stack2[0]);
    stack2[0].links.forEach(link => {
      console.log(link)
      var v = grid[link[0]][link[1]];
      if (v.i == finish.i && v.j == finish.j){finished=true}
      if ( ! v.explored ){
        stack2.push(v);
      } 
    })
    stack2.splice(0,1);
  } 
  if (stack2.length == 0){
    yay
  }
}

function drawHex(hex) {
  const points = get_points(hex.x, hex.y);
  for (i = 0; i < 12; i += 2) {
    if (hex.walls[i / 2]) {
      fill("gold");
      noStroke()
      quad(
        points[i][0], points[i][1],
        points[(i + 1) % 12][0], points[(i + 1) % 12][1],
        points[(i + 3) % 12][0], points[(i + 3) % 12][1],
        points[(i + 2) % 12][0], points[(i + 2) % 12][1],
      )
      // pour debug
      //text(hex.i + " " + hex.j,hex.x,hex.y)
    }
  }
}

function draw_inner_hex(hex){
  const points = get_points(hex.x, hex.y);
  fill(start_color_index,50,50);
  noStroke()
  beginShape();
  vertex(points[1][0],points[1][1])
  vertex(points[3][0],points[3][1])
  vertex(points[5][0],points[5][1])
  vertex(points[7][0],points[7][1])
  vertex(points[9][0],points[9][1])
  vertex(points[11][0],points[11][1])
  endShape();
  start_color_index+=1;
}

function get_points(x, y) {
  return [
    [x - apo_thick, y - radius_thick2], // 0
    [x - apo, y - radius2], // 1
    [x, y - apo_thick * 2 / sq3], // 2
    [x, y - apo * 2 / sq3], // 3
    [x + apo_thick, y - radius_thick2], // 4
    [x + apo, y - radius2], // 5
    [x + apo_thick, y + radius_thick2], // 6
    [x + apo, y + radius2], //7
    [x, y + apo_thick * 2 / sq3], //8
    [x, y + apo * 2 / sq3], // 9
    [x - apo_thick, y + radius_thick2], // 10
    [x - apo, y + radius2] // 11
  ]
}

function make_grid() {
  for (var i = 0; i < nb_rows; i++) {
    for (var j = (i%2); j < nb_cols; j+=2) {
      grid[i][j] = make_hex(i,j);
    }
  }
  for (var i = 0; i < nb_rows; i++) {
    for (var j = (i%2); j < nb_cols; j+=2) {
      if (i-1 >= 0){
        if (j-1 >= 0){
          grid[i][j].links.push([i-1,j-1])
        } if (j+1 <  nb_cols ){
          grid[i][j].links.push([i-1,j+1])
        }
      }
      if (i-2 >= 0){
        grid[i][j].links.push([i-2,j])
      }
      if (i+1 <  nb_rows ){
        if (j-1 >= 0){
          grid[i][j].links.push([i+1,j-1])
        } if (j+1 < nb_cols){
          grid[i][j].links.push([i+1,j+1])
        }  
      }
      if (i+2 < nb_rows){
        grid[i][j].links.push([i+2,j])
      }
    }
  }
}

function draw_grid(){
  for (var i = 0; i < nb_rows; i++) {
    for (var j = (i%2); j < nb_cols; j+=2) {
      drawHex(grid[i][j]);

    }
  }
}

function make_hex(i, j) {
  return {
    i:i,
    j:j,
    x: (i+1) *apo_thick,
    y: apo_thick * 2 / sq3 + j * (apo_thick * 2 / sq3 + radius_thick2),
    walls: [true, true, true, true, true, true],
    links: [],
    visited: false,
    explored: false
  }
}

function make_maze(){
  var a = Math.floor(nb_rows /2)
  if (a%2){a+=1}
  var stack = [grid[a][a-2]]
  while (stack.length > 0){
    var current_cell = stack[stack.length-1]
    current_cell.visited = true;
    var next_cell_index = get_random_unvisited_neighbour(current_cell);
    if (next_cell_index == -1){
      stack.pop()
    } else {
      open(current_cell,next_cell_index);
      var l = current_cell.links[next_cell_index]
      stack.push(grid[l[0]][l[1]]);
    }
  }
}

function get_random_unvisited_neighbour(hex){
  var fails = 0;
  var n = Math.floor(random(0,hex.links.length));
  while (fails < hex.links.length){
    var l = hex.links[n]
    if (grid[l[0]][l[1]].visited == false){
      return n;
    } else {
      n = (n+1)%hex.links.length
      fails +=1
    }
  }
  return -1
}

function open(hex,n){
  var index = hex.links[n]
  var door = -1;
  if(index[0]==hex.i+1){
    if (index[1]==hex.j+1){
      door = 3;
    } else if (index[1]==hex.j-1) {
      door = 1;
    }
  } else if ( index[0] == hex.i-2 && index[1] == hex.j){
    door = 5;
  } else if ( index[0] == hex.i+2 && index[1] == hex.j){
    door = 2;
  } else if(index[0]==hex.i-1){
    if (index[1]==hex.j+1){
      door = 4;
    } else if (index[1]==hex.j-1) {
      door = 0;
    }
  }
  hex.walls[door] = false;
  var l = hex.links[n]
  grid[l[0]][l[1]].walls[(door+3)%6] = false
}