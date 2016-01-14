import React from "react";
import history from "../../history";
import Backend from "../../core/Backend";
import Loader from "../../core/Loader";
import ResourceList from "./../base/ResourceList";

class TemplateList extends ResourceList {
    getDataUri() {
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