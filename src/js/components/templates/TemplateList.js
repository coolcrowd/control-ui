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
            headline: "Templates",
            description: "Info about templates …"
        }
    }
}

export default TemplateList;