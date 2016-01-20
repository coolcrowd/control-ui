import React from "react";
import ReactDOM from "react-dom";
import CSSTransitionGroup from "react-addons-css-transition-group";
import config from "../config.js";

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
            <CSSTransitionGroup transitionName="shake" transitionEnterTimeout={700} transitionLeaveTimeout={100}>
                <form key={key} className="login-form" onSubmit={this._onSubmit.bind(this)}>
                    <h1>Login</h1>

                    <div className="input">
                        <label className="input-label">Username</label>
                        <input autoFocus type="text" ref="username" value={this.state.username} onChange={this._onChange.bind(this)}/>
                    </div>

                    <div className="input">
                        <label className="input-label">Password</label>
                        <input type="password" ref="password" value={this.state.password} onChange={this._onChange.bind(this)}/>
                    </div>

                    <div className="login-submit">
                        <button className="action" type="submit" disabled={this.state.loading}>
                            Login
                        </button>
                    </div>
                </form>
            </CSSTransitionGroup>
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
            } else {
                window.localStorage.setItem("credentials", JSON.stringify({
                    username: username,
                    password: password
                }));

                window.location = "/";
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