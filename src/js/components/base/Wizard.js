import React from "react";
import Template from "../../core/Template";
import Loader from "../../core/Loader";
import history from "../../history";
import resolve from "../../resolve";
import serialize from "form-serialize";
import Combokeys from "combokeys";

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

        this.combokeys = new Combokeys(document.body);
        this.combokeys.stopCallback = () => false;
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
            } else if (form[name].type === "hidden") {
                form[name] = form[name].value;
            } else if (form[name].type === "number") {
                form[name] = "default" in form[name] ? form[name].default : 0;
            } else {
                console.warn("No default value defined for " + name);
            }
        }

        return form;
    }

    getCollectionUri(query) {
        return "[override-this]";
    }

    getItemUri(id) {
        return this.getCollectionUri() + "/" + id;
    }

    componentDidMount() {
        this.combokeys.bind("ctrl+enter", this._onSave.bind(this));
        this.combokeys.bind(["ctrl+s", "command+s"], () => {
            this._onSave();
            return false;
        });
        this.combokeys.bind("esc", this._onAbort.bind(this));

        this.setState({
            new: !("id" in this.props.params),
            loaded: !("id" in this.props.params),
            failed: false,
            data: null,
            form: this.getDefaultForm()
        }, () => {
            if (!this.state.new) {
                this.fetchData();
            } else {
                // Force validation on load
                this._validateChanges(this.state.form, true);
            }
        });
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
                new: true,
                loaded: true,
                failed: false,
                data: null,
                form: this.getDefaultForm()
            });
        }
    }

    componentWillUnmount() {
        this.combokeys.detach();
        this.ignoreLastFetch = true;
    }

    fetchData() {
        this.props.backend.request("GET", this.getItemUri(this.props.params.id)).then((response) => {
            if (!this.ignoreLastFetch) {
                let spec = this.getForm();
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

                    if (spec.hasOwnProperty(name) && "decoder" in spec[name]) {
                        form[name] = spec[name].decoder(form[name]);
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
        let spec = this.getForm();
        let oldForm = this.state.form;
        let form = serialize(this.refs.form, {hash: true, empty: true});

        for (let key in form) {
            if (key in spec && spec[key].type === "number") {
                form[key] = parseInt(form[key]);
            }
        }

        this.setState({
            form: form
        }, this._validateChanges.bind(this, oldForm));
    }

    _validateChanges(oldForm, forceValidation) {
        forceValidation = forceValidation || false;

        let keys = Object.keys(oldForm);
        let form = this.getForm();

        keys.forEach((key) => {
            if (forceValidation || oldForm[key] !== this.state.form[key]) {
                if (key in form && "validation" in form[key]) {
                    form[key].validation.validator(this.state.form[key]);
                }
            }
        });
    }

    _onSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        this._onSave();
    }

    _onSave() {
        let form = this.state.form;
        let spec = this.getForm();

        for (let name in form) {
            if (spec.hasOwnProperty(name) && "encoder" in spec[name]) {
                form[name] = spec[name].encoder(form[name]);
            }
        }

        if (this.state.new) {
            this.props.backend.request("PUT", this.getCollectionUri(), form).then((resp) => {
                history.replaceState(null, "/" + this.getItemUri(resp.data.id));
            }).catch((e) => {
                alert(JSON.stringify(e));
            });
        } else {
            let oldItem = this.state.data;
            let newItem = form;

            // Delete all unchanged properties for minimal patch.
            Object.keys(newItem).forEach((name) => {
                if (newItem[name] === oldItem[name]) {
                    delete newItem[name];
                }
            });

            // Nothing changed?
            if (Object.keys(newItem).length === 0) {
                history.replaceState(null, "/" + this.getItemUri(this.props.params.id));
                return;
            }

            this.props.backend.request("PATCH", this.getItemUri(this.props.params.id), newItem).then(() => {
                history.replaceState(null, "/" + this.getItemUri(this.props.params.id));
            }).catch((e) => {
                alert(JSON.stringify(e));
            });
        }
    }

    _onAbort() {
        if (!window.confirm("Do you really want to abort?")) {
            return;
        }

        if (this.state.new) {
            history.replaceState(null, "/" + this.getCollectionUri());
        } else {
            history.replaceState(null, "/" + this.getItemUri(this.props.params.id));
        }
    }

    render() {
        let form = this.getForm();
        let first = true;

        let content = Object.keys(form).map((name) => {
            let input = form[name];

            let out = this._renderFormElement(name, input, first);
            first = false;

            return out;
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

    _renderFormElement(name, input, first) {
        let formElement = null;

        if (input.type === "text" || input.type === "number") {
            formElement = (
                <input autoFocus={first} type={input.type} name={name}
                       placeholder={"placeholder" in input ? input.placeholder : ""}
                       key={name} onChange={this._onFormChange.bind(this)}
                       ref={name} value={this.state.form[name]}/>
            );
        } else if (input.type === "longtext") {
            formElement = (
                <textarea autoFocus={first} name={name} placeholder={"placeholder" in input ? input.placeholder : ""}
                          ref={name}
                          key={name} onChange={this._onFormChange.bind(this)}
                          value={this.state.form[name]}/>
            );
        } else if (input.type === "enum") {
            formElement = input.values.map((value) => {
                return (
                    <option value={value.value} selected={value.value === this.state.form[name]}>
                        {value.text}
                    </option>
                );
            });

            formElement = (
                <select key={name} name={name} onChange={this._onFormChange.bind(this)} size="1">
                    {formElement}
                </select>
            );
        } else if (input.type === "hidden") {
            return (
                <input type="hidden" name={name} value={input.value}/>
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