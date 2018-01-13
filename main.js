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

function shuffle(array) {
    "use strict";
    var index;
    var temp;
    var counter = array.length;
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter -= 1;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

// TODO: Clean this up... a lot...
function shrinkResults(json) {
    "use strict";
    var entitlements = JSON.parse(json).entitlements;
    var new_entitlements = [];
    var new_json = {};
    var cid = null;
    var title = null;
    var image = null;
    var entitlement_type = null;
    var feature_type = null;
    var pkg_link = null;
    var pkg_size = null;
    var i;
    for (i = 0; i < entitlements.length; ++i) {
        if (entitlements[i].hasOwnProperty("id")) {
            cid = entitlements[i]["id"];
        }
        if (entitlements[i].hasOwnProperty("game_meta")) {
            if (entitlements[i]["game_meta"].hasOwnProperty("name")) {
                title = entitlements[i]["game_meta"]["name"];
            }
            if (entitlements[i]["game_meta"].hasOwnProperty("icon_url")) {
                image = decodeURIComponent(entitlements[i]["game_meta"]["icon_url"].replace(/http[s]{0,1}\:\/\/image\.api\.(np|sp\-int|prod\-qa)\.km\.playstation\.net\/images\/\?format\=(png|jpg|jpeg)&image\=/i, ""));
                image = image.replace(/&sign\=[a-z0-9]{40}/i, "");
            }
        }
        if (entitlements[i].hasOwnProperty("entitlement_type")) {
            entitlement_type = entitlements[i]["entitlement_type"];
        }
        if (entitlements[i].hasOwnProperty("feature_type")) {
            feature_type = entitlements[i]["feature_type"];
        }
        if (entitlements[i].hasOwnProperty("entitlement_attributes")) {
            if (entitlements[i]["entitlement_attributes"][0].hasOwnProperty("reference_package_url")) {
                pkg_link = entitlements[i]["entitlement_attributes"][0]["reference_package_url"];
                if (entitlements[i]["entitlement_attributes"][0].hasOwnProperty("package_file_size")) {
                    pkg_size = entitlements[i]["entitlement_attributes"][0]["package_file_size"];
                }
            }
        }
        if (pkg_link === null) {
            if (entitlements[i].hasOwnProperty("drm_def")) {
                if (entitlements[i]["drm_def"].hasOwnProperty("drmContents")) {
                    if (entitlements[i]["drm_def"]["drmContents"][0].hasOwnProperty("contentUrl")) {
                        pkg_link = entitlements[i]["drm_def"]["drmContents"][0]["contentUrl"];
                        if (entitlements[i]["drm_def"]["drmContents"][0].hasOwnProperty("contentSize")) {
                            pkg_size = entitlements[i]["drm_def"]["drmContents"][0]["contentSize"];
                        }
                    }
                }
                if (image === null) {
                    if (entitlements[i]["drm_def"].hasOwnProperty("image_url")) {
                        image = decodeURIComponent(entitlements[i]["drm_def"]["image_url"].replace(/http[s]{0,1}\:\/\/image\.api\.(np|sp\-int|prod\-qa)\.km\.playstation\.net\/images\/\?format\=(png|jpg|jpeg)&image\=/i, ""));
                        image = image.replace(/&sign\=[a-z0-9]{40}/i, "");
                    }
                }
            }
        }
        if (pkg_link !== null) {
            new_entitlements.push({"entitlement_attributes": [{"package_file_size": pkg_size, "reference_package_url": pkg_link}], "entitlement_type": entitlement_type, "feature_type": feature_type, "game_meta": {"icon_url": image, "name": title}, "id": cid});
        }
        cid = null;
        title = null;
        image = null;
        entitlement_type = null;
        feature_type = null;
        pkg_link = null;
        pkg_size = null;
    }
    new_entitlements = shuffle(new_entitlements);
    new_json["entitlements"] = new_entitlements;
    return JSON.stringify(new_json);
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
            upload("http://psn.exposed/submit", json);
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