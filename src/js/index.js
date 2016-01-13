import React from "react";
import { render } from "react-dom";
import { Router, Route, IndexRoute, Link } from "react-router";
import history from "./history";

import App from "./components/App";
import TemplateList from "./components/TemplateList";
import TemplateDetail from "./components/TemplateDetail";
import TemplateWizard from "./components/TemplateWizard";
import Welcome from "./components/Welcome";

const container = document.createElement("div");

render((
    <Router history={history}>
        <Route path="/" component={App}>
            <IndexRoute component={Welcome} />
            <Route path="templates" component={TemplateList} />
            <Route path="templates/new" component={TemplateWizard} />
            <Route path="templates/:id" component={TemplateDetail} />
            <Route path="templates/:id/edit" component={TemplateWizard} />
        </Route>
    </Router>
), container);

document.body.appendChild(container);