import React, { Component } from 'react';

/**
 * If you're about to create a new widget you can copy / paste this into a new
 * file and rename it :)
 */
export default class SensorWidget extends Component {
    constructor(props) {
        super(props);

        this.state =
        {
            name: this.props.name ? this.props.name : "--",
            value: this.props.options.value ? this.props.options.value : "--",
            unit: this.props.options.unit ? this.props.options.unit : ""
        };
    }

    componentWillReceiveProps()
    {
        this.state =
        {
            name: this.props.name ? this.props.name : "--",
            value: this.props.options.value ? this.props.options.value : "--",
            unit: this.props.options.unit ? this.props.options.unit : ""
        };
    }

    render()
    {
        // There are two ways of binding styles. This is one way to do it.
        // If you have a lot of styles you can create a new .css file and
        // include it at the top. Look at GraphWidget.js
        let styles = {
            sensorData: {
                padding: 0,
                margin: 0,
                color: "black",
                fontSize:25,
                textAlign: "center"
            },
            sensorName: {
                padding: 0,
                marginTop: 25,
                color: "gray",
                fontSize:15,
                textAlign: "center"
            }
        };

        // This is the HTML returned by the widget. You see the clicked state
        // is shown and the this.clicked function is binded to an event
        return (
            <div>
                <p style={styles.sensorName}>{this.props.name}</p>
                <h1 style={styles.sensorData} onClick={this.clicked}>
                    {this.state.value} {this.state.unit}
                </h1>
            </div>
        );
    };
}