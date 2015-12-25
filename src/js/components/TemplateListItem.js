import React from "react";
import { Link } from "react-router";

class TemplateListItem extends React.Component {
    render() {
        return (
            <li>
                <Link to={"/templates/" + this.props.template.id}>
                    {this.props.template.name}
                </Link>

                <div className="list-actions">
                    <button className="list-action-delete">
                        <i className="fa fa-times" />
                    </button>
                </div>
            </li>
        )
    }
}

export default TemplateListItem;

