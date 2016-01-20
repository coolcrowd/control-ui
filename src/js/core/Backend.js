import HttpException from "./HttpException";
import history from "../history";
import parseLinkHeader from "parse-link-header";

/**
 * Talks to the backend.
 *
 * @author Niklas Keller
 */
class Backend {
    /**
     * Constructs a new instance.
     *
     * @param root API root URI.
     * @param authenticator Authenticator to use.
     */
    constructor(root, authenticator) {
        this.root = root;
        this.authenticator = authenticator;
    }

    /**
     * Makes a HTTP request.
     *
     * @param method HTTP method
     * @param uri URI
     * @param data data to send
     * @returns {Promise}
     */
    request(method, uri, data) {
        Backend._log(method + " " + uri);

        if (typeof data !== "undefined") {
            Backend._log(data);
        }

        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(method, this.root + uri, true);
            xhr.setRequestHeader("Authorization", this.authenticator.getAuthorization());

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
                        Backend._log("Couldn't parse response body…");

                        reject(new HttpException(e));

                        return;
                    }
                }

                if (this.status === 200 || this.status === 201 || this.status === 204) {
                    resolve({
                        meta: {
                            status: this.status,
                            links: parseLinkHeader(this.getResponseHeader("Link")) || {}
                        },
                        data: data
                    });
                } else {
                    reject({
                        meta: {
                            status: this.status,
                            links: parseLinkHeader(this.getResponseHeader("Link")) || {}
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

    static _log(message) {
        if (typeof console !== "undefined") {
            console.log(message);
        }
    }
}

export default Backend;