export default class PimaticProvider
{
    settings = {};

    constructor(settings)
    {
        this.settings = settings;
    }

    convertDevices(data)
    {
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

            if(device.config.class == "ShellSensor")
            {
                let item = {
                    "name":device.name,
                    "col":1,
                    "row":1,
                    "sizex":1,
                    "sizey":1,
                    "color":"#fff",
                    "tag":"SensorWidget",
                    "options":
                    {
                        "unit": device.attributes[0].unit,
                        "value":device.attributes[0].value,
                        "id":device.id
                    }
                };

                widgets.push(item);
            }
        });

        return widgets;
    }

    loadDevices()
    {
        return new Promise(function(resolve, reject)
        {
            if (this.settings && this.settings.url) {
                resolve(this.loadUrl("/devices"));
            }
        }.bind(this));
    }

    loadUrl(url, data)
    {
        console.log(this.settings.url);
        return new Promise(function(resolve, reject) {
            $.ajax(
            {
                type: "GET",
                url: this.settings.url + url,
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
}