import React from "react";
import { render } from "react-dom";
import { Router, Route, IndexRoute, Redirect, Link } from "react-router";
import Backend from "./core/Backend";
import Authenticator from "./core/Authenticator";
import BasicAuthenticator from "./core/BasicAuthenticator";

import App from "./components/App";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import NotFound from "./components/NotFound";

import ExperimentList from "./components/experiments/ExperimentList";
import ExperimentWizard from "./components/experiments/ExperimentWizard";

import TemplateList from "./components/templates/TemplateList";
import TemplateDetail from "./components/templates/TemplateDetail";
import TemplateWizard from "./components/templates/TemplateWizard";

import NotificationList from "./components/notifications/NotificationList";
import NotificationDetail from "./components/notifications/NotificationDetail";
import NotificationWizard from "./components/notifications/NotificationWizard";

import PopulationList from "./components/populations/PopulationList";
import PopulationDetail from "./components/populations/PopulationDetail";
import PopulationWizard from "./components/populations/PopulationWizard";

import history from "./history";
import config from "./config";

const container = document.createElement("div");
document.body.appendChild(container);

const renderLoggedIn = (authenticator) => {
    let backend = new Backend(config.apiRoot, authenticator);

    let createElement = (Component, props) => {
        return <Component {...props} backend={backend}/>;
    };

    return render((
        <Router history={history} createElement={createElement}>
            <Route path="/" component={App}>
                <IndexRoute component={Welcome}/>
                <Redirect from="/login" to="/"/>

                <Route path="experiments" component={ExperimentList}/>
                <Route path="experiments/new" component={ExperimentWizard}/>
                <Route path="experiments/:id/edit" component={ExperimentWizard}/>

                <Route path="templates" component={TemplateList}/>
                <Route path="templates/new" component={TemplateWizard}/>
                <Route path="templates/:id" component={TemplateDetail}/>
                <Route path="templates/:id/edit" component={TemplateWizard}/>

                <Route path="notifications" component={NotificationList}/>
                <Route path="notifications/new" component={NotificationWizard}/>
                <Route path="notifications/:id" component={NotificationDetail}/>
                <Route path="notifications/:id/edit" component={NotificationWizard}/>

                <Route path="populations" component={PopulationList}/>
                <Route path="populations/new" component={PopulationWizard}/>
                <Route path="populations/:id" component={PopulationDetail}/>

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
    const credentials = localStorage.getItem("credentials");

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