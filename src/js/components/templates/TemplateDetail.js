import React from "react";
import { Link } from "react-router";
import Backend from "../../core/Backend";
import Loader from "../../core/Loader";
import DataComponent from "./../base/DataComponent";
import ResourceAction from "./../base/ResourceAction";
import history from "../../history";

class TemplateDetail extends DataComponent {
    getDataUri() {
        return "templates/" + this.props.params.id;
    }

    componentWillReceiveProps(next) {
        let oldId = this.props.params.id;
        let newId = next.params.id;

        if (oldId !== newId) {
            this.fetchData();
        }
    }

    render() {
        let content = null;

        if (this.state.loaded) {
            if (this.state.failed) {
                content = (
                    <div>
                        <h1>Error while loading…</h1>

                        <p>Content couldn't be loaded.</p>
                    </div>
                );
            } else {
                let type;

                if ("answerType" in this.state.data) {
                    type = (
                        <span>
                            <i className="fa fa-file-image-o icon"/>
                            Image
                        </span>
                    );
                } else {
                    type = (
                        <span>
                            <i className="fa fa-file-text-o icon"/>
                            Text
                        </span>
                    );
                }

                content = (
                    <div>
                        <div className="resource-actions">
                            <Link to={this.props.location.pathname + "/edit"}>
                                <i className="fa fa-pencil icon"/>
                                Edit
                            </Link>

                            <ResourceAction icon="trash" method="DELETE" uri={"templates/" + this.props.params.id}
                                            onClick={() => window.confirm("Do you really want to delete this template?")}
                                            onSuccess={() => history.replaceState(null, "/templates")}
                                            onError={() => window.alert("Deletion failed.")}>
                                Delete
                            </ResourceAction>
                        </div>

                        <h1>{this.state.data.name}</h1>

                        <label>Content</label>
                        <pre>{this.state.data.content}</pre>

                        <label>Answer Type</label>
                        <div>{type}</div>
                    </div>
                );
            }
        }

        return (
            <Loader loaded={this.state.loaded} className="loader">
                {content}
            </Loader>
        );
    }
}

export default TemplateDetail;