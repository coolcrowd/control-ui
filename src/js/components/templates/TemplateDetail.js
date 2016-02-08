import React from "react";
import { Link } from "react-router";
import Loader from "../../core/Loader";
import DataComponent from "./../base/DataComponent";
import DataError from "./../base/DataError";
import ResourceAction from "./../base/ResourceAction";
import history from "../../history";

/**
 * @author Niklas Keller
 */
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
                    <DataError />
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

                let constraints = this.state.data.constraints.map((constraint) => (
                    <li key={constraint.name}>{constraint.name}</li>
                ));

                let tags = this.state.data.tags.map((tag) => (
                    <li key={tag.name}>{tag.name}</li>
                ));

                content = (
                    <div>
                        <div className="actions">
                            <button type="button" className="action" onClick={this._onUseClick.bind(this)}>
                                <i className="fa fa-clone icon"/>
                                Use
                            </button>

                            <Link to={this.props.location.pathname + "/edit"} className="action">
                                <i className="fa fa-pencil icon"/>
                                Edit
                            </Link>

                            <ResourceAction icon="trash" method="DELETE" uri={"templates/" + this.props.params.id}
                                            onClick={() => window.confirm("Do you really want to delete this template?")}
                                            onSuccess={() => history.replaceState(null, "/templates")}
                                            onError={(e) => {
                                                let error = "data" in e ? e.data.detail : "Unknown error.";
                                                window.alert("Deletion failed. " + error);
                                            }}
                                            backend={this.props.backend}>
                                Delete
                            </ResourceAction>
                        </div>

                        <h1>Template: {this.state.data.name}</h1>

                        <label className="input-label">Content</label>
                        <pre>{this.state.data.content}</pre>

                        <label className="input-label">Answer Type</label>
                        <div>{type}</div>

                        <label className="input-label"><i className="fa fa-chain icon"/> Constraints</label>
                        {constraints.length ? <ul>{constraints}</ul> : <i>none</i>}

                        <label className="input-label"><i className="fa fa-tags icon"/> Tags</label>
                        {tags.length ? <ul>{tags}</ul> : <i>none</i>}
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

    _onUseClick() {
        history.replaceState({
            template: this.state.data
        }, "/experiments/new");
    }
}

export default TemplateDetail;