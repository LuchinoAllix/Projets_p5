const side = 800
const c = side * 0.5 // center
const color = ["black","yellow"];//,"green","red","white","purple","brown"]; 
const len = color.length
var factor = 0.86

function setup() {
  createCanvas(side, side);
  colorMode(HSB, 360, 100, 100, 250)
  noLoop();
}

function draw() {
  background(color[len-1]);
  for (i = 0; i <= 21; i++ ){
    draw_rect(color[i % len]);
  }
}

function draw_rect(color){
  var o = 42; // offset
  noStroke();
  fill(color);
  quad(
    c - (c + random(-o,o)) * factor, c - (c + random(-o,o)) * factor,
    c + (c + random(-o,o)) * factor, c - (c + random(-o,o)) * factor,
    c + (c + random(-o,o)) * factor, c + (c + random(-o,o)) * factor,
    c - (c + random(-o,o)) * factor, c + (c + random(-o,o)) * factor
    );
  factor *= 0.9 ;
}