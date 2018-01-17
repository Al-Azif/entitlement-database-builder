/*jslint browser: true*/
/*global tingle */

function httpGet(url) {
    "use strict";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send(null);
    return xhr.responseText;
}

function upload(url, data) {
    "use strict";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(data);
}

function download(text) {
    // Modified from https://stackoverflow.com/a/18197511
    "use strict";
    var pom = document.createElement("a");
    pom.setAttribute("href", "data:application/json;charset=utf-8," + encodeURIComponent(text));
    pom.setAttribute("download", "internal_entitlements.json");
    if (document.createEvent) {
        var event = document.createEvent("MouseEvents");
        event.initEvent("click", true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
}

function main() {
    "use strict";
    var error_modal = new tingle.modal({
        footer: true,
        stickyFooter: false,
        closeMethods: ["overlay"]
    });
    error_modal.setContent("<h3 id=\"modal-content\">No Session Cookie!</h3>");
    error_modal.addFooterBtn("Ok", "tingle-btn tingle-btn--primary tingle-btn--pull-right", function () {
        error_modal.close();
    });
    var total_results = JSON.parse(httpGet("https://store.playstation.com/kamaji/api/chihiro/00_09_000/gateway/store/v1/users/me/internal_entitlements?start=0&size=1&fields=game_meta,drm_def")).total_results;
    if (!total_results) {
        error_modal.open();
    } else {
        var url = "https://store.playstation.com/kamaji/api/chihiro/00_09_000/gateway/store/v1/users/me/internal_entitlements?start=0&size=" + total_results + "&fields=game_meta,drm_def";
        var json = httpGet(url);
        var success_modal = new tingle.modal({
            footer: true,
            stickyFooter: false,
            closeMethods: ["overlay"]
        });
        success_modal.setContent("<h3 id=\"modal-content\">Submit to database?</h3>");
        success_modal.addFooterBtn("Cancel", "tingle-btn tingle-btn--danger tingle-btn--pull-left", function () {
            success_modal.close();
        });
        success_modal.addFooterBtn("Submit", "tingle-btn tingle-btn--primary tingle-btn--pull-right", function () {
            upload("https://psn.exposed/submit", json);
            success_modal.close();
        });
        success_modal.addFooterBtn("Download", "tingle-btn tingle-btn--default tingle-btn--pull-right", function () {
            download(json);
            success_modal.close();
        });
        success_modal.open();
    }
}

main();
