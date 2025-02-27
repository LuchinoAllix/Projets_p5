
// URL de l'API Open-Meteo
const url = "https://api.open-meteo.com/v1/forecast";

// Paramètres de la requête
const params = {
    "latitude": 45.4215,
    "longitude": -75.6972,
    "current": [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "is_day",
        "precipitation",
        "rain",
        "cloud_cover",
        "wind_speed_10m",
        "wind_direction_10m"
    ],
    "hourly": "temperature_2m"
};

// variable pour données météo
let data_set =  { time: "2025-02-20T19:00", interval: 900, temperature_2m: 40, relative_humidity_2m: 79, apparent_temperature: 49, is_day: 1, precipitation: 0, rain: 0, cloud_cover: 100, wind_speed_10m: 11.5, wind_direction_10m:302}

// w & h of canva
const side = 800; 

function setup(){
	createCanvas(side, side);
  	noLoop()
	frameRate(10)
  	angleMode(DEGREES);
	colorMode(HSB, 360, 100, 100, 250)

}

let nb_squares = 10
let size_square = side / nb_squares
let colors = ["black","white",getColorFromTemp(data_set.temperature_2m)]
let index = 0

function draw(){
	background("white")

	draw_big()
}

function draw_big(){
	for(i=0;i< nb_squares;i++){
		for(j=0;j< nb_squares;j++){
			draw_squares(i*size_square,j*size_square)
		}
	}
}

function draw_squares(i,j){
	let a = 0
	let size_inner_square = size_square
	index = 0
	let rx = random([0,1])
	let ry = random([0,1])

	while (size_inner_square > 0){
		let diff = size_square-size_inner_square
		push()
		translate(rx*diff,ry*diff)
		fill(colors[index])
		square(i,j,size_inner_square)
		console.log(size_inner_square)
		index = (index+1)%colors.length
		size_inner_square = size_square-(random(2,2.5)*a)
		a++
		pop()
	}
}


function makeURL(url, params){
	const queryString = new URLSearchParams(params).toString();
    return `${url}?${queryString}` ;
}

async function getData(url){
	try {
		const rep = await fetch(url)
  		const data = await rep.json()
		data_set = data.current;
		console.log(data);
	} catch(error) {
		console.error("Erreur lors de la récupération des données météo:", error)
	}
}

async function run(){
	await getData(makeURL(url,params))
	console.log(data_set);
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
	console.log(H)
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

//run()