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

        return (
            <div className="menu" id="sidr">
                <ul>
                    {widget_header}
                    
                    {
                      this.props.widgets.map(function(element, i)
                      {
                          if(element.hide)
                          {
                            //TODO: doesnt work 100% yet
                            this.show_widgets_title = true;

                              return (
                                <div key={element.name}>
                                    <li onClick={this.props.toggleWidget}  data-index={i}>
                                        {element.name}
                                    </li>
                                </div>
                              );
                          }
                      }, this)
                    }

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