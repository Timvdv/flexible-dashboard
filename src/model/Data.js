var Promise = require('es6-promise').Promise;

export default class Data {
    settings = {};

    constructor() {
        this.getSettings();
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
                    success: function(data)
                    {
                        resolve(data);
                    },
                    error: function()
                    {
                        reject(new Error("An error occurred while processing the devices"));
                    },
                    beforeSend: function(req)
                    {
                        req.setRequestHeader("Authorization", "Basic " + btoa(this.settings.username + ":" + this.settings.password));
                    }.bind(this)
                });
        }.bind(this));
    }

    /**
     * convert the rectrieved devices to data this application can read
     * @param data
     * @returns {Array}
     */
    convertDevices(data)
    {
        /**
         * JSON FROM API
             {
                "id":"all-hue-on",
                "name":"Lichten aan",
                "template":"switch",
                "attributes":[
                   {
                      "description":"The current state of the switch",
                      "type":"boolean",
                      "labels":[
                         "on",
                         "off"
                      ],
                      "label":"State",
                      "discrete":true,
                      "name":"state",
                      "value":false,
                      "history":[
                         {
                            "t":1464206839069,
                            "v":false
                         }
                      ],
                      "lastUpdate":1464206839069
                   }
                ],
                "actions":[
                   {
                      "description":"Turns the swch on",
                      "name":"turnOn"
                   },
                   {
                      "description":"Turns the switch off",
                      "name":"turnOff"
                   },
                   {
                      "description":"Changes the switch to on or off",
                      "params":{
                         "state":{
                            "type":"boolean"
                         }
                      },
                      "name":"changeStateTo"
                   },
                   {
                      "description":"Toggle the state of the switch",
                      "name":"toggle"
                   },
                   {
                      "description":"Returns the current state of the switch",
                      "returns":{
                         "state":{
                            "type":"boolean"
                         }
                      },
                      "name":"getState"
                   }
                ],
                "config":{
                   "id":"all-hue-on",
                   "name":"Lichtena aan",
                   "class":"ShellSwitch",
                   "onCommand":"curl -H \"Accept: application/json\" -X PUT --data '{\"on\": true, \"hue\": 1000}' http://10.0.1.3/api/newdeveloper/groups/0/action",
                   "offCommand":"curl -H \"Accept: application/json\" -X PUT --data '{\"on\": false, \"hue\": 1000}' http://10.0.1.3/api/newdeveloper/groups/0/action",
                   "getStateCommand":"echo false",
                   "interval":0
                },
                "configDefaults":{
                   "interval":0
                }
             }
         */

        /**
         * Target JSON
            {
              "name":"Lichten aan",
              "col":1,
              "row":1,
              "sizex":2,
              "sizey":2,
              "color":"#fff",
              "options":{
                 "value":false
              },
              "tag":"SwitchWidget"
           }
         */

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