import React from "react";

/**
 * Shows that an error occurred while loading data.
 * @author Niklas Keller
 */
class DataError extends React.Component {
    /**
     * React hook to render the component.
     * @returns {XML}
     */
    render() {
        return (
            <div>
                <h1>Error loading data …</h1>

                <p>
                    The page you were looking for could not be loaded.<br/><br/>
                </p>

                <p style={{textAlign: "center"}}>
                    <button type="button" onClick={this._onClick.bind(this)} className="action">
                        <i className="fa fa-refresh icon"/>
                        Reload
                    </button>
                </p>
            </div>
        );
    }

    /**
     * Handles clicks to the refresh button. Reloads the page.
     */
    _onClick() {
        window.location.reload(true);
    }
}

export default DataError;