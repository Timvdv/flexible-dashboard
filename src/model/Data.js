var Promise = require('es6-promise').Promise;

import DummyProvider from './providers/DummyProvider';
import PimaticProvider from './providers/PimaticProvider';

/**
 * This is the list we use to select all available setup templates
 */
const ProviderList = {
    DummyProvider,
    PimaticProvider
};

export default class Data {
    settings = {};
    provider = null;

    constructor() {
        this.getSettings();
        this.convertDevices= this.convertDevices.bind(this);
    }

    /**
     * this is called on initialization we get the settings from
     * the localstorage and put it in a local variable
     */
    getSettings()
    {
        if(localStorage.getItem("settings"))
        {
            const settings = JSON.parse(localStorage.getItem("settings"));

            this.settings = {
                'provider': settings.provider,
                'url': settings.url,
                'username': settings.username,
                'password': settings.password
            };

            this.setProvider();
        }
        else
        {
            console.log("No settings found, use the setup");
        }
    }

    /**
     * Set provider and pass the settings
     */
    setProvider()
    {
        this.provider = new ProviderList[this.settings.provider](this.settings);
    }

    /**
     * This method is called from within the app.js and is used to
     * return the devices based on the user setup
     * @returns {Promise}
     */
    getDevices()
    {
        return new Promise(function(resolve, reject)
        {
            this.provider.loadDevices().then(function(response)
            {
                resolve(this.convertDevices(response));
            }.bind(this), function(error)
            {
                reject("Failed to get devices!", error);
            });
        }.bind(this));
    }

    /**
     * convert the retrieved devices to data this application can read
     * @param data
     * @returns {Array}
     */
    convertDevices(data)
    {
        return this.provider.convertDevices(data);
    }

    /**
     * The load URL function can be called from all widgets, the data class
     * makes sure the correct provider will handle the data
     * @param url
     * @param data
     * @returns {*}
     */
    loadUrl(url, data)
    {
        return this.provider.loadUrl(url, data);
    }
}