/**
 * The module for control the event/post search component.
 * @author Haobin Yuan
 */

var searchInput = "" +
    "<form class='form-inline' style='margin: -10px auto 20px auto;' id='searchEveOn'>" +
    "    <input type='text' style='display: none; width: 250px' id='autocomplete' class='form-control' placeholder='Location'>" +
    "    <input type='text' style='width: 250px'  id='searchName' class='form-control' placeholder='Event Name' >" +
    "    <input type='text' style='display: none; width: 250px' id='searchDate' class='form-control' placeholder='Date'>" +
    "    <div class='input-group'>" +
    "        <select class='custom-select' id='selector' aria-label='Example select with button addon'>\n" +
    "                    <option selected>Name</option>" +
    "                    <option>Date</option>" +
    "                    <option>Location</option>" +
    "                </select>" +
    "        <div class='input-group-append'>" +
    "            <button class='btn btn-outline-secondary' type='button' id='search'><i class='fas fa-search'></i></button>\n" +
    "        </div>" +
    "    </div>" +
    "</form>";

var searchInputOffLine = "" +
    "<form class='form-inline' style='margin: -10px auto 20px auto' id='searchEveOff'>" +
    "    <select name='event' class='custom-select' style=' width: 250px' id='searchName' required>\n" +
    "            <option value='' selected disabled hidden>Choose...</option>" +
    "    </select>" +
    "    <input type='text' style='display: none; width: 250px' id='searchDate' class='form-control' placeholder='Date'>" +
    "    <select name='event' class='custom-select' id='autocomplete'  style='display: none;  width: 250px' required>\n" +
    "           <option value='' selected disabled hidden>Choose...</option>" +
    "    </select>" +
    "            <div class='input-group'>" +
    "                <select class='custom-select' id='selector' aria-label='Example select with button addon'>\n" +
    "                    <option selected>Name</option>" +
    "                    <option>Date</option>" +
    "                    <option>Location</option>" +
    "                </select>\n" +
    "                <div class='input-group-append'>" +
    "                    <button class='btn btn-outline-secondary' type='button' id='search'><i class='fas fa-search'></i></button>\n" +
    "                </div>\n" +
    "    </div>" +
    "</form>";


/**
 * A date picker selector for searching.
 */
function dateSelectorEventListener() {
    var picker = new Pikaday({
        field: document.getElementById("searchDate"),
        format: "D MMM YYYY",
        onSelect: function () {
            console.log(this.getMoment().format("Do MMMM YYYY"));
        }
    });
}

/**
 * Switch input type for searching.
 */
function switchType() {
    $(document).on("change", "#selector", function () {
        var type = $("#selector").val();
        var name = $("#searchName");
        var date = $("#searchDate");
        var location = $("#autocomplete");
        switch (type) {
            case "Date":
                name.val("");
                date.show();
                name.hide();
                location.hide();
                location.val("");
                break;
            case "Name":
                name.show();
                date.hide();
                location.hide();
                date.val("");
                location.val("");
                break;
            case "Location":
                name.hide();
                date.hide();
                name.val("");
                date.val("");
                location.show();
                break;
        }
    })
}

/**
 * Add event listener for search button.
 * Once the button is clicked, the form data will be submitted to AJAX query relevant information from sever side or local side.
 */
function searchBtnEventListener() {
    $(document).on("click", "#search", function () {
        $('#postsCount').empty();
        $('#blog-post').empty();
        $('#searchPostTitle').empty();

        var urlArr = window.location.pathname.split("/");
        var url = "/" + urlArr[1] + "/query";
        var type = $("#selector").val();
        var name = $("#searchName");
        var date = $("#searchDate");
        var location = $("#autocomplete");
        var val;
        var cb;
        switch (type) {
            case "Date":
                console.log("date", date.val());
                url = url + "/date/";
                val = date.val();
                cb = function (res) {
                    initMap(res);
                    addToEventCard(res);
                    // countInEvents("date",date.val(), res.length);
                };
                break;
            case "Location":
                console.log("loc", location.val());
                url = url + "/location/";
                val = location.val();
                var mapRes = false;
                if (val !== "") {
                    mapRes = operateMap(val);
                }
                if (mapRes === true) {
                    cb = function (res) {
                        addToEventCard(res);
                        // countInEvents("location",location.val(), res.length);
                    };
                } else {
                    cb = function (res) {
                        initMap(res);
                        addToEventCard(res);
                        // countInEvents("location",location.val(), res.length);
                    }
                }
                break;
            case "Name":
                console.log("name", name.val());
                url = url + "/name/";
                val = name.val();
                cb = function (res) {
                    initMap(res);
                    addToEventCard(res);
                    // displayResult("name",name.val(), res.length);
                };
                break
        }
        if (val !== "") {
            if (urlArr[1] === "events") {
                // $('#blog-post').empty();
                // $('#postResult').empty();
                showText(val, type);
                queryAjaxEvents(url + val, cb)
                // $("#showText").text('');
                // $("#showText").text("Results for " + val);
            } else if (urlArr[1] === "posts") {
                // $("#blog-post").empty();
                // $('#postResult').empty();
                showText(val, type);
                queryAjaxPosts(url + val)
                // $("#showText").text('');
                // $("#showText").text("Results for " + val);
            }

        } else {
            $("#showText").text('');
            $("#showText1").text('');
            $('#blog-post').empty();
            $('#event-cards').empty();
        }

    })
}

var form = $("#search-form");
var urlArr = window.location.pathname.split("/");

$(document).ready(function () {
    if (navigator.onLine === true) {
        form.empty();
        form.append(searchInput);
    } else {
        form.empty();
        form.append(searchInputOffLine);
    }

    dateSelectorEventListener();
    switchType();
    searchBtnEventListener()
});

/**
 * An event listener to detect whether the page is offline.
 */
window.addEventListener("offline", function (ev) {
    form.empty();
    form.append(searchInputOffLine);
    dateSelectorEventListener();
    switchType();
    // searchBtnEventListener()
    if (urlArr[1] === "events") {
        getAllEventCachedData();
    } else if (urlArr[1] === "posts") {
        getAllBlogCachedData()
    }


}, false);

/**
 * An event listener to detect whether the page is offline.
 */
window.addEventListener("online", function (ev) {
    form.empty();
    form.append(searchInput);
    dateSelectorEventListener();
    switchType();
    searchBtnEventListener()
}, false);

function showText(val, type) {
    $("#blog-post").empty();
    $('#postResult').empty();
    $("#showText").text("");
    $("#showText").text("Results for " + type + ': "' + val + '"');
}