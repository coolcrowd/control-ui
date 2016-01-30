import React from "react";
import Template from "../../core/Template";
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
            },
            placeholders: {
                type: "hidden",
                value: "",
                encoder: () => {
                    return {};
                }
            }
        };

        if (this.state.loaded && !this.state.failed) {
            let isTemplate = this.state.new && this.props.location.state && "template" in this.props.location.state || this.state.data && "templateId" in this.state.data;

            if (isTemplate) {
                let text;

                if (this.state.new && this.props.location.state && "template" in this.props.location.state) {
                    let template = this.props.location.state.template;
                    text = template.content;

                    Object.assign(base, {
                        description: {
                            type: "hidden",
                            value: text
                        },
                        answerType: {
                            type: "hidden",
                            value: template.answerType
                        },
                        templateId: {
                            type: "hidden",
                            value: template.id,
                            encoder: parseInt
                        }
                    });
                } else {
                    text = this.state.data.description;
                }

                let placeholders = Template.parse(text);

                Object.keys(placeholders).forEach((name) => {
                    base["placeholder[" + name + "]"] = {
                        type: placeholders[name].type,
                        label: name,
                        help: placeholders[name].description
                    };
                });

                if (Object.keys(placeholders).length === 0) {
                    base["placeholders"] = {
                        type: "hidden",
                        value: "",
                        encoder: () => {
                            return {};
                        }
                    }
                }
            } else {
                Object.assign(base, nonTemplate);
            }
        } else {
            Object.assign(base, nonTemplate);
        }

        Object.assign(base, {
            state: {
                type: "hidden",
                value: "DRAFT"
            },
            neededAnswers: {
                type: "number",
                label: "Needed Answers",
                help: "How many creative answers should be collected?"
            },
            answersPerWorker: {
                type: "number",
                label: "Answers / Worker",
                help: "How many answers should each worker be able to give?"
            },
            ratingsPerWorker: {
                type: "number",
                label: "Ratings / Worker",
                help: "How many ratings should each worker be able to give?"
            },
            ratingsPerAnswer: {
                type: "number",
                label: "Ratings / Answer",
                help: "How many ratings should each answer receive?"
            },
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
                type: "longtext",
                label: "Constraints",
                help: "Constraints that should be matched by all creative answers.",
                encoder: (text) => text.split("\n").map((item) => item.trim()).filter((item) => item !== "").map((item) => {
                    return {name: item}
                }),
                decoder: (items) => items.map((item) => item.name).join("\n")
            },
            tags: {
                type: "text",
                label: "Tags",
                help: "Tags! TODO…", // TODO
                encoder: (text) => text.split(",").map((item) => item.trim()).filter((item) => item !== "").map((item) => {
                    return {name: item}
                }),
                decoder: (items) => items.map((item) => item.name).join(", ")
            },
            populations: {
                type: "hidden",
                value: "",
                encoder: () => []
            },
            workerQualityThreshold: {
                type: "number",
                label: "Worker Quality Threshold",
                help: "Minimum worker quality to participate in this experiment. Values from 0 to 9."
            }
        });

        return base;
    }

    getCollectionUri(query) {
        if (typeof query !== "undefined") {
            return "experiments?" + query;
        }

        return "experiments";
    }
}

export default ExperimentWizard;