import React from "react";
import Loader from "../../core/Loader";
import Wizard from "../base/Wizard";

function encodeCollection(text, separator) {
    let items = text.split(separator);

    // Remove whitespace and empty elements
    return items.map((item) => item.trim()).filter((item) => item !== "");
}

/**
 * @author Niklas Keller
 */
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
                help: "Describe what this notification is about. It will be included in the sent mail. You can include the placeholder {{tokens}} to get detailed information in your notification, see SQL Query for more information."
            },
            query: {
                type: "longtext",
                label: "SQL Query",
                help: "Once this query returns a non-empty result, a notification will be sent out. If your query returns one or more records with exactly the two fields id : int and token : string the value of token can be included in the description.",
                validation: {
                    validator: this._validateQuery.bind(this),
                    renderer: this._renderQueryValidation.bind(this)
                }
            },
            checkPeriod: {
                type: "number",
                label: "Check Period",
                help: "How often should we check this query?",
                unit: "seconds",
                default: "86400"
            },
            emails: {
                type: "text",
                label: "E-Mails",
                help: "Addresses to receive notifications. Separate multiple values with commas.",
                encoder: (text) => encodeCollection(text, ","),
                decoder: (items) => items.join(", "),
                validation: {
                    validator: () => {
                        this.setState({
                            "validation.emails": this.refs.emails.value === "" || this.refs.emails.value.indexOf("@") > 0
                        });
                    },
                    renderer: () => {
                        if (!this.state["validation.emails"]) {
                            return (
                                <div className="validation-error">
                                    You must add at least one valid e-mail address.
                                </div>
                            );
                        }
                    }
                }
            },
            sendOnce: {
                type: "boolean",
                label: "Send Once",
                help: "Delete this notification if it has been sent once?",
                active: "send once and delete afterwards",
                inactive: "send whenever the result changes",
                encoder: (i) => {
                    return {
                        value: !!i
                    };
                },
                decoder: (i) => i.value ? "1" : ""
            }
        };
    }

    getCollectionUri(query) {
        if (typeof query !== "undefined") {
            return "notifications?" + query;
        }

        return "notifications";
    }

    _validateQuery() {
        let query = this.state.form.query;

        if (query === "" || query.toUpperCase().startsWith("SELECT ".substr(0, query.length))) {
            this.setState({queryValid: true});
        } else {
            this.setState({queryValid: false});
        }
    }

    _renderQueryValidation() {
        if (!this.state.queryValid) {
            return (
                <div className="validation-error">
                    Your SQL query must be a <code>SELECT</code> statement.
                </div>
            );
        } else {
            return null;
        }
    }
}

export default NotificationWizard;