// Copyright 2016 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var dataCacheName = 'index';
var cacheName = 'index cache';
var filesToCache = [
    // '/',
    '/manifest.json',
    '/javascripts/libraries/jquery-3.3.1.js',
    '/javascripts/libraries/popper.js',
    '/javascripts/libraries/bootstrap.js',
    '/javascripts/libraries/moment.js',
    '/javascripts/libraries/socket.io.2.2.0.js',
    // '/javascripts/libraries/jquery.datetimepicker.full.js',
    '/javascripts/libraries/pikaday.js',
    '/javascripts/query_user.js',
    '/javascripts/nav_bar_btn.js',
    '/javascripts/idb.js',
    '/javascripts/query_post.js',
    '/javascripts/query_event.js',
    '/javascripts/query_heat_events.js',
    '/javascripts/search_event.js',
    '/javascripts/new_post.js',
    '/javascripts/new_event.js',
    '/javascripts/init_sw.js',
    '/javascripts/database_indexed.js',
    '/javascripts/init_google_autocmp.js',
    '/javascripts/search_component.js',
    '/javascripts/google_map_controller.js',
    '/stylesheets/libraries/bootstrap.css',
    // '/stylesheets/libraries/jquery.datetimepicker.min.css',
    '/stylesheets/libraries/pikaday.css',
    '/stylesheets/modal.css',
    '/stylesheets/navbar.css',
    '/stylesheets/all.css',
    '/webfonts/fa-solid-900.woff2',
    '/webfonts/fa-solid-900.woff',
    '/webfonts/fa-solid-900.ttf',
    '/webfonts/fa-regular-400.ttf',
    '/images/icons/icon-144x144.png',
    '/images/account.png',
    '/images/user.png',
    '/favicon.ico'
];

/**
 * installation event: it adds all the files to be cached
 */

self.addEventListener('install', function (evt) {
    console.log('[ServiceWorker] Install', evt, evt.currentTarget.registration.scope);
    // cache dynamic route (push the current url to the array)
    // note: cannot add the same routes again!!!
    filesToCache.push(evt.currentTarget.registration.scope);
    evt.waitUntil(
        caches.open(cacheName).then(function (value) {
            console.log('[ServiceWorker] Caching app shell');
            return value.addAll(filesToCache)
        })
    )
});

/**
 * activation of service worker: it removes all cashed files if necessary
 */

self.addEventListener('activate', function (evt) {
    console.log('[ServiceWorker] Activate');
    evt.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key)
                }
            }))
        })
    );
    /*
     * Fixes a corner case in which the app wasn't returning the latest data.
     * You can reproduce the corner case by commenting out the line below and
     * then doing the following steps: 1) load app for first time so that the
     * initial New York City data is shown 2) press the refresh button on the
     * app 3) go offline 4) reload the app. You expect to see the newer NYC
     * data, but you actually see the initial data. This happens because the
     * service worker is not yet activated. The code below essentially lets
     * you activate the service worker faster.
     */
    return self.clients.claim();
});

/**
 * this is called every time a file is fetched. This is a middleware, i.e. this method is
 * called every time a page is fetched by the browser
 * there are two main branches:
 * /weather_data posts cities names to get data about the weather from the server. if offline, the fetch will fail and the
 *      control will be sent back to Ajax with an error - you will have to recover the situation
 *      from there (e.g. showing the cached data)
 * all the other pages are searched for in the cache. If not found, they are returned
 */

self.addEventListener('fetch', function (evt) {
    console.log('evt', evt);
    console.log('[ServiceWorker] Fetch', evt.request.url);

    evt.respondWith(
        caches.match(evt.request).then(function (response) {
            if (response) {
                return response
            }
            return fetch(evt.request)
        })
    )
});