var Promise = require('es6-promise').Promise;

export default class Data {
    settings = {};

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
                'prodvider': settings.provider,
                'url': settings.url,
                'username': settings.username,
                'password': settings.password
            };
        }
        else
        {
            console.log("No settings found, use the setup");
        }
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
            this.loadDevices().then(function(response)
            {
                resolve(this.convertDevices(response));
            }.bind(this), function(error)
            {
                reject("Failed to get devices!", error);
            });
        }.bind(this));
    }

    /**
     * the actual request to the API (the one the user entered)
     * @returns {Promise}
     */
    loadDevices()
    {
        return new Promise(function(resolve, reject)
        {
            $.ajax(
                {
                    type: "GET",
                    url: this.settings.url,
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    headers: {
                        'Authorization': 'Basic ' + btoa(this.settings.username + ":" + this.settings.password)
                    },
                    success: function(data)
                    {
                        resolve(data);
                    },
                    error: function()
                    {
                        reject(new Error("An error occurred while processing the devices"));
                    }
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
        //Add some dummy devices to create a nice show-off dash
        if(this.settings.prodvider == "DummyProvider")
            return this.dummySetup(data);

        //Start with empty widgets
        let widgets = [];

        //Loop over devices and convert the ones we know what to do with
        data.devices.map( (device) =>
        {
            if(device.config.class == "ShellSwitch")
            {
                let item = {
                    "name":device.name,
                    "col":1,
                    "row":1,
                    "sizex":2,
                    "sizey":2,
                    "color":"#fff",
                    "tag":"SwitchWidget",
                    "options":
                    {
                        "value":device.attributes[0].value,
                        "id":device.id,
                        "on_url":device.actions[0].name,
                        "off_url":device.actions[1].name
                    }
                };

                widgets.push(item);
            }
        });

        console.log(widgets);
        return widgets;
    }

    dummySetup(data)
    {
        let widgets = [];

        //Add the Graph widget
        widgets.push({"name":"GraphWidget", "col":1,"row":1,"sizex":4,"sizey":2,"color":"#fff","options":{},"tag":"GraphWidget"});

        //Loop over devices and convert the ones we know what to do with
        data.devices.map( (device) =>
        {
            if(device.config.class == "ShellSwitch")
            {
                let item = {
                    "name":device.name,
                    "col":1,
                    "row":1,
                    "sizex":2,
                    "sizey":2,
                    "color":"#fff",
                    "tag":"SwitchWidget",
                    "options":
                    {
                        "value":device.attributes[0].value,
                        "id":device.id,
                        "on_url":device.actions[0].name,
                        "off_url":device.actions[1].name
                    }
                };

                widgets.push(item);
            }
        });

        //Add the Buienradar widget
        widgets.push({"name":"weatherWidget", "col":1,"row":1,"sizex":1,"sizey":1,"color":"#3498db","options":{},"tag":"WeatherWidget"});

        return widgets;
    }
}