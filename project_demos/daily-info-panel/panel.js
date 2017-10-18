//Start all panel functions once page is ready
$(document).ready( function(){
    startTime(); 
    updateWeather(); 
    setDate();
    setSunriseSunset();
    //getParkingData();
    $("#parking-data").attr("src", "https://secure.parking.ucf.edu/GarageCount");
    initMap();
    refreshParkingData();
    
});

//Begin keeping and displaying time
//Basis for clock function taken from:
//http://www.w3schools.com/js/tryit.asp?filename=tryjs_timing_clock
function startTime() {
    var today = new Date();
    var hour = today.getHours();
    var AMPM = "AM";
    if(hour > 11){
        AMPM = "PM";
    }
    hour = hour%12;
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    minutes = formatTime(minutes);
    seconds = formatTime(seconds);
    document.getElementById('clock').innerHTML =
    hour + ":" + minutes + " " + AMPM;// + ":" + seconds; removed seconds
    var t = setTimeout(startTime, 500);	//restart function every 500 ms

}

    //Helper function for timer, adds zeros for familiar formatting
    function formatTime(i) {
        if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
        return i;
    }

function updateWeather() {
    var weatherData = getWeatherData();
    var parsedWeatherData = JSON.parse(weatherData);
    
    var actualTemp = parsedWeatherData.current_observation.temperature_string;
    var feelTemp = parsedWeatherData.current_observation.feelslike_string;
    var weatherIcon = getIcon(parsedWeatherData.current_observation.icon);
    var humidity = parsedWeatherData.current_observation.relative_humidity;
    var UV = parsedWeatherData.current_observation.UV;
    var weatherstring = parsedWeatherData.current_observation.weather;
    //chance of rain
    
    $("#temp-real").html(actualTemp);
    $("#temp-feel").html(feelTemp);
    $("#weather-icon").html(weatherIcon);
    $("#humidity").html(humidity);  //update humidity 		
    $("#UV").html(UV);              //update UV 			
    //update chance of rain $("#chance-of-rain").html();
    $("#weather-string").html(weatherstring);

    var tt = setTimeout(updateWeather, 360000);	//fetch weather every 6 min
    
    //Helper function for updateWeather(), Gets weather data via json request and returns it as a JSON string
    function getWeatherData(){

        //var apiKey = "";
        
        var connectionString = "https://api.wunderground.com/api/"+apiKey+"/conditions/q/FL/Oviedo.json";
        //var weatherData = httpGet(connectionString);
            
        var Httpreq = new XMLHttpRequest();
        Httpreq.open("GET", connectionString, false);
        Httpreq.send(null);
        
        return Httpreq.responseText;
        
    }
    
    // Maps icon information from the WU API to icons from weather-icons
    function getIcon(iconName){
        
        var iconHtml = "";
        
        switch(iconName){
            
            case "chanceofflurries":
                iconHtml = "<i class='wi wi-snow'></i>";
                break;
            case "chanceofrain":
                iconHtml = "<i class='wi wi-rain'></i>";
                break;
            case "chanceofsleet":
                iconHtml = "<i class='wi wi-sleet'></i>";
                break;
            case "chanceofsnow":
                iconHtml = "<i class='wi wi-snow'></i>";
                break;
            case "chanceofathunderstorm":
                iconHtml = "<i class='wi wi-thunderstorm'></i>";
                break;
            case "clear":
                iconHtml = "<i class='fa fa-smile-o'></i>";
                break;
            case "cloudy":
                iconHtml = "<i class='wi wi-cloudy'></i>";
                break;
            case "flurries":
                iconHtml = "<i class='wi wi-snow'></i>";
                break;
            case "hazy":
                iconHtml = "<i class='wi wi-day-haze'></i>";
                break;
            case "mostlycloudy":
                iconHtml = "<i class='wi wi-cloud'></i>";
                break;
            case "mostlysunny":
                iconHtml = "<i class='wi wi-day-sunny'></i>";
                break;
            case "partlycloudy":
                iconHtml = "<i class='wi wi-cloud'></i>";
                break;
            case "partlysunny":
                iconHtml = "<i class='wi wi-day-cloudy'></i>";
                break;
            case "rain":
                iconHtml = "<i class='wi wi-day-rain'></i>";
                break;
            case "sleet":
                iconHtml = "<i class='wi wi-day-sleet'></i>";
                break;
            case "snow":
                iconHtml = "<i class='wi wi-snow'></i>";
                break;
            case "sunny":
                iconHtml = "<i class='wi wi-day-sunny'></i>";
                break;
            case "thunderstorm":
                iconHtml = "<i class='wi wi-day-thunderstorm'></i>";
                break;
            case "unknown":
                iconHtml = "<i class='fa fa-question'></i>";
                break;
            default:
                iconHtml = "<i class='fa fa-question'></i>";
        }
        return iconHtml;
    }
}

//Displays the date in a familiar, legible format.
function setDate(){
                    
    var today = new Date();
    var weekDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var weekDay = weekDays[today.getDay()];
    var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November","December"];
    var month = monthNames[today.getMonth()];
    var day = today.getDate();
    var year = today.getFullYear();
    
    var dateString = weekDay+" "+month+" "+day+", "+year;
    $('#date').html(dateString);
    var t = setTimeout(setDate, 1000);	//Restart function every 1000 ms (1 second)
}

function setSunriseSunset(){
    sunriseSunsetData = JSON.parse(getSunriseSunset());
    var sunrise = convertUTCtoLocal("01/01/1999 "+sunriseSunsetData.results.sunrise+" UTC");
    var sunset = convertUTCtoLocal("01/01/1999 "+sunriseSunsetData.results.sunset+" UTC");
    
    $("#sunrise").html(sunrise);
    $("#sunset").html(sunset);
    
    var t = setTimeout(startTime, 500000);	//restart function 
    
    function getSunriseSunset(){
        var connectionString = "https://api.sunrise-sunset.org/json?lat=28.613474&lng=-81.200157";
        
        var Httpreq = new XMLHttpRequest();
        Httpreq.open("GET", connectionString, false);
        Httpreq.send(null);
        
        return Httpreq.responseText;
    }
}

function convertUTCtoLocal(time){	//Big ups to digitalbath! http://stackoverflow.com/questions/6525538/convert-utc-date-time-to-local-date-time-using-javascript
    var localTimeFull = new Date(time);
    var hour = localTimeFull.getHours();
    var AMPM = "AM";
    if(hour > 11){
        AMPM = "PM";
    }
    hour = hour%12;
    var minutes = localTimeFull.getMinutes();
    minutes = formatTime(minutes);
    
    var localTime = hour + ":" + minutes + " " + AMPM;
    
    return localTime;  
}

/*function getParkingData(){
    var garageCounts = $.get("http://localhost/garages", function(data){
         $("#garages").html(
            "<tr><td>Garage A</td><td>"+data[0]+"</td></tr>"+
            "<tr><td>Garage B</td><td>"+data[1]+"</td></tr>"+
            "<tr><td>Garage C</td><td>"+data[2]+"</td></tr>"+
            "<tr><td>Garage D</td><td>"+data[3]+"</td></tr>"+
            "<tr><td>Garage H</td><td>"+data[4]+"</td></tr>"+
            "<tr><td>Garage I</td><td>"+data[5]+"</td></tr>"+
            "<tr><td>Garage Libra</td><td>"+data[6]+"</td></tr>"
        );
    });
}*/

function refreshParkingData(){
    //$("#parking-data").contentWindow.location.reload(); //reload parking iframe
    $("#parking-data").src = $("#parking-data").src;
    var t = setTimeout(setDate, 300000);
}

function initMap() {
						 
    var location = {lat: 28.602784, lng: -81.202022};	//Select a location by coord
    //change to center on uni latlong
    var mapDiv = document.getElementById('map');	//Find div for map
    var map = new google.maps.Map(mapDiv, {			//Create map in map div, pass in properties
        center: location,
        zoom: 13
    });
    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
}

/*function getParkingData(){
    
    //var $ = getCounts();

    var garageCounts = [0,0,0,0,0,0,0];

    var $ = getCounts();
    
    garageCounts[0] = $("#gvCounts_DXDataRow0").find("strong").html();	//Get garage counts by unique IDs, stored in config
    garageCounts[1] = $("#gvCounts_DXDataRow1").find("strong").html();
    garageCounts[2] = $("#gvCounts_DXDataRow2").find("strong").html();
    garageCounts[3] = $("#gvCounts_DXDataRow3").find("strong").html();
    garageCounts[4] = $("#gvCounts_DXDataRow4").find("strong").html();
    garageCounts[5] = $("#gvCounts_DXDataRow5").find("strong").html();
    garageCounts[6] = $("#gvCounts_DXDataRow6").find("strong").html();

    console.log("garage data:"+garageCounts);    

    $("#garages").html(
        "<tr><td>Garage A</td><td>"+garageCounts[0]+"</td></tr>"+
        "<tr><td>Garage B</td><td>"+garageCounts[1]+"</td></tr>"+
        "<tr><td>Garage C</td><td>"+garageCounts[2]+"</td></tr>"+
        "<tr><td>Garage D</td><td>"+garageCounts[3]+"</td></tr>"+
        "<tr><td>Garage H</td><td>"+garageCounts[4]+"</td></tr>"+
        "<tr><td>Garage I</td><td>"+garageCounts[5]+"</td></tr>"+
        "<tr><td>Garage Libra</td><td>"+garageCounts[6]+"</td></tr>"
    );

}
function getCounts(){
    var connectionString = "http://secure.parking.ucf.edu/GarageCount/iframe.aspx/";
    
    $page = $("body").load(connectionString);
    
    return Httpreq.responseText;
}*/
