import React from "react";
import Template from "../../core/Template";
import Wizard from "../base/Wizard";

class ExperimentWizard extends Wizard {
    constructor() {
        super();

        this.state = Object.assign(this.state || {}, {
            algorithms: {
                taskChooserAlgorithms: [],
                ratingQualityAlgorithms: [],
                answerQualityAlgorithms: []
            }
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.fetchAlgorithms();
    }

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
                    base["placeholders[" + name + "]"] = {
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

        let algorithmMapper = (chooser) => {
            return {
                value: chooser.name,
                text: chooser.description
            };
        };

        let algorithmOptions = (formName, specName) => {
            let current = this.state.form[formName] ? this.state.form[formName].name : null;
            let availableAlgorithms = this.state.algorithms[specName];

            for (let key in availableAlgorithms) {
                if (availableAlgorithms[key].name !== current) {
                    continue;
                }

                let parameters = availableAlgorithms[key].parameters || [];

                parameters.map((item) => {
                    base["algorithmTaskChooser[parameters][]"] = {
                        type: "text",
                        label: item.description,
                        help: <span>Parameter for <b>{availableAlgorithms[key].name}</b>.</span>,
                        value: item.value || "",
                        encoder: (value) => {
                            return Object.assign(item, {
                                value: value
                            });
                        }
                    }
                })
            }
        };

        base["algorithmTaskChooser[name]"] = {
            type: "enum",
            label: "Task Chooser Algorithm",
            help: "How should tasks be chosen?",
            values: this.state.algorithms.taskChooserAlgorithms.map(algorithmMapper)
        };

        Object.assign(base, algorithmOptions("algorithmTaskChooser", "taskChooserAlgorithms"));

        base["algorithmQualityAnswer[name]"] = {
            type: "enum",
            label: "Answer Quality Algorithm",
            help: "How should the quality of an answer be determined?",
            values: this.state.algorithms.answerQualityAlgorithms.map(algorithmMapper)
        };

        Object.assign(base, algorithmOptions("algorithmQualityAnswer", "answerQualityAlgorithms"));

        base["algorithmQualityRating[name]"] = {
            type: "enum",
            label: "Rating Quality Algorithm",
            help: "How should the quality of a rating be determined?",
            values: this.state.algorithms.ratingQualityAlgorithms.map(algorithmMapper)
        };

        Object.assign(base, algorithmOptions("algorithmQualityRating", "ratingQualityAlgorithms"));

        Object.assign(base, {
            state: {
                type: "hidden",
                value: "DRAFT"
            },
            neededAnswers: {
                type: "number",
                label: "Needed Answers",
                help: "How many creative answers should be collected?",
                default: 10
            },
            answersPerWorker: {
                type: "number",
                label: "Answers / Worker",
                help: "How many answers should each worker be able to give?",
                default: 3
            },
            ratingsPerWorker: {
                type: "number",
                label: "Ratings / Worker",
                help: "How many ratings should each worker be able to give?",
                default: 3
            },
            ratingsPerAnswer: {
                type: "number",
                label: "Ratings / Answer",
                help: "How many ratings should each answer receive?",
                default: 3
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
                unit: "cents",
                default: 10
            },
            paymentRating: {
                type: "number",
                label: "Rating Payment",
                help: "Payment for each rating.",
                unit: "cents",
                default: 10
            },
            ratingOptions: {
                type: "hidden",
                value: "",
                encoder: () => [
                    {name: "good", value: 10},
                    {name: "bad", value: 0}
                ]
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

    fetchAlgorithms() {
        this.props.backend.request("GET", "algorithms").then((response) => {
            this.setState({
                algorithms: {
                    taskChooserAlgorithms: response.data.taskChooserAlgorithms || [],
                    ratingQualityAlgorithms: response.data.ratingQualityAlgorithms || [],
                    answerQualityAlgorithms: response.data.answerQualityAlgorithms || []
                }
            });
        }).catch(() => {
            this.setState({
                failed: true
            });
        });
    }
}

export default ExperimentWizard;