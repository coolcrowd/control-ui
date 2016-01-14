import React from "react";
import history from "../history";
import Backend from "../core/Backend";
import Loader from "../core/Loader";

class DataComponent extends React.Component {
    constructor() {
        super();

        this.state = {
            loaded: false,
            failed: false,
            data: null
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillUnmount() {
        this.ignoreLastFetch = true;
    }

    fetchData() {
        Backend.get(this.getDataUri()).then((response) => {
            if (!this.ignoreLastFetch) {
                this.setState({
                    data: response.data,
                    loaded: true,
                    failed: false
                });
            }
        }).catch(() => {
            this.setState({
                data: null,
                loaded: true,
                failed: true
            });
        });
    }
}

export default DataComponent;

