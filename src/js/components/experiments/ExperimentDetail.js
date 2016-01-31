import React from "react";
import { Link } from "react-router";
import Loader from "../../core/Loader";
import DataComponent from "../base/DataComponent";
import DataError from "../base/DataError";
import ResourceAction from "./../base/ResourceAction";
import history from "../../history";

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

                let populations = (this.state.data.populations || []).map((population) => {
                    return (
                        <li>
                            <b>{population.name}</b>
                        </li>
                    );
                });

                if (populations.length > 0) {
                    populations = (
                        <ul>
                            {populations}
                        </ul>
                    );
                } else {
                    populations = (
                        <i>None yet.</i>
                    );
                }

                content = (
                    <div>
                        <div className="actions">
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

                        <label className="input-label">Description</label>
                        <pre>{this.state.data.description}</pre>

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

                        <label className="input-label">Populations</label>
                        {populations}
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

export default ExperimentDetail;