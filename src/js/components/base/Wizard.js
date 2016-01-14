import React from "react";
import Backend from "../../core/Backend";
import Template from "../../core/Template";
import Loader from "../../core/Loader";
import history from "../../history";
import resolve from "../../resolve";
import serialize from "form-serialize";

class Wizard extends React.Component {
    constructor() {
        super();

        this.state = {
            new: false,
            loaded: false,
            failed: false,
            data: null,
            form: this.getDefaultForm()
        };
    }

    getDefaultForm() {
        let form = this.getForm();

        for (let name in form) {
            if (!form.hasOwnProperty(name)) {
                continue;
            }

            if (form[name].type === "text" || form[name].type === "longtext") {
                form[name] = "";
            } else if (form[name].type === "enum") {
                form[name] = form[name].default;
            }
        }

        return form;
    }

    componentDidMount() {
        this.setState({
            new: !("id" in this.props.params),
            loaded: !("id" in this.props.params),
            failed: false,
            data: null,
            form: this.getDefaultForm()
        }, () => {
            if (!this.state.new) {
                this._fetchData();
            }
        });
    }

    componentWillReceiveProps(next) {
        if ("id" in next.params) {
            if ("id" in this.props.params) {
                let oldId = this.props.params.id;
                let newId = next.params.id;

                if (oldId !== newId) {
                    this._fetchData();
                }
            } else {
                this._fetchData();
            }
        } else {
            this.setState({
                new: true,
                loaded: true,
                failed: false,
                data: null,
                form: this.getDefaultForm()
            });
        }
    }

    componentWillUnmount() {
        this.ignoreLastFetch = true;
    }

    _fetchData() {
        Backend.get(this.getDataUri() + "/" + this.props.params.id).then((response) => {
            if (!this.ignoreLastFetch) {
                let form = response.data;
                let defaultForm = this.getDefaultForm();

                // Fill in default values, e.g. from enums
                for (let name in defaultForm) {
                    if (!defaultForm.hasOwnProperty(name)) {
                        continue;
                    }

                    if (!(name in form)) {
                        form[name] = defaultForm[name];
                    }
                }

                this.setState({
                    new: false,
                    data: response.data,
                    form: form,
                    loaded: true,
                    failed: false
                });

                // Force validation on load
                this._validateChanges(form, true);
            }
        }).catch(() => {
            if (!this.ignoreLastFetch) {
                this.setState({
                    new: false,
                    data: null,
                    form: this.getDefaultForm(),
                    loaded: true,
                    failed: true
                });
            }
        });
    }

    _onFormChange() {
        let oldForm = this.state.form;

        this.setState({
            form: serialize(this.refs.form, {hash: true})
        }, this._validateChanges.bind(this, oldForm));
    }

    _validateChanges(oldForm, forceValidation) {
        forceValidation = forceValidation || false;

        let keys = Object.keys(oldForm);
        let form = this.getForm();

        keys.forEach((key) => {
            if (forceValidation || oldForm[key] !== this.state.form[key]) {
                if (form[key] && "validation" in form[key]) {
                    form[key].validation.validator(this.state.form[key]);
                }
            }
        });
    }

    _onSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        if (this.state.new) {
            Backend.put(this.getDataUri(), this.state.form).then((resp) => {
                console.log(resp); // TODO

                let newId = "1"; // TODO

                history.replaceState(null, this.props.location.pathname + "/" + newId);
            }).catch((e) => {
                console.log(e); // TODO

                let newId = "1"; // TODO

                history.replaceState(null, this.props.location.pathname + "/" + newId);
            });
        } else {
            let oldItem = this.state.data;
            let newItem = this.state.form;

            // Delete all unchanged properties for minimal patch.
            Object.keys(newItem).forEach((name) => {
                if (newItem[name] === oldItem[name]) {
                    delete newItem[name];
                }
            });

            // Nothing changed?
            if (Object.keys(newItem).length === 0) {
                let uri = resolve(this.props.location.pathname + "/..");
                history.replaceState(null, uri.pathname.substring(0, uri.pathname.length - 1));
                return;
            }

            Backend.patch(this.getDataUri() + "/" + this.props.params.id, newItem).then(() => {
                let uri = resolve(this.props.location.pathname + "/..");
                history.replaceState(null, uri.pathname.substring(0, uri.pathname.length - 1));
            }).catch((e) => {
                console.log(e); // TODO: Show Error!
            });
        }
    }

    render() {
        let form = this.getForm();

        let content = Object.keys(form).map((name) => {
            let input = form[name];
            return this._renderFormElement(name, input);
        });

        let wizard = (
            <form className="wizard" ref="form">
                {content}

                <div className="actions actions-right">
                    <button type="button" className="action action-constructive" onClick={this._onSubmit.bind(this)}>
                        <i className="fa fa-save"/> Save
                    </button>
                </div>
            </form>
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

    _renderFormElement(name, input) {
        let formElement = null;

        if (input.type === "text" || input.type === "number") {
            formElement = (
                <input type={input.type} name={name} placeholder={"placeholder" in input ? input.placeholder : ""}
                       key={name} onChange={this._onFormChange.bind(this)}
                       ref={name} value={this.state.form[name]}/>
            );
        } else if (input.type === "longtext") {
            formElement = (
                <textarea name={name} placeholder={"placeholder" in input ? input.placeholder : ""} ref={name}
                          key={name} onChange={this._onFormChange.bind(this)}
                          value={this.state.form[name]}/>
            );
        } else if (input.type === "enum") {
            formElement = input.values.map((value) => {
                return (
                    <label className="input-enum-option">
                        <input type="radio" name={name} value={value.value} onChange={this._onFormChange.bind(this)}
                               checked={value.value === this.state.form[name]}/>
                        {value.text}
                    </label>
                );
            });

            formElement = (
                <div key={name}>
                    {formElement}
                </div>
            );
        } else if (input.type === "list") {
            formElement = (
                <div>
                    DISPLAY LIST HERE... // TODO
                </div>
            );
        } else {
            console.warn("Unknown type: " + input.type);
        }

        return (
            <div className="input">
                {/* name */}
                <label className="input-label">{"label" in input ? input.label : name}</label>

                {/* description */}
                <p className="input-help">{"help" in input ? input.help : ""}</p>

                {/* form element itself */}
                {formElement}
                {"unit" in input ? <span className="input-unit">{input.unit}</span> : null}

                {/* any validation result */}
                {"validation" in input ? input.validation.renderer() : null}
            </div>
        );
    }
}

export default Wizard;