import React from "react";
import RestrictionList from "./RestrictionList";
import Restriction from "./Restriction";
import classNames from "classnames";

/**
 * @author Niklas Keller
 */
class PlatformWizardItem extends React.Component {
    constructor() {
        super();

        this.state = {
            calibrationList: false
        }
    }

    render() {
        let restrictions = this.props.restrictions.map((item) => <Restriction key={item.id} item={item}
                                                                              onChange={this.props.onChange}/>);

        if (restrictions.length > 0) {
            restrictions = (
                <div className="restrictions">
                    <h4>Restricted to:</h4>

                    {restrictions}
                </div>
            );
        }

        let restrictionsDialog = this.state.calibrationList ? (
            <div className={classNames({
                        "dialog-overlay": true,
                        "dialog-visible": this.state.calibrationList
                    })}>
                <div className="dialog">
                    <div className="dialog-title">
                        <h2>Restrictions</h2>
                        <button type="button" className="dialog-close"
                                onClick={() => this.setState({calibrationList: false})}>
                            <i className="fa fa-times"/>
                        </button>
                    </div>
                    <div className="dialog-content">
                        <RestrictionList backend={this.props.backend}
                                         onNew={this._onNewRestriction.bind(this)}/>
                    </div>
                </div>
            </div>
        ) : null;

        return (
            <li className="platform">
                <label className="platform-name">
                    <input type="checkbox" checked={this.props.enabled} disabled={this.props.item.isInactive} onChange={this.props.onToggle}/>
                    <h4>{this.props.item.name}</h4>
                </label>

                <div className="list-actions">
                    <button type="button" className="action" onClick={this._onRestrictClick.bind(this)}
                            disabled={!this.props.item.hasCalibrations}
                            title={this.props.item.hasCalibrations ? "" : "This platform doesn't support restrictions."}>
                        <i className={"fa fa-child icon"}/>
                        Restrict
                    </button>
                </div>

                {restrictions}

                {restrictionsDialog}
            </li>
        );
    }

    /**
     * Executed when the "restrict" button is clicked.
     * @private
     */
    _onRestrictClick() {
        this.setState({
            calibrationList: true
        });
    }

    /**
     * Adds a new calibration and enables the platform if not already enabled.
     * @private
     */
    _onNewRestriction(item) {
        this.setState({
            calibrationList: false
        });

        if (!this.props.enabled) {
            this.props.onToggle();
        }

        this.props.onNew(item);
    }
}

export default PlatformWizardItem;