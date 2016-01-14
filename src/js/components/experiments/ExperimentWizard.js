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

        let nonTemplate = {
            description: {
                type: "longtext",
                label: "Description",
                help: "Description of the creative task."
            },
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
            }
        };

        if (this.state.loaded && !this.state.failed && !this.state.new) {
            let text = this.state.data.description;
            let placeholders = Template.parse(text);

            if (Object.keys(placeholders).length > 0) {
                Object.keys(placeholders).forEach((name) => {
                    base["placeholder[" + name + "]"] = {
                        type: placeholders[name].type,
                        label: name,
                        help: placeholders[name].description
                    };
                });
            } else {
                Object.assign(base, nonTemplate);
            }
        } else {
            Object.assign(base, nonTemplate);
        }

        Object.assign(base, {
            paymentBase: {
                type: "number",
                label: "Base Payment",
                help: "Basic payment a worker gets for completing a task.",
                unit: "cents"
            },
            paymentAnswer: {
                type: "number",
                label: "Answer Payment",
                help: "Payment for each creative answer.",
                unit: "cents"
            },
            paymentRating: {
                type: "number",
                label: "Rating Payment",
                help: "Payment for each rating.",
                unit: "cents"
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