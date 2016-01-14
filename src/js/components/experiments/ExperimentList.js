import React from "react";
import history from "../../history";
import Backend from "../../core/Backend";
import Loader from "../../core/Loader";
import ResourceList from "./../base/ResourceList";

class ExperimentList extends ResourceList {
    getDataUri() {
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