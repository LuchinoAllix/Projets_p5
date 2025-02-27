
// URL de l'API Open-Meteo
const url = "https://api.open-meteo.com/v1/forecast";

// Paramètres de la requête
const params = {
    "latitude": 0,
    "longitude": 0,
    "current": [
        "temperature_2m",
        "wind_direction_10m"
    ]
};

// w & h of canva
const side = 600; 

// nombre de carrées sur un côté
let nb_squares = 10
let size_square = side / nb_squares
let colors = ["black","white","white"]
let index = 0

function setup(){
	createCanvas(side, side);
  	noLoop()
	colorMode(HSB, 360, 100, 100, 250)
}

function draw(){
	background("white")
	draw_big()
}

async function draw_big(){
	for(i=0;i< nb_squares;i++){
		for(j=0;j< nb_squares;j++){
			let data = await getData(makeURL(url,5*i,5*j,params));
			if(data === undefined){
				data = {wind_direction:0,temperature_2m:0}
			}
			draw_squares(i*size_square,j*size_square,data.wind_direction_10m,data.temperature_2m)
		}
	}
}

function draw_squares(i,j,angle,temp){
	let a = 0
	let size_inner_square = size_square
	index = 0
	let pair = getDirFromAngle(angle)
	colors[colors.length-1] = getColorFromTemp(temp)
	while (size_inner_square > 0){
		let diff = size_square-size_inner_square
		push()
		translate(pair[0]*diff,pair[1]*diff)
		fill(colors[index])
		square(i,j,size_inner_square)
		index = (index+1)%colors.length
		size_inner_square = size_square-(random(2,2.5)*a)
		a++
		pop()
	}
}

function makeURL(url,lat,long, params){
	params.latitude = lat;
	params.longitude = long;
	const queryString = new URLSearchParams(params).toString();
    return `${url}?${queryString}` ;
}

async function getData(url){
	try {
		const rep = await fetch(url)
  		const data = await rep.json()
		return  data.current;
	} catch(error) {
		console.error("Erreur lors de la récupération des données météo:", error)
	}
}

function getColorFromTemp(temp) {
	let H = 0
	let S = 0
	let B = 50
	if (temp>0){
		S = 4*temp 
	} else if(temp<0){
		H = 245
		S = -4*temp 
	}
    return [H,S,B]
}

function getDirFromAngle(angle){
	if(angle<90 ){
		return [1,0]
	} else if(angle < 180){
		return [1,1]
	} else if(angle < 270){
		return [0,1]
	}
	return [0,0]
}
