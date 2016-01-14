import React from "react";
import Backend from "../../core/Backend";
import Loader from "../../core/Loader";
import Wizard from "../base/Wizard";

class NotificationWizard extends Wizard {
    getForm() {
        return {
            name: {
                type: "text",
                label: "Name",
                help: "Name to identify the notification."
            },
            description: {
                type: "longtext",
                label: "Description",
                help: "Describe what this notification is about. It will be included in the sent mail."
            },
            query: {
                type: "longtext",
                label: "SQL query",
                help: "Once this query returns a non-empty result, a notification will be sent out.",
                validation: {
                    validator: this._validateQuery.bind(this),
                    renderer: this._renderQueryValidation.bind(this)
                }
            },
            checkPeriod: {
                type: "number",
                label: "Check Period",
                help: "How often should we check this query?",
                unit: "seconds"
            },
            sendThreshold: {
                type: "number",
                label: "Send Threshold",
                help: "If a notification has been sent, wait X seconds until another one is sent.",
                unit: "seconds"
            }
        };
    }

    getDataUri() {
        return "notifications";
    }

    _validateQuery() {
        let query = this.state.form.query;

        if (query === "" || query.startsWith("SELECT ".substr(0, query.length))) {
            this.setState({queryValid: true});
        } else {
            this.setState({queryValid: false});
        }
    }

    _renderQueryValidation() {
        if (!this.state.queryValid) {
            return (
                <div className="warnings">
                    <h3><i className="fa fa-warning"/> Warnings</h3>
                    <ul>
                        <li>Your SQL query must be a <code>SELECT</code> statement.</li>
                    </ul>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default NotificationWizard;