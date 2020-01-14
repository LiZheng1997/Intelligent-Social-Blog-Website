/**
 * The Google Map visualisation and manipulation module.
 * @author Junxiang Chen, Haobin Yuan
 */

var map;

/**
 * Initialise Google Map element.
 * @param res the events or posts fetching results
 */
function initMap(res) {
    console.log("init map", res);
    // sometimes the google object is not defined
    // the general and simple solution is to refresh the page
    if (google === undefined) {
        window.location.reload()
    }
    map = new google.maps.Map(document.getElementById("map-container"), {
        zoom: 4
    });

    initAutocomplete();

    // Display the area between the location southWest and northEast.
    // map.fitBounds(bounds);

    // Add markers to map at event locations.
    // For each of these markers, give them a title with their index, and when
    // they are clicked they should open an infoWindow with text from a secret
    // message.
    var bounds = new google.maps.LatLngBounds();
    if (res !== undefined) {
        console.log("set location", res.length);
        console.log("check", res);


        for (var i = 0; i < res.length; ++i) {
            if (res[i].location.lat !== undefined && res[i].location.long !== undefined) {
                var marker = new google.maps.Marker({
                    position: {
                        lat: res[i].location.lat,
                        lng: res[i].location.long
                    },
                    map: map
                });
                var myLatLng = new google.maps.LatLng(res[i].location.lat, res[i].location.long);
                bounds.extend(myLatLng);
                var str = res[i].event.name + " on " + moment(res[i].date).format("MMM DD YYYY") + " in " + res[i].location.name;
                if (window.location.pathname === "/events") {
                    attachSecretMessage(marker, str, res[i].event.id);
                }
                if (window.location.pathname === "/posts" || window.location.pathname.indexOf("users") !== -1) {
                    attachSecretMessage(marker, str, res[i].location.name)
                }
            }
        }
        map.fitBounds(bounds);
    }
}

/**
 * Attach message to the info window.
 * @param marker the marker on the Google Map
 * @param secretMessage the content of the info window
 * @param string the value for dynamic url fetching in the backend
 */
function attachSecretMessage(marker, secretMessage, string) {
    var infoWindow = new google.maps.InfoWindow({
        content: secretMessage
    });

    marker.addListener("click", function () {
        infoWindow.open(marker.get("map"), marker);
        if (window.location.pathname === "/events") {
            searchResultsTitle();
            queryAjaxEvents("/events/query/id/" + string, function (res) {
                addToEventCard(res)
            })
        }
        if (window.location.pathname === "/posts") {
            $('#blog-post').empty();
            searchResultsTitle();
            queryAjaxPosts("/posts/query/location/" + string)
        }

        if (window.location.pathname.indexOf("users") !== -1) {
            $('#blog-post').empty();
            queryAjaxPosts("/posts/query/location/" + string)
        }
    });
}

var service;

/**
 * Operate Google Map visualisation, including address searching by Google Service, self-adaptation and translation
 * @param address the exact address for querying by Google Service
 */
function operateMap(address) {
    console.log("operate map", address);
    var request = {
        query: address,
        fields: ["name", "geometry"]
    };

    service = new google.maps.places.PlacesService(map);

    service.findPlaceFromQuery(request, function (results, status) {
        console.log(results);
        var bounds = new google.maps.LatLngBounds();
        if (results !== null) {
            bounds.extend(results[0].geometry.location);
            map.fitBounds(bounds);
            return true
        } else {
            return false
        }
    });
}

function searchResultsTitle() {
    // $('#showText').text('');
    $('#showText').text('Search Results');
}
