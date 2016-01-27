import React from "react";
import Loader from "../../core/Loader";
import Wizard from "../base/Wizard";

class PopulationWizard extends Wizard {
    getForm() {
        return {
            name: {
                type: "text",
                label: "Name",
                help: "Internal name of this population."
            },
            question: {
                type: "text",
                label: "Question",
                help: "Question showed to the worker."
            },
            answers: {
                type: "longtext",
                label: "Possible answers",
                help: "List all possible answers to this question, each on a separate line. Accepted answers will be chosen when you start an experiment.",
                encoder: (text) => text.split("\n").map((item) => item.trim()).filter((item) => item.trim() !== "")
            }
        };
    }

    getCollectionUri(query) {
        if (typeof query !== "undefined") {
            return "populations?" + query;
        }

        return "populations";
    }
}

export default PopulationWizard;