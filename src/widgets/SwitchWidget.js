import React, { Component } from 'react';
var Promise = require('es6-promise').Promise;
import Data from '../model/Data';

require("../../css/widgets/switch.css");

/**
 * Really simple switch widget which turns something on / off
 */
export default class SwitchWidget extends Component {
    data = {};

    constructor(props) {
        super(props);

        this.data = new Data();

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
        this.updateTimer = 0;
    }


    /**
     * Update switch when state API state changed
     */
    componentWillReceiveProps()
    {
        setTimeout(() => {
            this.isActive = this.props.options.value;
            this.updateTimer = 0;
        }, this.updateTimer )
    }

    /**
     * When clicked on the switch call the api
     */
    clicked()
    {
        this.isActive = !this.isActive;

        this.updateTimer = 5000; //wait with updating until the timer is done
        this.saveToggleSwitch();
        this.forceUpdate();
    }

    /**
     * change the switch state by doing the AJAX call
     * @returns {Promise}
     */
    toggleSwitchPromise()
    {
        return new Promise((resolve, reject) => {
            const url = this.isActive ? this.props.options.on_url : this.props.options.off_url;

            resolve(this.data.loadUrl("/device/" +this.props.options.id + "/" + url));
        } );
    };

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
                <div className={switchState} onClick={this.clicked}>
                    <span type="checkbox" name="onoffswitch" id="myonoffswitch" />
                    <label className="onoffswitch-label" htmlFor="myonoffswitch" />
                </div>
            </div>
        );
    };
}