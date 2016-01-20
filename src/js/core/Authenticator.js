class Authenticator {
    /**
     * Constructs the authorization header for use in HTTP requests.
     */
    getAuthorization() {
        return "";
    }

    /**
     * Returns a form to gather the required information.
     */
    static getForm() {
        return null;
    }

    /**
     * Constructs a new instance from the form.
     */
    static fromForm(form) {
        return new Authenticator;
    }
}

export default Authenticator;