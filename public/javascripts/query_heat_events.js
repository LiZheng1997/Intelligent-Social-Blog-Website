/**
 * A DOM manipulation function to arrange HTML elements to heat events.
 * @param res the AJAX query results
 */
function addToHeatEvent(res) {
    var heatEvents = $("#heat-events");
    heatEvents.empty();
    for (var i = 0; i < res.length; i++) {
        var event = "<a href='/events/" + res[i]._id +
            "'>" + res[i].name +
            "</a><br>";
        heatEvents.append(event)
    }
}

$(document).ready(function () {
    queryAjaxEvents("/events/query", addToHeatEvent)
});