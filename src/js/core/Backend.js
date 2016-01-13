import HttpException from "./HttpException";
import history from "../history";

class Backend {
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
                    templates: [
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

    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(method, uri, true); // TODO: Username + Password

        xhr.onreadystatechange = function () {
            if (this.readyState !== 4) {
                return;
            }

            if (this.status === 200) {
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

                resolve({
                    meta: {
                        status: this.status,
                        links: {
                            // TODO: Parse Links
                        }
                    },
                    data: data
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