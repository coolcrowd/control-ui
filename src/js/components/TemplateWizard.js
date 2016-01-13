import React from "react";

import Template from "../core/Template";

function getPlaceholderItem(placeholder) {
    return (
        <li className="placeholder">
            {placeholder}
        </li>
    )
}

function getWarningItem(warning) {
    return (
        <div className="warning">
            <i className="fa fa-warning"/> {warning}
        </div>
    )
}

class TemplateWizard extends React.Component {
    constructor() {
        super();

        this.state = {
            placeholders: {},
            warnings: []
        }
    }

    render() {
        // TODO: Find out how to use {{ }} in React literally.
        let html = "You can add placeholders by using the following syntax: <code>{{placeholder-name:placeholder-type}}</code>";
        let placeholderHelp = (
            <div className="help">
                <p dangerouslySetInnerHTML={{__html: html}}/>
                <ul>
                    <li><code>placeholder-name</code><br />
                        You may use the following characters:
                        <code>a-z</code>, <code>-</code>, <code>_</code>.
                    </li>
                    <li>
                        <code>placeholder-type</code><br />
                        You may use any <a href="https://developer.mozilla.org/de/docs/Web/HTML/Element/Input">input
                        type defined in HTML 5</a>. Default: <code>text</code>.
                    </li>
                </ul>
            </div>
        );

        let placeholders = [];
        let warnings = [];
        let placeholderLabel;

        if (Object.keys(this.state.placeholders).length) {
            placeholders = Object.keys(this.state.placeholders).map(getPlaceholderItem);
            placeholderLabel = (
                <label>Placeholders</label>
            );
        }

        if (this.state.warnings.length) {
            warnings = this.state.warnings.map(getWarningItem);
        }

        return (
            <div className="wizard">
                <label>Name</label>
                <input type="text" placeholder="Name" name="name"/>

                <label>Content</label>
                <textarea placeholder="Content" name="content" ref="content"
                          onChange={this._onContentChange.bind(this)}/>

                {placeholderHelp}
                {placeholderLabel}

                <ul className="placeholders">
                    {placeholders}
                </ul>

                <div className="warnings">
                    {warnings}
                </div>

                <div className="actions actions-right">
                    <button type="submit" className="action action-constructive">
                        <i className="fa fa-save"/> Save
                    </button>
                </div>
            </div>
        );
    }

    _onContentChange() {
        let value = this.refs.content.value;
        let placeholders = Template.parse(value);
        let warnings = Template.check(placeholders);

        this.setState({
            placeholders: placeholders,
            warnings: warnings
        });
    }
}

export default TemplateWizard;