import React from "react";
import history from "../../history";
import ResourceList from "./../base/ResourceList";

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
}

export default TemplateList;