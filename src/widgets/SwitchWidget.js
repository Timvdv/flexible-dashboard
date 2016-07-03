import React, { Component } from 'react';
var Promise = require('es6-promise').Promise;

require("../../css/widgets/switch.css");

/**
 * Really simple switch widget which turns something on / off
 */
export default class SwitchWidget extends Component {
    constructor(props) {
        super(props);

        //The switch widget needs the settings to create an API call
        const settings = JSON.parse(localStorage.getItem("settings"));

        this.settings = {
            'provider': settings.provider,
            'url': settings.url,
            'username': settings.username,
            'password': settings.password
        };

        this.isActive = this.props.options.value;
        this.clicked = this.clicked.bind(this);
    }


    /**
     * When clicked on the switch call the api
     */
    clicked()
    {
        this.isActive = !this.isActive;

        if(this.settings.provider == "PimaticProvider")
            this.saveToggleSwitch();

        this.forceUpdate();
    }

    /**
     * change the switch state by doing the AJAX call
     * @returns {Promise}
     */
    toggleSwitchPromise()
    {
        return new Promise((resolve, reject) =>
        {
            const url = this.isActive ? this.props.options.on_url : this.props.options.off_url;

            $.ajax(
                {
                    type: "GET",
                    url: this.settings.url + "/" + this.props.options.id + "/" +url,
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
                        reject(new Error("An error occurred while changing the switch"));
                    }
                });
        });
    }

    /**
     * call the API and switch on / off
     */
    saveToggleSwitch()
    {
        this.toggleSwitchPromise().then(function(response)
        {
            console.log(awesome);
        }.bind(this), function(error)
        {
            console.error("Failed to toggle switch!", error);
        });
    }

    render()
    {
        let switchState = "onoffswitch " + (this.isActive ? "active" : "");

        return (
            <div>
                <p className="switch-text">
                    {this.props.name}
                </p>
                <div className="onoffswitch" onClick={this.clicked} className={switchState} >
                    <span type="checkbox" name="onoffswitch" id="myonoffswitch" />
                    <label className="onoffswitch-label" htmlFor="myonoffswitch" />
                </div>
            </div>
        );
    };
}