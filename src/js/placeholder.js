class Placeholder {
    static parse(text) {
        // format: {{name:type}}
        // type defaults to "text" if not present

        let expr = new RegExp("\{\{([a-z\-_]+)(?::([a-z\-_]+))?\}\}", "g");
        let matches = {};
        let match;

        while (match = expr.exec(text)) {
            matches[match[1]] = matches[match[1]] || [];
            matches[match[1]].push({
                type: match[2] || "text",
                start: match.index,
                end: match.index + match[0].length
            });
        }

        return matches;
    }

    static apply(text, data) {
        let placeholders = this.parse();

        placeholders.forEach((positions, name) => {
            if (name in data) {
                positions.forEach((position) => {
                    text = text.substr(0, position.start) + data[name] + text.substr(position.end);
                });
            }
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

            placeholders[name].forEach((position) => {
                type = type || position.type;

                if (type !== position.type) {
                    warnings.push("Two different types have been found for placeholder '" + name + "': '" + type + "', '" + position.type + "'");
                }
            });
        }

        return warnings;
    }
}

export default Placeholder;