import React from "react";
import { Link } from "react-router";
import Loader from "../../core/Loader";
import DataComponent from "../base/DataComponent";
import DataError from "../base/DataError";
import ResourceAction from "../base/ResourceAction";
import Template from "../../core/Template";
import history from "../../history";

/**
 * @author Niklas Keller
 */
class ExperimentDetail extends DataComponent {
    getDataUri() {
        return "experiments/" + this.props.params.id;
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
                let editButton = this.state.data.state === "DRAFT" ? (
                    <Link to={this.props.location.pathname + "/edit"} className="action">
                        <i className="fa fa-pencil icon"/>
                        Edit
                    </Link>
                ) : null;

                let stateButton = null;

                if (this.state.data.state === "DRAFT") {
                    stateButton = (
                        <button className="action action-constructive" type="button"
                                disabled={this.state.data.populations.length === 0}
                                title={this.state.data.populations.length === 0 ? "Add at least one population to publish an experiment" : ""}
                                onClick={this._onPublishClick.bind(this)}>
                            <i className="fa fa-play icon"/>
                            Publish
                        </button>
                    );
                } else if (this.state.data.state === "PUBLISHED") {
                    stateButton = (
                        <button className="action action-destructive" type="button"
                                onClick={this._onAbortClick.bind(this)}>
                            <i className="fa fa-stop icon"/>
                            Abort
                        </button>
                    );
                }

                let description = Object.keys(this.state.data.placeholders).length > 0
                    ? Template.apply(this.state.data.description, this.state.data.placeholders)
                    : this.state.data.description;

                content = (
                    <div>
                        <div className="actions">
                            {stateButton}

                            <Link className="action" to={this.props.location.pathname + "/platforms"}>
                                <i className="fa fa-users icon"/>
                                Edit Populations
                            </Link>

                            {editButton}

                            <ResourceAction icon="trash" method="DELETE" uri={"experiments/" + this.props.params.id}
                                            onClick={() => window.confirm("Do you really want to delete this experiment?")}
                                            onSuccess={() => history.replaceState(null, "/experiments")}
                                            onError={() => window.alert("Deletion failed.")}
                                            backend={this.props.backend}>
                                Delete
                            </ResourceAction>
                        </div>

                        <h1>Experiment: {this.state.data.title}</h1>

                        <label className="input-label">Parameters</label>
                        <table className="input-table-info">
                            <tbody>
                            <tr>
                                <td>Answer Type</td>
                                <td>{this.state.data.answerType === "TEXT" ? "Text" : "Images"}</td>
                                <td>Needed Answers</td>
                                <td>{this.state.data.neededAnswers || 0}</td>
                            </tr>
                            <tr>
                                <td>Answers / Worker</td>
                                <td>{this.state.data.answersPerWorker || 0}</td>
                                <td>Base Payment</td>
                                <td>{this.state.data.paymentBase || 0}</td>
                            </tr>
                            <tr>
                                <td>Ratings / Worker</td>
                                <td>{this.state.data.ratingsPerWorker || 0}</td>
                                <td>Payment / Answer</td>
                                <td>{this.state.data.paymentAnswer || 0}</td>
                            </tr>
                            <tr>
                                <td>Ratings / Answer</td>
                                <td>{this.state.data.ratingsPerAnswer || 0}</td>
                                <td>Payment / Rating</td>
                                <td>{this.state.data.paymentRating || 0}</td>
                            </tr>
                            </tbody>
                        </table>

                        <label className="input-label">Description</label>
                        <pre>{description}</pre>
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

    _onPublishClick() {
        this.props.backend.request("PATCH", "experiments/" + this.props.params.id, {
            state: "PUBLISHED"
        }).then(() => {
            alert("Experiment has been published.");
        }).catch(() => {
            alert("Experiment could not be published.");
        });
    }

    _onAbortClick() {
        this.props.backend.request("PATCH", "experiments/" + this.props.params.id, {
            state: "CREATIVE_STOPPED"
        }).then(() => {
            alert("No more creative answers will be collected.");
        }).catch(() => {
            alert("Experiment could not be stopped.");
        });
    }
}

export default ExperimentDetail;