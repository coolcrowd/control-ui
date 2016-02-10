import React from "react";
import { Link } from "react-router";
import Loader from "../../core/Loader";
import DataComponent from "../base/DataComponent";
import DataError from "../base/DataError";
import ResourceAction from "./../base/ResourceAction";
import history from "../../history";

/**
 * @author Niklas Keller
 */
class CalibrationDetail extends DataComponent {
    getDataUri() {
        return "calibrations/" + this.props.params.id;
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
                let answers = this.state.loaded ? this.state.data.answers.map((answer) => {
                    return (
                        <li><b>{answer.answer}</b></li>
                    );
                }) : [];

                content = (
                    <div>
                        <div className="actions">
                            <ResourceAction icon="trash" method="DELETE" uri={"calibrations/" + this.props.params.id}
                                            onClick={() => window.confirm("Do you really want to delete this calibration?")}
                                            onSuccess={() => history.replaceState(null, "/calibrations")}
                                            onError={(e) => {
                                                let error = typeof e === "object" && "data" in e ? e.data.detail : "Unknown error.";
                                                window.alert("Deletion failed. " + error);
                                            }}
                                            backend={this.props.backend}>
                                Delete
                            </ResourceAction>
                        </div>

                        <h1>Calibration: {this.state.data.name}</h1>

                        <label className="input-label">Question</label>
                        <pre>{this.state.data.question}</pre>

                        <label className="input-label">Possible Answers</label>
                        <ul>
                            {answers}
                        </ul>
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

export default CalibrationDetail;