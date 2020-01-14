/**
 * A query posts module to use AJAX to query post data, with DOM and IDB manipulation.
 * @author Junxiang Chen, Haobin Yuan
 */

/**
 * Handle the path of an image to parse a valid path to display in <img> tag.
 * @param image the original path
 * @returns {string} the parsed path
 */
function handlePath(image) {
    var arr = image.split("/");
    return "/" + arr[arr.length - 2] + "/" + arr[arr.length - 1]
}

/**
 * Split the current location path to an array for further condition judgement.
 * @returns {string[]} An array that contains elements of a path
 */
function handleUrl() {
    return window.location.pathname.split("/")
}

/**
 * Encode canvas element to base64 code for further storage in IDB.
 */
function encodeBase64() {
    // console.log("load", this.width, this.height, this.src, handlePath(this.src), this.title);
    var canvas = document.createElement("canvas");
    var cxt = canvas.getContext("2d");
    canvas.width = this.width;
    canvas.height = this.height;
    console.log("encode base 64 this", this);
    cxt.drawImage(this, 0, 0);

    // console.log(canvas);
    var base64 = canvas.toDataURL("image/jpeg");
    // console.log("base64", base64);
    var imgData = {
        path: handlePath(this.src),
        base64: base64,
        id: this.title
    };
    storeCachedData(imgData.path, imgData, IMAGE_STORE_NAME);
}

/**
 * Encode image data to base64 code.
 * @param imgSrc image source
 * @param id image id
 */
function handleImage(imgSrc, id) {
    var image = new Image();
    image.setAttribute("crossOrigin", "anonymous");
    image.src = imgSrc.src;
    console.log(image);
    if (image.complete) {
        console.log("complete", image.width, image.height);
        encodeBase64()
    }
    image.title = id;
    // when the image loading is completed, draw image
    image.onload = encodeBase64;
}

/**
 * Append single image to HTML card to display multiple images card.
 * @param parent the parent HTML element that the <img> tag append to.
 * @param src the path of an image
 * @param active set whether an image should be activated to display in front of the card.
 */
function appendSingleImage(parent, src, active) {
    console.log("img src", src);
    var carousel_item;
    if (active === true) {
        carousel_item = $("<div class='carousel-item active'><img class='card-img-top' width='180px' height='auto' src=" + src + "></div>");
    } else {
        carousel_item = $("<div class='carousel-item'><img class='card-img-top' width='180px' height='auto' src=" + src + "></div>");
    }

    // var img = $("<img class='card-img-top' src=" + src[i] + ">");
    parent.append(carousel_item);
}

/**
 * Append multiple images to a card to set a multiple image display card.
 * @param mainBody The blog element
 * @param pathArr an array of image paths for a blog
 * @param online a boolean to indicate whether images should be queried from server side or IDB
 */
function appendMultipleImage(mainBody, pathArr, online) {
    console.log("append multiple");
    var carousel = $("<div class='carousel slide' data-ride='carousel'></div>");
    var carousel_inner = $("<div class='carousel-inner'></div>");
    carousel_inner.appendTo(carousel);
    if (online === true) {
        for (var j = 0; j < pathArr.length; j++) {
            if (j === 0) {
                appendSingleImage(carousel_inner, pathArr[j], true);
            } else {
                appendSingleImage(carousel_inner, pathArr[j], false);
            }
        }
    } else {
        console.log("online false");
        for (var i = 0; i < pathArr.length; i++) {
            getImageCachedData("path", pathArr[i], i, carousel_inner)
        }
    }

    carousel.append(carousel_inner);
    mainBody.append(carousel);
    $(".carousel").carousel({
        interval: 2000
    });
}

/**
 * Add BLOG elements to the page.
 * @param obj the blog HTML element
 * @param prepend indicate whether the append order should be in order or reverse order
 */
function addToBlog(obj, prepend) {
    console.log("online?", navigator.onLine);

    var blogPost = $("#blog-post");
    var container = "<div class='card mb-sm-4' id=" + obj.id + "></div>";
    if (prepend) {
        blogPost.prepend(container)
    } else {
        blogPost.append(container);
    }
    var mainBody = $("#" + obj.id);
    if (navigator.onLine) {
        appendMultipleImage(mainBody, obj.path, true);

        // query multiple images
        // var images = mainBody.children("img");
        var images = mainBody.find("img");
        console.log("element", images);
        for (var i = 0; i < images.length; i++) {
            handleImage(images[i], obj.id)
        }
    } else {
        console.log("obj.path", obj.path);
        // for (var j = 0; j < obj.path.length; j++) {
        //     getImageCachedData("path", obj.path[j])
        // }
        appendMultipleImage(mainBody, obj.path, false)
    }

    var text = "" +
        "<div class='card-body'>" +
        "    <h2 class='card-title'>" +
        "<a href='/events/" + obj.event.id +
        "'>" + obj.event.name +
        "</a>" +
        "    </h2>" +
        "    <p class='card-text'>" +
        obj.content +
        "    </p>" +
        // "    <a href='#' class='btn btn-primary'>Read More &rarr;</a>" +
        "</div>";
    mainBody.append(text);

    // var footer = document.createElement("div");
    //     // footer.setAttribute("class", "card-footer");
    var footer = $("<div class='card-footer'></div>");
    console.log(moment(obj.date).format("LLLL"));

    var info = "" +
        "<div class='row'>" +
        "    <div class='col-md-12'>" +
        "        <label>" +
        "Posted on " +
        moment(obj.date).format("LLLL") + " " +
        "in " + obj.location.name + " " +
        "by " +
        "<a href='/users/" + obj.user.id +
        "'>" + obj.user.name +

        "</a>" +
        "        </label>" +
        "</div>";

    footer.append(info);
    // footer.append(collapseElem);
    mainBody.append(footer)
}

/**
 * Parse AJAX query results to arrange a valid data format for displaying in the front-end page.
 * @param res an AJAX query post results
 */
function parsePosts(res) {
    console.log(res, res.constructor);

    var idList = [];

    for (var i = res.length - 1; i >= 0; i--) {
        var id = res[i]._id;

        var images = res[i].images;

        var path = [];
        for (var j = 0; j < images.length; j++) {
            path.push(handlePath(images[j]));
        }

        var event = res[i].event;
        var content = res[i].content;
        var location = res[i].location;
        var date = res[i].date;
        var user = res[i].user;

        res[i].date = moment(res[i].date).format('D MMM YYYY');
        storeCachedData(id, res[i], BLOG_STORE_NAME);

        idList.push(id);

        var obj = {
            id: id,
            path: path,
            event: event,
            content: content,
            location: location,
            date: date,
            user: user
        };

        addToBlog(obj, false)
    }

    if (window.location.pathname === "/events") {
        $("#postsCount").text("");
        $("#postsCount").text(res.length + " posts of " + res[0].event.name);
    }

    if (window.location.pathname === '/posts') {
        $('#searchPostTitle').text("");
        $("#searchPostTitle").text(res.length + " posts");
    }

    if (window.location.pathname.indexOf("users") !== -1) {
        $("#postsCount").text("");
        $("#postsCount").text(res.length + " posts");
    }

    if (window.location.pathname === "/") {
        localStorage.setItem("id", JSON.stringify(idList));

    }
    console.log("local storage image draft", localStorage.getItem("image_draft"));
    if (localStorage.getItem("image_draft") === null) {
        localStorage.setItem("image_draft", JSON.stringify([]));
    }
    if (localStorage.getItem("post_draft") === null) {
        localStorage.setItem("post_draft", JSON.stringify([]))
    }
}

/**
 * From BLOG events to find the user data.
 * @param res AJAX query post results
 */
function addUserPageTitle(res) {
    var ifMyBlog = window.location.pathname.indexOf("myself");
    console.log("tag", ifMyBlog);
    if (ifMyBlog !== -1) {
        $("#userPageTitle").text("My Posts Locations");
    } else {
        var name = "A User's";
        if (res[0].user.name !== undefined) {
            name = res[0].user.name + "'s";
        }
        $("#userPageTitle").text(name + " Posts Locations");
    }
}

/**
 * An AJAX query to fetch relevant range of posts from sever side.
 * @param url the AJAX url
 */
function queryAjaxPosts(url) {
    var urlArr = url.split("/");
    console.log("query post url arr", urlArr);
    var uArr = window.location.pathname.split("/");
    $.get({
        url: url,
        success: function (res) {
            if ((JSON).parse(res).length === 0) {
                $('#noDataPanel').show();
            }
            if ((JSON).parse(res).length !== 0) {
                $('#noDataPanel').hide();
            }
            parsePosts(JSON.parse(res));
            console.log("url arr in query ajax posts", urlArr);

            if (uArr[1] === "posts" || uArr[1] === "users") {
                console.log("current init map", urlArr, res);
                initMap(JSON.parse(res))
            }
            addUserPageTitle(JSON.parse(res))
            // displayPostsTitle(res);
        },
        error: function (xhr, status, err) {
            console.log("query err, probably offline");
            // showOfflineWarning();
            if (urlArr[1] === "query") {
                var idList = JSON.parse(localStorage.getItem("id"));
                for (var i = 0; i < idList.length; i++) {
                    getBlogCachedData("_id", idList[i])
                }
            } else if (urlArr[1] === "events") {
                if (urlArr[2] !== undefined) {
                    getBlogCachedData("event.id", urlArr[urlArr.length - 1])
                }
            } else if (urlArr[1] === "posts") {
                if (urlArr[2] !== undefined) {
                    console.log("fetch posts error", xhr.responseText);
                    switch (urlArr[urlArr.length - 2]) {
                        case "name":
                            console.log("name", urlArr[urlArr.length - 1]);
                            getBlogCachedData("event.name", urlArr[urlArr.length - 1]);
                            break;
                        case "date":
                            console.log("date");
                            getBlogCachedData("date", urlArr[urlArr.length - 1]);
                            break;
                        case "location":
                            console.log("location");
                            getBlogCachedData("location.name", urlArr[urlArr.length - 1]);
                            break;
                        default:
                            getAllBlogCachedData();
                    }
                }
            } else if (urlArr[1] === "users") {
                getBlogCachedData("user.id", urlArr[urlArr.length - 1])
            }

        }
    });
}

$(document).ready(function () {
    if (window.location.pathname === "/") {
        queryAjaxPosts("/query")
    } else {
        var urlArr = handleUrl();
        var queryUrl = "/" + urlArr[1];
        if (urlArr[1] === "events") {
        } else if (urlArr[1] === "posts") {
            if (urlArr[2] === undefined) {
                queryAjaxPosts("/query")
            }
        } else if (urlArr[1] === "users" || urlArr[1] === "myself") {
            var userId = urlArr[urlArr.length - 1];
            console.log("user id", userId);
            queryUrl = queryUrl + "/query/" + userId;
            console.log("query url", queryUrl);
            queryAjaxPosts(queryUrl)
        }
    }

});