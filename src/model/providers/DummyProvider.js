export default class DummyProvider
{
    settings = {};

    constructor(settings)
    {
        this.settings = settings;
    }

    convertDevices(data)
    {
        let widgets = [];

        //Add the Graph widget
        widgets.push({"id": "GraphWidget", "name":"GraphWidget", "col":1,"row":1,"sizex":4,"sizey":2,"color":"#fff","options":{},"tag":"GraphWidget"});

        //Loop over devices and convert the ones we know what to do with
        data.devices.map( (device) =>
        {
            if(device.config.class == "ShellSwitch")
            {
                let item = {
                    "id":device.id,
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
        widgets.push({"id": "weatherWidget", "name":"weatherWidget", "col":1,"row":1,"sizex":1,"sizey":1,"color":"#3498db","options":{},"tag":"WeatherWidget"});

        return widgets;
    }

    loadDevices()
    {
        return new Promise(function(resolve, reject)
        {
            if (this.settings && this.settings.url) {
                resolve(this.loadDummyDevices());
            }
        }.bind(this));
    }

    loadDummyDevices()
    {
        return new Promise(function(resolve, reject) {
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
                    success: function (data) {
                        resolve(data);
                    },
                    error: function () {
                        reject(new Error("An error occurred while processing the devices"));
                    }
                });
        }.bind(this));
    }

    loadUrl(url, data)
    {
        return new Promise(function(resolve, reject) {
            //Dummy does not support this.. always return true
            resolve(true);
        });
    }
}
