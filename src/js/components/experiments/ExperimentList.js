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
            headline: "Experiments",
            description: "Info about experiments …"
        }
    }
}

export default ExperimentList;