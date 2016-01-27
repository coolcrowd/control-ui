import React from "react";
import { Link } from "react-router";
import Loader from "../../core/Loader";
import DataComponent from "../base/DataComponent";
import DataError from "../base/DataError";
import ResourceAction from "./../base/ResourceAction";
import history from "../../history";

class PopulationDetail extends DataComponent {
    getDataUri() {
        return "populations/" + this.props.params.id;
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
                let answers = this.state.loaded ? this.state.data.answers.map((answer) => <li><b>{answer}</b></li>) : [];

                content = (
                    <div>
                        <div className="actions">
                            <ResourceAction icon="trash" method="DELETE" uri={"populations/" + this.props.params.id}
                                            onClick={() => window.confirm("Do you really want to delete this population?")}
                                            onSuccess={() => history.replaceState(null, "/populations")}
                                            onError={() => window.alert("Deletion failed.")}
                                            backend={this.props.backend}>
                                Delete
                            </ResourceAction>
                        </div>

                        <h1>Population: {this.state.data.name}</h1>

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

export default PopulationDetail;