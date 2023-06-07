/****************************************************************
 * FUNCTIONS
 ****************************************************************/

/**
 * @function SendMessage
 * @description Standard function for sending messages
 * @param {String} message 
 * @param {Object} payload 
 * @param {Function} successCallback 
 * @param {Function} failCallback 
 */
function SendMessage(message, payload, successCallback, failCallback) {

    if(chrome.runtime.lastError) return;
    
    // Send message
    chrome.runtime.sendMessage({ 
        message: message,
        payload: payload
    }, response => {

        // Check for runtime error
        if (chrome.runtime.lastError) {
            if (failCallback && failCallback instanceof Function) failCallback(response?.payload);
            return;
        }

        // Check for the success of message
        if (response?.message === 'success') {
            if (successCallback && successCallback instanceof Function) successCallback(response?.payload);                 
        }
        else {
            if (failCallback && failCallback instanceof Function) failCallback(response?.payload);
        }
    });
}

/**
 * @function SendMessageToCurrentTab
 * @description Sends message to the current active tab of the current window
 * @param {String} message 
 * @param {Object} payload 
 * @param {Function} successCallback 
 * @param {Function} failCallback 
 */
function SendMessageToCurrentTab(message, payload, successCallback, failCallback) {
    
    // Query for the current tab in the active window
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        let tabId = tabs[0].id;

        // Send message to current tab to start recording
        chrome.tabs.sendMessage(tabId, { 
            message: message,
            payload: payload
        }, response => {

            // Check for runtime error
            if (chrome.runtime.lastError) {
                if (failCallback && failCallback instanceof Function) failCallback(response?.payload);
                return;
            }

            // Check for the success of message
            if (response?.message === 'success') {
                if (successCallback && successCallback instanceof Function) successCallback(response?.payload);                 
            }
            else {
                if (failCallback && failCallback instanceof Function) failCallback(response?.payload);
            }
        });
    });
}

/**
 * @function SendMessageToAllTabs
 * @description Sends message to all tabs of the active window
 * @param {String} message 
 * @param {Object} payload 
 * @param {Function} successCallback 
 * @param {Function} failCallback 
 */
function SendMessageToAllTabs(message, payload, successCallback, failCallback) {
    
    // Query for the current tab in the active window
    chrome.tabs.query({ }, function(tabs) {

        // Loop through each tab
        for (let i = 0; i < tabs.length; i++) {

            let tabId = tabs[i]?.id;
            let tabUrl = tabs[i]?.url;

            // Ensure tab url is valid
            if(/^http/.test(tabUrl)) {
            
                // Send message to current tab to start recording
                chrome.tabs.sendMessage(tabId, { 
                    message: message,
                    payload: payload
                }, response => {

                    // Check for runtime error
                    if (chrome.runtime.lastError) {
                        if (failCallback && failCallback instanceof Function) failCallback(response?.payload);
                        return;
                    }

                    // Check for the success of message
                    if (response?.message === 'success') {
                        if (successCallback && successCallback instanceof Function) successCallback(response?.payload);                 
                    }
                    else {
                        if (failCallback && failCallback instanceof Function) failCallback(response?.payload);
                    }
                });
            }
        }

    });
}

/**
 * @function getTopLevelHostname
 * @description Gets the apex domain from a url string
 * @param {String} url 
 * @returns {String} Returns the apex domain of the any URL
 */
function getTopLevelHostname(url) {

    // Check inputs
    if(!url && !(url instanceof String)) return "";

    try {
        // Intialie local varables
        const hostname = new URL(url).hostname.toString();
        const hostnameParts = hostname.split('.');

        return hostnameParts[hostnameParts.length-2] + "." + hostnameParts[hostnameParts.length-1];
    }
    catch(ex) {
        return "";
    }
}

/**
 * @function createElement
 * @description Creates an HTML element
 * @param {String} tagName The HTML element tag name
 * @param {String} id The id of the element
 */
function createElement(tagName, id = "") {
    
    // Validate the tag name
    const validTagName = (tagName && typeof tagName === "string" && tagName.length > 0) ? tagName : "div";

    // Create the element
    const element = document.createElement(validTagName);

    // Set the id of the element
    if(id && typeof id === "string" && id.length > 0) {
        element.id = id;
    }

    // Indicate the element is an app element
    element.dataset.appExtElement = true;

    // Return the new element
    return element;
}

/**
 * @function isElementLoadedOnPage
 * @description Checks if the element loaded on the page already
 * @param id {String} The id of the element to check for on page
 * @returns {Boolean} Returns true if the element is already loaded on the current page
 */
function isElementLoadedOnPage(id) {

    // Check input
    if (id && typeof id === "string" || id.length > 0) {
        const elementCount = document.querySelectorAll(`#${id}`).length;
        return elementCount > 0;
    }

    return false;
}

/****************************************************************
 * EXPORTS
 ****************************************************************/

export {
    SendMessage, 
    SendMessageToCurrentTab, 
    SendMessageToAllTabs, 
    getTopLevelHostname, 
    createElement,
    isElementLoadedOnPage
}