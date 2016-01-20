import React from "react";
import history from "../../history";
import Loader from "../../core/Loader";
import DataComponent from "./../base/DataComponent";
import ResourceListItem from "./ResourceListItem";
import DataError from "./DataError";

class ResourceList extends DataComponent {
    componentWillReceiveProps(next) {
        // TODO: Implement pagination...
    }

    render() {
        if (this.state.loaded && this.state.failed) {
            return (
                <DataError />
            );
        }

        let children = this.state.loaded ? (this.state.data.items || []).map((item) => {
            return (
                <ResourceListItem key={item.id} item={item} basepath={this.props.location.pathname}
                                  onDelete={this._onDelete.bind(this)} backend={this.props.backend}/>
            );
        }) : [];

        let info = this.getInfo();

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

        return (
            <div>
                <div className="actions">
                    <button className="action action-constructive" onClick={this._onCreate.bind(this)}>
                        <i className="fa fa-plus icon"/> Create
                    </button>
                </div>

                <h1>{info.headline}</h1>

                <p className="info">
                    {info.description}
                </p>

                <br/>

                <Loader loaded={this.state.loaded} className="loader">
                    <ul className="list">
                        {children}
                    </ul>
                </Loader>
            </div>
        );
    }

    _onCreate() {
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