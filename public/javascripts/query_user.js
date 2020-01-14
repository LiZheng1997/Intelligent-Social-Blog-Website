/**
 * A server side query for validating whether the user is logged in or not.
 * @param successCallback the callback function to manipulate the scenario that the user is logged in successfully.
 * @param errorCallback the callback function to manipulate the scenario that the user is failed to logged in.
 */
function queryUser(successCallback, errorCallback) {
    $.get({
        url: "/users/query",
        success: function (res) {
            console.log("query user success", res);
            successCallback(res)
        },
        error: function (xhr, status, err) {
            console.log("fail to query user");
            errorCallback()
        }
    })
}