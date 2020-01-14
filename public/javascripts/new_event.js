/**
 * The module for creating a new event.
 * @author Junxiang Chen, Haobin Yuan
 */

var newEventModal = "" +
    "<div class='modal fade bd-example-modal-lg' id='newEventModal' tabindex='-1' role='dialog'\n" +
    "     aria-labelledby='exampleModalLabel' aria-hidden='true'>" +
    "    <div class='modal-dialog modal-lg' role='document'>" +
    "      <form class='needs-validation-event'>" +
    "        <div class='modal-content'>\n" +
    "            <div class='modal-header'>" +
    "                <h5 class='modal-title' id='exampleModalLabel'>New Event</h5>\n" +
    "                <button type='button' class='close' data-dismiss='modal' aria-label='Close'>\n" +
    "                    <span aria-hidden='true'>&times;</span>\n" +
    "                </button>\n" +
    "            </div>" +
    "            <div class='modal-body'>" +
    "                <div class='input-group mb-3'>\n" +
    "                    <div class='input-group-prepend'>" +
    "                        <span class='input-group-text' id='basic-addon1'>Event</span>" +
    "                    </div>" +
    "                    <input type='text' id='event-title' class='form-control' placeholder='Event Title'" +
    "                           aria-describedby='basic-addon1' required>" +
    "                 <div class='invalid-feedback'>" +
    "                       Event Name is Required" +
    "                 </div>" +
    "                </div>" +
    "                    <div class='form-group'>" +
    "                        <label for='event-message-text' class='col-form-label'>Content:</label>\n" +
    "                        <textarea class='form-control' id='event-message-text' required></textarea>\n" +
    "                    <div class='invalid-feedback'>" +
    "                            Event Content is Required" +
    "                    </div>" +
    "                    </div>" +
    "                    <div class=\"form-row\">\n" +
    "                            <div class='input-group mb-3'>\n" +
    "                                <div class=\"input-group-prepend\">\n" +
    "                                    <span class='input-group-text' id='basic-addon1'><i class='far fa-calendar-alt'></i></span>" +
    "                                </div>" +
    "                                <input type='text' id='datepicker' class='form-control' placeholder='Date'\n" +
    "                                       aria-label='Username' aria-describedby='basic-addon1' required>\n" +
    "                                <div class='invalid-feedback'>" +
    "                                   Date Selection is Required" +
    "                                </div>" +
    "                            </div>" +
    "                     </div>" +
    "                    <div class='form-row'>" +
    "                            <div class='input-group'>" +
    "                                <div class='input-group-prepend'>" +
    "                                    <span class='input-group-text' id='basic-addon1'><i class='fas fa-location-arrow'></i></span>\n" +
    "                                </div>" +
    "                                <input type='text' class='form-control' id='autocompleteEvent' aria-label='Amount (to the nearest dollar)'\n" +
    "                                       placeholder='Location' required>" +
    "                                <div class='invalid-feedback'>" +
    "                                   Location is Required" +
    "                                </div>" +
    "                            </div>" +
    "                    </div>" +
    "            </div>" +
    "            <div class='modal-footer'>" +
    "                <button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>" +
    "                <button type='button' class='btn btn-primary' id='createEvent'>Create</button>" +
    "            </div>" +
    "                </form>\n" +
    "        </div>" +
    "    </div>" +
    "</div>";

/**
 * Event input form validation.
 */
function validationEvent() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName("needs-validation-event");
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function (form) {
        document.getElementById("createEvent").addEventListener("click", function (event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add("was-validated");
        }, false);
    });
}

/**
 * Initialise NEW EVENT MODAL.
 */
function init() {
    $("#new-event-modal").append(newEventModal);
    'use strict';
    window.addEventListener("load", validationEvent, false);
}

init();

/**
 * Send an AJAX request to create a new event to the MongoDB.
 * @param url the AJAX request url
 * @param data the data sending in the request process
 */
function insertAjaxEvent(url, data) {
    $.ajax({
        url: url,
        data: data,
        contentType: "application/json",
        type: "POST",
        success: function (res) {
            console.log("insert event success", res);
            var heatEvents = $("#heat-events");
            var event = "<a href='/events/" + res._id +
                "'>" + res.name +
                "</a><br>";
            heatEvents.append(event);
            storeCachedData("_id", res, EVENT_STORE_NAME)

        },
        error: function (xhr, status, err) {
            alert("Create Event Error:" + xhr.responseText)
        }
    })
}

/**
 * A component for picking date.
 */
function datePickerEventListener() {
    var picker = new Pikaday({
        field: document.getElementById("datepicker"),
        format: 'D MMM YYYY',
        onSelect: function () {
            console.log(this.getMoment().format('Do MMMM YYYY'));
        }
    });
}

/**
 * Add event listener for submit button. When clicking the button, it will send form data to the sever side async.
 */
function createEventBtnEventListener() {
    $("#createEvent").click(function () {
        var placeName = $("#autocompleteEvent").val();
        console.log(placeName);
        console.log(latitude);
        console.log(longitude);
        if (latitude === undefined || longitude === undefined) {
            console.log("empty location")
        }
        var location = {
            name: placeName,
            lat: latitude,
            long: longitude
        };

        var date = $("#datepicker").val();
        var data = {
            name: $("#event-title").val(),
            content: $("#event-message-text").val(),
            location: location,
            date: moment(date).format("YYYY-MM-DD")
        };
        var readyToInsert = true;
        for (var key in data) {
            if (data[key] === "") {
                readyToInsert = false;
                break
            }
        }
        if (readyToInsert) {
            var modal = $("#newEventModal");
            modal.modal("hide");
            if (!modal.is(":animated")) {
                console.log("data", data);
                insertAjaxEvent("/events/insert", JSON.stringify(data))
            }
        }

    })
}

$(document).ready(function () {
    datePickerEventListener();
    createEventBtnEventListener();
    $(document).on("hidden.bs.modal", "#newEventModal", function (e) {
        console.log("clean data");
        $("#new-event-modal").empty();
        console.log("empty");
        $("#new-event-modal").append(newEventModal);
        console.log("append");
        validationEvent();
        console.log("validation");
        datePickerEventListener();
        console.log("date picker");
        createEventBtnEventListener();
        console.log("create event btn");
        initAutocomplete();
        console.log("init auto complete");
    });
});
