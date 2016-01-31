import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";
import history from "../../../history";
import ResourceListItem from "./../../base/ResourceListItem";
import DataError from "./../../base/DataError";
import DataComponent from "./../../base/DataComponent";
import Combokeys from "combokeys";
import Loader from "../../../core/Loader";

class AnswerList extends DataComponent {
    constructor() {
        super();

        this.combokeys = new Combokeys(document.body);
    }

    componentDidMount() {
        this.combokeys.bind("j", this._onPrev.bind(this));
        this.combokeys.bind("k", this._onNext.bind(this));

        return super.componentDidMount();
    }

    componentWillUnmount() {
        this.combokeys.detach();

        return super.componentWillUnmount();
    }

    componentWillReceiveProps(next) {
        if (next.location.query !== this.props.location.query) {
            // trigger after new props are applied
            setTimeout(this.fetchData.bind(this), 1);
        }
    }

    getDataUri() {
        return this.getCollectionUri(this.getQueryString());
    }

    getQueryString() {
        let from = encodeURIComponent(this.props.location.query.from || "0");
        let asc = encodeURIComponent(this.props.location.query.asc || "true");

        return "from=" + from + "&asc=" + asc;
    }

    getCollectionUri(query) {
        if (typeof query !== "undefined") {
            return "experiments/" + this.props.params.id + "/answers?" + query;
        }

        return "experiments/" + this.props.params.id + "/answers";
    }

    render() {
        if (this.state.loaded && this.state.failed) {
            return (
                <DataError />
            );
        }

        let children = this.state.loaded ? (this.state.data.items || []).map((item) => {
            return (
                <div>

                </div>
            );
        }) : [];

        if (children.length === 0) {
            children = [(
                <li className="list-empty">
                    <i className={"fa fa-3x fa-file-text-o"}/>
                    <br/>
                    You have no creative answers yet!
                </li>
            )];
        }

        return (
            <div>
                <div className="actions">
                    <button className="action" onClick={this._onRefresh.bind(this)}>
                        <i className="fa fa-refresh icon"/> Refresh
                    </button>
                </div>

                <h1>Creative answers</h1>

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
            </div>
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
        history.replaceState(null, this.props.location.pathname + "?from=" + from + "&asc=" + asc);
    }

    _onPrev() {
        if (!("prev" in this.state.meta.links)) {
            return;
        }

        let from = encodeURIComponent(this.state.meta.links.prev.from || "0");
        let asc = encodeURIComponent(this.state.meta.links.prev.asc || "true");
        history.replaceState(null, this.props.location.pathname + "?from=" + from + "&asc=" + asc);
    }

    _onRefresh() {
        this.setState({
            loaded: false,
            failed: false,
            data: null
        });

        this.fetchData();
    }
}

export default AnswerList;