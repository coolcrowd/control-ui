let config = {
    apiRoot: "/api/",
    authentication: false
};

try {
    Object.assign(config, require("./config.local.js").default);
} catch (e) { }

export default config;