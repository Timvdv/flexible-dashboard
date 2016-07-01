import React, { Component } from 'react';
import { Link } from 'react-router'

/**
 * Setup the dashboard so shows dummy data!
 */
export default class DummySetup extends Component {
    constructor(props) {
        super(props);

        this.state = {step : 0};

        this.nextStep = this.nextStep.bind(this);
    }

    /**
     * next step changes the step iterator so you can show different pieces
     * of HTML which makes the setup easy to follow
     */
    nextStep()
    {
        let next_step = this.state.step >= 2 ? 0 : (this.state.step + 1);

        this.setState(
            {
                step: next_step
            }
        );
    }

    /**
     * add the settings to the localstorage so the model knows what data to load
     */
    setDataProvider()
    {
        const settings = {
            'provider': 'DummyProvider',
            'url':'/dummy-setup-data.json',
            'username': null,
            'password': null
        };

        const settings_json = JSON.stringify(settings);

        localStorage.setItem("settings", settings_json);

        setTimeout(function ()
        {
            this.nextStep();
        }.bind(this), 3000)
    }

    /**
     * Render the dummy data setup component
     * @returns {XML}
     */
    render() {
        let html = "";

        switch(this.state.step)
        {
            case 0:
                html = (<div className="Setup setup-dummy">
                    We're about to fill your dashboard with
                    dummy data.

                    <button onClick={this.nextStep}>Fill it up!</button>
                </div>);
                break;
            case 1:
                this.setDataProvider();

                html = (<div className="Setup setup-dummy">
                    <div className="loader">
                        <div className="sk-circle">
                            <div className="sk-circle1 sk-child"></div>
                            <div className="sk-circle2 sk-child"></div>
                            <div className="sk-circle3 sk-child"></div>
                            <div className="sk-circle4 sk-child"></div>
                            <div className="sk-circle5 sk-child"></div>
                            <div className="sk-circle6 sk-child"></div>
                            <div className="sk-circle7 sk-child"></div>
                            <div className="sk-circle8 sk-child"></div>
                            <div className="sk-circle9 sk-child"></div>
                            <div className="sk-circle10 sk-child"></div>
                            <div className="sk-circle11 sk-child"></div>
                            <div className="sk-circle12 sk-child"></div>
                        </div>
                    </div>
                    Filling your dashboard with dummy data
                </div>);
                break;
            case 2:
                html = (<div className="Setup setup-dummy">
                    Setup Complete!
                    <br/>
                    <Link to={"/"}>View your dashboard</Link>
                </div>);
                break;
        }

        return (
            <div>
                {html}
            </div>
        );
    };
}