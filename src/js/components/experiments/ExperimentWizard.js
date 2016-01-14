import React from "react";
import Backend from "../../core/Backend";
import Template from "../../core/Template";
import Loader from "../../core/Loader";
import Wizard from "../base/Wizard";

class ExperimentWizard extends Wizard {
    getForm() {
        if (!this.state) {
            return {};
        }

        let base = {
            title: {
                type: "text",
                label: "Title",
                help: "Task name will be published on crowdworking platforms."
            }
        };

        let description = {
            type: "longtext",
            label: "Description",
            help: "Description of the creative task."
        };

        if (!this.state.loaded || this.state.failed || this.state.new) {
            base.description = description;
        } else {
            let text = this.state.data.description;
            let placeholders = Template.parse(text);

            if (Object.keys(placeholders).length === 0) {
                base.description = description;
            } else {
                Object.keys(placeholders).forEach((name) => {
                    base["placeholder[" + name + "]"] = {
                        type: placeholders[name].type,
                        label: name,
                        help: placeholders[name].description
                    };
                });
            }
        }

        Object.assign(base, {
            answerType: {
                type: "enum",
                label: "Answer Type",
                help: "Collect text or images from workers?",
                default: "TEXT",
                values: [
                    {
                        value: "TEXT",
                        text: "Text"
                    },
                    {
                        value: "IMAGE",
                        text: "Images"
                    }
                ]
            },
            paymentBase: {
                type: "number",
                label: "Base Payment",
                help: "Basic payment a worker gets for completing a task.",
                unit: "cent"
            },
            paymentAnswer: {
                type: "number",
                label: "Answer Payment",
                help: "Payment for each creative answer.",
                unit: "cent"
            },
            paymentRating: {
                type: "number",
                label: "Rating Payment",
                help: "Payment for each rating.",
                unit: "cent"
            },
            constraints: {
                type: "list",
                label: "Constraints",
                help: "Constraints that should be matched by all creative answers."
            },
            tags: {
                type: "list",
                label: "Tags",
                help: "Tags! TODO…" // TODO
            }
        });

        return base;
    }

    getDataUri() {
        return "experiments";
    }
}

export default ExperimentWizard;