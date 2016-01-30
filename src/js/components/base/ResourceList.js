import React from "react";
import ReactDOM from "react-dom";
import history from "../../history";
import Loader from "../../core/Loader";
import DataComponent from "./../base/DataComponent";
import ResourceListItem from "./ResourceListItem";
import DataError from "./DataError";
import Combokeys from "combokeys";

class ResourceList extends DataComponent {
    constructor() {
        super();

        this.combokeys = new Combokeys(document.body);
    }

    componentDidMount() {
        this.combokeys.bind("j", this._onPrev.bind(this));
        this.combokeys.bind("k", this._onNext.bind(this));
        this.combokeys.bind("n", () => {
            this._onAdd();
            return false;
        });

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
        return "[override-this]";
    }

    getItemUri(id) {
        return this.getCollectionUri() + "/" + id;
    }

    render() {
        if (this.state.loaded && this.state.failed) {
            return (
                <DataError />
            );
        }

        let info = this.getInfo();

        let children = this.state.loaded ? (this.state.data.items || []).map((item) => {
            return (
                <ResourceListItem key={item.id} item={item} basepath={this.props.location.pathname}
                                  onDelete={this._onDelete.bind(this)} backend={this.props.backend}
                                  editable={"editable" in info ? info.editable : true}
                                  renderAdditionalAction={this.renderAdditionalItemAction}/>
            );
        }) : [];

        if (children.length === 0) {
            children = [(
                <li className="list-empty">
                    <i className={"fa fa-3x fa-" + info.icon}/>
                    <br/>
                    You have no {info.headline.toLowerCase()} yet!<br/>
                    Let's change that!
                </li>
            )];
        }

        let additionalAction = this.renderAdditionalAction();

        return (
            <div>
                <div className="actions">
                    {additionalAction}

                    <button className="action action-constructive" onClick={this._onAdd.bind(this)}>
                        <i className="fa fa-plus icon"/> Create
                    </button>
                </div>

                <h1>{info.headline}</h1>

                <p className="info">
                    {info.description}
                </p>

                <br/>

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

    renderAdditionalAction() {
        return null;
    }

    renderAdditionalItemAction() {
        return null;
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

    _onAdd() {
        history.replaceState(null, this.props.location.pathname + "/new");
    }

    _onDelete(id) {
        let items = this.state.data.items.filter(function (i) {
            return i.id !== id;
        });

        let data = this.state.data;
        data.items = items;

        this.setState({
            data: data
        });
    }
}

export default ResourceList;