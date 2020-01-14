/**
 * AJAX request to register a user
 * @param url request url
 * @param data form data
 */
function insertAjaxUser(url, data) {
    $.ajax({
        url: url,
        data: data,
        contentType: "application/json",
        type: "POST",
        success: function (res) {
            console.log("insert user success")
        },
        error: function (xhr, status, err) {
            console.log("insert user err")
        }
    })
}

$(document).ready(function () {
    var password = $("#password").val();
    var confirmPassword = $("#confirmPassword").val();

    if (password !== confirmPassword) {
        alert("password and confirm password doesn't match!")
    }
});