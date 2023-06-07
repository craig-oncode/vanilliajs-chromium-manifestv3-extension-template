
export function AppLocalStorage() {

    // Declare local variables
    const _storageConfig = {
        dbName: "myAppStorageDB",
        stores: {
            myDataStore: {
                name: "myDataStore",
                keyPath: "id"
            }
        }
    }
    //const _dbName = "myAppStorageDB";
    
    // Open the App Local Storage Store
    //let deleteRequest = indexedDB.deleteDatabase(_storageConfig.dbName);
    const openRequest = indexedDB.open(_storageConfig.dbName, 1);
    var _db = null;

    //const _storeNames = {
    //    myDataStore: {
    //        name: "myDataStore",
    //        keyPath: "id"
    //    }
    //};

    /**
     * @function onupgradeneeded
     * @description Called when storage version if different than current version
     *              and upgrades the data structures as needed
     * @param {Object} event 
     */
    openRequest.onupgradeneeded = function (event) {
        // the existing database version is less than 2 (or it doesn't exist)
        let db = openRequest.result;

        // Check version you are upgrading from
        switch (event.oldVersion) {
            case 0:
                // version 0 means that the client had no database
                // perform initialization

                if (!db.objectStoreNames.contains(_storageConfig.stores.myDataStore.name)) {
                    db.createObjectStore(_storageConfig.stores.myDataStore.name, {keyPath: _storageConfig.stores.myDataStore.keyPath});
                    // const myDataStore = db.createObjectStore('myDataStore', { autoIncrement: true });
                    // const fieldname_idx = db.createIndex("fieldname_idx", "fieldname")
                }
        }
    };

    /**
     * @function onerror
     * @description There was an error opening the data store
     */
    openRequest.onerror = function () {
        console.error("Error", openRequest.error);
    };

    /**
     * @function onsuccess
     * @description Successfully opened the app data store
     */
    openRequest.onsuccess = function () {
        _db = openRequest.result;
        // continue working with database using db object

        _db.onversionchange = function () {
            _db.close();
            alert("Database is outdated, please reload the page.")
        };
    };

    /**
     * @function onblocked
     * @description Another connection is already open to the same database
     */
    openRequest.onblocked = function () {
        // this event shouldn't trigger if we handle onversionchange correctly

        // it means that there's another open connection to the same database
        // and it wasn't closed after db.onversionchange triggered for it
    };

    /****************************************************************
     * PUBLIC FUNCTIONS
     ****************************************************************/

    /**
     * @function getDataStoreItem
     * @param {String} id 
     * @param {Function} successCallback 
     * @param {Function} errorCallback 
     */
    function getDataStoreItem(id, successCallback, errorCallback) {

    }

    /**
     * @function setDataStoreItem
     * @param {Object} cache 
     * @param {Function} successCallback 
     * @param {Function} errorCallback 
     */
    function setDataStoreItem(cache, successCallback, errorCallback) {

    }

    return {
        myAppStorageDB: {
            get: getDataStoreItem,
            set: setDataStoreItem
        }
    }
}
