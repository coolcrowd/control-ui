/**
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

        data.forEach((item) => {
            let line = "";

            for (let key in item) {
                // Escape all text limit occurrences by duplicating those characters
                // Yes, javascript still doesn't have a global string replace…
                let value = item[key].split(this.textLimit).join(this.textLimit + this.textLimit);

                // Append value enclosed in text limits and add field separator
                line += this.textLimit + value + this.textLimit + this.fieldSeparator;
            }

            contents += line + this.recordSeparator;
        });

        return contents;
    }
}

export default CsvFormatter;