import Authenticator from "../../src/js/core/Authenticator";

describe("Authenticator", () => {
    it("should return empty `authorization` header", () => {
        (new Authenticator).getAuthorization().should.be.empty;
    });
});