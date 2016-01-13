import TemplateException from "./TemplateException";

class Template {
    static parse(text) {
        // format: {{name:description:type}}
        // type defaults to "text" if not present

        let expr = new RegExp("\{\{([^:{}]+)(?::([^:{}]+))?(?::([^:{}]+))?\}\}", "g");
        let matches = {};
        let match;

        while (match = expr.exec(text)) {
            if (!(match[1] in matches)) {
                matches[match[1]] = {
                    name: match[1],
                    description: match[2] || "",
                    type: match[3] || "text",
                    positions: []
                };
            }

            matches[match[1]].positions.push({
                start: match.index,
                end: match.index + match[0].length
            });
        }

        return matches;
    }

    static apply(text, data) {
        let placeholders = this.parse(text);
        let missing = [];
        let ops = [];

        for (var name in placeholders) {
            if (!placeholders.hasOwnProperty(name)) {
                continue;
            }

            if (name in data) {
                placeholders[name].positions.forEach((position) => {
                    ops.push({
                        start: position.start,
                        end: position.end,
                        replacement: data[name]
                    });
                });
            } else {
                missing.push(name);
            }
        }

        if (missing.length > 0) {
            throw new TemplateException("The following parameters have been missing in parameter data: " + missing.join(", "));
        }

        if (Object.keys(placeholders).length === 0 && Object.keys(data).length !== 0) {
            throw new TemplateException("No placeholders found, but data has been passed and wasn't empty!");
        }

        if (JSON.stringify(Object.keys(placeholders)) !== JSON.stringify(Object.keys(data))) {
            throw new TemplateException("Placeholders do not match the ones defined in the template!");
        }

        ops.sort((a, b) => {
            if (a.start < b.start) {
                return -1;
            }

            if (a.start > b.start) {
                return 1;
            }

            if (a.end < b.end) {
                return -1;
            }

            if (a.end > b.end) {
                return 1;
            }

            return 0;
        });

        let offset = 0;

        ops.forEach((op) => {
            text = text.substring(0, op.start + offset) + op.replacement + text.substring(op.end + offset);
            offset += op.replacement.length - (op.end - op.start);
        });

        return text;
    }

    static check(placeholders) {
        let warnings = [];

        for (var name in placeholders) {
            if (!placeholders.hasOwnProperty(name)) {
                continue;
            }

            let type;

            placeholders[name].positions.forEach((position) => {
                type = type || position.type;

                if (type !== position.type) {
                    warnings.push("Two different types have been found for placeholder '" + name + "': '" + type + "', '" + position.type + "'");
                }
            });
        }

        return warnings;
    }
}

export default Template;