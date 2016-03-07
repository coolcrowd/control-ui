import React from "react";
import { Link } from "react-router";
import classNames from "classnames";

/**
 * @author Niklas Keller
 */
class Action extends React.Component {
    constructor() {
        super();
    }

    render() {
        if ("onClick" in this.props) {
            return (
                <button type="button" className="action" onClick={this.props.onClick}>
                    <i className={"fa fa-" + this.props.icon +" icon"}/>
                    {this.props.children}
                </button>
            );
        } else {
            if ("disabled" in this.props && this.props.disabled) {
                return (
                    <span className="action action-inactive" title={this.props.title || ""}>
                        <i className={"fa fa-" + this.props.icon + " icon"}/>
                        {this.props.children}
                    </span>
                );
            }

            return (
                <Link className="action" to={this.props.href} title={this.props.title || ""}>
                    <i className={"fa fa-" + this.props.icon + " icon"}/>
                    {this.props.children}
                </Link>
            );
        }
    }
}

export default Action;