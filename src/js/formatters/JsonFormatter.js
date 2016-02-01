/**
 * @author Niklas Keller
 * @see http://www.json.org/
 */
class JsonFormatter {
    /**
     * Constructs a new instance.
     * @param space number of spaces that should be used for indentation
     */
    constructor(space) {
        this.space = space || 2;
    }

    /**
     * Formats an array of objects into a JSON formatted string.
     * @param data
     * @returns {string}
     */
    format(data) {
        return JSON.stringify(data, null, this.space);
    }
}

export default JsonFormatter;