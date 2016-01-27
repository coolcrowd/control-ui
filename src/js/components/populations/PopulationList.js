import React from "react";
import history from "../../history";
import ResourceList from "./../base/ResourceList";

class PopulationList extends ResourceList {
    getCollectionUri(query) {
        if (typeof query !== "undefined") {
            return "populations?" + query;
        }

        return "populations";
    }

    getInfo() {
        return {
            icon: "users",
            headline: "Populations",
            description: "Create populations to restrict experiments on a platform to a certain user group."
        }
    }
}

export default PopulationList;