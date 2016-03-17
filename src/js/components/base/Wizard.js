import React from "react";
import Template from "../../core/Template";
import Loader from "../../core/Loader";
import history from "../../history";
import resolve from "../../resolve";
import serialize from "form-serialize";
import Combokeys from "combokeys";

/**
 * @author Niklas Keller
 */
class Wizard extends React.Component {
    constructor() {
        super();

        this.state = Object.assign(this.state || {}, {
            new: false,
            saving: false,
            loaded: false,
            failed: false,
            data: null,
            form: this.getDefaultForm()
        });

        this.combokeys = new Combokeys(document.body);
        this.combokeys.stopCallback = () => false;
    }

    getDefaultForm() {
        let form = this.getForm();

        for (let name in form) {
            if (form[name].type === "text" || form[name].type === "longtext") {
                form[name] = "default" in form[name] ? form[name].default : "";
            } else if (form[name].type === "enum") {
                form[name] = form[name].default;
            } else if (form[name].type === "hidden") {
                form[name] = form[name].value;
            } else if (form[name].type === "number") {
                form[name] = "default" in form[name] ? form[name].default : 0;
            } else if (form[name].type === "boolean") {
                form[name] = false;
            } else {
                form[name] = "";

                console.warn("No default value defined for " + name);
            }
        }

        return form;
    }

    getCollectionUri(query) {
        throw "Must be implemented in sub classes";
    }

    getItemUri(id) {
        return this.getCollectionUri() + "/" + id;
    }

    componentDidMount() {
        this.combokeys.bind(["ctrl+enter", "ctrl+s", "command+s"], () => {
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
            if (this.ignoreLastFetch) {
                return;
            }

            let spec = this.getForm();
            let form = response.data;
            let defaultForm = this.getDefaultForm();

            form = Wizard.decodeForm(form, spec, defaultForm);

            this.setState({
                new: false,
                data: response.data,
                form: form,
                loaded: true,
                failed: false
            });

            // Force validation on load
            this._validateChanges(form, true);

            this.onFetched();
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

    /**
     * Executed after data has successfully been fetched. Can be used as simple hook.
     */
    onFetched() {
        // May be implemented by child classes…
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

        let spec = this.getForm();
        let specKeys = Object.keys(spec);

        specKeys.forEach((name) => {
            let bracket = name.indexOf("[");
            let key = bracket === -1 ? name : name.substr(0, bracket);
            let regex = /\[([a-z0-9]+)]/ig;
            let match;

            let formElement = this.state.form[key];
            let oldFormElement = oldForm[key];
            let specElement = spec[name];

            while ((match = regex.exec(key)) !== null) {
                let element = match[1];

                if (formElement && element in formElement) {
                    formElement = formElement[element];
                    oldFormElement = oldFormElement[element];
                }
            }

            if (forceValidation || oldFormElement !== formElement) {
                if (specElement && "validation" in specElement) {
                    specElement.validation.validator(formElement);
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
        let form = Object.assign({}, this.state.form);
        let spec = this.getForm();

        this.setState({saving: true});

        if (this.state.new) {
            Wizard.encodeForm(form, spec);

            this.props.backend.request("PUT", this.getCollectionUri(), form).then((resp) => {
                this.setState({saving: false});
                history.replaceState(null, "/" + this.getItemUri(resp.data.id));
            }).catch((e) => {
                this.setState({saving: false});
                let error = typeof e === "object" && "data" in e ? e.data.detail : "Unknown error.";
                window.alert(error);
            });
        } else {
            let oldItem = this.state.data;
            let newItem = form;

            // Delete all unchanged properties for minimal patch.
            Object.keys(newItem).forEach((name) => {
                // Ignore all exactly equal objects
                if (JSON.stringify(newItem[name]) === JSON.stringify(oldItem[name])) {
                    delete newItem[name];
                }

                // Ignore all objects which are subsets of the API response
                // Some fields are received but not sent again.
                else if (typeof newItem[name] === "object") {
                    if (Object.keys(newItem[name]) > Object.keys(oldItem[name])) {
                        return;
                    }

                    let tmpItem = Object.assign({}, oldItem[name], newItem[name]);

                    if (JSON.stringify(tmpItem) === JSON.stringify(oldItem[name])) {
                        delete newItem[name];
                    }
                }
            });

            Wizard.encodeForm(newItem, spec);

            // Nothing changed?
            if (Object.keys(newItem).length === 0) {
                history.replaceState(null, "/" + this.getItemUri(this.props.params.id));
                return;
            }

            this.props.backend.request("PATCH", this.getItemUri(this.props.params.id), newItem).then(() => {
                this.setState({saving: false});
                history.replaceState(null, "/" + this.getItemUri(this.props.params.id));
            }).catch((e) => {
                this.setState({saving: false});
                let error = typeof e === "object" && "data" in e ? e.data.detail : "Unknown error.";
                window.alert(error);
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

                <div className="actions actions-right actions-bottom">
                    <button type="button" className="action action-constructive" onClick={this._onSubmit.bind(this)} disabled={this.state.saving}>
                        <i className="fa fa-save icon"/> Save
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
        let value = (() => {
            let bracketPos = name.indexOf("[");
            let key = bracketPos === -1 ? name : name.substr(0, bracketPos);
            let value = this.state.form[key];
            let regex = /\[([a-z0-9]+)]/ig;
            let match;

            while ((match = regex.exec(name)) !== null) {
                let element = match[1];

                if (value && element in value) {
                    value = value[element];
                } else {
                    value = "";
                }
            }

            return value;
        })();

        if (input.type === "text" || input.type === "number") {
            formElement = (
                <input autoFocus={first} type={input.type} name={name}
                       placeholder={"placeholder" in input ? input.placeholder : ""}
                       key={name} onChange={this._onFormChange.bind(this)}
                       ref={name} value={value}/>
            );
        } else if (input.type === "longtext") {
            formElement = (
                <textarea autoFocus={first} name={name} placeholder={"placeholder" in input ? input.placeholder : ""}
                          ref={name}
                          key={name} onChange={this._onFormChange.bind(this)}
                          value={value}/>
            );
        } else if (input.type === "enum") {
            formElement = input.values.map((item, i) => {
                return (
                    <label className="radio-option">
                        <input key={name} name={name} type="radio" value={item.value}
                               checked={i === 0 && !value || value === item.value}
                               onChange={this._onFormChange.bind(this)}/>
                        <span>{item.text}</span>
                    </label>
                );
            });
        } else if (input.type === "hidden") {
            return (
                <input type="hidden" name={name} value={value || input.value}/>
            );
        } else if (input.type === "boolean") {
            formElement = (
                <label>
                    <input type="checkbox" name={name} checked={value} onChange={this._onFormChange.bind(this)}
                           value="1"/>
                    {value ? (input.active || "active") : (input.inactive || "inactive")}
                </label>
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

    static decodeForm(form, spec, defaults) {
        for (let name in spec) {
            let bracketPos = name.indexOf("[");
            let key = bracketPos === -1 ? name : name.substr(0, bracketPos);
            let regex = /\[([a-z0-9]+)]/ig;
            let match;

            let formElement = form[key];
            let specElement = spec[name];

            while ((match = regex.exec(name)) !== null) {
                let element = match[1];

                if (formElement && element in formElement) {
                    formElement = formElement[element];
                }
            }

            if (name in defaults && typeof formElement === "undefined") {
                formElement = defaults[name];
            }

            if ("decoder" in specElement) {
                form[name] = specElement.decoder(formElement);
            }
        }

        return form;
    }

    static encodeForm(form, spec, name) {
        if (typeof form === "object") {
            for (let key in form) {
                let specElement = spec[name ? name + "[" + key + "]" : key];

                if (specElement && "encoder" in specElement) {
                    form[key] = specElement.encoder(form[key]);
                }

                form[key] = Wizard.encodeForm(form[key], spec, name ? name + "[" + key + "]" : key);
            }
        } else {
            let specElement = spec[name];

            if (specElement && "encoder" in specElement) {
                return specElement.encoder(form);
            }
        }

        return form;
    }
}

export default Wizard;