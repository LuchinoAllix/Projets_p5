const side = 2000;
const nb = 300 ;
const taille = side / nb *2;
const chars = ["(",")","+","!","[","]"];
var col;

function setup() {
  createCanvas(side,side);
  noLoop();
  for (i=0;i<nb/2;i++){
    let x = random(side);
    let t = random(taille,3.5*taille);
    if(random()>0.9){col="red"} else col="black";
    for (j=0;j<nb;j++){
      textFont('Courier New',t);
      fill(col);
      text(random(chars),x,taille*j);
    }
  }
}
