import React from "react";
import Shortcut from "./Shortcut";

class ShortcutHelp extends React.Component {
    render() {
        return (
            <div>
                <h3>Navigation</h3>

                <table>
                    <tbody>
                    <Shortcut keys="g h" title="Dashboard"/>
                    <Shortcut keys="g e" title="Experiments"/>
                    <Shortcut keys="g t" title="Templates"/>
                    <Shortcut keys="g n" title="Notifications"/>
                    </tbody>
                </table>

                <h3>Lists</h3>

                <table>
                    <tbody>
                    <Shortcut keys="n" title="New item"/>
                    <Shortcut keys="j" title="Previous page"/>
                    <Shortcut keys="k" title="Next page"/>
                    </tbody>
                </table>

                <h3>Editors</h3>

                <table>
                    <tbody>
                    <Shortcut keys="esc" title="Abort"/>
                    <Shortcut keys="ctrl+enter" title="Save"/>
                    </tbody>
                </table>

                <h3>Dialogs</h3>

                <table>
                    <tbody>
                    <Shortcut keys="?" title="Shortcut help"/>
                    <Shortcut keys="esc" title="Close dialog"/>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ShortcutHelp;