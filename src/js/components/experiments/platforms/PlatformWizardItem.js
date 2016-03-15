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
                                                                              enabled={!this.props.item.isInactive}
                                                                              immutable={this.props.immutable}
                                                                              onChange={this.props.onChange}
                                                                              onRemove={this.props.onRemove}/>);

        if (restrictions.length > 0) {
            restrictions = (
                <div className="restrictions">
                    <h4>Restrictions</h4>
                    <div className="input-help">Selected properties will have to match before a worker can submit tasks to this experiment.</div>

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
                        <button type="button" className="dialog-close" disabled={this.props.immutable}
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

        let restrictionTitle = this.props.item.hasCalibrations ? "" : "This platform doesn't support restrictions.";

        if (this.props.item.isInactive) {
            restrictionTitle = "This platform is inactive and can no longer be modified.";
        }

        let platformTitle = this.props.item.isInactive ? "This platform is inactive and can no longer be modified." : "";
        platformTitle = this.props.immutable ? "This platform can't be modified, because the experiment was already published on it." : platformTitle;

        return (
            <li className={classNames({
                "platform": true,
                "platform-inactive": this.props.item.isInactive
            })}>
                <label className="platform-name">
                    <input type="checkbox" checked={this.props.enabled} disabled={this.props.item.isInactive || this.props.immutable}
                           onChange={this.props.onToggle}
                           title={platformTitle}/>
                    <h4 title={platformTitle}>{this.props.item.name}</h4>
                </label>

                <div className="list-actions">
                    <button type="button" className="action" onClick={this._onRestrictClick.bind(this)}
                            disabled={!this.props.item.hasCalibrations || this.props.item.isInactive || this.props.immutable}
                            title={restrictionTitle}>
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