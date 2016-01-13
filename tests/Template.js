import Template from "../src/js/core/Template";

describe("Template", () => {
    it("should be empty without placeholders", () => {
        var result = Template.parse("");
        result.should.be.empty;
    });

    it("should find all placeholders", () => {
        var result = Template.parse("{{1}} {{2}} {{3}}");
        result.should.have.keys("1", "2", "3");
    });
});