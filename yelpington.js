function fetchAllThenPopulateListAndMap() {
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