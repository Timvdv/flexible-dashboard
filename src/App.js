import React, { Component } from 'react';
import $ from 'jquery';
import gridster from 'gridster/dist/jquery.gridster';
import { browserHistory } from 'react-router'

import Widget from './Widget';
import Menu from './Menu';
import Data from './model/Data';

import ExampleWidget from './widgets/ExampleWidget';
import WeatherWidget from './widgets/WeatherWidget';
import SwitchWidget from './widgets/SwitchWidget';
import GraphWidget from './widgets/GraphWidget';
import SensorWidget from './widgets/SensorWidget';

/**
 * This is the list we use to select all available widgets
 */
const widgetList = {
    ExampleWidget,
    WeatherWidget,
    SwitchWidget,
    GraphWidget,
    SensorWidget
};

export default class App extends Component {
    grid = {};

    /**
     * This happens when the main app loads. First we check if the user has entered
     * the settings, if this is not the case redirect to the setup page.
     * 
     * If the user did setup everything we load the widgets into the state and setup
     * gridster after the widgets are loaded
     */
    constructor()
    {
        super();
    }

    /**
     * When the component mounts initialize the grid and start looking for devices
     * the devices/widgets will be imported using the data model via a promis
     */
    componentDidMount()
    {
        //This is the data model;
        const data = new Data();

        if(localStorage.getItem('settings') == null)
        {
            browserHistory.push('/setup')
        }
        else
        {
            this.state = {
                widgets : JSON.parse(localStorage.getItem('widgets') || '{}')
            };

            this.updateDevices(data);
        }

        this.grid = $(".gridster ul").gridster(
        {
            widget_margins: [10, 10],
            widget_base_dimensions: [140, 140]
        }).data('gridster');
    }

    updateDevices(data)
    {
        data.getDevices().then((response) =>
        {
            this.setState({'widgets': response});

            localStorage.setItem('widgets', JSON.stringify(response));

            $(".gridster ul").gridster(
                {
                    widget_margins: [10, 10],
                    widget_base_dimensions: [140, 140]
                }).data('gridster');

            setTimeout( () => {
                this.updateDevices(data);
            }, 3000);
        }, (error) =>
        {
            console.error("Failed to load devices!", error);
        });
    }

    resetSettings()
    {
        localStorage.clear();
        location.reload();
    }

    /**
     * This is the actual app. Are widgets are rendered into the correct positions.
     *
     * Every widget is a Widget class and has a specific child which defines the content
     * the type is based on the type tag given in the JSON file
     */
    render() {
        let widgets = [];

        console.log("render");

        if(this.state == null || this.state && this.state.widgets && !this.state.widgets.length > 0)
            return (
                <div>
                    <h1>
                        No Widgets found :(
                    </h1>
                    <p>
                        This could be a problem with your API
                    </p>
                    <ul>
                        <li>Is your API online?</li>
                        <li>Are you sure you provided the correct API URL / credentials?</li>
                        <li>Are you sure the Dashboard supports your devices?</li>
                    </ul>
                    <p>

                        Please try again: <button onClick={this.resetSettings}>Reset Settings!</button>
                    </p>
                    <br/>
                    <small>If you think this is a bug, please report it <a href="https://github.com/Timvdv/flexible-dashboard" target="_blank"> on Github </a></small>
                </div>
            );

        this.state.widgets.map(function(element, i)
        {
            if(widgetList[element.tag])
            {
                let Tag = widgetList[element.tag];

                widgets.push(
                    <Widget key={element.name} row={element.row} col={element.col} sizex={element.sizex} sizey={element.sizey} color={element.color}>
                        <Tag name={element.name} options={element.options} />
                    </Widget>
                );
            }
        });

        return (
        <div>
            <div className="gridster">
                <ul>
                    {widgets}

                    {/**
                     *  Code for menu (disabled for now):
                     *  <li id="simple-menu" className="widget" data-row="1" data-col="1" data-sizex="1" data-sizey="1" href="#sidr"><p>Show menu</p></li>
                     */}
                </ul>
            </div>
            <Menu />
        </div>
    );
  };
}
