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
class NotificationDetail extends DataComponent {
    getDataUri() {
        return "notifications/" + this.props.params.id;
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
                let emails = this.state.data.emails.map((item) => (
                    <li><code>{item}</code></li>
                ));

                emails = (
                    <ul>
                        {emails}
                    </ul>
                );

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
                                            onError={(e) => {
                                                let error = "data" in e ? e.data.detail : "Unknown error.";
                                                window.alert("Deletion failed. " + error);
                                            }}
                                            backend={this.props.backend}>
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

                        <label className="input-label">E-Mails</label>
                        <div>{emails}</div>

                        <label className="input-label">Send Once</label>
                        <div>{this.state.data.sendOnce.value ? "Yes, will be sent once and then be deleted." : "No, will be sent on every change."}</div>
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