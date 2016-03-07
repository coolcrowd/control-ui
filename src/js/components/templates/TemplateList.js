import React from "react";
import history from "../../history";
import ResourceList from "./../base/ResourceList";
import Action from "../base/Action";
import ResourceAction from "../base/ResourceAction";

/**
 * @author Niklas Keller
 */
class TemplateList extends ResourceList {
    getCollectionUri(query) {
        if (typeof query !== "undefined") {
            return "templates?" + query;
        }

        return "templates";
    }

    getInfo() {
        return {
            icon: "bolt",
            headline: "Templates",
            description: "Create templates to ease the creation of similar tasks. " +
            "Changes to templates will only affect new experiments to keep your already existing ones in the known state."
        }
    }

    renderItemActions() {
        // this method will be rebound to ResourceListItem and executes in its context

        let onClick = function () {
            history.replaceState({
                template: this.props.item
            }, "/experiments/new");
        };

        return [
            (
                <Action icon="clone" onClick={onClick.bind(this)}>Use</Action>
            ),
            (
                <Action icon="pencil" href={this.props.basepath + "/" + this.props.item.id + "/edit"}>Edit</Action>
            ),
            (
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
            )
        ];
    }
}

export default TemplateList;