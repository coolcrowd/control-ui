import React from "react";

/**
 * @author Niklas Keller
 */
class State extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <span
                className={this.props.prefix + "-state " + this.props.prefix + "-state-" + this.props.state.toLowerCase().replace(/_/g, "-")}
                title={this.props.state.replace(/_/g, " ")}>
                {this.props.state.replace(/_/g, " ").substr(0, 1)}
            </span>
        );
    }
}

export default State;