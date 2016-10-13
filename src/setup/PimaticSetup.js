import React, { Component } from 'react';
import { Link } from 'react-router';

/**
 * Setup the dashboard so it can connect to Pimatic!
 */
export default class PimaticSetup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            step : 1,
            error: "",
            http: "http://",
            url: "",
            port: 8080,
            username: "",
            password: ""
        };

        this.nextStep = this.nextStep.bind(this);
    }

    /**
     * next step changes the step iterator so you can show different pieces
     * of HTML which makes the setup easy to follow
     */
    nextStep()
    {
        this.setState(
            {
                step: (this.state.step + 1)
            }
        );
    }

    /**
     * validate user input
     */
    validateCredentials()
    {
        this.state.error = "";

        if(this.state.url == null || this.state.url == "")
        {
            this.state.error = "please provide the location of pimatic"
        }

        if(this.state.username == null || this.state.username == "")
        {
            this.state.error = "please provide a username"
        }

        if(this.state.password == null || this.state.password == "")
        {
            this.state.error = "please provide a password"
        }

        this.setState({error: this.state.error});

        if(this.state.error == "")
        {
            this.testConnection();
        }
    }

    /**
     * Call the testConnection promise
     */
    testConnection()
    {
        this.runTestConnection().then((response) =>
        {
            this.nextStep();
        }, (c_error) =>
        {
            this.state.error = c_error.toString();
            this.setState({error: this.state.error});
        });
    }

    /**
     * test if the url returns a 200 response
     * @returns {Promise}
     */
    runTestConnection()
    {
        return new Promise(function(resolve, reject)
        {
            $.ajax(
                {
                    type: "GET",
                    url: this.state.http + "" + this.state.url + ":" + this.state.port + "/api",
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', 'Basic ' + btoa(this.state.username + ":" + this.state.password));
                    }.bind(this),
                    success: function(data)
                    {
                        resolve(data);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown)
                    {
                        reject(new Error("Could not connect to your API. Make sure your CORS setting in Pimatic is set to: " + location.host + " " +  errorThrown));
                    }
                });
        }.bind(this));
    }

    /**
     * add the settings to the localstorage so the model knows what data to load
     */
    setDataProvider()
    {
        this.state.url = this.state.http + "" + this.state.url + ":" + this.state.port + "/api";

        const settings = {
            'provider': 'PimaticProvider',
            'url': this.removeTrailingSlash(this.state.url),
            'username': this.state.username,
            'password': this.state.password
        };
        
        const settings_json = JSON.stringify(settings);

        localStorage.setItem("settings", settings_json);

        setTimeout(function ()
        {
            this.nextStep();
        }.bind(this), 3000);
    }

    /**
     * put http to state
     * @param event
     */
    handleChangeHttp(event)
    {
        this.setState(
            {
                http: event.target.value
            }
        );
    }

    /**
     * put url to state
     * @param event
     */
    handleChangeUrl(event)
    {
        this.setState(
            {
                url: event.target.value
            }
        );
    }

    /**
     * change port
     * @param event
     */
    handleChangePort(event)
    {
        this.setState(
            {
                port: event.target.value
            }
        );
    }    

    /**
     * put username to state
     * @param event
     */
    handleChangeUsername(event)
    {
        this.setState(
            {
                username: event.target.value
            }
        );
    }

    /**
     * put password to state
     * @param event
     */
    handleChangePassword(event)
    {
        this.setState(
            {
                password: event.target.value
            }
        );
    }

    /**
     * Strip the / at the end of a url
     * @param  {String} url
     * @return {String}
     */
    removeTrailingSlash(url)
    {
        if(url.substr(-1) == '/')
        {
            url = url.substring(0, url.length - 1);
        }

        return url;
    }

    /**
     * Render the pimatic setup component
     * @returns {XML}
     */
    render() {
        let html = "";

        /**
         * Based on the step state, different HTML is shown
         */
        switch(this.state.step)
        {
            case 1:
                html = (<div className="Setup setup-pimatic">
                    <div className="whitelist-domain">
                        First: Whitelist this domain in Pimatic, <br />
                        otherwise CORS won't work.
                    </div>
                    <br /><br />
                    Enter your Pimatic credentials
                    <br />

                    <div className="error">
                        {this.state.error}
                    </div>


                    <div className="setup-form-row">
                        <label htmlFor="port">
                            http/https:
                        </label>
                        <select value={this.state.http} onChange={this.handleChangeHttp.bind(this)}>
                            <option value="http://">http</option>
                            <option value="https://">https</option>
                        </select>  
                    </div>

                    <div className="setup-form-row">                  
                        <span className="help-text">example.com</span>
                        <label htmlFor="url">
                            Pimatic IP:
                        </label>
                        <input
                            id="url"
                            placeholder="ex: http://localhost"
                            type="text"
                            value={this.state.url}
                            onChange={this.handleChangeUrl.bind(this)}
                        />
                    </div>

                    <div className="setup-form-row">
                        <span className="help-text">Usually 8080</span>
                        <label htmlFor="port">
                            Pimatic Port:
                        </label>
                        <input
                            id="port"
                            placeholder="ex: http://localhost:4040"
                            type="text"
                            value={this.state.port}
                            onChange={this.handleChangePort.bind(this)}
                        />
                    </div>

                    <div className="setup-form-row">
                        <span className="help-text">The username used to log in with pimatic</span>
                        <label htmlFor="username">
                            Username:
                        </label>
                        <input
                            id="username"
                            placeholder="username"
                            type="text"
                            value={this.state.username}
                            onChange={this.handleChangeUsername.bind(this)}
                        />
                    </div>

                    <div className="setup-form-row">
                        <span className="help-text">The password used to log in with pimatic</span>
                        <label htmlFor="password">
                            Password:
                        </label>
                        <input
                            id="password"
                            placeholder="password"
                            type="password"
                            value={this.state.password}
                            onChange={this.handleChangePassword.bind(this)}
                        />
                    </div>

                    <button className="btn-next" onClick={this.validateCredentials.bind(this)}>
                        Next step
                    </button>
                </div>);
                break;
            case 2:
                this.setDataProvider();

                    html = (<div className="Setup setup-pimatic">
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
            case 3:
                html = (<div className="Setup setup-pimatic">
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