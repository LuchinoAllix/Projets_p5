
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

let data_set;

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

run()