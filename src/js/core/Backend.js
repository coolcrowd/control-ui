import HttpException from "./HttpException";
import history from "../history";
import config from "../config";

const credentials = JSON.parse(localStorage.getItem("credentials"));

class Backend {
    static request(method, uri, data) {
        return request(method, uri, data);
    }

    static get(uri) {
        return request("GET", uri);
    }

    static post(uri, data) {
        return request("POST", uri, data);
    }

    static put(uri, data) {
        return request("PUT", uri, data);
    }

    static patch(uri, data) {
        return request("PATCH", uri, data);
    }

    static delete(uri) {
        return request("DELETE", uri);
    }
}

function request(method, uri, data) {
    console.log(method + " " + uri + " " + JSON.stringify(data));

    if (method === "GET" && uri === "notifications") {
        return new Promise((resolve) => {
            resolve({
                meta: {
                    status: 200,
                    links: {}
                },
                data: {
                    items: [
                        {
                            id: 1,
                            name: "Lorem Ipsum",
                            description: "Lorem Ipsum ... {{Person:Person ...}}.",
                            query: "SELECT * FROM ... WHERE x = 1",
                            checkPeriod: 600,
                            sendThreshold: 86400
                        }
                    ]
                }
            });
        });
    }

    if (method === "GET" && uri === "notifications/1") {
        return new Promise((resolve) => {
            resolve({
                meta: {
                    status: 200,
                    links: {}
                },
                data: {
                    id: 1,
                    name: "Lorem Ipsum",
                    description: "Lorem Ipsum ... {{Person:Person ...}}.",
                    query: "SELECT * FROM ... WHERE x = 1",
                    checkPeriod: 600,
                    sendThreshold: 86400
                }
            });
        });
    }

    if (method === "GET" && uri === "experiments") {
        return new Promise((resolve) => {
            resolve({
                meta: {
                    status: 200,
                    links: {}
                },
                data: {
                    items: [
                        {
                            id: 1,
                            title: "Lorem Ipsum",
                            description: "Lorem Ipsum ... {{Person:Person ...}}.",
                            algorithmTaskChooser: "",
                            algorithmQualityAnswer: "",
                            algorithmQualityRating: "",
                            ratingPerAnswer: 5,
                            paymentBase: 0,
                            paymentAnswer: 10,
                            paymentRating: 5,
                            constraints: [
                                {
                                    name: "rassistisch"
                                }
                            ],
                            tags: [
                                {
                                    name: "Lorem"
                                }
                            ]
                        }
                    ]
                }
            });
        });
    }

    if (method === "GET" && uri === "experiments/1") {
        return new Promise((resolve) => {
            resolve({
                meta: {
                    status: 200,
                    links: {}
                },
                data: {
                    id: 1,
                    title: "Lorem Ipsum",
                    description: "Lorem Ipsum ... {{Person:Person ...}}.",
                    algorithmTaskChooser: "",
                    algorithmQualityAnswer: "",
                    algorithmQualityRating: "",
                    ratingPerAnswer: 5,
                    paymentBase: 0,
                    paymentAnswer: 10,
                    paymentRating: 5,
                    constraints: [
                        {
                            name: "rassistisch"
                        }
                    ],
                    tags: [
                        {
                            name: "Lorem"
                        }
                    ]
                }
            });
        });
    }

    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(method, config.apiRoot + uri, true);
        xhr.setRequestHeader("Authorization", "Basic " + btoa(credentials.username + ":" + credentials.password));

        xhr.onreadystatechange = function () {
            if (this.readyState !== 4) {
                return;
            }

            let body = this.responseText;
            let data = null;

            if (body !== "") {
                try {
                    data = JSON.parse(body);
                } catch (e) {
                    reject(new HttpException(e));
                    return;
                }
            }

            if (this.status === 200 || this.status === 201 || this.status === 204) {
                resolve({
                    meta: {
                        status: this.status,
                        links: {
                            // TODO: Parse Links
                        }
                    },
                    data: data
                });
            } else {
                reject({
                    meta: {
                        status: this.status,
                        links: {}
                    },
                    data: data || {
                        code: "unknown",
                        detail: "No response provided!"
                    }
                });
            }
        };

        if (typeof data !== "undefined") {
            xhr.setRequestHeader("content-type", "application/json");
            xhr.send(JSON.stringify(data));
        } else {
            xhr.send();
        }
    });
}

export default Backend;