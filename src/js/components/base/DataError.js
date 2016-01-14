import React from "react";

class DataError extends React.Component {
    render() {
        return (
            <div>
                <h1>Error loading data …</h1>

                <p>
                    The page you were looking for could not be loaded.<br/><br/>
                </p>

                <p style={{textAlign: "center"}}>
                    <button type="button" onClick={this._onClick.bind(this)} className="resource-action">
                        <i className="fa fa-refresh icon"/>
                        Reload
                    </button>
                </p>
            </div>
        );
    }

    _onClick() {
        window.location.reload(true);
    }
}

export default DataError;