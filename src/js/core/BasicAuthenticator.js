import React from "react";
import Authenticator from "./Authenticator";
import Login from "../components/Login";

class BasicAuthenticator extends Authenticator {
    constructor(username, password) {
        super();

        this.authorization = "Basic " + btoa(username + ":" + password);
    }

    /**
     * Constructs the authorization header for use in HTTP requests.
     */
    getAuthorization() {
        return this.authorization;
    }
}

export default BasicAuthenticator;