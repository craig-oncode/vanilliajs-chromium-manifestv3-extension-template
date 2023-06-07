/**
 * @function ConfigManager
 * @returns {Promise<Config>} Returns a promise of a config object
 */
export async function ConfigManager() {

    /**
     * @function main
     * @description Calls GetConfig function and sets up api endpoint
     * @returns {Object} Returns config object
     */
    async function main() {
        const config = await GetConfig();
        return config;
    }

    /**
     * @function GetConfig
     * @description Gets the auth configuration
     * @returns {Object} Returns an object with config details
     */
    async function GetConfig() {
        // Get the manifest
        const manifest = chrome.runtime.getManifest();

        // Get config
        const fetchConfig = () => fetch("/config.json");
        const response = await fetchConfig();
        const config = await response.json();

        // Add the version details to the config
        config.version = manifest.version;

        // Return the config
        return config;
    }

    return main();
}