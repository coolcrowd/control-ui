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
    constructor() {
        super();

        this.state = Object.assign(this.state || {}, {
            stateButtonLoading: false
        });
    }

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
                let answerLink = null;

                if (this.state.data.state === "DRAFT") {
                    stateButton = (
                        <button className="action action-constructive" type="button"
                                disabled={this.state.data.populations.length === 0 || this.state.stateButtonLoading}
                                title={this.state.data.populations.length === 0 ? "Add at least one population to publish an experiment" : ""}
                                onClick={this._onPublishClick.bind(this)}>
                            <i className="fa fa-play icon"/>
                            Publish
                        </button>
                    );
                } else if (this.state.data.state === "PUBLISHED") {
                    stateButton = (
                        <button className="action action-destructive" type="button"
                                onClick={this._onAbortClick.bind(this)}
                                disabled={this.state.stateButtonLoading}>
                            <i className="fa fa-stop icon"/>
                            Abort
                        </button>
                    );
                }

                if (this.state.data.state !== "DRAFT") {
                    answerLink = (
                        <div className="actions actions-right">
                            <Link to={this.props.location.pathname + "/answers"} className="action action-large">
                                <i className="fa fa-eye icon"/>
                                View Answers
                            </Link>
                        </div>
                    );
                }

                let description = Object.keys(this.state.data.placeholders).length > 0
                    ? Template.apply(this.state.data.description, this.state.data.placeholders)
                    : this.state.data.description;

                let constraints = this.state.data.constraints.map((constraint) => (
                    <li key={constraint.name}>{constraint.name}</li>
                ));

                let tags = this.state.data.tags.map((tag) => (
                    <li key={tag.name}>{tag.name}</li>
                ));

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
                                            onError={(e) => {
                                                let error = "data" in e ? e.data.detail : "Unknown error.";
                                                window.alert("Deletion failed. " + error);
                                            }}
                                            backend={this.props.backend}>
                                Delete
                            </ResourceAction>
                        </div>

                        <h1>Experiment: {this.state.data.title}</h1>

                        {answerLink}

                        <label className="input-label">Parameters</label>
                        <table className="input-table-info">
                            <tbody>
                            <tr>
                                <td>Answer Type</td>
                                <td><b>{this.state.data.answerType === "TEXT" ? "Text" : "Images"}</b></td>
                                <td>Needed Answers</td>
                                <td><b>{this.state.data.neededAnswers.value}</b></td>
                            </tr>
                            <tr>
                                <td>Answers / Worker</td>
                                <td><b>{this.state.data.answersPerWorker.value}</b></td>
                                <td>Base Payment</td>
                                <td><b>{this.state.data.paymentBase.value} ¢</b> (USD)</td>
                            </tr>
                            <tr>
                                <td>Ratings / Worker</td>
                                <td><b>{this.state.data.ratingsPerWorker.value}</b></td>
                                <td>Payment / Answer</td>
                                <td><b>{this.state.data.paymentAnswer.value} ¢</b> (USD)</td>
                            </tr>
                            <tr>
                                <td>Ratings / Answer</td>
                                <td><b>{this.state.data.ratingsPerAnswer.value}</b></td>
                                <td>Payment / Rating</td>
                                <td><b>{this.state.data.paymentRating.value} ¢</b> (USD)</td>
                            </tr>
                            </tbody>
                        </table>

                        <label className="input-label">Description</label>
                        <pre>{description}</pre>

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

    _onPublishClick() {
        this.setState({
            stateButtonLoading: true
        });

        this.props.backend.request("PATCH", "experiments/" + this.props.params.id, {
            state: "PUBLISHED"
        }).then((response) => {
            this.setState({
                stateButtonLoading: false
            });

            if (response.data.state === "PUBLISHED") {
                this.fetchData();
            } else {
                alert("Experiment could not be published.");
            }
        }).catch((e) => {
            this.setState({
                stateButtonLoading: false
            });

            let error = "data" in e ? e.data.detail : "Unknown error.";
            alert("Experiment could not be published: " + error);
        });
    }

    _onAbortClick() {
        this.setState({
            stateButtonLoading: true
        });

        this.props.backend.request("PATCH", "experiments/" + this.props.params.id, {
            state: "CREATIVE_STOPPED"
        }).then(() => {
            this.setState({
                stateButtonLoading: false
            });

            this.fetchData();
        }).catch((e) => {
            this.setState({
                stateButtonLoading: false
            });

            let error = "data" in e ? e.data.detail : "Unknown error.";
            alert("Experiment could not be stopped: " + error);
        });
    }
}

export default ExperimentDetail;