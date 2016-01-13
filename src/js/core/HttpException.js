class HttpException {
    constructor(message) {
        this.message = message;
        this.name = "HttpException";
    }
}

export default HttpException;