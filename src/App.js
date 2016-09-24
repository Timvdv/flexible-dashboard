import React, { Component } from 'react';
import $ from 'jquery';
import gridster from 'gridster/dist/jquery.gridster';
import { browserHistory } from 'react-router';


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
        this.grid = {};
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
                widgets : JSON.parse(localStorage.getItem('widgets') || '{}'),
                editing : false
            };

            this.updateDevices(data);
        }

        this.updateGrid();
    }

    updateDevices(data)
    {
        data.getDevices().then((response) =>
        {
            response = this.addGridValues(response);

            this.setState({'widgets': response});
            localStorage.setItem('widgets', JSON.stringify(response));

            this.updateGrid();

            setTimeout( () => {
                this.updateDevices(data);
            }, 3000);
        }, (error) =>
        {
            console.error("Failed to load devices!", error);
        });
    }

    addGridValues(response)
    {
        let current_devices = (JSON.parse(localStorage.getItem("widgets")) || {});

        // Loop Through JSON values from providers
        for (let i = response.length - 1; i >= 0; i--)
        {
             // Compare to localstorage and add grid values
            for (let j = current_devices.length - 1; j >= 0; j--)
            {
                if(current_devices[j].name == response[i].name)
                {
                    let current = current_devices[j];

                    response[i].hide  = false;
                    response[i].col   = current.col;
                    response[i].row   = current.row;
                    response[i].sizex = current.sizex;
                    response[i].sizey = current.sizey;
                    response[i].color = current.color;

                    if(current_devices[j].hide)
                        response[i].hide = current_devices[j].hide;
                }
            }
        }

        return response;
    }

    updateGrid()
    {
        this.grid = $(".gridster ul").gridster(
        {
            widget_margins: [10, 10],
            widget_base_dimensions: [140, 140]
        }).data('gridster');

        if(this.grid && !this.state.editing)
        {
            this.grid.disable();
            this.state.editing = false;
        }
        else if(this.grid)
        {
            this.state.editing = true;
            this.grid.enable();

            console.log(this.grid.serialize())    
        }
    }

    resetSettings()
    {
        localStorage.clear();
        location.reload();
    }

    hideWidget(index)
    {
        this.state.widgets[index].hide = true;
        this.setState({widgets: this.state.widgets});
        localStorage.setItem('widgets', JSON.stringify(this.state.widgets));

        this.updateGrid();
    }

    toggleWidget(e)
    {
        let index = e.target.dataset.index;
        let gridster = $(".gridster ul").data('gridster');

        let element = this.state.widgets[index];
        let Tag = widgetList[element.tag];

        var widget = (<div>
            <Widget
                key={element.name}
                name={element.name}
                row={element.row}
                col={element.col}
                sizex={element.sizex}
                sizey={element.sizey}
                color={element.color}
                editing={this.state.editing}
                hide={element.hide}>
                <Tag name={element.name} options={element.options} />
            </Widget>
            </div>
        );

        //fuuuu :(((((
        gridster.add_widget(widget, 3, 4);

        //this.state.widgets[index].hide = false;
        //this.setState({widgets: this.state.widgets});
        //localStorage.setItem('widgets', JSON.stringify(this.state.widgets));

        this.updateGrid();
    }

    editMode(edit_state)
    {
        this.state.editing = edit_state;
        this.setState({'editing': edit_state});
    }

    /**
     * This is the actual app. Are widgets are rendered into the correct positions.
     *
     * Every widget is a Widget class and has a specific child which defines the content
     * the type is based on the type tag given in the JSON file
     */
    render() {
        let widgets = [];

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

        this.updateGrid();

        //localStorage.setItem("a","b");
        //localStorage.setItem('grid', )

        console.log('render');                        

        this.state.widgets.map(function(element, i)
        {
            if(widgetList[element.tag] && !element.hide)
            {
                let Tag = widgetList[element.tag];

                let hideWidget = this.hideWidget.bind(this, i),
                     editStateBind = this.editMode.bind(this);

                widgets.push(
                    <Widget
                        key={element.name}
                        name={element.name}
                        row={element.row}
                        col={element.col}
                        sizex={element.sizex}
                        sizey={element.sizey}
                        color={element.color}
                        editing={this.state.editing}
                        hide={element.hide}
                        onClick={hideWidget}
                        onClickEdit={editStateBind}>
                            <Tag name={element.name} options={element.options} />
                    </Widget>
                );
            }
        }.bind(this));

        var toggleWidgetBind = this.toggleWidget.bind(this);

        return (
        <div>
            <div className="gridster">
                <ul>
                    {widgets}

                     <li id="simple-menu" className="widget" data-row="1" data-col="1" data-sizex="1" data-sizey="1" href="#sidr">
                        <br /><h1><i className="material-icons">menu</i></h1>
                    </li>
                </ul>

            </div>
            <Menu widgets={this.state.widgets} toggleWidget={toggleWidgetBind} />
        </div>
    );
  };
}
