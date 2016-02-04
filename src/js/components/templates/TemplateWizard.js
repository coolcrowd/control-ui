import React from "react";
import Template from "../../core/Template";
import Wizard from "../base/Wizard";

function getPlaceholderItem(placeholder) {
    return (
        <li className="placeholder">
            <b>{placeholder.name}</b> ({placeholder.occurrences}x) <span
            className="placeholder-type">{placeholder.type}</span><br/>
            {placeholder.description}
        </li>
    );
}

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
class TemplateWizard extends Wizard {
    getForm() {
        return {
            name: {
                type: "text",
                label: "Name",
                help: "Name to identify the template."
            },
            content: {
                type: "longtext",
                label: "Content",
                help: "Description of the creative task. You can use placeholders with {{name:description}}.",
                validation: {
                    validator: this._onContentChange.bind(this),
                    renderer: this._renderContent.bind(this)
                }
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
            }
        };
    }

    getCollectionUri(query) {
        if (typeof query !== "undefined") {
            return "templates?" + query;
        }

        return "templates";
    }

    _onContentChange() {
        let content = this.refs.content.value;
        let placeholders = Template.parse(content);

        this.setState({
            contentPlaceholders: placeholders
        });
    }

    _renderContent() {
        let placeholders = [];
        let placeholderLabel;

        if (Object.keys(this.state.contentPlaceholders || {}).length) {
            placeholders = Object.keys(this.state.contentPlaceholders).map((key) => {
                return getPlaceholderItem({
                    name: key,
                    description: this.state.contentPlaceholders[key].description,
                    occurrences: this.state.contentPlaceholders[key].positions.length,
                    type: this.state.contentPlaceholders[key].type
                });
            });

            placeholderLabel = (
                <label className="input-label">Placeholders</label>
            );
        }

        return (
            <div>
                {placeholderLabel}

                <ul className="placeholders">
                    {placeholders}
                </ul>
            </div>
        );
    }
}

export default TemplateWizard;