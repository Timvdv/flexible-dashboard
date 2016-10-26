import React, { Component } from 'react';
import { Link } from 'react-router'
import sidr from 'sidr/dist/jquery.sidr';

require("../css/vendor/sidr.css");
require("../css/menu.css");

export default class Menu extends Component {
    constructor(props)
    {
        super(props);

        this.show_widgets_title = false;
    }

    componentDidMount()
    {
        $('#simple-menu').sidr(
        {
            side: 'right'
        });
    }

    resetSettings()
    {
        if(confirm("Are you sure you want to reset to factory settings?"))
        {
            localStorage.clear();
            location.reload();
        }
    }

    render()
    {
        var widget_header = "";
        
        if(this.show_widgets_title)
        {
            widget_header = (
                <div>
                    <h3>
                        Manage widgets
                    </h3>
                </div>
            );             
        }

        let menu_widgets = [];

        this.props.hidden_widgets.map((element) => {
            if(element.hide) {
                //TODO: doesnt work 100% yet
                this.show_widgets_title = true;

                menu_widgets.push(
                    <div key={element.name}>
                        <li onClick={this.props.addWidget} data-index={element.id}>
                          {element.name}
                        </li>
                    </div>
                );
            }
        }, this);

        return (
            <div className="menu" id="sidr">
                <ul>
                    {widget_header}
                    {menu_widgets}
                    <h3>
                        Settings
                    </h3>
                    <li>
                        <p onClick={this.resetSettings}>Factory reset</p>
                    </li>
                </ul>
            </div>
        );
    };
}