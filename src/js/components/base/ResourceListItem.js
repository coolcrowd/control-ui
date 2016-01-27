import React from "react";
import { Link } from "react-router";
import ResourceAction from "./ResourceAction";

class ResourceListItem extends React.Component {
    render() {
        return (
            <li>
                <Link to={this.props.basepath + "/" + this.props.item.id}>
                    {this.props.item.name || this.props.item.title}
                </Link>

                <div className="list-actions">
                    <Link className="action" to={this.props.basepath + "/" + this.props.item.id + "/edit"}>
                        <i className="fa fa-pencil icon"/>
                        Edit
                    </Link>

                    <ResourceAction icon="trash" method="delete" uri={this.props.basepath.substring(1) + "/" + this.props.item.id}
                                    onClick={() => window.confirm("Do you really want to delete this item?")}
                                    onSuccess={() => this.props.onDelete(this.props.item.id)}
                                    onError={() => window.alert("Could not delete this item!")}
                                    backend={this.props.backend}>
                        Delete
                    </ResourceAction>
                </div>
            </li>
        );
    }
}

export default ResourceListItem;