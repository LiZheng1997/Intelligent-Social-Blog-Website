/**
 * The module for creating a new post.
 * @author Junxiang Chen
 */

var newPostModal = "" +
    "<div class='modal fade bd-example-modal-lg' id='newPostModal' tabindex='-1' role='dialog'" +
    "    aria-labelledby='exampleModalLabel' aria-hidden='true'>" +
    "    <div class='modal-dialog modal-lg' role='document'>" +
    "        <div class='modal-content'>" +
    "            <div class='modal-header'>" +
    "                <h5 class='modal-title' id='exampleModalLabel'>New Post</h5>\n" +
    "                    <button type='button' class='close' data-dismiss='modal' aria-label='Close'>\n" +
    "                        <span aria-hidden='true'>&times;</span>" +
    "                    </button>" +
    "            </div>" +
    "            <!--must have enctype='multipart/form-data'-->" +
    "            <form class='needs-validation' enctype='multipart/form-data' id='post_form'>\n" +
    "                <div class='modal-body'>\n" +
    "                    <div class='input-group mb-3'>\n" +
    "                        <div class='input-group-prepend'>\n" +
    "                            <label class='input-group-text' for='event-selector'>Event</label>" +
    "                        </div>\n" +
    "                        <select name='event' class='custom-select' id='event-selector' required>\n" +
    "                            <option value='' selected disabled hidden>Choose...</option>" +
    "                        </select>" +
    "                        <div class='invalid-feedback'>" +
    "                            Event Selection is Required" +
    "                        </div>" +
    "                    </div>\n" +
    "                    <div class='form-group'>\n" +
    "                        <label for='post-message-text' class='col-form-label'>Content:</label>\n" +
    "                        <textarea class='form-control' id='post-message-text' required='true'></textarea>\n" +
    "                        <div class='invalid-feedback'>\n" +
    "                            Content is Required" +
    "                        </div>" +
    "                    </div>\n" +
    "                    <div class='input-group'>\n" +
    "                        <input class='form-control' id='autocomplete' placeholder='Location' type='text' required/>\n" +
    "                        <div class='input-group-append'>" +
    "                            <button class='btn btn-outline-secondary' type='button'>\n" +
    "                                <i class='fas fa-location-arrow'></i>\n" +
    "                            </button>" +
    "                        </div>\n" +
    "                        <div class='invalid-feedback'>\n" +
    "                            Location is Required" +
    "                        </div>" +
    "                    </div>" +
    "                    <hr>" +
    "                    <div class='form-group'>" +
    "                        <span>Please </span>" +
    "                        <button type='button' class='btn btn-success' id='uploadBtn'>Upload Picture</button>" +
    "                        <span> or </span>" +
    "                        <button type='button' class='btn btn-success' id='takePhotoBtn'>Take Photo</button>" +
    "                        <span> to complete post:</span>" +
    "                    </div>" +
    "                    <div id='previewCard' class='card-deck'>" +
    "                    </div>" +
    "                    <br>" +
    "                    <div class='input-group mb-3' id='uploadInput' style='display: none'>\n" +
    "                        <div class='input-group-prepend'>\n" +
    "                            <span class='input-group-text'>Upload</span>" +
    "                        </div>" +
    "                        <div class='custom-file'>" +
    "                            <input type='file' name='image' class='custom-file-input' id='uploadPic' multiple='multiple'>\n" +
    "                            <label class='custom-file-label' for='inputGroupFile01'>Choose file</label>" +
    "                        </div>" +
    "                        <div id='uploadPicRequire' class='invalid-feedback' style='display: none'>" +
    "                            At Least One Picture Should be Uploaded" +
    "                        </div>" +
    "                    </div>" +
    "                    <div class='form-group' id='takePic' style='display: none'>" +
    "                        <div id='video'></div>" +
    "                        <div>" +
    "                            <button type='button' class='btn btn-danger' id='take'>Take Photo</button>" +
    "                        </div>" +
    "                        <br>" +
    "                        <div id='photoResult'></div>" +
    "                        <div id='takePicRequire' class='invalid-feedback' style='display: none'>\n" +
    "                            At Least One Picture Should be Taken" +
    "                        </div>" +
    "                    </div>" +
    "                    <div id='picRequire' class='invalid-feedback' style='display: none'>" +
    "                            At Least One Picture Should be Uploaded or Taken" +
    "                    </div>" +
    "                </div>" +
    "                <div class='modal-footer'>" +
    "                    <button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>\n" +
    "                    <button type='button' class='btn btn-primary' id='sendPost'>Send</button>" +
    "                </div>" +
    "            </form>" +
    "        </div>" +
    "    </div>" +
    "</div>";

var fileNames = [];
var imgFiles = [];
var formData = new FormData();

/**
 * Post input form validation.
 */
function validation() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName("needs-validation");
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function (form) {
        document.getElementById("sendPost").addEventListener("click", function (event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add("was-validated");
        }, false);
    });
}

/**
 * Initialise the NEW POST MODAL.
 */
function init() {
    $("#new-post-modal").append(newPostModal);
    'use strict';
    window.addEventListener("load", validation, false);
}

init();

/**
 * Handle different directory strings in different operation systems.
 * @param path the original path of the image
 * @returns {string} the unified format of the storage string
 */
function extractPath(path) {
    var isBackSlash = path.indexOf("\\");
    var arr;
    if (isBackSlash !== -1) {
        arr = path.split('\\');
    } else {
        arr = path.split('/');
    }
    return "dist" + "/" + arr[arr.length - 2] + "/" + arr[arr.length - 1];
}

/**
 * A DOM manipulation funciton to arrange HTML elements to the input selection area.
 * @param res the AJAX query data.
 */
function addToNewPostEventSelector(res) {
    console.log(res);
    var eventSelector = $("#event-selector");
    for (var i = 0; i < res.length; i++) {
        var option = "<option value=" + res[i]._id +
            ">" + res[i].name +
            "</option>";
        eventSelector.append(option)
    }
}

/**
 * Add event listener for querying and adding existing events to the event selector.
 */
function eventSelectorEventListener() {
    $(document).on("shown.bs.modal", "#newPostModal", function () {
        console.log("show modal");
        queryAjaxEvents("/events/query", addToNewPostEventSelector)
    });
}

/**
 * Transform the base64 image code to BLOB data format
 * @param dataUrl base64 image code
 * @returns {Blob} the BLOB data format
 */
function dataURLtoBlob(dataUrl) {
    var arr = dataUrl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime
    });
}

/**
 * Add uploaded image to preview.
 * @param data The base64 image data
 */
function addToPreviewCard(data) {
    var divCard = $("<div class='card'>");

    var preview = $("<img>");
    preview.attr("src", data);
    preview.addClass("card-img-top");
    preview.appendTo(divCard);

    var cardBody = $("<div class='footer'>");
    var fileName = $("<small class='text-muted'>" + "preview" + "</small>"); // filename
    fileName.appendTo(cardBody);
    cardBody.appendTo(divCard);
    divCard.appendTo("#previewCard");
}

/**
 * An AJAX request for uploading image to sever side.
 * If there is an online request, it will send upload image request to the sever directly.
 * Otherwise, it will store image and post data into IDB and the index in localStorage.
 * @param url the request url
 * @param formData the image data
 * @param data other form input data except image
 * @param cachedData post data cached in IDB
 */
function uploadAjaxImage(url, formData, data, cachedData) {
    $.ajax({
        async: false,
        url: url,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        type: "POST",
        success: function (res) {
            console.log("upload image success", res, res.constructor);
            var images = JSON.parse(res);
            var imagePath = [];
            for (var i = 0; i < images.length; i++) {
                var newPath = extractPath(images[i].path);
                imagePath.push(newPath);
            }
            data.images = imagePath;
            console.log('ImagePath:' + imagePath);
            insertAjaxPost("/insert", JSON.stringify(data));
        },
        error: function (xhr, status, err) {
            console.log("upload image err");
            console.log("image data", cachedData);
            var imgIdList = JSON.parse(localStorage.getItem("image_draft"));
            var imgList = [];
            data._id = Math.floor(Math.random() * 26) + Date.now();
            for (var i = 0; i < cachedData.length; i++) {
                var imgData = {
                    path: Math.floor(Math.random() * 26) + Date.now(),
                    base64: cachedData[i],
                    id: data._id
                };
                storeCachedData("path", imgData, IMAGE_DRAFT_NAME);
                imgIdList.push(imgData.path);
                imgList.push(imgData.path);
            }
            data.images = imgList;
            localStorage.setItem("image_draft", JSON.stringify(imgIdList));
            storeCachedData("_id", data, BLOG_DRAFT_NAME);
            var postIdList = JSON.parse(localStorage.getItem("post_draft"));
            postIdList.push(data._id);
            localStorage.setItem("post_draft", JSON.stringify(postIdList))
        }
    })
}

/**
 * An AJAX request for inserting a new post to the sever side.
 * Usually right after the success response from image upload request.
 * @param url the request url
 * @param data other form data except image
 */
function insertAjaxPost(url, data) {
    $.ajax({
        url: url,
        data: data,
        contentType: "application/json",
        type: "POST",
        success: function (res) {
            console.log("insert post success", res);
            // var path = handlePath(res.images);
            var images = res.images;
            var path = [];
            for (var j = 0; j < images.length; j++) {
                path.push(handlePath(images[j]));
            }

            console.log("new post:", path);

            storeCachedData(res._id, res, BLOG_STORE_NAME);
            // storeCachedData(res.event, res, BLOG_STORE_NAME);
            // update list in the localStorage
            var idList = JSON.parse(localStorage.getItem("id"));
            idList.unshift(res._id);
            localStorage.setItem("id", JSON.stringify(idList));
            // ensure the performance during the DOM manipulation process
            setTimeout(function () {
                var obj = {
                    id: res._id,
                    path: path,
                    event: res.event,
                    content: res.content,
                    location: res.location,
                    date: res.date,
                    user: res.user
                };
                console.log("new post obj", obj);
                addToBlog(obj, true);
                $('#noDataPanel').hide();
            }, 1000)
        },
        error: function (xhr, status, err) {
            console.log("insert err", xhr.responseText, status);
            alert("Create Post Error: " + xhr.responseText)
        }
    })
}

/**
 * An AJAX request for fetching cached post DRAFT (the events that have not been uploaded due to offline).
 * Once the system is turning from offline to online, it will automatically executed to upload data from IDB to sever.
 */
function uploadAjaxCache() {
    console.log("uploading ajax");
    var postDraftList = JSON.parse(localStorage.getItem("post_draft"));
    for (var i = 0; i < postDraftList.length; i++) {
        sendBlogCachedData("_id", postDraftList[i])
    }
}

/**
 * Add event listener to upload picture input. With the change of uploaded image, the preview area will update concurrently.
 */
function uploadPicEventListener() {
    var uploadPic = $("#uploadPic");
    uploadPic.change(function () {
        var allFiles = uploadPic[0].files;
        console.log("all files", allFiles);
        var len = allFiles.length;
        $("#uploadPicRequire").hide();
        $("#picRequire").hide();

        for (var i = 0; i < len; i++) {
            var file = allFiles[i]; // select single file
            console.log(file);
            // name should be the same as upload instance in the router: 'image'
            formData.append("image", uploadPic[0].files[i]);

            if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/gif") {
                alert("Illegal picture file format!");
                continue;
            }
            var reader = new FileReader();

            // cb when the upload finished
            reader.onload = function (e) {

                var data = e.target.result;

                addToPreviewCard(data);
                imgFiles.push(data);
                // save filename
                fileNames.push(file.name);
            };
            // read file by DataURL format:
            reader.readAsDataURL(file);
        }
    });
}

/**
 * Add event listener for upload button.
 * If the button is clicked, the picture input area will be loaded, and the camera and taking picture area will be hidden.
 * Also, it will load picture input area event listener.
 * In the meanwhile, relevant data variables will be cleaned files to restart storing from blank.
 */
function uploadBtnEventListener() {
    $("#uploadBtn").click(function () {
        fileNames = [];
        imgFiles = [];
        formData = new FormData();
        $("#previewCard").empty();
        $("#uploadInput").show();
        $("#takePic").hide(function () {
            // TODO: delete camera binding
            $("#video").empty()
        });
        $("#uploadPic").attr("required", true);
    });
    uploadPicEventListener()
}

/**
 * Add event listener for take picture button.
 * Once the button is clicked, the camera will take a picture and add the picture to the preview area.
 * @param videoPlaying whether the camera is capturing the scene.
 */
function takeBtnEventListener(videoPlaying) {
    document.getElementById("take").addEventListener("click", function () {
        console.log("click take");
        if (videoPlaying) {
            console.log("video playing");
            var c = "Result: <canvas id='canvas' style='height: 100%; width: 100%'></canvas>";
            if ($("#canvas").length <= 0) {
                $("#photoResult").append(c);
            }
            $("#takePicRequire").hide();
            $("#picRequire").hide();

            var canvas = document.getElementById("canvas");
            canvas.width = v.videoWidth;
            canvas.height = v.videoHeight;
            canvas.getContext("2d").drawImage(v, 0, 0);
            // gat photo
            var data = canvas.toDataURL("image/webp");
            addToPreviewCard(data);
            imgFiles.push(data);
            console.log("camera data", data);
            var blob = dataURLtoBlob(data);
            console.log("transfer to blob", blob, blob.constructor);
            fileNames.push("camera image");
            formData.append("image", blob)
            // document.getElementById('photo').setAttribute('src', data);
        }
    }, false);
}

/**
 * Add event listener for taking picture button.
 * Once the button is clicked, the camera and taking picture area will be loaded, and the upload area will be hidden.
 * Also, it will add picture taking area event listener.
 */
function takePhotoBtnEventListener() {
    $("#takePhotoBtn").click(function () {
        fileNames = [];
        imgFiles = [];
        formData = new FormData();
        $("#previewCard").empty();
        $("#uploadPic").attr("required", false);
        $("#takePic").show(
            !(function () {
                if (navigator.mediaDevices === undefined) {
                    navigator.mediaDevices = {};
                }
                if (navigator.mediaDevices.getUserMedia === undefined) {
                    navigator.mediaDevices.getUserMedia = function (constraints) {

                        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

                        if (!getUserMedia) {
                            return Promise.reject(new Error("getUserMedia is not implemented in this browser"));
                        }

                        // handle old version browser
                        return new Promise(function (resolve, reject) {
                            getUserMedia.call(navigator, constraints, resolve, reject);
                        });
                    }
                }

                var video = "Camera:<video id='v' style='width: 100%; height: 100%'></video>";
                $("#video").append(video);

                var constraints = {
                    video: true,
                    audio: false
                };
                var videoPlaying = false;
                var v = document.getElementById("v");
                var promise = navigator.mediaDevices.getUserMedia(constraints);
                promise.then(function (stream) {
                    //  new version browser
                    if ("srcObject" in v) {
                        v.srcObject = stream;
                    } else {
                        // old version browser
                        v.src = window.URL.createObjectURL(stream);
                    }
                    v.onloadedmetadata = function (e) {
                        v.play();
                        videoPlaying = true;
                        // refresh UI
                        $("#previewCard").empty();
                        takeBtnEventListener(videoPlaying)
                    };
                }).catch(function (err) {
                    console.error(err.name + ": " + err.message);
                    // refresh UI
                    $("#previewCard").empty();
                });
            })());
        $("#uploadInput").hide();
    });
}

/**
 * Add event listener for sending form data.
 * It will validate the input data before sending AJAX request.
 */
function sendPostBtnEventListener() {
    $("#sendPost").click(function () {
        var placeName = $("#autocomplete").val();
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
        var data = {
            event: {
                name: $("#event-selector option:selected").text(),
                id: $("#event-selector").val()
            },
            content: $("#post-message-text").val(),
            location: location
        };
        var readyToUpload = true;
        for (var key in data) {
            if (data[key] === "") {
                readyToUpload = false;
                break
            }
        }
        if (fileNames.length === 0) {
            console.log("no image file");
            readyToUpload = false;
            $("#uploadPicRequire").show();
            $("#takePicRequire").show();
            if ($("#uploadInput").is(":hidden") && $("#takePic").is(":hidden")) {
                $("#picRequire").show()
            } else {
                $("#picRequire").hide()
            }
        }
        if (readyToUpload) {
            console.log("data", data);
            var modal = $("#newPostModal");
            modal.modal("hide");
            if (!modal.is(":animated")) {
                console.log("animate stop");
                // ensure the performance in DOM manipulation
                uploadAjaxImage("/upload", formData, data, imgFiles);
            }
        }
    });
}

$(document).ready(function () {
    eventSelectorEventListener();

    uploadBtnEventListener();

    takePhotoBtnEventListener();

    sendPostBtnEventListener();

    $(document).on("hidden.bs.modal", "#newPostModal", function (e) {
        formData = new FormData();
        imgFiles = [];
        fileNames = [];
        console.log("clean data");
        $("#uploadInput").hide();
        $("#takePic").hide(function () {
            // TODO: delete camera binding
            $("#video").empty()
        });
        $("#new-post-modal").empty();
        console.log("empty");
        $("#new-post-modal").append(newPostModal);
        console.log("append");
        validation();
        console.log("validation");
        sendPostBtnEventListener();
        console.log("bind send");
        initAutocomplete();
        console.log("init auto complete");
        uploadBtnEventListener();
        console.log("bind upload");
        takePhotoBtnEventListener();
        console.log("bind take photo")
    });
});
