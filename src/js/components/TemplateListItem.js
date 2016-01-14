import React from "react";
import { Link } from "react-router";
import ResourceAction from "./ResourceAction";

class TemplateListItem extends React.Component {
    render() {
        return (
            <li>
                <Link to={"/templates/" + this.props.template.id}>
                    {this.props.template.name}
                </Link>

                <div className="list-actions">
                    <ResourceAction icon="trash" method="delete" uri={"templates/" + this.props.template.id}
                                    onClick={() => window.confirm("Do you really want to delete this template?")}
                                    onSuccess={() => this.props.onDelete(this.props.template.id)}
                                    onError={() => window.alert("Could not delete template!")}>
                        Delete
                    </ResourceAction>
                </div>
            </li>
        );
    }
}

export default TemplateListItem;

