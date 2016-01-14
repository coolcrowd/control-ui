import React from "react";
import { Link } from "react-router";
import ResourceAction from "./ResourceAction";

class ResourceListItem extends React.Component {
    render() {
        return (
            <li>
                <Link to={this.props.basepath + "/" + this.props.item.id}>
                    {"name" in this.props.item ? this.props.item.name : this.props.item.title}
                </Link>

                <div className="list-actions">
                    <ResourceAction icon="trash" method="delete" uri={"templates/" + this.props.item.id}
                                    onClick={() => window.confirm("Do you really want to delete this item?")}
                                    onSuccess={() => this.props.onDelete(this.props.item.id)}
                                    onError={() => window.alert("Could not delete this item!")}>
                        Delete
                    </ResourceAction>
                </div>
            </li>
        );
    }
}

export default ResourceListItem;

