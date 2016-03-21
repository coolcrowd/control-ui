import React from "react";
import { Link } from "react-router";
import Loader from "../../core/Loader";
import DataComponent from "../base/DataComponent";
import DataError from "../base/DataError";
import ResourceAction from "../base/ResourceAction";
import Action from "../base/Action";
import Template from "../../core/Template";
import history from "../../history";

/**
 * @author Niklas Keller
 */
class ExperimentDetail extends DataComponent {
    constructor() {
        super();

        this.state = Object.assign(this.state || {}, {
            stateButtonLoading: false,
            platformsFailed: false,
            platforms: null
        });
    }

    getDataUri() {
        return "experiments/" + this.props.params.id;
    }

    componentDidMount() {
        super.componentDidMount();
        this.fetchPlatforms();
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
            if (this.state.failed || this.state.platformsFailed) {
                content = (
                    <DataError />
                );
            } else {
                let state = (
                    <div className="experiment-state-notice">
                        This experiment's state is currently <span
                        className={"experiment-state experiment-state-" + this.state.data.state.toLowerCase().replace(/_/g, "-")}>{this.state.data.state.replace(/_/g, " ")}</span>
                    </div>
                );

                if (this.state.data.state === "INVALID") {
                    state = [
                        state,
                        <div className="experiment-state-notice">
                            The software can't recover, because the platforms are in an inconsistent state which can't
                            be recovered.
                        </div>
                    ];
                }

                let platforms = [];

                if (this.state.platforms && (this.state.data.state === "PUBLISHED" || this.state.data.state === "CREATIVE_STOPPED")) {
                    let populations = this.state.data.populations;

                    for (let i = 0; i < populations.length; i++) {
                        let platform = this.state.platforms[populations[i].platformId];

                        platforms.push(
                            <li key={populations[i].platformId} className="experiment-detail-platform">
                                <a href={this.replaceExperimentUrl(platform.url)} target="_blank">{platform.name}</a>
                            </li>
                        );
                    }

                    if (platforms.length > 0) {
                        platforms = (
                            <div className="experiment-detail-platforms">
                                <label className="input-label">Published Platforms</label>

                                <ul>
                                    {platforms}
                                </ul>
                            </div>
                        );
                    }
                }

                let editButton = (
                    <Action icon="pencil" href={this.props.location.pathname + "/edit"}
                            disabled={this.state.data.state !== "DRAFT"}
                            title="Experiments can only be edited when in draft state!">
                        Edit
                    </Action>
                );

                let deleteButton = this.state.data.state === "DRAFT" || this.state.data.state === "STOPPED" ? (
                    <ResourceAction icon="trash" method="DELETE" uri={"experiments/" + this.props.params.id}
                                    onClick={() => window.confirm("Do you really want to delete this experiment?")}
                                    onSuccess={() => history.replaceState(null, "/experiments")}
                                    onError={(e) => {
                                                let error = typeof e === "object" && "data" in e ? e.data.detail : "Unknown error.";
                                                window.alert("Deletion failed. " + error);
                                            }}
                                    backend={this.props.backend}>
                        Delete
                    </ResourceAction>
                ) : (
                    <Action icon="trash" href="/" disabled={true}
                            title="Experiments can only be deleted when in draft state or completely stopped!">
                        Delete
                    </Action>
                );

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
                        <div className="actions actions-right" style={{clear: "right"}}>
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

                            {deleteButton}
                        </div>

                        {answerLink}

                        <h1>Experiment: {this.state.data.title}</h1>

                        {state}

                        {platforms}

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
                        <div className="experiment-description dont-break-out"
                             dangerouslySetInnerHTML={{__html: description}}></div>

                        {constraints.length ? (
                            <div>
                                <label className="input-label"><i className="fa fa-chain icon"/> Constraints</label>
                                <ul>{constraints}</ul>
                            </div>
                        ) : (
                            <div>
                                <label className="input-label"><i className="fa fa-chain icon"/> No Constraints</label>
                            </div>
                        )}

                        {tags.length ? (
                            <div>
                                <label className="input-label"><i className="fa fa-tags icon"/> Tags</label>
                                <ul>{tags}</ul>
                            </div>
                        ) : (
                            <div>
                                <label className="input-label"><i className="fa fa-tags icon"/> No Tags</label>
                            </div>
                        )}
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

            let error = typeof e === "object" && "data" in e ? e.data.detail : "Unknown error.";
            alert("Experiment could not be published: " + error);
        });
    }

    _onAbortClick() {
        this.setState({
            stateButtonLoading: true
        });

        this.props.backend.request("PATCH", "experiments/" + this.props.params.id, {
            state: "CREATIVE_STOPPED"
        }).then((response) => {
            this.setState({
                stateButtonLoading: false
            });

            if (response.data.state === "CREATIVE_STOPPED") {
                this.fetchData();
            } else {
                alert("Experiment could not be stopped.");
            }
        }).catch((e) => {
            this.setState({
                stateButtonLoading: false
            });

            let error = typeof e === "object" && "data" in e ? e.data.detail : "Unknown error.";
            alert("Experiment could not be stopped: " + error);
        });
    }

    fetchPlatforms() {
        this.props.backend.request("GET", "platforms").then((response) => {
            let platforms = {};

            for (let i = 0; i < response.data.items.length; i++) {
                platforms[response.data.items[i].id] = response.data.items[i];
            }

            this.setState({
                platformsFailed: false,
                platforms: platforms
            });
        }).catch(() => {
            this.setState({
                platformsFailed: true,
                platforms: null
            });
        });
    }

    replaceExperimentUrl(url) {
        let data = this.flattenExperiment();

        for (let key in data) {
            data[key] = encodeURIComponent(data[key]);
        }

        let placeholders = Template.parse(url);

        let placeholderData = {};

        for (let key in placeholders) {
            placeholderData[key] = data[key];
        }

        return Template.apply(url, placeholderData);
    }

    flattenExperiment() {
        // http://stackoverflow.com/a/19101235/2373138
        let flatten = function (data) {
            let result = {};

            function recurse(cur, prop) {
                let isEmpty;

                if (Object(cur) !== cur) {
                    result[prop] = typeof result[prop] === "string" ? (result[prop] + ", " + cur) : cur;
                } else if (Array.isArray(cur)) {
                    for (var i = 0, l = cur.length; i < l; i++) {
                        recurse(cur[i], prop);
                    }

                    if (l == 0) {
                        result[prop] = "";
                    }
                } else {
                    for (var p in cur) {
                        recurse(cur[p], prop ? prop + "." + p : p);
                    }
                }
            }

            recurse(data, "");
            return result;
        };

        return flatten(this.state.data);
    }
}

export default ExperimentDetail;