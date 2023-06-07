import { ConfigManager } from './modules/app.module.configmanager.js';

(function () {

    /****************************************************************
     * CONSTANTS
     ****************************************************************/

    /**
     * @name BackendMessageEvents
     * @description All backend functions that are executed by frontend
     */
    const BackendMessageEvents = {

        /**
         * @function get_currenturl_onbackend
         * @description Gets the current url of the active tab of the active window
         * @param {*} request 
         * @param {*} send 
         * @param {*} sendResponse 
         */
        get_currenturl_onbackend: function (request, send, sendResponse) {

            // Get current active tab of current window
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

                // Check for errors
                if (chrome.runtime.lastError) {
                    sendResponse({ message: 'fail' });
                    return;
                }

                // Declare variables
                const currentUrl = (tabs?.length > 0) ? new URL(tabs[0].url) : null;

                console.log(`hostname: ${currentUrl?.hostname}`);

                const config = {
                    hostname: currentUrl.hostname,
                    url: currentUrl
                };

                // Return the hostname of current active tab
                sendResponse({
                    message: 'success',
                    payload: config
                });
            });
        },
    };

    /****************************************************************
     * EVENT LISTENERS
     ****************************************************************/

    /**
     * @event onClicked
     * @description Click event for extension button in browser
     */
    chrome.action.onClicked.addListener((tab) => {
        chrome.runtime.openOptionsPage();
    });

    /**
     * @event onUpdated
     * @description Fires when a tab is updated
     */
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

        if (changeInfo.status === 'complete') {

            // Inject CSS file
            chrome.scripting.insertCSS({
                target: { tabId: tabId },
                files: ["./app.frontend.css"]
            })
            .then(() => {
                // Inject foreground script
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["./app.frontend.js"]
                })
            });
        }
    });

    /**
     * @event onMessage
     * @description Catch sent messages from frontend
     */
    chrome.runtime.onMessage.addListener((request, send, sendResponse) => {

        // Check for runtime error
        if (chrome.runtime.lastError) return false;
        if (!request?.message) return false;

        // Get function to call and instantiate it
        const fn = BackendMessageEvents[request.message];
        if (fn && fn instanceof Function) fn(request, send, sendResponse);

        return true;
    });
})();