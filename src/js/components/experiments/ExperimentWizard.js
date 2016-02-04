import React from "react";
import Template from "../../core/Template";
import Wizard from "../base/Wizard";
import DataError from "../base/DataError";

function encodeTextCollection(text, separator) {
    let items = text.split(separator);

    // Remove whitespace and empty elements
    items = items.map((item) => item.trim()).filter((item) => item !== "");

    if (items.length === 0) {
        // Special value to signal no elements, because proto can't differentiate
        // between default value and empty collection…
        return [
            {
                name: ""
            }
        ];
    }

    return items.map((item) => {
        return {
            name: item
        };
    });
}

/**
 * @author Niklas Keller
 */
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

        if (this.props.location.state && "experiment" in this.props.location.state) {
            let form = Wizard.decodeForm(this.props.location.state.experiment, this.getForm(), this.getDefaultForm());
            delete form.id;

            this.setState({
                form: form,
                data: form,
                loaded: true,
                failed: false
            });
        }
    }

    componentWillReceiveProps(next) {
        super.componentWillReceiveProps(next);

        if (this.props.location.state && "experiment" in this.props.location.state) {
            let form = Wizard.decodeForm(this.props.location.state.experiment, this.getForm(), this.getDefaultForm());
            delete form.id;

            this.setState({
                form: form,
                data: form,
                loaded: true,
                failed: false
            });
        }
    }

    getForm() {
        if (!this.state) {
            return {};
        }

        let qualityThresholdValues = [];

        for (let i = 0; i < 10; i++) {
            qualityThresholdValues.push({
                text: Math.round(100 * i / 9) + "%",
                value: i
            });
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

                if (this.state.new && this.props.location.state) {
                    let template;

                    if ("template" in this.props.location.state) {
                        template = this.props.location.state.template;
                    } else if ("experiment" in this.props.location.state) {
                        template = {
                            content: this.props.location.state.experiment.description,
                            answerType: this.props.location.state.experiment.answerType,
                            id: this.props.location.state.experiment.templateId
                        }
                    } else {
                        throw "Invalid state!";
                    }

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
                            decoder: (i) => i.value,
                            encoder: (i) => {
                                return {value: parseInt(i)};
                            }
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

                parameters.map((item, i) => {
                    base[formName + "[parameters][" + i + "][id]"] = {
                        type: "hidden",
                        value: item.id,
                        encoder: parseInt
                    };

                    base[formName + "[parameters][" + i + "][value]"] = {
                        type: "text",
                        label: item.description,
                        help: <span>Parameter for <b>{availableAlgorithms[key].name}</b>.</span>,
                        validation: {
                            validator: () => {
                                let value = this.refs[formName + "[parameters][" + i + "][value]"].value;
                                let regex = new RegExp(item.regex);

                                let state = {};
                                state["validation." + formName + "[parameters][" + i + "][value]"] = value === "" || regex.exec(value) !== null;

                                this.setState(state);
                            },
                            renderer: () => {
                                let valid = this.state["validation." + formName + "[parameters][" + i + "][value]"];

                                if (!valid) {
                                    return (
                                        <div className="validation-error">
                                            Parameter does not match required format: <b>{item.regex}</b>
                                        </div>
                                    );
                                }
                            }
                        }
                    };
                });
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
                default: 10,
                decoder: (i) => i.value,
                encoder: (i) => {
                    return {value: i};
                }
            },
            answersPerWorker: {
                type: "number",
                label: "Answers / Worker",
                help: "How many answers should each worker be able to give?",
                default: 3,
                decoder: (i) => i.value,
                encoder: (i) => {
                    return {value: i};
                }
            },
            ratingsPerWorker: {
                type: "number",
                label: "Ratings / Worker",
                help: "How many ratings should each worker be able to give?",
                default: 3,
                decoder: (i) => i.value,
                encoder: (i) => {
                    return {value: i};
                }
            },
            ratingsPerAnswer: {
                type: "number",
                label: "Ratings / Answer",
                help: "How many ratings should each answer receive?",
                default: 3,
                decoder: (i) => i.value,
                encoder: (i) => {
                    return {value: i};
                }
            },
            paymentBase: {
                type: "number",
                label: "Base Payment",
                help: "Basic payment a worker gets for completing a task.",
                unit: "cents",
                decoder: (i) => i.value,
                encoder: (i) => {
                    return {value: i};
                }
            },
            paymentAnswer: {
                type: "number",
                label: "Answer Payment",
                help: "Payment for each creative answer.",
                unit: "cents",
                default: 10,
                decoder: (i) => i.value,
                encoder: (i) => {
                    return {value: i};
                }
            },
            paymentQualityThresholdAnswer: {
                type: "enum",
                label: "Minimum Answer Quality",
                help: "How good must a answer be to enable payments?",
                values: qualityThresholdValues,
                decoder: (i) => i.value,
                encoder: (i) => {
                    return {value: i};
                }
            },
            paymentRating: {
                type: "number",
                label: "Rating Payment",
                help: "Payment for each rating.",
                unit: "cents",
                default: 10,
                decoder: (i) => i.value,
                encoder: (i) => {
                    return {value: i};
                }
            },
            paymentQualityThresholdRating: {
                type: "enum",
                label: "Minimum Answer Quality",
                help: "How good must a rating be to enable payments?",
                values: qualityThresholdValues,
                decoder: (i) => i.value,
                encoder: (i) => {
                    return {value: i};
                }
            },
            ratingOptions: { // TODO: Add editor for rating options, just preserve them for now…
                type: "hidden",
                value: "",
                encoder: (json) => {
                    console.log(json);
                    try {
                        return JSON.parse(json);
                    } catch (e) {
                        console.error(e);
                    }
                },
                decoder: (items) => {
                    if (items.length) {
                        return JSON.stringify(items);
                    } else {
                        return JSON.stringify([
                            {name: "good", value: 10},
                            {name: "bad", value: 0}
                        ]);
                    }
                }
            },
            constraints: {
                type: "longtext",
                label: "Constraints",
                help: "Constraints that should be matched by all creative answers.",
                encoder: (text) => encodeTextCollection(text, "\n"),
                decoder: (items) => items.map((item) => item.name).join("\n")
            },
            tags: {
                type: "text",
                label: "Tags",
                help: "Tags! TODO…", // TODO
                encoder: (text) => encodeTextCollection(text, ","),
                decoder: (items) => items.map((item) => item.name).join(", ")
            },
            workerQualityThreshold: {
                type: "enum",
                label: "Worker Quality Threshold",
                help: "Minimum worker quality to participate in this experiment.",
                values: qualityThresholdValues,
                decoder: (i) => i.value,
                encoder: (i) => {
                    return {value: i};
                }
            }
        });

        return base;
    }

    render() {
        if (this.state.algorithmsFailed) {
            return (
                <DataError />
            );
        }

        return super.render();
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
                algorithmsFailed: true
            });
        });
    }
}

export default ExperimentWizard;