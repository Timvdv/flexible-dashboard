/**
 *
 * !! This is actually a 'app' because it's independent from the settings..
 * TODO: Implement a system that seperates these two types
 *
 */

var Promise = require('es6-promise').Promise;
import React, { Component } from 'react';

/**
 * The weather widget gets the temperature from Buienradar.nl in XML format
 * selects the data it wants and renders it to the page.
 */
export default class ThermostatWidget extends Component {
    constructor(props) {
        super(props);

        this.updateInterval = null;

        this.state =
        {
            temperture: 0
        };

        this.getTemperture = this.getTemperture.bind(this);
    }

    /**
     * When the component mounts set the update
     * interval back to it's default state
     */
    componentDidMount()
    {
        this.updateInterval = 60000;
        this.getTemperture();
    }

    /**
     * When the component unmounts clear the interval
     */
    componentWillUnmount()
    {
        this.updateInterval = null;
    }

    /**
     * Get the temperature data from buienradar.nl by
     * doing the AJAX call
     * @returns {Promise}
     */
    getTempertureData()
    {
        return new Promise(function(resolve, reject)
        {
            $.ajax(
            {
                type: "GET",
                url: "http://xml.buienradar.nl/",
                dataType: "xml",
                success: function(xml)
                {
                    resolve(xml);
                },
                error: function()
                {
                    reject(new Error("An error occurred while processing XML file."));
                }
            });
        });
    }

    /**
     * Get the temperture data and assing it to the application state
     * so it triggers the rerender when changed
     */
    getTemperture()
    {
        this.getTempertureData().then(function(response)
        {
            let current_weather = $(response).find('actueel_weer stationnaam[regio=Rotterdam]'),
                temp = current_weather.parent().find('temperatuurGC').html();

            if(this.updateInterval)
            {
                this.setState({temperture: temp});

                setTimeout(function(){
                    this.getTemperture();
                }.bind(this), this.updateInterval);
            }
        }.bind(this), function(error)
        {
            console.error("Failed to get temperture!", error);
        });
    }

    /**
     * Render the weather widget
     * @returns {XML}
     */
    render()
    {
        let styles = {
            smallText: {
                padding: 5,  // Becomes "10px" when rendered.
                color: "white",
                fontSize:15,
                textAlign: "center",
                display: "block",
                fontWeight: 100
            },
            heading: {
                paddingTop: 1,  // Becomes "10px" when rendered.
                color: "white",
                fontSize:25,
                textAlign: "center",
                fontWeight: 900
            }
        };

        return (
            <div>
                <p style={styles.smallText}>
                    The weather in Rotterdam:
                </p>
                <h1 style={styles.heading} onClick={this.clicked}>
                    {this.state.temperture}℃
                </h1>
            </div>
        );
    };
}