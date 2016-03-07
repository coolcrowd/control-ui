import React from "react";
import { Link } from "react-router";
import ResourceAction from "./ResourceAction";

/**
 * @author Niklas Keller
 */
class ResourceListItem extends React.Component {
    render() {
        let actions = "actions" in this.props ? this.props.actions.call(this) : [];

        return (
            <li>
                <Link to={this.props.basepath + "/" + this.props.item.id}>
                    {this.props.item.name || this.props.item.title}
                </Link>

                <div className="list-actions">
                    {actions}
                </div>
            </li>
        );
    }
}

export default ResourceListItem;