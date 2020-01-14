/**
 * Configure Google Map AutoComplete component.
 * @author Haobin Yuan
 */

var autocomplete;
var autocompleteEvent;

/**
 * Initialise the auto complete event listener.
 */
function initAutocomplete() {
    // console.log("auto complete selector", $("#autocompleteEvent").get(0));
    var autocompleteElem = $("#autocomplete").get(0);
    if (autocompleteElem !== undefined) {
        autocomplete = new google.maps.places.Autocomplete(
            autocompleteElem, {types: ["geocode"]});
        autocomplete.addListener("place_changed", fillInAddress);
    }
    var autocompleteEventElem = $("#autocompleteEvent").get(0);
    if (autocompleteEventElem !== undefined) {
        autocompleteEvent = new google.maps.places.Autocomplete(
            autocompleteEventElem, {types: ["geocode"]}
        );
        autocompleteEvent.addListener("place_changed", fillInAddressEvent)
    }
}

var latitude;
var longitude;

/**
 * The core of auto complete.
 * Gets the Geometry coordinate.
 */
function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
    latitude = place.geometry.location.lat();
    longitude = place.geometry.location.lng();
}

/**
 * The core of auto complete.
 * This is an event listener for another component.
 */
function fillInAddressEvent() {
    var place = autocompleteEvent.getPlace();
    latitude = place.geometry.location.lat();
    longitude = place.geometry.location.lng()
}
