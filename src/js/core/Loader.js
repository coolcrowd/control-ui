import React from "react";

// Show loader while page is not loaded yet, but without spin.js!
// https://github.com/quickleft/react-loader/blob/master/lib/react-loader.js

/**
 * @author Niklas Keller
 */
class Loader extends React.Component {
    constructor() {
        super();

        this.state = {
            loaded: false
        };
    }

    componentDidMount() {
        this.updateState(this.props);
    }

    componentWillReceiveProps(next) {
        this.updateState(next);
    }

    updateState(props) {
        props = props || {};

        let loaded = this.state.loaded;

        if ("loaded" in props) {
            loaded = !!props.loaded;
        }

        this.setState({
            loaded: loaded
        });
    }

    render() {
        var props, children;

        if (this.state.loaded) {
            props = {
                key: "content",
                className: "loaded-content"
            };

            children = this.props.children;
        } else {
            props = {
                key: "loader",
                ref: "loader",
                className: "loader-container"
            };

            children = [
                React.createElement("div", {className: "loader"}, null)
            ]
        }

        return React.createElement("div", props, children);
    }
}

export default Loader;

