import Template from "../../src/js/core/Template";

describe("Template", () => {
    it("should be empty without placeholders", () => {
        var result = Template.parse("");
        result.should.be.empty;
    });

    it("should find all placeholders", () => {
        var result = Template.parse("{{1}} {{2}} {{3}}");
        result.should.have.keys("1", "2", "3");
    });

    it("should throw on apply with missing data", () => {
        var template = "{{1}}";

        (() => Template.apply(template)).should.throw();
        (() => Template.apply(template, {2: "OK"})).should.throw();
    });

    it("should throw on apply with additional data", () => {
        var template = "{{1}}";

        (() => Template.apply(template, {1: "OK", 2: "OK"})).should.throw();
    });

    it("should throw on apply with data but without placeholders", () => {
        var template = "";

        (() => Template.apply(template, {1: "OK", 2: "OK"})).should.throw();
    });

    it("should not throw on valid apply", () => {
        var template = "{{1}}";

        (() => Template.apply(template, {1: "OK"})).should.not.throw();
    });

    it("should not throw on valid apply with multiple placeholders", () => {
        var template = "{{1}} {{2}}";

        (() => Template.apply(template, {1: "OK", 2: "FOO"})).should.not.throw();
    });

    it("should merge placeholders with same name", () => {
        var template = "{{1}} {{1}}";

        (() => Template.apply(template, {1: "OK"})).should.not.throw();

        var result = Template.apply(template, {1: "OK"}).should.equal("OK OK");
    });
});