/**
 * Query event module for querying all events from sever side to client side.
 * @author Junxiang Chen
 */

/**
 * An AJAX request for querying all events with success and error callback function to handle different scenarios.
 * @param url
 * @param cb
 */
function queryAjaxEvents(url, cb) {
    var urlArr = url.split("/");
    console.log("query event url", url);
    $.get({
        url: url,
        success: function (res) {
            console.log("query events success", res);
            var obj = JSON.parse(res);
            for (var i = 0; i < obj.length; i++) {
                obj[i].event = {
                    name: obj[i].name,
                    id: obj[i]._id
                };
                obj[i].date = moment(obj[i].date).format("D MMM YYYY");
                storeCachedData(res[i]._id, obj[i], EVENT_STORE_NAME)
            }
            cb(obj)
        },
        error: function () {
            console.log("fetch events error");
            switch (urlArr[urlArr.length - 2]) {
                case "name":
                    console.log("name");
                    getEventCachedData("name", urlArr[urlArr.length - 1]);
                    break;
                case "date":
                    console.log("date");
                    getEventCachedData("date", urlArr[urlArr.length - 1]);
                    break;
                case "location":
                    console.log("location");
                    getEventCachedData("location.name", urlArr[urlArr.length - 1]);
                    break;
                default:
                    getAllEventCachedData();
            }
        }
    })
}

