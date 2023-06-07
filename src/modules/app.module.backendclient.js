import { SendMessage } from './app.module.utils.js';

const BackendClient = {

    App: {

        /**
         * @function GetData
         * @description Gets data from the backend
         * @param {*} successCallback 
         * @param {*} failCallback 
         */
        GetConfig: function(successCallback, failCallback) {
            SendMessage("get_currenturl_onbackend",
                null,
                data => {
                    successCallback(data);
                },
                error => {
                    failCallback(error);
                });
        }
    }
};

export {BackendClient}