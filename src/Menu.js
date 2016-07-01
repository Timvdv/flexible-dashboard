import React, { Component } from 'react';
import { Link } from 'react-router'
import sidr from 'sidr/dist/jquery.sidr';


/**
 * Menu is disabled for now!
 * Will be enabled in later stage.
 */

export default class Menu extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount()
    {
        $('#simple-menu').sidr(
        {
            side: 'right'
        });
    }
    render() {
        let styles = {
            notification: {
                border: "5px solid green",
                padding: 10,  // Becomes "10px" when rendered.
                color: "#333"
            },
            notificationHint: {
                fontStyle: "italic"
            }
        };

        return (
            <div className="menu" id="sidr">
                <ul>
                    <h3>
                        hoi
                    </h3>
                    <li>
                        <Link to={"/setup"}>Setup</Link>
                    </li>
                    <hr/>
                    <li>
                        <a href="#">
                            Draggable devices here
                        </a>
                    </li>
                </ul>
            </div>
        );
    };
}