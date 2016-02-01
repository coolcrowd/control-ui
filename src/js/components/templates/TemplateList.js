import React from "react";
import history from "../../history";
import ResourceList from "./../base/ResourceList";

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

    renderAdditionalItemAction() {
        // this method will be rebound to ResourceListItem and executes in its context

        let onClick = function () {
            history.replaceState({
                template: this.props.item
            }, "/experiments/new");
        };

        return (
            <button type="button" className="action" onClick={onClick.bind(this)}>
                <i className="fa fa-clone icon"/>
                Use
            </button>
        );
    }
}

export default TemplateList;