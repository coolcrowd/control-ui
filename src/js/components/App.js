import React from "react";
import { Link } from "react-router";

class App extends React.Component {
    render() {
        return (
            <div>
                <input type="checkbox" id="mobile-menu-switch" className="no-display"/>

                <div className="menu">
                    <div className="max-width">
                        <label id="mobile-menu-button" htmlFor="mobile-menu-switch">
                            <i className="fa fa-bars"/>
                        </label>

                        <h2><Link to="/">CrowdControl</Link></h2>
                        {/* change the <a>s to <Link>s */}
                        <ul>
                            <li><Link to="/experiments">Experiments</Link></li>
                            <li><Link to="/templates">Templates</Link></li>
                            <li><Link to="/notifications">Notifications</Link></li>
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
}

export default App;