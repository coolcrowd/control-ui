import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";

class App extends React.Component {
    render() {
        return (
            <div>
                <input type="checkbox" id="mobile-menu-switch" className="no-display" ref="mobileSwitch"/>

                <div className="menu">
                    <div className="max-width">
                        <label id="mobile-menu-button" htmlFor="mobile-menu-switch">
                            <i className="fa fa-bars"/>
                        </label>

                        <h2><Link to="/" onClick={this._switchMobile.bind(this)}>CrowdControl</Link></h2>
                        {/* change the <a>s to <Link>s */}
                        <ul>
                            <li><Link to="/experiments" onClick={this._switchMobile.bind(this)}>Experiments</Link></li>
                            <li><Link to="/templates" onClick={this._switchMobile.bind(this)}>Templates</Link></li>
                            <li><Link to="/notifications" onClick={this._switchMobile.bind(this)}>Notifications</Link></li>
                        </ul>

                        <button type="button" className="logout" onClick={this._onLogout.bind(this)}>
                            <i className="fa fa-power-off icon"/>
                        </button>
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