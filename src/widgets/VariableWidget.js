import React, { Component } from 'react';

export default class VariableWidget extends Component {
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