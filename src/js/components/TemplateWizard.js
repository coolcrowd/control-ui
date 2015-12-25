import React from "react";

class TemplateWizard extends React.Component {
    render() {
        return (
            <div className="wizard">
                <label>Title</label>
                <input type="text" placeholder="Title" name="title" />

                <label>Description</label>
                <textarea placeholder="Description" name="description" className="resize-horizontal" />

                <div className="actions actions-right">
                    <button type="submit" className="action action-constructive">
                        <i className="fa fa-save" /> Save
                    </button>
                </div>
            </div>
        );
    }
}

export default TemplateWizard;