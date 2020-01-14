/**
 * DOM manipulation for Navigation Bar.
 * @author Junxiang Chen, Haobin Yuan
 */

var navBarBtn = $("#nav-bar-btn");
var post_eventBtn = $('#post_event');

// console.log("cookie", document.cookie);

queryUser(function (res) {
    var usersLink = "" +
        "<a id='my-blog-panel' class='nav-link' href='/users/myself/" + res._id +
        "'>My Blog</a>";
    $("#myBlog").append(usersLink);
    var userBtn = "" +
        // "<p id='draftTitle' style='display: block; margin-top: 5px; margin-right: 5px'> Draft Box: </p>"+
        "<button type='button' id='draft' class='btn btn-danger btn-circle' style='display: block'></button>" +
        "<div class='dropdown'>" +
        "    <button class='btn btn-light dropdown-toggle' type='button' id='dropdownMenuButton'\n" +
        "           data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' style='margin-left: 2%'>" +
        res.username +
        "       <img class='rounded-circle' src='/images/account.png' height='18' width='18'>" +
        "    </button>" +
        "    <div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>" +
        "    <a class='dropdown-item' href='/users/myself/" + res._id +
        "'>My blog</a>" +
        "                    <a class='dropdown-item' href='/logout'>Log Out</a>\n" +
        "    </div>" +
        "</div>";
    navBarBtn.append(userBtn);
    $('#username').text("Welcome, " + res.username);
    if (window.location.pathname === "/") {
        var navBtn =
            "<button type='button' class='btn btn-light' data-target='#newPostModal' data-toggle='modal' style='margin-left: 2%'>\n" +
            "    New Post" +
            "</button>" +
            "<button type='button' class='btn btn-light' data-target='#newEventModal' data-toggle='modal' style='margin-left: 2%'>\n" +
            "    New Event" +
            "</button>";
        post_eventBtn.append(navBtn);
    }
}, function () {
    if (navigator.onLine) {
        var register = "<a id='register-btn' href='/register' class='btn btn-light'>Register</a>";
        navBarBtn.append(register);
        var login = "<a id='login-btn' href='/login' class='btn btn-light'>Login</a>";
        navBarBtn.append(login);
    }

});

$(document).ready(function () {
    urlArr = window.location.pathname.split("/");
    if (urlArr[2] === "myself") {
        $("#my-blog-panel").attr("class", "nav-link active")
    }
    if (navigator.onLine) {
        hideOfflineWarning()
    } else {
        showOfflineWarning()
    }

    var int = self.setInterval("readDraftCount()", 2000);
});

function readDraftCount() {
    var imgIdList = JSON.parse(localStorage.getItem("image_draft"));

    if (imgIdList !== null) {
        if (imgIdList.length > 0) {
            $('#draft').show();
            $('#draft').text(imgIdList.length);

        } else {
            $('#draft').hide();

        }
    }
}