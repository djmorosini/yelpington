function initiate() {
    let name = document.location.pathname.slice(1)

    if (!name || name == "all") {

        let title = document.getElementById("title")
        title.textContent = "Restaurant Directory 🍗"

        let frontMapDiv = document.getElementById("frontMap")
        frontMapDiv.setAttribute("style", "height: 400px; width: 600px; border: 1px solid black; float: right;");

        let mymap = L.map('frontMap').setView([44.4779, -73.2166], 16);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoiZGptb3Jvc2luaSIsImEiOiJjamphMng3a20wN2xwM3BxaDl1b2hlamNjIn0.dd7Bj-cAdxOMnaS9t01gpw'
        }).addTo(mymap);

        function addMapMarker(markerID, mapLat, mapLon, restaurantID, restaurantName) {
            markerID = L.marker([mapLat, mapLon]).addTo(mymap);
            markerID.bindPopup("<a href='/" + restaurantID + "'>" + restaurantName + "</a>")
        }

        fetch('all.json')
        .then(function (response) {
            return response.text();
        })
        .then(function (myText) {
            allList = JSON.parse(myText)
            for (i = 0; i < allList.length; i++) {
                fetch(allList[i] + '.json')
                    .then(function (response) {
                        return response.text();
                    })
                    .then(function (restaurantData) {

                        restaurantJson = JSON.parse(restaurantData)

                        populateList(restaurantJson.id, restaurantJson.name)

                        addMapMarker(i, restaurantJson.lat, restaurantJson.lon, restaurantJson.id, restaurantJson.name)


                    })
            }
        })

    } else {

        let wrapDiv = document.getElementById("wrapper")
        wrapDiv.setAttribute("style", "min-height: 450px; width: 650px; min-width: 200px; border: 1px solid black; background-color: rgba(255, 255, 255, 0.5); padding: 5px;")

        fetch(name + '.json')
            .then(function (response) {
                return response.text();
            })
            .then(function (myText) {

                data = JSON.parse(myText)

                addPageInfo()

            })
            .then(function () {

                let addressArray = data.address.split(" ")

                let locationSearch = addressArray.join("+")

                let url = "https://nominatim.openstreetmap.org/search?q=" + locationSearch + "&format=json"

                fetch(url)
                    .then(function (response) {

                        return response.json();
                    })
                    .then(function (myJSON) {

                        firstBbox = myJSON[0].boundingbox[0]
                        secondBbox = myJSON[0].boundingbox[1]
                        thirdBbox = myJSON[0].boundingbox[2]
                        fourthBbox = myJSON[0].boundingbox[3]

                        markLat = myJSON[0].lat
                        markLon = myJSON[0].lon

                        document.getElementById("map").innerHTML = "<h2>Location: </h2><br>" + '<iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=' + thirdBbox + "," + firstBbox + "," + fourthBbox + "," + secondBbox + '&layer=mapnik&marker=' + markLat + '%2C' + markLon + '" style="border: 1px solid black"></iframe><br/><small><a style="position: relative; bottom: 20px; left:10px; background-color:white;" href="https://www.openstreetmap.org/?mlat=44.47518&mlon=-73.21256#map=19/44.47518/-73.21256">View Larger Map</a></small>'


                    })

            });
    }
}

function populateList(jsonListNumberID, jsonListNumberNames) {
    document.getElementById("navBar").innerHTML += "<a href=/" + jsonListNumberID + "><div class='navList'>" + jsonListNumberNames + "</div></a>"
}

function addPageInfo() {
    document.getElementById('menu').innerHTML = "<a href='" + data.menu + "'><div id='menuLink'>" + data.name + "Menu</div></a>"
    document.querySelector('h1').innerHTML = "<a href=" + data.website + ">" + data.name + "</a>"
    document.getElementById('phone').innerHTML = "<h2>Phone: </h2>" + data["phone number"]
    document.getElementById('addressDiv').innerHTML = "<h2>Address: </h2>" + data.address + "<br>"
    if (Array.isArray(data.hours)) {
        document.getElementById('hours').innerHTML += "<h2>Hours: </h2>"
        for (let i = 0; i < data.hours.length; i++) {

            document.getElementById('hours').innerHTML += data.hours[i] + "<br>"

        }
    } else {
        document.getElementById('hours').innerHTML = "<h2>Hours: </h2>" + data.hours + "<br>"
    }

    if (Array.isArray(data.notes)) {
        document.getElementById('notes').innerHTML += "<h2>Notes: </h2>"
        for (let i = 0; i < data.notes.length; i++) {

            document.getElementById('notes').innerHTML += marked(data.notes[i])

        }
    } else {
        data.notes = marked(data.notes.toString())
        document.getElementById('notes').innerHTML = "<h2>Notes: </h2>" + data.notes + "<br>"
    }
}