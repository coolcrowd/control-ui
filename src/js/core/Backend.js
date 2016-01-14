import HttpException from "./HttpException";
import history from "../history";

const root = "http://localhost:3000/";

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
    if (method === "GET" && uri === "templates") {
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
                            name: "Mean Tweet",
                            content: "Lorem Ipsum ... {{Person:Person ...}}."
                        }
                    ]
                }
            });
        });
    }

    if (method === "GET" && uri === "templates/1") {
        return new Promise((resolve) => {
            resolve({
                meta: {
                    status: 200,
                    links: {}
                },
                data: {
                    id: 1,
                    name: "Mean Tweet",
                    content: "Lorem Ipsum ... {{Person:Person ...}}."
                }
            });
        });
    }

    if (method === "DELETE" && uri === "templates/1") {
        return new Promise((resolve) => {
            resolve({
                meta: {
                    status: 204,
                    links: {}
                },
                data: null
            });
        });
    }

    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(method, root + uri, true); // TODO: Username + Password

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

            if (this.status === 200 || this.status === 201) {
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