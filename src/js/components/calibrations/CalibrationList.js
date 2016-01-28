import React from "react";
import history from "../../history";
import ResourceList from "./../base/ResourceList";

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
}

export default CalibrationList;