import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import $ from 'jquery';

import Widget from './Widget';
import Menu from './Menu';
import Data from './model/Data';

import ExampleWidget from './widgets/ExampleWidget';
import WeatherWidget from './widgets/WeatherWidget';
import SwitchWidget from './widgets/SwitchWidget';
import GraphWidget from './widgets/GraphWidget';
import SensorWidget from './widgets/SensorWidget';
import VariableWidget from './widgets/VariableWidget';

import ReactGridLayout from 'react-grid-layout';
import { WidthProvider  } from 'react-grid-layout';

var GridLayout = WidthProvider(ReactGridLayout);

/**
 * This is the list we use to select all available widgets
 */
const widgetList = {
    ExampleWidget,
    WeatherWidget,
    SwitchWidget,
    GraphWidget,
    SensorWidget,
    VariableWidget
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

        this.onLayoutChange = this.onLayoutChange.bind(this);
    }

    /**
     * When the component mounts initialize the grid and start looking for devices
     * the devices/widgets will be imported using the data model via a promis
     */
    componentDidMount()
    {
        //This is the data model;
        const data = new Data();

        if(localStorage.getItem('settings') === null) {
            browserHistory.push('/setup');
        }
        else {
            this.state = {
                widgets : JSON.parse(localStorage.getItem('widgets') || '[]'),
                hidden_widgets : JSON.parse(localStorage.getItem('hidden_widgets') || '[]'),
                editing : false,
                newCounter: 0
            };

            this.updateDevices(data);
        }

        this.generateLayout();
    }

    /**
     * Generate layout on initial load
     * @return {[type]} [description]
     */
    generateLayout() {
        if(!this.state.widgets)
            return {};

        let counter = 0;
        let row_height = 0;

        this.state.widgets = this.state.widgets.map((item, i) => {
            if(!item.layout) {
                item.layout = {
                    x: counter,
                    y: row_height,
                    w: 1,
                    h: 20,
                    i: i.toString()
                };

                counter++;

                if(counter > 4) {
                    row_height += 20;
                    counter = 0;
                }
            }

            return item;
        });

        this.updateState();
    }

    /**
     * Add to storage when things change
     */
    onLayoutChange(layout) {
        let widget_obj = this.state.widgets;

        this.state.widgets = layout.map((obj, i) => {
            let widget_layout = widget_obj[i];

            if(!widget_layout.layout)
                widget_layout.layout = {};

            widget_layout.layout.x = obj.x;
            widget_layout.layout.y = obj.y;
            widget_layout.layout.z = obj.z;
            widget_layout.layout.w = widget_layout.layout.w || obj.w;
            widget_layout.layout.h = obj.h;
            widget_layout.layout.moved = obj.moved;
            widget_layout.layout.static = obj.static;

            return widget_layout;
        });

        this.setState({'widgets': this.state.widgets});
        localStorage.setItem('widgets', JSON.stringify(this.state.widgets));
    }

    /**
     * Update devices every 3 seconds..
     * todo: use antoher method to do this.
     */
    updateDevices(data)
    {
        data.getDevices().then((response) =>
        {
            response = this.addGridValues(response);

            response.filter(widget => {
                return widget.hide === false;
            });

            let hidden_widgets = response.filter(widget => {
                return widget.hide === true;
            });            

            this.setState(
                {
                    'widgets': response,
                    'hidden_widgets': hidden_widgets
                }
            );

            localStorage.setItem('widgets', JSON.stringify(response));
            localStorage.setItem('hidden_widgets', JSON.stringify(hidden_widgets));

            setTimeout( () => {
                this.updateDevices(data);
            }, 3000);
        }, (error) =>
        {
            console.error("Failed to load devices!", error);
        });
    }

    /**
     * Add the settings from LocalStorage to the ones from the database
     * this is kindof the dashboard database.
     */
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

                    response[j].hide  = false;
                    response[i].color = current.color;

                    if(response[i].layout)
                    {
                        response[i].layout.x = current.x;
                        response[i].layout.y = current.y;
                        response[i].layout.z = current.z;
                        response[i].layout.w = current.w;
                        response[i].layout.h = current.h;
                        response[i].layout.moved = current.moved;
                        response[i].layout.static = current.static;
                    }

                    if(current_devices[i].hide)
                        response[i].hide = current_devices[j].hide;
                }
            }
        }

        return response;
    }

    /**
     * Clear localstorage and reload page (will automatically go to setup)
     */
    resetSettings()
    {
        localStorage.clear();
        location.reload();
    }

    /**
     * Were not completely deleting the widget, it can be found
     * in the menu (state: hidden_widgets)
     */
    deleteWidget(widget)
    {
        //Add widget to hidden widgets array
        this.state.hidden_widgets.push(widget);

        let index = this.state.widgets.indexOf(widget);
        
        //Remove and hide widget from widget array
        this.state.widgets[index].hide = true;
        this.state.widgets.splice(index, 1);

        //Update State
        this.updateState();
    }

    /**
     * Add widgets #yay
     */
    addWidget(e)
    {
        let index   = e.target.dataset.index;

        let element = this.state.hidden_widgets.filter(widget => {
            return widget.id === index;
        })[0];

        element.hide = false;

        this.state.widgets.push(element);

        let hidden_widget_index = this.state.hidden_widgets.indexOf(element);
        this.state.hidden_widgets.splice(hidden_widget_index, 1);
        
        //Update State
        this.updateState();
    }

    /**
     * Switch edit mode: true / false
     */
    editMode(edit_state)
    {
        this.state.editing = edit_state;
        this.setState({'editing': edit_state});
    }

    /**
     * Update state
     */
    updateState()
    {
        this.setState(
            {
                'widgets': this.state.widgets,
                'hidden_widgets': this.state.hidden_widgets
            }
        );

        localStorage.setItem('widgets', JSON.stringify(this.state.widgets));
        localStorage.setItem('hidden_widgets', JSON.stringify(this.state.hidden_widgets));        
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
        {
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
                    <small>If you think this is a bug, please report it <a href="https://github.com/Timvdv/flexible-dashboard" target="_blank">on Github</a></small>
                </div>
            );
        }

        this.state.widgets.map(function (element, i) {
            if (widgetList[element.tag] && !element.hide) {
                let Tag = widgetList[element.tag];

                let deleteWidget = this.deleteWidget.bind(this, element),
                    editStateBind = this.editMode.bind(this);

                widgets.push(<div key={i} data-grid={element.layout}>
                    <Widget
                        name={element.name}
                        color={element.color}
                        editing={this.state.editing}
                        hide={element.hide}
                        delete={deleteWidget}
                        onClickEdit={editStateBind}>
                        <Tag name={element.name} options={element.options} layout={element.layout}/>
                    </Widget></div>
                );
            }
        }.bind(this));

        var addWidgetBind = this.addWidget.bind(this);

        return (<div className="container">
                <span id="simple-menu" href="#sidr">
                    <i className="material-icons">menu</i>
                    <h1>Menu</h1>
                </span>

                <div className="widget-grid">
                    <GridLayout
                        onLayoutChange={this.onLayoutChange}
                        isDraggable={true}
                        isResizable={false}
                        className="layout"
                        rowHeight={3}
                        cols={5}
                        items={widgets.length}>

                        {widgets}
                    </GridLayout>
                </div>

                <Menu widgets={this.state.widgets} hidden_widgets={this.state.hidden_widgets} addWidget={addWidgetBind} />
            </div>
        );
  };
}