import React from "react";
import history from "../../history";
import Loader from "../../core/Loader";

class DataComponent extends React.Component {
    constructor() {
        super();

        this.state = {
            loaded: false,
            failed: false,
            data: null,
            meta: {
                status: null,
                links: {}
            }
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillUnmount() {
        this.ignoreLastFetch = true;
    }

    fetchData() {
        this.props.backend.request("GET", this.getDataUri()).then((response) => {
            if (!this.ignoreLastFetch) {
                this.setState({
                    data: response.data,
                    loaded: true,
                    failed: false,
                    meta: response.meta
                });

                this.onFetched();
            }
        }).catch((e) => {
            this.setState({
                data: null,
                loaded: true,
                failed: true,
                meta: "meta" in e ? e.meta : {
                    status: null,
                    links: {}
                }
            });
        });
    }

    onFetched() {

    }
}

export default DataComponent;