import React from "react";
import Backend from "../core/Backend";
import Template from "../core/Template";
import Loader from "../core/Loader";

function getPlaceholderItem(placeholder) {
    return (
        <li className="placeholder">
            <b>{placeholder.name}</b> ({placeholder.occurrences}x)<br/>
            {placeholder.description}
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
            new: false,
            loaded: false,
            failed: false,
            template: null,

            placeholders: {},
            warnings: [],

            name: "",
            content: "",
            answerType: "TEXT"
        };
    }

    componentDidMount() {
        this.setState({
            new: "id" in this.props.params,
            loaded: "id" in this.props.params,
            template: null
        });

        if (!this.state.new) {
            this.fetchData();
        }
    }

    componentWillReceiveProps(next) {
        if ("id" in next.params) {
            if ("id" in this.props.params) {
                let oldId = this.props.params.id;
                let newId = next.params.id;

                if (oldId !== newId) {
                    this.fetchData();
                }
            } else {
                this.fetchData();
            }
        } else {
            this.setState({
                new: false,
                loaded: true,
                failed: false,
                template: null,

                name: "",
                content: "",
                answerType: "TEXT"
            });
        }
    }

    componentWillUnmount() {
        this.ignoreLastFetch = true;
    }

    fetchData() {
        Backend.get("templates/" + this.props.params.id).then((response) => {
            if (!this.ignoreLastFetch) {
                this.setState({
                    template: response.data,
                    loaded: true,
                    failed: false,

                    name: response.data.name,
                    content: response.data.content,
                    answerType: "answerType" in response.data ? response.data.answerType : "TEXT"
                });

                this._onNameChange();
                this._onContentChange();
            }
        }).catch(() => {
            this.setState({
                template: null,
                loaded: true,
                failed: true
            })
        });
    }

    render() {
        let placeholderHelp = (
            <div className="help">
                <p>
                    You can add placeholders by using the following syntax:
                    <code>{"{{"}name:description:type{"}}"}</code>
                </p>

                <ul>
                    <li><code>name</code><br />
                        You may use any character except <code>{"TODO"}</code>, <code>{"TODO"}</code> and <code>:</code>.
                    </li>
                    <li><code>description</code><br />
                        You may use any character except <code>{"TODO"}</code>, <code>{"TODO"}</code> and <code>:</code>.
                    </li>
                    <li>
                        <code>type</code><br />
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
            placeholders = Object.keys(this.state.placeholders).map((key) => {
                return getPlaceholderItem({
                    name: key,
                    description: this.state.placeholders[key].description,
                    occurrences: this.state.placeholders[key].positions.length
                });
            });

            placeholderLabel = (
                <label>Placeholders</label>
            );
        }

        if (this.state.warnings.length) {
            warnings = this.state.warnings.map(getWarningItem);
        }

        let wizard = (
            <div className="wizard">
                <label>Name</label>
                <input type="text" placeholder="Name" name="name" value={this.state.name} ref="name"
                       onChange={this._onNameChange.bind(this)}/>

                <label>Content</label>
                <textarea placeholder="Content" name="content" value={this.state.content} ref="content"
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

        if (this.state.new) {
            return wizard;
        } else {
            return (
                <Loader loaded={this.state.loaded} className="loader">
                    {wizard}
                </Loader>
            );
        }
    }

    _onNameChange() {
        let value = this.refs.name.value;

        this.setState({
            name: value
        });
    }

    _onContentChange() {
        let value = this.refs.content.value;
        let placeholders = Template.parse(value);
        let warnings = Template.check(placeholders);

        this.setState({
            content: value,
            placeholders: placeholders,
            warnings: warnings
        });
    }
}

export default TemplateWizard;