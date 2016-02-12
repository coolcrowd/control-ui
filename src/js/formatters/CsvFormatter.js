/**
 * @author Niklas Keller
 * @see https://en.wikipedia.org/wiki/Comma-separated_values
 */
class CsvFormatter {
    /**
     * Constructs a new instance.
     * @param recordSeparator record separator or <code>\r\n</code> if not specified
     * @param fieldSeparator field separator or <code>;</code> if not specified
     * @param textLimit text limit character or <code>"</code> if not specified
     */
    constructor(recordSeparator, fieldSeparator, textLimit) {
        this.recordSeparator = recordSeparator || "\r\n";
        this.fieldSeparator = fieldSeparator || ";";
        this.textLimit = textLimit || "\"";
    }

    /**
     * Formats an array of objects into a CSV formatted string.
     * @param data array of objects to format
     * @returns {string}
     */
    format(data) {
        let contents = "";
        let keys = Object.keys(data[0] || {});

        for (let i = 0; i < keys.length; i++) {
            contents += this.encodeColumn(keys[i]) + this.fieldSeparator;
        }

        contents += this.recordSeparator;

        data.forEach((item) => {
            let line = "";

            for (let i = 0; i < keys.length; i++) {
                // Append value enclosed in text limits and add field separator
                line += this.encodeColumn(item[keys[i]]) + this.fieldSeparator;
            }

            contents += line + this.recordSeparator;
        });

        return contents;
    }

    encodeColumn(value) {
        if (value instanceof Array || typeof value === "object") {
            console.warn("Invalid CSV value.", value);
            value = "";
        }

        if (typeof value === "number") {
            value = value + "";
        }

        if (!value) {
            value = "";
        }

        // Escape all text limit occurrences by duplicating those characters
        // Yes, javascript still doesn't have a global string replace…
        value = value.split(this.textLimit).join(this.textLimit + this.textLimit);

        // Return value enclosed in text limits
        return this.textLimit + value + this.textLimit;
    }
}

export default CsvFormatter;