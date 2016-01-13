import React from "react";
import history from "../history";
import Backend from "../core/Backend";
import Loader from "../core/Loader";
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
            templates: [],
            loaded: false
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
                    <button className="action action-constructive" onClick={this._onCreateClick.bind(this)}>
                        <i className="fa fa-plus" /> Create new template…
                    </button>
                </div>

                <Loader loaded={this.state.loaded} className="loader">
                    <ul className="list">
                        {children}
                    </ul>
                </Loader>
            </div>
        );
    }

    _onCreateClick() {
        history.replaceState(null, "/templates/new");
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillReceiveProps(next) {
        return;

        let oldId = this.props.params.id;
        let newId = next.params.id;

        if (oldId !== newId) {
            this.fetchData();
        }
    }

    componentWillUnmount() {
        this.ignoreLastFetch = true;
    }

    fetchData() {
        Backend.get("templates").then((response) => {
            if (!this.ignoreLastFetch) {
                this.setState({
                    templates: response.data.templates,
                    loaded: true
                });
            }
        }).catch(() => {
            // TODO: Nice error message
            alert("loading failed!");
            this.setState({
                loaded: true
            })
        });
    }
}

export default TemplateList;

