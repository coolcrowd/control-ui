import React from "react";
import history from "../../history";
import ResourceList from "./../base/ResourceList";
import ResourceAction from "../base/ResourceAction";

/**
 * @author Niklas Keller
 */
class CalibrationList extends ResourceList {
    getCollectionUri(query) {
        if (typeof query !== "undefined") {
            return "calibrations?" + query;
        }

        return "calibrations";
    }

    getInfo() {
        return {
            icon: "users",
            headline: "Calibrations",
            description: "Create calibrations to restrict experiments on a platform to a certain user group."
        }
    }

    renderItemActions() {
        // this method will be rebound to ResourceListItem and executes in its context

        return [
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
        ];
    }
}

export default CalibrationList;