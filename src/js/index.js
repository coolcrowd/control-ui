import React from "react";
import { render } from "react-dom";
import { Router, Route, IndexRoute, Link } from "react-router";
import history from "./history";

import App from "./components/App";
import Welcome from "./components/Welcome";

import ExperimentList from "./components/experiments/ExperimentList";
import ExperimentWizard from "./components/experiments/ExperimentWizard";

import TemplateList from "./components/templates/TemplateList";
import TemplateDetail from "./components/templates/TemplateDetail";
import TemplateWizard from "./components/templates/TemplateWizard";

import NotificationList from "./components/notifications/NotificationList";
import NotificationDetail from "./components/notifications/NotificationDetail";
import NotificationWizard from "./components/notifications/NotificationWizard";

const container = document.createElement("div");

render((
    <Router history={history}>
        <Route path="/" component={App}>
            <IndexRoute component={Welcome}/>

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
        </Route>
    </Router>
), container);

document.body.appendChild(container);