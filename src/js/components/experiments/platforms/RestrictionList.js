import React from "react";
import ReactDOM from "react-dom";
import history from "../../../history";
import Loader from "../../../core/Loader";
import DataComponent from "../../base/DataComponent";
import DataError from "../../base/DataError";

/**
 * @author Niklas Keller
 */
class RestrictionList extends DataComponent {
    constructor() {
        super();

        this.state = {
            url: "calibrations"
        };
    }

    getDataUri() {
        return this.state.url;
    }

    render() {
        if (this.state.loaded && this.state.failed) {
            return (
                <DataError />
            );
        }

        let children = this.state.loaded ? (this.state.data.items || []).map((item) => {
            return (
                <li className="restriction">
                    <span onClick={() => this.props.onNew(item)}>
                        {item.name}
                    </span>
                </li>
            );
        }) : [];

        if (children.length === 0) {
            children = [(
                <li className="list-empty">
                    <i className={"fa fa-3x fa-child"}/>
                    <br/>
                    You have no calibrations yet!<br/>
                    Let's change that!
                </li>
            )];
        }

        return (
            <Loader loaded={this.state.loaded} className="loader">
                <ul className="list" ref="list">
                    {children}
                </ul>

                <div style={{textAlign: "center", padding: "20px"}}>
                    <button className="action pagination pagination-prev" type="button"
                            disabled={!(this.state.loaded && "prev" in this.state.meta.links)}
                            onClick={this._onPrev.bind(this)}>
                        <i className="fa fa-angle-left icon"/>
                        previous
                    </button>

                    <button className="action pagination pagination-next" type="button"
                            disabled={!(this.state.loaded && "next" in this.state.meta.links)}
                            onClick={this._onNext.bind(this)}>
                        <i className="fa fa-angle-right icon"/>
                        next
                    </button>
                </div>
            </Loader>
        );
    }

    onFetched() {
        let node = ReactDOM.findDOMNode(this.refs.list);
        let bounds = node.getBoundingClientRect();

        if (bounds.top < 0) {
            window.scrollTo(0, node.offsetTop - 50);
        }
    }

    _onNext() {
        if (!("next" in this.state.meta.links)) {
            return;
        }

        let from = encodeURIComponent(this.state.meta.links.next.from || "0");
        let asc = encodeURIComponent(this.state.meta.links.next.asc || "true");

        this.setState({
            url: "calibration?from=" + from + "&asc=" + asc
        }, this.fetchData.bind(this));
    }

    _onPrev() {
        if (!("prev" in this.state.meta.links)) {
            return;
        }

        let from = encodeURIComponent(this.state.meta.links.prev.from || "0");
        let asc = encodeURIComponent(this.state.meta.links.prev.asc || "true");

        this.setState({
            url: "calibration?from=" + from + "&asc=" + asc
        }, this.fetchData.bind(this));
    }
}

export default RestrictionList;