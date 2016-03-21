import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";
import history from "../../../history";
import ResourceListItem from "./../../base/ResourceListItem";
import DataError from "./../../base/DataError";
import DataComponent from "./../../base/DataComponent";
import Combokeys from "combokeys";
import Loader from "../../../core/Loader";
import JsonFormatter from "../../../formatters/JsonFormatter";
import CsvFormatter from "../../../formatters/CsvFormatter";
import { saveAs } from "filesaver.js";
import moment from "moment";
import classNames from "classnames";

/**
 * @author Niklas Keller
 */
class AnswerList extends DataComponent {
    constructor() {
        super();

        this.combokeys = new Combokeys(document.body);
    }

    componentDidMount() {
        this.combokeys.bind("j", this._onPrev.bind(this));
        this.combokeys.bind("k", this._onNext.bind(this));

        return super.componentDidMount();
    }

    componentWillUnmount() {
        this.combokeys.detach();

        return super.componentWillUnmount();
    }

    componentWillReceiveProps(next) {
        if (next.location.query !== this.props.location.query) {
            // trigger after new props are applied
            setTimeout(this.fetchData.bind(this), 1);
        }
    }

    getDataUri() {
        return this.getCollectionUri(this.getQueryString());
    }

    getQueryString() {
        let from = encodeURIComponent(this.props.location.query.from || "0");
        let asc = encodeURIComponent(this.props.location.query.asc || "true");

        return "from=" + from + "&asc=" + asc;
    }

    getCollectionUri(query) {
        if (typeof query !== "undefined") {
            return "experiments/" + this.props.params.id + "/answers?" + query;
        }

        return "experiments/" + this.props.params.id + "/answers";
    }

    /**
     * Fetches data from {@link #getDataUri()} and sets {@code state.data} and {@code state.meta} accordingly.
     */
    fetchData() {
        let onError = (e) => {
            this.setState({
                data: typeof e === "object" && "data" in e ? e.data : null,
                loaded: true,
                failed: true,
                meta: "meta" in e ? e.meta : {
                    status: null,
                    links: {}
                }
            });
        };

        this.props.backend.request("GET", this.getDataUri()).then((answerResponse) => {
            if (!this.ignoreLastFetch) {
                this.props.backend.request("GET", "experiments/" + this.props.params.id).then((response) => {
                    this.setState({
                        data: answerResponse.data,
                        loaded: true,
                        failed: false,
                        meta: answerResponse.meta,
                        experiment: response.data
                    });

                    this.onFetched();
                }).catch(onError);
            }
        }).catch(onError);
    }

    render() {
        if (this.state.loaded && this.state.failed) {
            return (
                <DataError />
            );
        }

        let children = this.state.loaded ? (this.state.data.items || []).map((item) => {
            let feedback = item.ratings.filter((rating) => rating.feedback).map((rating) => {
                return (
                    <li key={rating.id} className="dont-break-out">
                        {rating.feedback}
                    </li>
                );
            });

            if (feedback.length) {
                feedback = (
                    <div className="answer-feedback">
                        <b>Feedback</b>

                        <ul>
                            {feedback}
                        </ul>
                    </div>
                );
            }

            let systemResponse = null;

            if (item.systemresponse) {
                systemResponse = (
                    <div className="answer-system-response">
                        <b>Response to the worker</b>

                        <div className="answer-system-response-content">
                            {item.systemresponse}
                        </div>
                    </div>
                );
            }

            let answerTime = moment(item.time * 1000);
            let now = moment();

            if (now.diff(answerTime, 'days') >= 7) {
                answerTime = answerTime.format("llll");
            } else {
                answerTime = answerTime.fromNow();
            }

            let quality = item.ratings.length > 0 ? (
                <span className={"answer-quality " + (item.quality >= this.state.experiment.paymentQualityThreshold
                        ? "answer-quality-good"
                        : "answer-quality-bad")}>
                    {item.quality >= this.state.experiment.paymentQualityThreshold ? "Good" : "Bad"}
                </span>
            ) : (
                <span className="answer-quality answer-quality-none">
                     No Ratings
                </span>
            );

            if (item.duplicate) {
                quality = (
                    <span className="answer-quality answer-quality-duplicate">
                        DUPLICATE
                    </span>
                );
            }

            let meta = (
                <div className="answer-meta">
                    <time dateTime={moment(item.time * 1000).toISOString()}
                          title={moment(item.time * 1000).format("llll")}>
                        {answerTime}
                    </time>

                    {quality}
                </div>
            );

            let content = [
                meta,
                <div className="answer-content dont-break-out">
                    {item.content}
                </div>
                ,
                feedback,
                systemResponse
            ];

            if (this.state.experiment.answerType === "IMAGE") {
                content = [
                    <a className="answer-content-image dont-break-out" href={item.content} target="_blank">
                        <img src={item.content} alt={item.content} title={item.content}/>
                    </a>,
                    <div className="answer-meta-image">
                        {meta}
                        <div className="answer-meta-image-url">
                            <a href={item.content} target="_blank">
                                {item.content}
                            </a>
                        </div>
                        {feedback}
                        {systemResponse}
                    </div>
                ];
            }

            return (
                <div key={item.id} className={classNames({
                            "answer": true,
                            "answer-duplicate": item.duplicate
                        })}>
                    {content}
                </div>
            );
        }) : [];

        if (children.length === 0) {
            children = [(
                <li key="empty" className="list-empty">
                    <i className={"fa fa-3x fa-file-text-o"}/>
                    <br/>
                    You have no creative answers yet!
                </li>
            )];
        }

        return (
            <div>
                <div className="actions">
                    <button className="action" onClick={this._onCsvExport.bind(this)}>
                        <i className="fa fa-file-excel-o icon"/> Export CSV
                    </button>

                    <button className="action" onClick={this._onJsonExport.bind(this)}>
                        <i className="fa fa-file-text-o icon"/> Export JSON
                    </button>

                    <button className="action" onClick={this._onRefresh.bind(this)}>
                        <i className="fa fa-refresh icon"/> Refresh
                    </button>
                </div>

                <h1>Creative answers</h1>

                <Loader loaded={this.state.loaded} className="loader">
                    <ul className="list" ref="list">
                        {children}
                    </ul>

                    <div style={{textAlign: "center", padding: "20px"}}>
                        <button className="action pagination pagination-prev" type="button"
                                disabled={!(this.state.loaded && "prev" in this.state.meta.links)}
                                onClick={this._onPrev.bind(this)}>
                            <i className="fa fa-angle-left icon"/>
                            previous
                        </button>

                        <button className="action pagination pagination-next" type="button"
                                disabled={!(this.state.loaded && "next" in this.state.meta.links)}
                                onClick={this._onNext.bind(this)}>
                            <i className="fa fa-angle-right icon"/>
                            next
                        </button>
                    </div>
                </Loader>
            </div>
        );
    }

    onFetched() {
        let node = ReactDOM.findDOMNode(this.refs.list);
        let bounds = node.getBoundingClientRect();

        if (bounds.top < 0) {
            window.scrollTo(0, node.offsetTop - 50);
        }
    }

    _onNext() {
        if (!("next" in this.state.meta.links)) {
            return;
        }

        let from = encodeURIComponent(this.state.meta.links.next.from || "0");
        let asc = encodeURIComponent(this.state.meta.links.next.asc || "true");
        history.replaceState(null, this.props.location.pathname + "?from=" + from + "&asc=" + asc);
    }

    _onPrev() {
        if (!("prev" in this.state.meta.links)) {
            return;
        }

        let from = encodeURIComponent(this.state.meta.links.prev.from || "0");
        let asc = encodeURIComponent(this.state.meta.links.prev.asc || "true");
        history.replaceState(null, this.props.location.pathname + "?from=" + from + "&asc=" + asc);
    }

    _onRefresh() {
        this.setState({
            loaded: false,
            failed: false,
            data: null
        });

        this.fetchData();
    }

    _onJsonExport() {
        this._export().then((items) => {
            let formatter = new JsonFormatter(2);
            let content = formatter.format(items);
            let filename = this._promptForFilename("json");

            if (!filename) {
                return;
            }

            saveAs(new Blob([content], {
                type: "application/json; charset=utf-8"
            }), filename);
        });
    }

    _onCsvExport() {
        this._export().then((items) => {
            let formatter = new CsvFormatter();

            // Map ratings to a flat map so we have no nested objects anymore to encode as CSV …
            let data = items.map((item) => {
                let ratings = {};

                item.ratings.forEach((rating, i) => {
                    for (let key in rating) {
                        if (key === "violatedConstraints") {
                            rating[key] = rating[key].map((i) => i.name).join(", ");
                        }

                        ratings["rating " + key] = rating[key];
                    }
                });

                delete item.ratings;

                return Object.assign(item, ratings);
            });

            let content = formatter.format(data);
            let filename = this._promptForFilename("csv");

            if (!filename) {
                return;
            }

            saveAs(new Blob([content], {
                type: "text/csv; charset=utf-8"
            }), filename);
        });
    }

    _promptForFilename(extension) {
        let filename = prompt("Filename");

        if (!filename) {
            return null;
        }

        if (filename.length - extension.length < 0 || filename.substr(filename.length - extension.length, extension.length) !== extension) {
            return filename + "." + extension;
        }

        return filename;
    }

    _export() {
        let all = [];

        let handler = (url) => {
            return new Promise((resolve, reject) => {
                url = url || "experiments/" + this.props.params.id + "/answers";

                this.props.backend.request("GET", url).then((response) => {
                    response.data.items.forEach((item) => {
                        all.push(item);
                    });

                    if ("next" in response.meta.links) {
                        let nextUrl = response.meta.links.next.url.substr(1);
                        resolve(handler(nextUrl));
                    } else {
                        resolve(all);
                    }
                }).catch((e) => reject(e));
            });
        };

        return handler();
    }
}

export default AnswerList;