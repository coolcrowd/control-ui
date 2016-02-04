let config = {
    apiRoot: "http://localhost:4567/",
    authentication: false
};

try {
    Object.assign(config, require("./config.local.js").default);
} catch (e) { }

export default config;
