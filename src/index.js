import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'

import App from './App';
import Setup from './Setup'

require("../css/vendor/gridster.css");
require("../css/vendor/sidr.css");
require("../css/main.css");


/**
 * This is where we render correct component based on the URL
 * short: Routing
 */
ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={App}/>
        <Route path="/setup" component={Setup}/>
    </Router>
), document.getElementById('react-root'));