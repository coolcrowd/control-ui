import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";
import Combokeys from "combokeys";
import ShortcutHelp from "./ShortcutHelp";
import classNames from "classnames";

class App extends React.Component {
    constructor() {
        super();

        this.combokeys = new Combokeys(document.body);
        this.state = {
            shortcutHelp: false
        };
    }

    componentDidMount() {
        this.combokeys.bind("?", () => this.setState({shortcutHelp: true}));
        this.combokeys.bind("esc", () => this.setState({shortcutHelp: false}));
        this.combokeys.bind("g h", () => this.props.history.replaceState(null, "/"));
        this.combokeys.bind("g e", () => this.props.history.replaceState(null, "/experiments"));
        this.combokeys.bind("g t", () => this.props.history.replaceState(null, "/templates"));
        this.combokeys.bind("g n", () => this.props.history.replaceState(null, "/notifications"));
    }

    componentWillLeave() {
        this.combokeys.detach();
    }

    render() {
        return (
            <div>
                <input type="checkbox" id="mobile-menu-switch" className="no-display" ref="mobileSwitch"/>

                <div className="menu">
                    <div className="max-width">
                        <label id="mobile-menu-button" htmlFor="mobile-menu-switch">
                            <i className="fa fa-bars"/>
                        </label>

                        <h2><Link to="/" onClick={this._switchMobile.bind(this)}
                                  className={classNames({"selected": this.props.location.pathname == "/"})}>
                            <img className="menu-logo" src="/img/logo.png" width="100" height="24" alt="CrowdControl"
                                 title="CrowdControl"/>
                        </Link></h2>

                        <ul>
                            <li><Link to="/experiments"
                                      className={classNames({"selected": this.props.location.pathname == "/experiments"})}
                                      onClick={this._switchMobile.bind(this)}>Experiments</Link></li>
                            <li><Link to="/templates"
                                      className={classNames({"selected": this.props.location.pathname == "/templates"})}
                                      onClick={this._switchMobile.bind(this)}>Templates</Link></li>
                            <li><Link to="/notifications"
                                      className={classNames({"selected": this.props.location.pathname == "/notifications"})}
                                      onClick={this._switchMobile.bind(this)}>Notifications</Link>
                            </li>
                        </ul>

                        <button type="button" className="logout" onClick={this._onLogout.bind(this)}>
                            <i className="fa fa-power-off icon"/>
                        </button>
                    </div>
                </div>

                {/* TODO: Refactor into component */}
                <div className={classNames({
                        "dialog-overlay": true,
                        "dialog-visible": this.state.shortcutHelp
                    })}>
                    <div className="dialog">
                        <div className="dialog-title">
                            <h2>Shortcuts</h2>
                            <button type="button" className="dialog-close"
                                    onClick={() => this.setState({shortcutHelp: false})}>
                                <i className="fa fa-times"/>
                            </button>
                        </div>
                        <div className="dialog-content">
                            <ShortcutHelp/>
                        </div>
                    </div>
                </div>

                <div className="max-width">
                    <div className="content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }

    _onLogout() {
        localStorage.removeItem("credentials");
        window.location = "/login";
    }

    _switchMobile() {
        ReactDOM.findDOMNode(this.refs.mobileSwitch).checked = false;
    }
}

export default App;