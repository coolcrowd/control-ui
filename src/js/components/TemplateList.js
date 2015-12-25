import React from "react";
import history from "../history";

import TemplateListItem from "./TemplateListItem";

function getTemplateListItem(template) {
    return (
        <TemplateListItem key={template.id} template={template} />
    )
}

class TemplateList extends React.Component {
    constructor() {
        super();

        this.state = {
            templates: [
                {
                    id: 1,
                    name: "Mean Tweet",
                    content: "Mean Tweet..."
                }
            ]
        }
    }

    render() {
        let children = this.state.templates.map(getTemplateListItem);

        return (
            <div>
                <h1>Templates</h1>

                <p>
                    Info about templates....
                </p>

                <div className="actions">
                    <button className="action action-constructive" onClick={this._onClick.bind(this)}>
                        <i className="fa fa-plus" /> Create new template…
                    </button>
                </div>

                <ul className="list">
                    {children}
                </ul>
            </div>
        )
    }

    _onClick() {
        history.replaceState(null, "/templates/new");
    }
}

export default TemplateList;

