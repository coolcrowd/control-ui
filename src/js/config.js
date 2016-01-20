let config = {
    apiRoot: "/api/",
    authentication: false
};

try {
    let localConfig = require("./config.local.js").default;
    Object.assign(config, localConfig);
} catch (e) {
    if (!e.message.startsWith("Cannot find module")) {
        throw e;
    }
}

export default config;