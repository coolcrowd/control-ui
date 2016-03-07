import React from "react";
import { Link } from "react-router";
import history from "../../history";
import ResourceList from "./../base/ResourceList";
import Action from "../base/Action";
import ResourceAction from "../base/ResourceAction";

/**
 * @author Niklas Keller
 */
class ExperimentList extends ResourceList {
    getCollectionUri(query) {
        if (typeof query !== "undefined") {
            return "experiments?" + query;
        }

        return "experiments";
    }

    getInfo() {
        return {
            icon: "flask",
            headline: "Experiments",
            description: "Experiments are creative tasks. " +
            "Workers can give answers to these tasks and rate previous answers from other workers. " +
            "Multiple platforms can be used to publish these tasks."
        }
    }

    renderActions() {
        let actions = super.renderActions();

        actions.push(
            <Link className="action action-constructive" to="/templates">
                <i className="fa fa-clone icon"/>
                Create from template…
            </Link>
        );

        return actions;
    }

    renderItemActions() {
        // this method will be rebound to ResourceListItem and executes in its context

        let onClick = function () {
            history.replaceState({
                experiment: this.props.item
            }, "/experiments/new");
        };

        console.log(this);

        return [
            (
                <Action icon="clone" onClick={onClick.bind(this)}>Clone</Action>
            ),
            (
                <Action icon="pencil" href={this.props.basepath + "/" + this.props.item.id + "/edit"}
                        disabled={this.props.item.state !== "DRAFT"}>
                    Edit
                </Action>
            ),
            this.props.item.state === "DRAFT" || this.props.item.state === "STOPPED" ? (
                <ResourceAction icon="trash" method="delete"
                                uri={this.props.basepath.substring(1) + "/" + this.props.item.id}
                                onClick={() => window.confirm("Do you really want to delete this item?")}
                                onSuccess={() => this.props.onDelete(this.props.item.id)}
                                onError={(e) => {
                                        let error = typeof e === "object" && "data" in e ? e.data.detail : "Unknown error.";
                                        window.alert("Could not delete this item! " + error);
                                    }}
                                backend={this.props.backend}>
                    Delete
                </ResourceAction>
            ) : (
                <Action icon="trash" href={this.props.basepath + "/" + this.props.item.id + "/edit"}
                        disabled={true}
                        title="Experiments can only be deleted when in draft state or completely stopped!">
                    Delete
                </Action>
            )
        ];
    }
}

export default ExperimentList;