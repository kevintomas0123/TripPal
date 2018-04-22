
/******************************  START - AUTOCOMPLETE TEXTBOX ******************************/

//Init autocomplete for the City 1 and City 2 
function initAutocomplete() {
    //Set map information - City 1
    var mapCity1 = new google.maps.Map(document.getElementById('mapCity1'), {
        center: { lat: 37.871866, lng: -122.264532 },
        zoom: 13,
        mapTypeId: 'roadmap',
        types: ['cities']
    });

    //Set map information - City 2
    var mapCity2 = new google.maps.Map(document.getElementById('mapCity2'), {
        center: { lat: 37.871866, lng: -122.264532 },
        zoom: 13,
        mapTypeId: 'roadmap',
        types: ["locality"]
    });

    // Create the search box and link it to the UI element.
    var inputCity1 = document.getElementById('textCity1');
    var inputCity2 = document.getElementById('textCity2');
    var searchBoxCity1 = new google.maps.places.SearchBox(inputCity1);
    var searchBoxCity2 = new google.maps.places.SearchBox(inputCity2);

    mapCity1.controls[google.maps.ControlPosition.TOP_LEFT].push(inputCity1);
    mapCity2.controls[google.maps.ControlPosition.TOP_LEFT].push(inputCity2);

    //Set the categories are cities
    mapCity1.controls[google.maps.ControlPosition.TOP_LEFT].push("cities");
    mapCity2.controls[google.maps.ControlPosition.TOP_LEFT].push("cities");

    // Bias the SearchBox results towards current map's viewport.
    mapCity1.addListener('bounds_changed', function () {
        searchBoxCity1.setBounds("map.getBounds()", mapCity1.getBounds());
    });

    // Bias the SearchBox results towards current map's viewport.
    mapCity2.addListener('bounds_changed', function () {
        searchBoxCity2.setBounds("map.getBounds()", mapCity2.getBounds());
    });

    var markersCity1 = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBoxCity1.addListener('places_changed', function () {
        var places = searchBoxCity1.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markersCity1.forEach(function (marker) {
            marker.setMap(null);
        });
        markersCity1 = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markersCity1.push(new google.maps.Marker({
                map: mapCity1,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        mapCity1.fitBounds(bounds);
    });

    var markersCity2 = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBoxCity2.addListener('places_changed', function () {
        var places = searchBoxCity2.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markersCity2.forEach(function (marker) {
            marker.setMap(null);
        });
        markersCity2 = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {

            if (!place.geometry) {
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markersCity2.push(new google.maps.Marker({
                map: mapCity2,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        mapCity2.fitBounds(bounds);
    });
}

/****************************** END - AUTOCOMPLETE TEXTBOX ******************************/

/****************************** START - CITY 1 ******************************/

//Onclick event when the user selects "Compare"
$(document).on("click", "#compareCities", function (event) {

    //Hidde validation
    $("#validateCity").css("visibility", "hidden");

    //Set the City 1
    var city1 = $("#textCity1").val().trim().toLowerCase();

    //Get the city name (It's the first one)
    var splitCity1 = city1.split(",");
    city1 = splitCity1[0];

    //Set the City 1
    var city2 = $("#textCity2").val().trim().toLowerCase();

    //Get the city name (It's the first one)
    var splitCity2 = city2.split(",");
    city2 = splitCity2[0];

    //Validate if the city 1 and city are not empty or the same
    if (city1 === "" || city2 === "") {
        $("#validateCity").css("visibility", "visible");
        $("#validateCity").text("Please provide a valid City.");
    }
    else {
        if (city1 === city2) {
            $("#validateCity").css("visibility", "visible");
            $("#validateCity").text("You enter the same city, please provide a valid City.");
        }
        else {
            //Hidde validation
            $("#trending_city2").css("visibility", "hidden");
            $("#trending_city1").css("visibility", "hidden");

            //Get information - City 1
            getInfoCity1(city1);

            //Get information - City 2
            getInfoCity2(city2);
        }
    }
});

//Get information City 1, get the first data in the array
function getInfoCity1(city) {

    //Geoname API
    var urlCity = "http://api.geonames.org/wikipediaSearchJSON?q=" + city + "&maxRows=10&username=marijar84"

    $.ajax({
        url: urlCity,
        method: "GET"
    }).then(function (response) {

        //Get the first record
        var result = response.geonames["0"];

        //Set the general information about City 1
        setInformation_City1(result);

        //Get food and rating, based on latitude and longitude
        getFoodAndRating_City1(result.lat, result.lng);

        //Get and set weather information
        getWeather_City1(city);

        //Get and set trending information
        getTrending_City1(city);
    });
}

//Get information City 1, get the first data in the array
function getInfoCity2(city) {

    //Geoname API
    var urlCity = "http://api.geonames.org/wikipediaSearchJSON?q=" + city + "&maxRows=10&username=marijar84"

    $.ajax({
        url: urlCity,
        method: "GET"
    }).then(function (response) {
        //Get the first record
        var result = response.geonames["0"];
        //Set the general information about City 2
        setInformation_City2(result);
        //Get food and rating, based on latitude and longitude
        getFoodAndRating_City2(result.lat, result.lng);
        //Get and set weather information
        getWeather_City2(city);
        //Get and set trending information
        getTrending_City2(city);

    });
}

//Set the title, wikipedia url, summary (City 1) 
function setInformation_City1(informationCity1) {

    var title = informationCity1.title;

    var url = informationCity1.wikipediaUrl;

    var description = informationCity1.summary

    //Set information in html
    $("#labelCity1").text(title);
    $("#labelCity1").attr("href", "https://" + url);

    $("#descriptionCity1").text(description);

}

//Set the title, wikipedia url, summary (City 1) 
function setInformation_City2(informationCity2) {

    var title = informationCity2.title;

    var url = informationCity2.wikipediaUrl;

    var description = informationCity2.summary

    //Set information in html
    $("#labelCity2").text(title);
    $("#labelCity2").attr("href", "https://" + url);

    $("#descriptionCity2").text(description);

}

//Get food and rating average with latitude and longitude parameteres (City 1)
function getFoodAndRating_City1(lat, lng) {

    //Foursquare API
    var queryUrlCity1 = "https://api.foursquare.com/v2/venues/explore?&ll=" + lat + "," + lng + "&client_id=J50IQCIUKW05KX5XP24VYIU3CVBAFSBGEXG1EGIL50PEGXA5&client_secret=3G1VQAJ4JDVCZLQALXCR0RHRYY3XYI5IYR4O1G2CFWI4JAR0&query=restaurants&v=20180421";

    $.ajax({
        url: queryUrlCity1,
        method: "GET"
    }).then(function (response) {
        //Get average to food and rating
        getFoodAverage_City1(response.response.groups["0"].items);
    });
}

//Get food and rating average with latitude and longitude parameteres (City 2)
function getFoodAndRating_City2(lat, lng) {

    var queryUrlCity2 = "https://api.foursquare.com/v2/venues/explore?&ll=" + lat + "," + lng + "&client_id=J50IQCIUKW05KX5XP24VYIU3CVBAFSBGEXG1EGIL50PEGXA5&client_secret=3G1VQAJ4JDVCZLQALXCR0RHRYY3XYI5IYR4O1G2CFWI4JAR0&query=restaurants&v=20180421";

    $.ajax({
        url: queryUrlCity2,
        method: "GET"
    }).then(function (response) {
        //Calculate average to food and rating
        getFoodAverage_City2(response.response.groups["0"].items);
    });
}

//Calculate average food and rating based on restaurante list (City 1)
function getFoodAverage_City1(restauranteList) {

    var averageFood = 0;
    var rating = 0;

    for (var itemFood = 0; itemFood < restauranteList.length - 1; itemFood++) {
        //Food Average
        var price = restauranteList[itemFood].venue.price;
        if (price !== undefined) {
            averageFood = averageFood + restauranteList[itemFood].venue.price.tier;
        }

        //Rating Average
        rating = rating + restauranteList[itemFood].venue.rating;
    }

    //Calculate rating food
    var calculateAverageFood = averageFood / restauranteList.length;
    ratingFood_City1(calculateAverageFood);

    //Calculate Rating
    var calculateRating = rating / restauranteList.length;
    ratingPlace_City1(calculateRating);
}

//Calculate average food and rating based on restaurante list (City 2)
function getFoodAverage_City2(restauranteList) {
    var averageFood = 0;

    var rating = 0;

    for (var itemFood = 0; itemFood < restauranteList.length; itemFood++) {
        var price = restauranteList[itemFood].venue.price;
        if (price !== undefined) {
            //Food Average
            averageFood = averageFood + restauranteList[itemFood].venue.price.tier;
        }

        //Rating Average
        rating = rating + restauranteList[itemFood].venue.rating;
    }

    //Calculate rating food
    var calculateAverageFood = averageFood / restauranteList.length;
    ratingFood_City2(calculateAverageFood);

    //Calculate Rating
    var calculateRating = rating / restauranteList.length;
    ratingPlace_City2(calculateRating);
}

//Show rating in html
function ratingPlace_City1(calculateRating) {
    $("#rating_city1").removeClass();

    //Get percentaje value
    var calculate = (calculateRating * 100) / 10;

    //Configurate the progress bar
    $("#rating_city1").attr("style", "width: " + calculate + "%");
    $("#rating_city1").text(calculate.toFixed(2) + "%");

    //IF rating is mora than 8, the place is excelent
    if (calculateRating > 8) {
        $("#rating_city1").addClass("progress-bar progress-bar-striped bg-success progress-bar-animated");

    }
    else {
        //if rating is less than 4, the place is bad
        if (calculateRating < 4) {
            $("#rating_city1").addClass("progress-bar progress-bar-striped bg-danger progress-bar-animated");

        }
        else {
            //if rating is between 4 and 8, the rating is normal
            if (calculateRating >= 4 && calculateRating <= 8) {
                $("#rating_city1").addClass("progress-bar progress-bar-striped bg-info progress-bar-animated");

            }
        }
    }
}

//Show rating in html
function ratingPlace_City2(calculateRating) {
    $("#rating_city2").removeClass();

    //Get percentaje value
    var calculate = (calculateRating * 100) / 10;

    //Configurate the progress bar
    $("#rating_city2").attr("style", "width: " + calculate + "%");
    $("#rating_city2").text(calculate.toFixed(2) + "%");

    //IF rating is mora than 8, the place is excelent
    if (calculateRating > 8) {
        $("#rating_city2").addClass("progress-bar progress-bar-striped bg-success progress-bar-animated");
    }
    else {
        //if rating is less than 4, the place is bad
        if (calculateRating < 4) {
            $("#rating_city2").addClass("progress-bar progress-bar-striped bg-danger progress-bar-animated");
        }
        else {
            //if rating is between 4 and 8, the rating is normal
            if (calculateRating >= 4 && calculateRating <= 8) {
                $("#rating_city2").addClass("progress-bar progress-bar-striped bg-info progress-bar-animated");
            }
        }
    }
}

//Show rating food in html - City 1
function ratingFood_City1(calculateAverageFood) {
    $("#ratingFood_city1").removeClass();

    //Calculate the percentaje
    var calculate = (calculateAverageFood * 100) / 4;

    //Configurate the progress bar
    $("#ratingFood_city1").attr("style", "width: " + calculate + "%");
    $("#ratingFood_city1").text(calculate.toFixed(2) + "%");

    //If the food is bad the value is less than 2
    if (calculateAverageFood <= 2) {
        $("#ratingFood_city1").addClass("progress-bar progress-bar-striped bg-success progress-bar-animated");
    }
    //If the food is bad the value is more than 2
    else if (calculateAverageFood > 2) {
        $("#ratingFood_city1").addClass("progress-bar progress-bar-striped bg-danger progress-bar-animated");
    }
}

//Show rating food in html - City 2
function ratingFood_City2(calculateAverageFood) {
    $("#ratingFood_city2").removeClass();

    //Calculate the percentaje
    var calculate = (calculateAverageFood * 100) / 4;

    //Configurate the progress bar
    $("#ratingFood_city2").attr("style", "width: " + calculate + "%");
    $("#ratingFood_city2").text(calculate.toFixed(2) + "%");

    //If the food is bad the value is less than 2
    if (calculateAverageFood <= 2) {
        $("#ratingFood_city2").addClass("progress-bar progress-bar-striped bg-success progress-bar-animated");

    }
    //If the food is bad the value is more than 2
    else if (calculateAverageFood > 2) {
        $("#ratingFood_city2").addClass("progress-bar progress-bar-striped bg-danger progress-bar-animated");

    }
}

//Get weather information, the parameter is the city - City 1
function getWeather_City1(city) {
    //Apikey
    var APIKey = "d9644357007eea70b23279e2e3fa9466";

    // Here we are building the URL we need to query the database
    //Open Weather map Api
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
        "q=" + city + "&units=imperial&appid=" + APIKey;

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // We store all of the retrieved data inside of an object called "response"
        .then(function (response) {

            var temperature = response.main.temp;

            $("#weather_City1").removeClass();

            //Configure progress bar
            $("#weather_City1").attr("style", "width: " + temperature + "%");
            $("#weather_City1").text(temperature.toFixed(2) + "°F");

            //If the temperature is more than 78 is hot
            if (temperature > 78) {
                $("#weather_City1").addClass("progress-bar progress-bar-striped bg-success progress-bar-animated");

            }
            else {
                //If the temperature is less than 62 is cold
                if (temperature < 62) {
                    $("#weather_City1").addClass("progress-bar progress-bar-striped bg-danger progress-bar-animated");

                }
                else {
                    //If the temperature is between 62 and 78 is normal
                    if (temperature >= 62 && temperature <= 78) {
                        $("#weather_City1").addClass("progress-bar progress-bar-striped bg-info progress-bar-animated");

                    }
                }
            }
        });
}

//Get weather information, the parameter is the city - City 1
function getWeather_City2(city) {
    var APIKey = "d9644357007eea70b23279e2e3fa9466";

    // Here we are building the URL we need to query the database
    //Open Weather map Api
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
        "q=" + city + "&units=imperial&appid=" + APIKey;

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // We store all of the retrieved data inside of an object called "response"
        .then(function (response) {

            var temperature = response.main.temp;

            //Configure progress bar
            $("#weather_City2").attr("style", "width: " + temperature + "%");
            $("#weather_City2").text(temperature.toFixed(2) + "°F");

            //If the temperature is more than 78 is hot
            if (temperature > 78) {
                $("#weather_City2").addClass("progress-bar progress-bar-striped bg-success progress-bar-animated");

            }
            else {
                //If the temperature is less than 62 is cold
                if (temperature < 62) {
                    $("#weather_City2").addClass("progress-bar progress-bar-striped bg-danger progress-bar-animated");

                }
                else {
                    //If the temperature is between 62 and 78 is normal
                    if (temperature >= 62 && temperature <= 78) {
                        $("#weather_City2").addClass("progress-bar progress-bar-striped bg-info progress-bar-animated");

                    }
                }
            }
        });
}

//Get trending information - City 1
function getTrending_City1(city) {
    city = $("#textCity1").val().trim().toLowerCase();

    //Get trending information 
    //Sygic Travel Api - Limit 4
    var queryURL = "https://api.sygictravelapi.com/1.0/en/places/list?query=" + city + "&categories=going_out&limit=4&lang=en";

    $("#title_City1").text($("#textCity1").val());

    $.ajax({
        url: queryURL,
        method: "GET",
        headers: {
            'x-api-key': 'xRQzqTyL1qTDkZej8hQi8YhWsMLMFwB8cwZZY27a'
        }
    })
        .then(function (response) {

            //If more than cero we have trending places
            if (response.data.places.length > 0) {
                //Div is visible
                $("#trending_city1").css("visibility", "visible");

                //Set Trending 1
                $("#trending1_title1_c1").text(response.data.places["0"].name);
                $("#trending1_descript1_c1").text(response.data.places["0"].perex);
                //If the trending don't have picture, set the logo picture
                if (response.data.places["0"].thumbnail_url !== null) {
                    $("#trending1_img1_c1").attr("src", response.data.places["0"].thumbnail_url);
                }
                else {
                    $("#trending1_img1_c1").attr("src", "./assets/images/logo.png");
                }

                //Set Trending 2
                $("#trending1_title2_c1").text(response.data.places["1"].name);
                $("#trending1_descript2_c1").text(response.data.places["1"].perex);
                //If the trending don't have picture, set the logo picture
                if (response.data.places["1"].thumbnail_url !== null) {
                    $("#trending1_img2_c1").attr("src", response.data.places["1"].thumbnail_url);
                }
                else {
                    $("#trending1_img2_c1").attr("src", "./assets/images/logo.png");
                }

                //Set Trending 3
                $("#trending1_title3_c1").text(response.data.places["2"].name);
                $("#trending1_descript3_c1").text(response.data.places["2"].perex);
                //If the trending don't have picture, set the logo picture
                if (response.data.places["2"].thumbnail_url !== null) {
                    $("#trending1_img3_c1").attr("src", response.data.places["2"].thumbnail_url);
                }
                else {
                    $("#trending1_img3_c1").attr("src", "./assets/images/logo.png");
                }

                //Set Trending 4
                $("#trending1_title4_c1").text(response.data.places["3"].name);
                $("#trending1_descript4_c1").text(response.data.places["3"].perex);
                //If the trending don't have picture, set the logo picture
                if (response.data.places["3"].thumbnail_url !== null) {
                    $("#trending1_img4_c1").attr("src", response.data.places["3"].thumbnail_url);
                }
                else {
                    $("#trending1_img4_c1").attr("src", "./assets/images/logo.png");
                }
            }
            //If we don't have trending information about the city, we show a modal window 
            else {
                $("#textModal").text("Sorry! I could not find trending information about the " + $("#textCity1").val());
                $('#notTrending').modal('show');
            }

        });
}

//Get trending information - City 2
function getTrending_City2(city) {
    city = $("#textCity2").val().trim().toLowerCase();

    //Get trending information 
    //Sygic Travel Api - Limit 4
    var queryURL = "https://api.sygictravelapi.com/1.0/en/places/list?query=" + city + "&categories=going_out&limit=4&lang=en";

    $("#title_City2").text($("#textCity2").val());

    $.ajax({
        url: queryURL,
        method: "GET",
        headers: {
            'x-api-key': 'xRQzqTyL1qTDkZej8hQi8YhWsMLMFwB8cwZZY27a'
        }
    })
        .then(function (response) {

            if (response.data.places.length > 0) {
                //Set div visible
                $("#trending_city2").css("visibility", "visible");

                //Set Trending 1
                $("#trending1_title1_c2").text(response.data.places["0"].name);
                $("#trending1_descript1_c2").text(response.data.places["0"].perex);
                //If the trending don't have picture, set the logo picture
                if (response.data.places["0"].thumbnail_url !== null) {
                    $("#trending1_img1_c2").attr("src", response.data.places["0"].thumbnail_url);
                }
                else {
                    $("#trending1_img1_c2").attr("src", "./assets/images/logo.png");
                }

                //Set Trending 2
                $("#trending1_title2_c2").text(response.data.places["1"].name);
                $("#trending1_descript2_c2").text(response.data.places["1"].perex);
                //If the trending don't have picture, set the logo picture
                if (response.data.places["1"].thumbnail_url !== null) {
                    $("#trending1_img2_c2").attr("src", response.data.places["1"].thumbnail_url);
                }
                else {
                    $("#trending1_img2_c2").attr("src", "./assets/images/logo.png");
                }
                
                //Set Trending 3
                $("#trending1_title3_c2").text(response.data.places["2"].name);
                $("#trending1_descript3_c2").text(response.data.places["2"].perex);
                //If the trending don't have picture, set the logo picture
                if (response.data.places["2"].thumbnail_url !== null) {
                    $("#trending1_img3_c2").attr("src", response.data.places["2"].thumbnail_url);
                }
                else {
                    $("#trending1_img3_c2").attr("src", "./assets/images/logo.png");
                }

                //Set Trending 4
                $("#trending1_title4_c2").text(response.data.places["3"].name);
                $("#trending1_descript4_c2").text(response.data.places["3"].perex);
                //If the trending don't have picture, set the logo picture
                if (response.data.places["3"].thumbnail_url !== null) {
                    $("#trending1_img4_c2").attr("src", response.data.places["3"].thumbnail_url);
                }
                else {
                    $("#trending1_img4_c2").attr("src", "./assets/images/logo.png");
                }

            }
            //If we don't have trending information about the city, we show a modal window  
            else {
                $("#textModal").text("Sorry! I could not find trending information about the " + $("#textCity2").val());
                $('#notTrending').modal('show');
            }
        });
}

var config = {
    apiKey: "AIzaSyAC4wC49vngw174lvtjWjfA1R15hy-VYy0",
    authDomain: "project-1-e45b8.firebaseapp.com",
    databaseURL: "https://project-1-e45b8.firebaseio.com",
    projectId: "project-1-e45b8",
    storageBucket: "project-1-e45b8.appspot.com",
    messagingSenderId: "409341424469"
};

firebase.initializeApp(config);

var database = firebase.database();

// Initial Values
var name = "";
var email = "";
var password = "";
// Capture Button Click
$("#submit").on("click", function (event) {
    console.log("submitted")
    event.preventDefault();

    // Grabbed values from text-boxes
    name = $("#username").val().trim();
    email = $("#email_field").val().trim();
    passowrd = $("#password_field").val().trim();

    // Code for "Setting values in the database"
    database.ref().set({
        name: name,
        email: email,
        password: password

    });

});

// Firebase watcher + initial loader HINT: .on("value")
database.ref().on("value", function (snapshot) {

    // Log everything that's coming out of snapshot
    console.log("snap", snapshot.val());
    if (snapshot.val() === null) {
        console.log("havent set any data yet");
        return;
    }

    console.log(snapshot.val().name);
    console.log(snapshot.val().email);
    console.log(snapshot.val().passowrd);


    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});


