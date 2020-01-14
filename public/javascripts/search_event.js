/**
 * Manipulate DOM element for search events page.
 * @author Junxiang Chen, Haobin Yuan
 */

/**
 * Add event listener for read more button.
 * Once the button is clicked, the client side will query relevant post for a specific event.
 * If the service is online, it will AJAX query info from sever side.
 * Otherwise, it will query info from local side (IDB).
 * @param id the event id
 */
function readMoreBtnEventListener(id) {
    $("#" + id).click(function () {
        $("#blog-post").empty();
        queryAjaxPosts("/events/query/" + id)
    })
}

/**
 * An HTML manipulation function to add queried events to the event card.
 * @param res AJAX queried data
 */
function addToEventCard(res) {
    var eventCards = $("#event-cards");
    eventCards.empty();
    console.log(eventCards);
    eventCards.empty();
    for (var i = 0; i < res.length; i++) {
        var eventCard = $("<div class='col-lg-4 col-sm-6 mb-4'></div>");
        var eventDiv = $('<div class="card h-100"></div>');
        var eventCardBody = "" +
            "<div class='card-body'>" +
            "    <h4 class='card-title'>" +
            "    <a href='/events/" + res[i]._id +
            "'>" + res[i].name +
            "</a>" +
            "    </h4>" +
            "    <p class='card-text'>" + res[i].content +
            "    </p>" +
            "    <button id='" + res[i]._id +
            "' class='btn btn-primary'>Read More &rarr;</button>" +
            "</div>";
        eventDiv.append(eventCardBody);

        var footer = $("<div class='card-footer'></div>");
        // console.log(moment(obj.date).format("LLLL"));

        var info = "" +
            "<div class='row'>" +
            "    <div>" +
            "        <label style='font-size: small'>" +
            "Posted on " +
            moment(res[i].event.date).format("LLLL") + " " +
            "in " + res[i].location.name + " " +
            "by " +
            "            <a href='/users/" + res[i].user.id +
            "'>" + res[i].user.name +

            "            </a>" +
            "        </label>" +
            "</div>";
        footer.append(info);
        eventDiv.append(footer);
        eventCard.append(eventDiv);
        eventCards.append(eventCard);
        readMoreBtnEventListener(res[i]._id)
    }
}

$(document).ready(function () {
    var urlArr = handleUrl();
    if (urlArr[2] === undefined) {
        queryAjaxEvents("/events/query", function (res) {
            initMap(res);
            addToEventCard(res)
        })
    } else {
        var eventId = urlArr[urlArr.length - 1];
        queryAjaxEvents("/events/query/id/" + eventId, function (res) {
            initMap(res);
            addToEventCard(res)
        })
    }

});