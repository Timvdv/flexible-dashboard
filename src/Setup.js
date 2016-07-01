import React, { Component } from 'react';
import { Router, Route, Link, browserHistory } from 'react-router'

require("../css/setup.css");

import DummySetup from './setup/DummySetup';
import PimaticSetup from './setup/PimaticSetup';

/**
 * This is the list we use to select all available setup templates
 */
const setup_list = {
    DummySetup,
    PimaticSetup
};

export default class Setup extends Component {
    constructor(props) {
        super(props);
    }

    /**
     * Show the list with setups, when the item is picked select the
     * template that needs to be shown and add a hide class to the current
     * view
     * @param e
     */
    selectSetup(e)
    {
        let setup_type = e.target.dataset.setup;

        if(setup_list[setup_type])
        {
            this.setState({'Tag': setup_list[setup_type]});
            e.target.parentElement.className = "hide";
        }
    }

    /**
     * Render the setup. When the 'Tag' is updated the page rerenders automatically
     * to the new component. When the tag is empty nothing is rendered
     * @returns {XML}
     */
    render()
    {
        let setup_type_html = "";

        if(this.state && this.state.Tag)
        {
            let Tag = this.state.Tag;
            setup_type_html = (<Tag />);
        }

        return (
            <div className="container setup-container">
                <h1>
                    Setup Dashboard
                </h1>
                <div className="choose-type">
                    <ul id="choose-setup">
                        <li onClick={this.selectSetup.bind(this)} data-setup="DummySetup">
                            DummySetup
                        </li>
                        <li onClick={this.selectSetup.bind(this)} data-setup="PimaticSetup">
                            PimaticSetup
                        </li>
                    </ul>
                </div>
                <div>
                    {setup_type_html}
                </div>
            </div>
        );
    };
}