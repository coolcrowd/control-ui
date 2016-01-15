import React from "react";
import { Link } from "react-router";
import Backend from "../../core/Backend";
import Loader from "../../core/Loader";
import DataComponent from "../base/DataComponent";
import DataError from "../base/DataError";
import ResourceAction from "./../base/ResourceAction";
import history from "../../history";

class NotificationDetail extends DataComponent {
    getDataUri() {
        return "notifications/" + this.props.params.id;
    }

    componentWillReceiveProps(next) {
        let oldId = this.props.params.id;
        let newId = next.params.id;

        if (oldId !== newId) {
            this._fetchData();
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
                content = (
                    <div>
                        <div className="actions">
                            <Link to={this.props.location.pathname + "/edit"} className="action">
                                <i className="fa fa-pencil icon"/>
                                Edit
                            </Link>

                            <ResourceAction icon="trash" method="DELETE" uri={"notifications/" + this.props.params.id}
                                            onClick={() => window.confirm("Do you really want to delete this notification?")}
                                            onSuccess={() => history.replaceState(null, "/notifications")}
                                            onError={() => window.alert("Deletion failed.")}>
                                Delete
                            </ResourceAction>
                        </div>

                        <h1>Notification: {this.state.data.name}</h1>

                        <label className="input-label">Description</label>
                        <pre>{this.state.data.description}</pre>

                        <label className="input-label">SQL Query</label>
                        <pre>{this.state.data.query}</pre>

                        <label className="input-label">Check Period</label>
                        <div>Checked every <code>{this.state.data.checkPeriod}</code> seconds.</div>

                        <label className="input-label">Send Threshold</label>
                        <div>Next sent only after <code>{this.state.data.sendThreshold}</code> seconds.</div>
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

export default NotificationDetail;