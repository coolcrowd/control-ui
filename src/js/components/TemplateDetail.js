import React from "react";
import { Link } from "react-router";
import Backend from "../core/Backend";
import Loader from "../core/Loader";

class TemplateDetail extends React.Component {
    constructor() {
        super();

        this.state = {
            template: null,
            loaded: false,
            failed: false
        };
    }

    render() {
        let content = null;

        if (this.state.loaded) {
            if (this.state.failed) {
                content = (
                    <div>
                        <h1>Error while loading…</h1>

                        <p>Content couldn't be loaded.</p>
                    </div>
                );
            } else {
                let type;

                if ("answerType" in this.state.template) {
                    type = (
                        <span>
                            <i className="fa fa-file-image-o icon" />
                            Image
                        </span>
                    );
                } else {
                    type = (
                        <span>
                            <i className="fa fa-file-text-o icon" />
                            Text
                        </span>
                    );
                }

                content = (
                    <div>
                        <h1>{this.state.template.name}</h1>

                        <Link to={this.props.location.pathname + "/edit"}><i className="fa fa-pencil icon" /> Edit</Link>

                        <pre>{this.state.template.content}</pre>

                        <label>Answer Type</label>
                        <div>{type}</div>
                    </div>
                );
            }
        }

        return (
            <Loader loaded={this.state.loaded} className="loader">
                {content}
            </Loader>
        );
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillReceiveProps(next) {
        let oldId = this.props.params.id;
        let newId = next.params.id;

        if (oldId !== newId) {
            this.fetchData();
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
                    failed: false
                });
            }
        }).catch(() => {
            this.setState({
                template: null,
                loaded: true,
                failed: true
            })
        });
    }
}

export default TemplateDetail;