import React from "react";

class Shortcut extends React.Component {
    render() {
        let keys = this.props.keys.split(" ").map((key) => {
            return <code key={key} className="key">{key}</code>;
        });

        return (
            <tr>
                <td>
                    {keys}
                </td>
                <td>
                    {this.props.title}
                </td>
            </tr>
        );
    }
}

export default Shortcut;