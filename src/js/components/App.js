import React from "react";
import { Link } from "react-router";

class App extends React.Component {
    render() {
        return (
            <div>
                <div className="menu">
                    <div className="max-width">
                        <h1><Link to="/">CrowdControl</Link></h1>
                        {/* change the <a>s to <Link>s */}
                        <ul>
                            <li><Link to="/experiments">Experiments</Link></li>
                            <li><Link to="/templates">Templates</Link></li>
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