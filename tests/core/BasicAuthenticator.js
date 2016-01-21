import BasicAuthenticator from "../../src/js/core/BasicAuthenticator";

describe("Authenticator", () => {
    it("should return a correct `authorization` header", () => {
        (new BasicAuthenticator("abc", "123")).getAuthorization().should.be.equal("Basic " + btoa("abc:123"));
    });
});