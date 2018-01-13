// Modified from PSDLE
// MIT License
// https://github.com/RePod/psdle/blob/master/_src/chrome/psdle/js/background.js

function checkForValidUrl(tabId, changeInfo, tab) {
    "use strict";
    if (tab.url.indexOf("https://store.playstation.com/") == 0) {
        chrome.pageAction.show(tabId);
    }
}

chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.pageAction.onClicked.addListener(function (tab) {
    "use strict";
    chrome.tabs.sendMessage(tab.id, {alive: "y"}, function (response) {
        if (response) {
            console.log(response);
        } else {
            chrome.tabs.executeScript({file: "main.js"});
        }
    });
});