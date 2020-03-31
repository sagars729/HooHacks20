//var instance = M.FormSelect.getInstance(elem);
USA = {'Mississippi': {lat: 32.741646, lng: -89.678696}, 'Oklahoma': {lat: 35.565342, lng: -96.928917}, 'Delaware': {lat: 39.318523, lng: -75.507141}, 'Minnesota': {lat: 45.694454, lng: -93.900192}, 'Illinois': {lat: 40.349457, lng: -88.986137}, 'Arkansas': {lat: 34.969704, lng: -92.373123}, 'New Mexico': {lat: 34.840515, lng: -106.248482}, 'Indiana': {lat: 39.849426, lng: -86.258278}, 'Maryland': {lat: 39.063946, lng: -76.802101}, 'Louisiana': {lat: 31.169546, lng: -91.867805}, 'Idaho': {lat: 44.240459, lng: -114.478828}, 'Wyoming': {lat: 42.755966, lng: -107.30249}, 'Tennessee': {lat: 35.747845, lng: -86.692345}, 'Arizona': {lat: 33.729759, lng: -111.431221}, 'Iowa': {lat: 42.011539, lng: -93.210526}, 'Michigan': {lat: 43.326618, lng: -84.536095}, 'Kansas': {lat: 38.5266, lng: -96.726486}, 'Utah': {lat: 40.150032, lng: -111.862434}, 'Virginia': {lat: 37.769337, lng: -78.169968}, 'Oregon': {lat: 44.572021, lng: -122.070938}, 'Connecticut': {lat: 41.597782, lng: -72.755371}, 'Montana': {lat: 46.921925, lng: -110.454353}, 'California': {lat: 36.116203, lng: -119.681564}, 'Massachusetts': {lat: 42.230171, lng: -71.530106}, 'West Virginia': {lat: 38.491226, lng: -80.954453}, 'South Carolina': {lat: 33.856892, lng: -80.945007}, 'New Hampshire': {lat: 43.452492, lng: -71.563896}, 'Wisconsin': {lat: 44.268543, lng: -89.616508}, 'Vermont': {lat: 44.045876, lng: -72.710686}, 'Georgia': {lat: 33.040619, lng: -83.643074}, 'North Dakota': {lat: 47.528912, lng: -99.784012}, 'Pennsylvania': {lat: 40.590752, lng: -77.209755}, 'Florida': {lat: 27.766279, lng: -81.686783}, 'Alaska': {lat: 61.370716, lng: -152.404419}, 'Kentucky': {lat: 37.66814, lng: -84.670067}, 'Hawaii': {lat: 21.094318, lng: -157.498337}, 'Nebraska': {lat: 41.12537, lng: -98.268082}, 'Missouri': {lat: 38.456085, lng: -92.288368}, 'Ohio': {lat: 40.388783, lng: -82.764915}, 'Alabama': {lat: 32.806671, lng: -86.79113}, 'New York': {lat: 42.165726, lng: -74.948051}, 'South Dakota': {lat: 44.299782, lng: -99.438828}, 'Colorado': {lat: 39.059811, lng: -105.311104}, 'New Jersey': {lat: 40.298904, lng: -74.521011}, 'Washington': {lat: 47.400902, lng: -121.490494}, 'North Carolina': {lat: 35.630066, lng: -79.806419}, 'District of Columbia': {lat: 38.897438, lng: -77.026817}, 'Texas': {lat: 31.054487, lng: -97.563461}, 'Nevada': {lat: 38.313515, lng: -117.055374}, 'Maine': {lat: 44.693947, lng: -69.381927}, 'Rhode Island': {lat: 41.680893, lng: -71.51178}}

function initMap() {
  var kansas = {lat: 38.500000 , lng: -98.000000};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: kansas
  });
	
  return map;
  /*for (var name in USA) {
	markerWindow(USA[name], 1000, name, map); //1000 should be replaced with the actual prediction
  }*/
}

function markerWindow(loc, predictedCases , name, map){
	var cases = parseInt(predictedCases)
	var ventilators = Math.floor(.01*cases)
	var beds = Math.floor(.05*cases)
	var	state = name
    var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">' + state + '</h1>'+
      '<div id="bodyContent">'+
      'Predicted Total Cases: ' + cases +  '</p>' +
      'Predicted number ventilators needed: ' + ventilators + '</p>' +
      'Predicted number beds needed: ' + beds + '</p>'
      '</div>'+
      '</div>';

  	var infowindow = new google.maps.InfoWindow({
    	content: contentString
 	 });

  	var marker = new google.maps.Marker({
    	position: loc,
    	map: map,
        label: "" + cases
 	 });
  	
	marker.addListener('click', function() {
    	infowindow.open(map, marker);
		document.getElementById("name").innerHTML = "" + name;
		document.getElementById("cases").innerHTML = "" + cases;
		document.getElementById("vents").innerHTML = "" + ventilators;
		document.getElementById("beds").innerHTML = "" + beds;
		
 	});
}

$(document).ready(function(){
  $('select').formSelect();
});

function server_email(em, date, name, cases, vents, beds){
	d = {'email': em, 'name': name, 'cases': cases, 'vents': vents, 'beds': beds, 'date': date}
	console.log(d)
}

function get_dates(){
	d = {}
	$.get({
       url: '/covid_dates',
       data: d,
       success: function(data){
       		for(x in data["past"]) add_option(data["past"][x]);
			for(x in data["pred"]) add_option(data["pred"][x]);
       },
       error: function(data){
           console.log(data)
       }
    });
}

function add_option(date) {
	var op = document.createElement("option")
	op.text = date
	document.getElementById("date_picker").add(op)
	$('select').formSelect();
}

function get_data(){
	date = document.getElementById("date_picker").selectedOptions[0].value;
	d = {'date': date}
	$.get({
       url: '/covid_data',
       data: d,
       success: function(data){
           	map = initMap();
			var tot = 0;
            for(i in data["past"]){
				markerWindow(USA[data["past"][i]["Location"]], data["past"][i]["Cases"], data["past"][i]["Location"], map);
            	tot += parseInt(data["past"][i]["Cases"])
			}
			for(i in data["pred"]){
				markerWindow(USA[data["pred"][i]["Location"]], data["pred"][i]["Cases"], data["pred"][i]["Location"], map);
				tot += parseInt(data["pred"][i]["Cases"])
			}
			document.getElementById("total_cases").innerHTML = tot;
			var ventilators = Math.floor(.01*tot)
			var beds = Math.floor(.05*tot)
			
			document.getElementById("total_vents").innerHTML = Math.floor(ventilators)
			document.getElementById("total_beds").innerHTML = Math.floor(beds)
       },
       error: function(data){
           console.log(data)
       }
    });
} 

function server_email(em, date, name, cases, vents, beds){
	d = {'email': em, 'name': name, 'cases': cases, 'vents': vents, 'beds': beds, 'date': date}
	console.log(d)
	$.get({
       url: '/covid_email',
       data: d,
       success: function(data){
           console.log(data)
		   alert("Your Email Has Been Subscribed!")
       },
       error: function(data){
           console.log(data)
       }
    });
}

function send_email(){
	name = document.getElementById("name").innerHTML 
	date = document.getElementById("date_picker").selectedOptions[0].value;
	cases = document.getElementById("cases").innerHTML
	vents = document.getElementById("vents").innerHTML
	beds = document.getElementById("beds").innerHTML 
	em = document.getElementById("s_email").value

	server_email(em, date, name, cases, vents, beds)
}

function send_total_email(){
	name = "US"
	date = document.getElementById("date_picker").selectedOptions[0].value;
	cases = document.getElementById("total_cases").innerHTML
	vents = document.getElementById("total_vents").innerHTML
	beds = document.getElementById("total_beds").innerHTML 
	em = document.getElementById("s_total_email").value

	server_email(em, date, name, cases, vents, beds);
}

dates = get_dates();
console.log(dates);
