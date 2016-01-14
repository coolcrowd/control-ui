import React from "react";
import history from "../history";
import Backend from "../core/Backend";
import Loader from "../core/Loader";
import DataComponent from "./DataComponent";
import TemplateListItem from "./TemplateListItem";

class TemplateList extends DataComponent {
    constructor() {
        super();
    }

    getDataUri() {
        return "templates";
    }

    componentWillReceiveProps(next) {
        // TODO: Implement pagination...
    }

    render() {
        if (this.state.loaded && this.state.failed) {
            return (
                <div>
                    <h1>Loading failed…</h1>

                    <p>
                        Data could not be loaded.
                    </p>
                </div>
            );
        }

        let children = this.state.loaded ? this.state.data.items.map((template) => {
            return (
                <TemplateListItem key={template.id} template={template} onDelete={this._onDelete.bind(this)}/>
            );
        }) : [];

        return (
            <div>
                <h1>Templates</h1>

                <p>
                    Info about templates....
                </p>

                <div className="actions">
                    <button className="action action-constructive" onClick={this._onCreate.bind(this)}>
                        <i className="fa fa-plus"/> Create new template…
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

    _onCreate() {
        history.replaceState(null, "/templates/new");
    }

    _onDelete(id) {
        let items = this.state.data.items.filter(function(i) {
            return i.id !== id;
        });

        let data = this.state.data;
        data.items = items;

        this.setState({
            data: data
        });
    }
}

export default TemplateList;

