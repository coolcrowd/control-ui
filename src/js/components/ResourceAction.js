import React from "react";
import { Link } from "react-router";
import Backend from "../core/Backend";
import classNames from "classnames";

class ResourceAction extends React.Component {
    constructor() {
        super();

        this.state = {
            loading: false,
            failed: false
        };
    }

    componentWillReceiveProps() {
        this.setState({
            loading: false,
            failed: false
        });
    }

    render() {
        return (
            <button type="button" className={classNames({
                "resource-action": true,
                "action-destructive": this.props.method.toUpperCase() === "DELETE"
            })} onClick={this._onClick.bind(this)} disabled={this.state.loading}>
                <i className={"fa fa-" + this.props.icon + " icon"} />
                {this.props.children}
            </button>
        );
    }

    _onClick() {
        // ignore if action already loading
        if (this.state.loading) {
            return;
        }

        if ("onClick" in this.props) {
            if (!this.props.onClick()) {
                return;
            }
        }

        this.setState({
            loading: true
        });

        Backend.request(this.props.method.toUpperCase(), this.props.uri, this.props.data).then((response) => {
            if ("onSuccess" in this.props) {
                this.props.onSuccess(response);
            }

            this.setState({
                loading: false,
                failed: false
            });
        }).catch((e) => {
            if ("onError" in this.props) {
                this.props.onError(e);
            }

            this.setState({
                loading: false,
                failed: true
            });
        });
    }
}

export default ResourceAction;

