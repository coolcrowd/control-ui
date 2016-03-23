import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";
import Combokeys from "combokeys";
import ShortcutHelp from "./ShortcutHelp";
import classNames from "classnames";

/**
 * @author Niklas Keller
 */
class App extends React.Component {
    constructor() {
        super();

        this.combokeys = new Combokeys(document.body);
        this.state = {
            shortcutHelp: false,
            screen: false
        };
    }

    componentDidMount() {
        this.combokeys.bind("?", () => this.setState({shortcutHelp: true, screen: false}));
        this.combokeys.bind("esc", () => this.setState({shortcutHelp: false, screen: false}));
        this.combokeys.bind("g h", () => this.props.history.replaceState(null, "/"));
        this.combokeys.bind("g e", () => this.props.history.replaceState(null, "/experiments"));
        this.combokeys.bind("g t", () => this.props.history.replaceState(null, "/templates"));
        this.combokeys.bind("g n", () => this.props.history.replaceState(null, "/notifications"));
        this.combokeys.bind("g c", () => this.props.history.replaceState(null, "/calibrations"));
        this.combokeys.bind("up up down down left right left right b a", () => this.setState({shortcutHelp: false, screen: true}));
    }

    componentWillUnmount() {
        this.combokeys.detach();
    }

    render() {
        let logoutButton = this.props.authentication ? (
            <button type="button" className="logout" onClick={this._onLogout.bind(this)}>
                <i className="fa fa-power-off icon"/>
            </button>
        ) : null;

        let titles = (
            <div className="titles-overlay">
                <div className="titles-logo">
                    <img src="/img/logo.png" width="400" height="96" alt="CrowdControl" title="CrowdControl"/>
                </div>

                <div className="titles">
                    <div className="titles-content">
                        <p className="center">
                            A long time ago in a galaxy far, far away …
                        </p>

                        <p className="center">
                            … six team members created a software called CrowdControl.
                        </p>

                        <p>
                            It's a beautiful piece of software designed to publish experiments to crowdworking platforms
                            like Amazon Mechanical Turk and PyBossa.
                        </p>

                        <p>
                            There are templates, calibrations and keyboard shortcuts built into the software. It's also
                            possible to receive notifications which can be defined with the full power of SQL.
                        </p>

                        <br />

                        <p className="center">
                            To error is human, to fuck up takes root privileges.
                            <br /><br />
                            (unknown)
                        </p>
                    </div>
                </div>
            </div>
        );

        if (!this.state.screen) {
            titles = null;
        }

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
                            <li>
                                <Link to="/experiments"
                                      className={classNames({"selected": this.props.location.pathname == "/experiments"})}
                                      onClick={this._switchMobile.bind(this)}>Experiments</Link>
                            </li>
                            <li>
                                <Link to="/templates"
                                      className={classNames({"selected": this.props.location.pathname == "/templates"})}
                                      onClick={this._switchMobile.bind(this)}>Templates</Link>
                            </li>
                            <li>
                                <Link to="/notifications"
                                      className={classNames({"selected": this.props.location.pathname == "/notifications"})}
                                      onClick={this._switchMobile.bind(this)}>Notifications</Link>
                            </li>
                            <li>
                                <Link to="/calibrations"
                                      className={classNames({"selected": this.props.location.pathname == "/calibrations"})}
                                      onClick={this._switchMobile.bind(this)}>Calibrations</Link>
                            </li>
                        </ul>

                        {logoutButton}
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

                {titles}

                <div className="max-width">
                    <div className="content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }

    _onLogout() {
        localStorage.removeItem("crowdcontrol:credentials");
        window.location = "/login";
    }

    _switchMobile() {
        ReactDOM.findDOMNode(this.refs.mobileSwitch).checked = false;
    }
}

export default App;