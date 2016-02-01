import React from "react";
import history from "../../history";
import Loader from "../../core/Loader";

/**
 * Loads a data set and displays it.
 * @author Niklas Keller
 */
class DataComponent extends React.Component {
    /**
     * Constructs a new instance.
     */
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

    /**
     * React hook when the component first mounts.
     */
    componentDidMount() {
        this.fetchData();
    }

    /**
     * React hook when the component will unmount.
     */
    componentWillUnmount() {
        this.ignoreLastFetch = true;
    }

    /**
     * Fetches data from {@link #getDataUri()} and sets {@code state.data} and {@code state.meta} accordingly.
     */
    fetchData() {
        this.props.backend.request("GET", this.getDataUri()).then((response) => {
            if (this.ignoreLastFetch) {
                return;
            }
            this.setState({
                data: response.data,
                loaded: true,
                failed: false,
                meta: response.meta
            });

            this.onFetched();
        }).catch((e) => {
            this.setState({
                data: "data" in e ? e.data : null,
                loaded: true,
                failed: true,
                meta: "meta" in e ? e.meta : {
                    status: null,
                    links: {}
                }
            });
        });
    }

    /**
     * Executed after data has successfully been fetched. Can be used as simple hook.
     */
    onFetched() {
        // May be implemented by child classes…
    }
}

export default DataComponent;