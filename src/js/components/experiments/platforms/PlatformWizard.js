import React from "react";
import Loader from "../../../core/Loader";
import DataError from "../../base/DataError";
import PlatformWizardItem from "./PlatformWizardItem";
import history from "../../../history";

/**
 * @author Niklas Keller
 */
class PlatformWizard extends React.Component {
    constructor() {
        super();

        this.state = {
            loaded: false,
            failed: false,
            platforms: null,
            experiment: null,
            payload: [],
            platformState: {}
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillReceiveProps(next) {
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
        let failedState = {
            platforms: null,
            experiment: null,
            loaded: true,
            failed: true,
            payload: [],
            platformState: []
        };

        this.props.backend.request("GET", "experiments/" + this.props.params.id).then((response) => {
            if (!this.ignoreLastFetch) {
                let experiment = response.data;

                this.props.backend.request("GET", "platforms").then((response) => {
                    if (this.ignoreLastFetch) {
                        return;
                    }

                    let platforms = response.data;

                    this.setState({
                        platforms: platforms,
                        experiment: experiment,
                        loaded: true,
                        failed: false,
                        payload: this._buildPayload(platforms.items, experiment.populations || []),
                        platformState: this._buildPlatformState(platforms.items, experiment.populations || [])
                    });
                }).catch(() => {
                    if (!this.ignoreLastFetch) {
                        this.setState(failedState);
                    }
                });
            }
        }).catch(() => {
            if (!this.ignoreLastFetch) {
                this.setState(failedState);
            }
        });
    }

    render() {
        if (this.state.loaded && this.state.failed) {
            return <DataError />;
        }

        let children = this.state.loaded ? (this.state.platforms.items || []).map((item) => {
            return (
                <PlatformWizardItem key={item.id} item={item} backend={this.props.backend}
                                    enabled={this.state.platformState[item.id]}
                                    restrictions={this.state.payload[item.id]}
                                    onToggle={() => this._onPlatformToggle(item.id)}
                                    onChange={(restriction) => this._onRestrictionChange(item.id, restriction)}
                                    onNew={(restriction) => this._onRestrictionCreation(item.id, restriction)}/>
            );
        }) : [];

        if (children.length === 0) {
            children = [(
                <li className="list-empty">
                    <i className={"fa fa-3x fa-users"}/>
                    <br/>
                    You have no platforms yet!<br/>
                    Let's change that!
                </li>
            )];
        }

        let experimentTitle = this.state.loaded ? this.state.experiment.title : "";

        return (
            <div>
                <h1>Platforms for &ldquo;{experimentTitle}&rdquo;</h1>

                <p className="info">
                    Experiments can be published on one or multiple platforms.
                </p>

                <br/>

                <Loader loaded={this.state.loaded} className="loader">
                    <ul className="list list-large" ref="list">
                        {children}
                    </ul>

                    <div className="actions actions-right actions-bottom">
                        <button type="button" className="action action-constructive"
                                onClick={this._onSubmit.bind(this)}>
                            <i className="fa fa-save icon"/> Save
                        </button>
                    </div>
                </Loader>
            </div>
        );
    }

    _onSubmit() {
        let payload = this.state.payload;
        let populations = [];

        for (let id in payload) {
            if (!this.state.platformState[id]) {
                continue;
            }

            let population = {
                platformId: id,
                calibrations: []
            };

            try {
                payload[id].some((item) => {
                    if (item.acceptedAnswers.length === 0) {
                        throw "You must select at least one accepted answer.";
                    }

                    population.calibrations.push({
                        id: item.id,
                        acceptedAnswers: item.acceptedAnswers
                    });
                });
            } catch (e) {
                alert(e);

                return;
            }

            populations.push(population);
        }

        if (populations.length === 0) {
            alert("A experiment must be published on at least one platform.");

            return;
        }

        let experiment = {
            populations: populations
        };

        this.props.backend.request("PATCH", "experiments/" + this.props.params.id, experiment).then(() => {
            history.replaceState(null, "/experiments/" + this.props.params.id);
        }).catch((e) => {
            alert(JSON.stringify(e));
        });
    }

    _onRestrictionCreation(id, restriction) {
        let payload = this.state.payload;
        let restrictions = payload[id];

        for (let j = 0; j < restrictions.length; j++) {
            if (restrictions[j].id === restriction.id) {
                // Restriction already present…
                return;
            }
        }

        restrictions.push(restriction);

        this.setState({
            payload: payload
        });
    }

    _onRestrictionChange(id, restriction) {
        let payload = this.state.payload;
        let restrictions = payload[id];

        for (let j = 0; j < restrictions.length; j++) {
            if (restrictions[j].id === restriction.id) {
                restrictions[j] = restriction;
                payload[id] = restrictions;

                this.setState({
                    payload: payload
                });

                return;
            }
        }
    }

    _onPlatformToggle(id) {
        let platforms = this.state.platformState;

        platforms[id] = !platforms[id];

        this.setState({
            platformState: platforms
        });
    }

    _buildPlatformState(platforms, populations) {
        let result = {};

        for (let i = 0; i < platforms.length; i++) {
            result[platforms[i].id] = false;
        }

        for (let i = 0; i < populations.length; i++) {
            result[populations[i].platformId] = true;
        }

        return result;
    }

    _buildPayload(platforms, populations) {
        let result = {};

        for (let i = 0; i < platforms.length; i++) {
            result[platforms[i].id] = [];
        }

        for (let i = 0; i < populations.length; i++) {
            result[populations[i].platformId] = populations[i].calibrations || [];
        }

        return result;
    }
}

export default PlatformWizard;