// Require polyfill, because IE doesn't support Object.assign yet.
require("./polyfill/Object.assign");

// Startup file …
import React from "react";
import { render } from "react-dom";
import { Router, Route, IndexRoute, Redirect, Link } from "react-router";
import Backend from "./core/Backend";
import Authenticator from "./core/Authenticator";
import BasicAuthenticator from "./core/BasicAuthenticator";

import App from "./components/App";
import Login from "./components/Login";
import NotFound from "./components/NotFound";

import ExperimentList from "./components/experiments/ExperimentList";
import ExperimentWizard from "./components/experiments/ExperimentWizard";
import ExperimentDetail from "./components/experiments/ExperimentDetail";
import AnswerList from "./components/experiments/answers/AnswerList";
import PlatformWizard from "./components/experiments/platforms/PlatformWizard";

import TemplateList from "./components/templates/TemplateList";
import TemplateDetail from "./components/templates/TemplateDetail";
import TemplateWizard from "./components/templates/TemplateWizard";

import NotificationList from "./components/notifications/NotificationList";
import NotificationDetail from "./components/notifications/NotificationDetail";
import NotificationWizard from "./components/notifications/NotificationWizard";

import CalibrationList from "./components/calibrations/CalibrationList";
import CalibrationDetail from "./components/calibrations/CalibrationDetail";
import CalibrationWizard from "./components/calibrations/CalibrationWizard";

import history from "./history";
import config from "./config";

const container = document.createElement("div");
document.body.appendChild(container);

const renderLoggedIn = (authenticator) => {
    let backend = new Backend(config.apiRoot, authenticator);

    let createElement = (Component, props) => {
        return <Component {...props} backend={backend} authentication={config.authentication}/>;
    };

    return render((
        <Router history={history} createElement={createElement}>
            <Redirect from="/" to="/experiments"/>
            <Redirect from="/login" to="/"/>

            <Route path="/" component={App}>
                <Route path="experiments" component={ExperimentList}/>
                <Route path="experiments/new" component={ExperimentWizard}/>
                <Route path="experiments/:id" component={ExperimentDetail}/>
                <Route path="experiments/:id/edit" component={ExperimentWizard}/>
                <Route path="experiments/:id/platforms" component={PlatformWizard}/>
                <Route path="experiments/:id/answers" component={AnswerList}/>

                <Route path="templates" component={TemplateList}/>
                <Route path="templates/new" component={TemplateWizard}/>
                <Route path="templates/:id" component={TemplateDetail}/>
                <Route path="templates/:id/edit" component={TemplateWizard}/>

                <Route path="notifications" component={NotificationList}/>
                <Route path="notifications/new" component={NotificationWizard}/>
                <Route path="notifications/:id" component={NotificationDetail}/>
                <Route path="notifications/:id/edit" component={NotificationWizard}/>

                <Route path="calibrations" component={CalibrationList}/>
                <Route path="calibrations/new" component={CalibrationWizard}/>
                <Route path="calibrations/:id" component={CalibrationDetail}/>

                {/* NotFoundRoute doesn't work */}
                <Route path="*" component={NotFound}/>
            </Route>
        </Router>
    ), container);
};

const renderLogin = () => render((
    <Router history={history}>
        <Route path="/login" component={Login}/>
        <Redirect from="*" to="/login"/>
    </Router>
), container);

if (config.authentication) {
    const credentials = localStorage.getItem("crowdcontrol:credentials");

    if (credentials) {
        let data = JSON.parse(credentials);
        let authenticator = new BasicAuthenticator(data.username, data.password);

        renderLoggedIn(authenticator);
    } else {
        renderLogin();
    }
} else {
    renderLoggedIn(new Authenticator);
}