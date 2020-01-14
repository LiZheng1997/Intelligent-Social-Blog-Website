/**
 * The IndexedDB manipulation module, including some DOM manipulation functions.
 * @author Junxiang Chen, Haobin Yuan
 */

var dbPromise;

var DB_NAME = "db-com6504";
var BLOG_STORE_NAME = "store-blog";
var IMAGE_STORE_NAME = "store-image";
var EVENT_STORE_NAME = "store-event";
var BLOG_DRAFT_NAME = "draft-blog";
var IMAGE_DRAFT_NAME = "draft-image";

/**
 * Initialise BLOG IDB storage.
 * @param upgradeDB update DB
 */
function initBlogDB(upgradeDB) {
    var blogDB = upgradeDB.createObjectStore(BLOG_STORE_NAME, {keyPath: "_id"});
    blogDB.createIndex("_id", "_id", {unique: true});
    blogDB.createIndex("event.id", "event.id", {unique: false, multiEntry: true});
    blogDB.createIndex("event.name", "event.name", {unique: false, multiEntry: true});
    blogDB.createIndex("location.name", "location.name", {unique: false, multiEntry: true});
    blogDB.createIndex("date", "date", {unique: false, multiEntry: true});
    blogDB.createIndex("user.id", "user.id", {unique: false, multiEntry: true})
}

/**
 * Initialise IMAGE IDB storage.
 * @param upgradeDB update DB
 */
function initImageDB(upgradeDB) {
    var imageDB = upgradeDB.createObjectStore(IMAGE_STORE_NAME, {keyPath: "path"});
    imageDB.createIndex("path", "path", {unique: true});
    imageDB.createIndex("id", "id", {unique: false, multiEntry: true})
}

/**
 * Initialise EVENT IDB storage.
 * @param upgradeDB update DB
 */
function initEventDB(upgradeDB) {
    var eventDB = upgradeDB.createObjectStore(EVENT_STORE_NAME, {keyPath: "_id"});
    eventDB.createIndex("_id", "_id", {unique: true});
    eventDB.createIndex("name", "name", {unique: true});
    eventDB.createIndex("location.name", "location.name", {unique: false, multiEntry: true});
    eventDB.createIndex("date", "date", {unique: false, multiEntry: true})
}

/**
 * Initialise BLOG DRAFT IDB storage.
 * @param upgradeDB update DB
 */
function initBlogDraftDB(upgradeDB) {
    var blogDraftDB = upgradeDB.createObjectStore(BLOG_DRAFT_NAME, {keyPath: "_id"});
    blogDraftDB.createIndex("_id", "_id", {unique: true});
}

/**
 * Initialise IMAGE DRAFT IDB storage.
 * @param upgradeDB update DB
 */
function initImageDraftDB(upgradeDB) {
    var imageDraftDB = upgradeDB.createObjectStore(IMAGE_DRAFT_NAME, {keyPath: "path"});
    imageDraftDB.createIndex("path", "path", {unique: true});
    imageDraftDB.createIndex("id", "id", {unique: false, multiEntry: true})
}

/**
 * Initialise ALL IDB storage.
 */
function initDB() {
    dbPromise = idb.openDb(DB_NAME, 1, function (upgradeDB) {
        if (!upgradeDB.objectStoreNames.contains(DB_NAME)) {
            initBlogDB(upgradeDB);
            initImageDB(upgradeDB);
            initEventDB(upgradeDB);
            initBlogDraftDB(upgradeDB);
            initImageDraftDB(upgradeDB)
        }
    })
}

/**
 * Return a PROMISE for async putting date into the IDB.
 * @param store the store name of IDB
 * @param obj the object that is going to store in the IDB store.
 */
function putData(store, obj) {
    return new Promise(function (resolve, reject) {
        if (store) {
            store.put(obj);
            resolve()
        } else {
            reject()
        }
    })
}

/**
 * Store fetched data from sever side to a store in IDB.
 * @param index the IDB index
 * @param obj the storing object
 * @param STORE_NAME the specific IDB store name
 */
function storeCachedData(index, obj, STORE_NAME) {
    // console.log("inserting:", JSON.stringify(obj));
    if (dbPromise) {
        dbPromise.then(function (db) {
            var tx = db.transaction(STORE_NAME, "readwrite");
            var store = tx.objectStore(STORE_NAME);
            putData(store, obj).then(function (value) {
                return tx.complete
            }).catch(function (reason) {
                console.log("put error")
            })
        }).then(function (value) {
            console.log("added items to the store", JSON.stringify(obj))
        }).catch(function () {
            localStorage.setItem(index, JSON.stringify(obj))
        });
    } else {
        localStorage.setItem(index, JSON.stringify(obj))
    }
}

/**
 * A DOM manipulation function that adds cached posts info to HTML selector.
 * It manipulates all cached POST data from BLOG IDB
 * @param res the fetched data from IDB
 */
function addPostToSearchSelector(res) {
    console.log("cache post res", res);
    var locationSelector = $("#autocomplete");
    var nameSelector = $("#searchName");
    var nameSet = new Set();
    var locationSet = new Set();
    for (var i = 0; i < res.length; i++) {
        nameSet.add(res[i].event.name);
        locationSet.add(res[i].location.name);
    }
    var nameArr = Array.from(nameSet);
    var locationArr = Array.from(locationSet);
    console.log("event arr", nameArr);
    for (var j = 0; j < nameArr.length; j++) {
        var option = "<option>" + nameArr[j] +
            "</option>";
        nameSelector.append(option);
    }
    console.log("loc arr", locationArr);
    for (var k = 0; k < locationArr.length; k++) {
        var item = locationArr[k];
        var locationOptions = "<option>" + item +
            "</option>";
        locationSelector.append(locationOptions);
    }
}

/**
 * Fetch all BLOG objects from BLOG IDB.
 */
function getAllBlogCachedData() {
    var req = window.indexedDB.open(DB_NAME, 1);
    req.onsuccess = function (ev) {
        console.log("post success");
        var db = ev.target.result;
        var tx = db.transaction([BLOG_STORE_NAME], "readonly");
        var store = tx.objectStore(BLOG_STORE_NAME);
        var r = store.openCursor();
        var res = [];
        r.onsuccess = function (ev1) {
            var cursor = ev1.target.result;
            if (cursor) {
                res.push(cursor.value);
                cursor.continue()
            } else {
                console.log("res of posts", res);
                var urlArr = handleUrl();
                console.log(urlArr);
                if (urlArr[1] === "posts") {
                    addPostToSearchSelector(res)
                } else if (urlArr[1] === "users") {

                }
            }
        }
    }
}

/**
 * Fetch BLOG objects from IDB according to a specific index.
 * @param index the index of the BLOG IDB store
 * @param id the index value for querying
 */
function getBlogCachedData(index, id) {
    var obj;
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log("fetching:", id);
            var tx = db.transaction(BLOG_STORE_NAME, "readonly");
            var store = tx.objectStore(BLOG_STORE_NAME);
            var idx = store.index(index);
            return idx.getAll(IDBKeyRange.only(id))
        }).then(function (value) {
            var images, path;
            if (value && value.length > 0) {
                addUserPageTitle(value);
                for (var i = 0; i < value.length; i++) {
                    console.log(value[i]);

                    images = value[i].images;
                    path = [];
                    for (var j = 0; j < images.length; j++) {
                        path.push(handlePath(images[j]));
                    }
                    obj = {
                        id: value[i]._id,
                        path: path,
                        event: value[i].event,
                        content: value[i].content,
                        location: value[i].location,
                        date: value[i].date,
                        user: value[i].user
                    };
                    addToBlog(obj, false)
                }
                // displayPostsOffLine(value);
                $("#searchPostTitle").text("");
                $("#searchPostTitle").text(value.length + " posts ");
            } else {
                $("#postResult").text("");
                var val = localStorage.getItem(id);
                if (val != null) {
                    images = val.images;
                    path = [];
                    for (var k = 0; k < images.length; k++) {
                        path.push(handlePath(images[k]));
                    }

                    obj = {
                        id: val._id,
                        path: path,
                        event: val.event,
                        content: val.content,
                        location: val.location,
                        date: val.date,
                        user: val.user
                    };
                    addToBlog(obj, false)
                }
            }
        })
    } else {
        $("#searchPostTitle").text("");
        var val = localStorage.getItem(id);
        if (val != null) {
            var images = val.images;
            var path = [];
            for (var j = 0; j < images.length; j++) {
                path.push(handlePath(images[j]));
            }

            obj = {
                id: val._id,
                path: path,
                event: val.event,
                content: val.content,
                location: val.location,
                date: val.date,
                user: val.user
            };
            addToBlog(obj, false)
        }
    }
}

/**
 * Fetch IMAGE objects from IDB according to a specific index.
 * @param index the index of the IMAGE IDB store
 * @param path the image path value
 * @param num the index of an array in an iteration process
 * @param elem the DOM element that the image append to
 */
function getImageCachedData(index, path, num, elem) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log("fetching:", path);
            var tx = db.transaction(IMAGE_STORE_NAME, "readonly");
            var store = tx.objectStore(IMAGE_STORE_NAME);
            var idx = store.index(index);
            return idx.getAll(IDBKeyRange.only(path))
        }).then(function (value) {
            if (value && value.length > 0) {
                for (var i = 0; i < value.length; i++) {
                    console.log(value[i]);
                    if (num === 0) {
                        appendSingleImage(elem, value[i].base64, true)
                    } else {
                        appendSingleImage(elem, value[i].base64, false)
                    }

                }
            }
        })
    }
}

/**
 * This function fetches relevant BLOG objects to query the relevant IMAGE objects in IDB.
 * @param index the index of the BLOG IDB store
 * @param id the index value for querying
 */
function sendBlogCachedData(index, id) {
    var obj;
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log("fetching cache post:", id);
            var tx = db.transaction(BLOG_DRAFT_NAME, "readonly");
            var store = tx.objectStore(BLOG_DRAFT_NAME);
            var idx = store.index(index);
            return idx.getAll(IDBKeyRange.only(id))
        }).then(function (value) {
            if (value && value.length > 0) {
                for (var i = 0; i < value.length; i++) {
                    obj = {
                        event: value[i].event,
                        content: value[i].content,
                        location: {
                            name: value[i].location.name
                        }
                    };
                    var formData = new FormData();
                    sendImageCachedData("id", value[i]._id, formData, obj);
                    var blogIdList = JSON.parse(localStorage.getItem("post_draft"));
                    var blogSet = new Set(blogIdList);
                    blogSet.delete(id);
                    var arr = Array.from(blogSet);
                    localStorage.setItem("post_draft", JSON.stringify(arr))
                }
            }
        })
    }
}

/**
 * This function fetches relevant IMAGE objects to send the AJAX request for uploading the DRAFT images and posts.
 * @param index the index of the IMAGE IDB store
 * @param id the index value for querying
 * @param formData for storing BLOB type IMAGE data
 * @param data the BLOG data
 */
function sendImageCachedData(index, id, formData, data) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log("fetching cache image:", id);
            var tx = db.transaction(IMAGE_DRAFT_NAME, "readonly");
            var store = tx.objectStore(IMAGE_DRAFT_NAME);
            var idx = store.index(index);
            return idx.getAll(IDBKeyRange.only(id))
        }).then(function (value) {
            if (value && value.length > 0) {
                for (var i = 0; i < value.length; i++) {
                    var dataUrl = value[i].base64;
                    var blob = dataURLtoBlob(dataUrl);
                    formData.append("image", blob);
                    var imgIdList = JSON.parse(localStorage.getItem("image_draft"));
                    var imgSet = new Set(imgIdList);
                    imgSet.delete(value[i].path);
                    var arr = Array.from(imgSet);
                    localStorage.setItem("image_draft", JSON.stringify(arr))
                }
                uploadAjaxImage("/upload", formData, data, []);
            }
        })
    }
}

/**
 * Fetch EVENT objects from IDB according to a spefic index.
 * @param index the index value for querying
 * @param id the index value
 */
function getEventCachedData(index, id) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log("fetching:", id);
            var tx = db.transaction(EVENT_STORE_NAME, "readonly");
            var store = tx.objectStore(EVENT_STORE_NAME);
            var idx = store.index(index);
            return idx.getAll(IDBKeyRange.only(id))
        }).then(function (value) {

            if (value && value.length > 0) {
                addToEventCard(value);

            } else {
                $('#event-cards').empty();
                $('#blog-post').empty();
            }
        })
    }
}

/**
 * A DOM manipulation function that adds cached events info to HTML selector.
 * @param res the fetched data from IDB
 */
function addEventToSearchSelector(res) {
    var locationSelector = $("#autocomplete");
    var nameSelector = $("#searchName");
    var set = new Set();
    for (var i = 0; i < res.length; i++) {
        var option = "<option>" + res[i].name +
            "</option>";
        nameSelector.append(option);

        set.add(res[i].location.name);
    }
    var arr = Array.from(set);
    console.log("arr", arr);
    for (var j = 0; j < arr.length; j++) {
        var item = arr[j];
        var locationOptions = "<option>" + item +
            "</option>";
        locationSelector.append(locationOptions);
    }
}

/**
 * Fetch all EVENT objects from BLOG IDB.
 */
function getAllEventCachedData() {
    var req = window.indexedDB.open(DB_NAME, 1);
    req.onsuccess = function (ev) {
        console.log("event success");
        var db = ev.target.result;
        var tx = db.transaction([EVENT_STORE_NAME], "readonly");
        var store = tx.objectStore(EVENT_STORE_NAME);
        var r = store.openCursor();
        var res = [];
        r.onsuccess = function (ev1) {
            var cursor = ev1.target.result;
            if (cursor) {
                res.push(cursor.value);
                cursor.continue()
            } else {
                console.log("res of events", res);
                var urlArr = handleUrl();
                if (urlArr[1] === "") {
                    addToHeatEvent(res);
                    addToNewPostEventSelector(res)
                } else if (urlArr[1] === "events") {
                    addToEventCard(res);
                    addEventToSearchSelector(res);
                    // allResult(res.length);
                }
            }
        }
    }
}

if ("indexedDB" in window) {
    initDB()
} else {
    console.log("This browser doesn't support IndexedDB")
}