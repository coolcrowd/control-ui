import React from "react";
import { Link } from "react-router";

class App extends React.Component {
    render() {
        return (
            <div>
                <input type="checkbox" id="mobile-menu-switch" className="no-display" />

                <div className="menu">
                    <div className="max-width">
                        <label id="mobile-menu-button" htmlFor="mobile-menu-switch">
                            <i className="fa fa-bars" />
                        </label>

                        <h2><Link to="/">CrowdControl</Link></h2>
                        {/* change the <a>s to <Link>s */}
                        <ul>
                            <li><Link to="/experiments">Experiments</Link></li>
                            <li><Link to="/templates">Templates</Link></li>
                            <li><Link to="/notifications">Notifications</Link></li>
                        </ul>
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
}

export default App;