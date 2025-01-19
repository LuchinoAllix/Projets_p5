var ratio_Canvas = 0.75 ;
var width_Canvas = 700 ;
var height_Canvas = width_Canvas * ratio_Canvas ;
var center_Canvas_x = width_Canvas /2 ; 
var center_Canvas_y = height_Canvas /2 ; 

function setup() {
  createCanvas(width_Canvas,height_Canvas);
}

function draw() {
  background(220);
  textSize(random(10,100));
  textAlign(CENTER);
  fill(random(255),random(255),random(255))
  text("ᓚᘏᗢ", center_Canvas_x + random(-50,50), center_Canvas_y + random(-50,50));
}


