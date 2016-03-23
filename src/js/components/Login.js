import React from "react";
import ReactDOM from "react-dom";
import CSSTransitionGroup from "react-addons-css-transition-group";
import config from "../config.js";

/**
 * @author Niklas Keller
 */
class Login extends React.Component {
    constructor() {
        super();

        this.state = {
            loading: false,
            username: "",
            password: "",
            attempt: 0
        };
    }

    render() {
        let key = "login-attempt-" + this.state.attempt;

        return (
            <div className="login">
                <div className="login-inner">
                    <img className="login-logo" src="/img/logo.png" width="200" height="48" alt="CrowdControl"
                         title="CrowdControl"/>

                    <CSSTransitionGroup transitionName="shake" transitionEnterTimeout={700} transitionLeave={false}>
                        <form key={key} className="login-form" onSubmit={this._onSubmit.bind(this)}>
                            <h1>Log In</h1>

                            <div className="input">
                                <label className="input-label">Username</label>
                                <input autoFocus type="text" ref="username" value={this.state.username}
                                       onChange={this._onChange.bind(this)}/>
                            </div>

                            <div className="input">
                                <label className="input-label">Password</label>
                                <input type="password" ref="password" value={this.state.password}
                                       onChange={this._onChange.bind(this)}/>
                            </div>

                            <div className="login-submit">
                                <button className="action" type="submit" disabled={this.state.loading}>
                                    Login
                                </button>
                            </div>
                        </form>
                    </CSSTransitionGroup>
                </div>
            </div>
        );
    }

    _onSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            loading: true
        });

        let username = this.state.username;
        let password = this.state.password;

        let xhr = new XMLHttpRequest;
        xhr.open("GET", config.apiRoot, true);
        xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));

        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) {
                return;
            }

            if (xhr.status === 401) {
                this.setState({
                    loading: false,
                    password: "",
                    attempt: this.state.attempt + 1
                });

                ReactDOM.findDOMNode(this.refs.password).focus();
            } else if (xhr.status === 200 || xhr.status === 204 || xhr.status === 404) {
                window.localStorage.setItem("crowdcontrol:credentials", JSON.stringify({
                    username: username,
                    password: password
                }));

                window.location = "/";
            } else {
                alert("Internal error while authenticating… Probably a configuration issue.");

                this.setState({
                    loading: false,
                    password: "",
                    attempt: this.state.attempt + 1
                });

                ReactDOM.findDOMNode(this.refs.password).focus();
            }
        };

        xhr.send();
    }

    _onChange() {
        this.setState({
            username: ReactDOM.findDOMNode(this.refs.username).value,
            password: ReactDOM.findDOMNode(this.refs.password).value
        });
    }
}

export default Login;