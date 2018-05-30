var map;
var longitude = "";
var latitude = "";
var directionsDisplay;
var coord="";
var metros = [];
var partida = [];
var chegada = [];
var final = "";
var i = 0;
var inicio = "";
var tempo = [];
var aux="";
var now = "";
var interval = "";
function verifica() {
	if (localStorage.length != 0){
		tempo.push(localStorage.tempo);
		chegada.push(localStorage.chegada);    
		partida.push(localStorage.partida);  
		metros.push(localStorage.metros);  
		chegada = JSON.parse(chegada);
		metros = JSON.parse(metros);	
		tempo = JSON.parse(tempo);
		partida = JSON.parse(partida);
	}
}


function initialize() {	
	var directionsService = new google.maps.DirectionsService();	
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			pontoPadrao = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({
			"location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            },
            function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
		    inicio = results[0].formatted_address;
		}
            });
	});
    }
}




function formatatempo(segs) {
	min = 0;
	hr = 0;
	while(segs>=60) {
		if (segs >=60) {
			segs = segs-60;
			min = min+1;
		}
	}
	
	while(min>=60) {
		if (min >=60) {
			min = min-60;
			hr = hr+1;
		}
	}
	
	if (hr < 10) {hr = "0"+hr}
	if (min < 10) {min = "0"+min}
	if (segs < 10) {segs = "0"+segs}
	fin = hr+":"+min+":"+segs
	return fin;
}
var segundos = 0; 
function conta() {
	segundos++;
	document.getElementById("counter").innerHTML = formatatempo(segundos);
}

function inicia(){
	verifica();
	initialize();	
	interval = setInterval("conta();",1000);
	document.getElementById("planilha").style.display = 'none';	
	document.getElementById("counter").style.display = 'block';
	document.getElementById("btnEnviar").style.display = 'block';
	document.getElementById("iniciar").style.display = 'none';	
	
	
}



function showPosition(position) {
	var directionsService = new google.maps.DirectionsService();	
	document.getElementById("counter").style.display = 'none';
	document.getElementById("btnEnviar").style.display = 'none';
	document.getElementById("iniciar").style.display = 'block';
	tempo.push(document.getElementById("counter").textContent);
	clearInterval(interval);	
	localStorage.tempo = JSON.stringify(tempo);

	var latitude = position.coords.latitude.toString();
	var longitude = position.coords.longitude.toString();
	var g = new google.maps.Geocoder();
	g.geocode({
	  "location": new google.maps.LatLng(latitude, longitude)
	},
	function(results, status) {
	  if (status == google.maps.GeocoderStatus.OK) {
		  final = results[0].formatted_address;
		  chegada.push(final);		  		  
		  localStorage.chegada = JSON.stringify(chegada);
		  
	  }
	});
	coord = latitude+","+longitude;
	var request = {
		origin: inicio,
		destination: coord,
		travelMode: google.maps.TravelMode.DRIVING
	};

	partida.push(request.origin);  
    localStorage.partida = JSON.stringify(partida);
	localStorage.tempo = JSON.stringify(tempo);		
	directionsService.route(request, function(result, status) {				
		metros.push(result.routes[0].legs[0].distance.text);
		localStorage.metros = JSON.stringify(metros);
		
	});	
}

document.getElementById("btnEnviar").addEventListener("click",function () {
	document.getElementById("planilha").style.display = 'block';		
	navigator.geolocation.getCurrentPosition(showPosition);	

});





