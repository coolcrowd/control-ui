import React from "react";
import history from "../../history";
import ResourceList from "./../base/ResourceList";

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
}

export default ExperimentList;