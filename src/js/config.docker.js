let meta = (name) => {
    var metas = document.getElementsByTagName("meta");

    for (var i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute("name") == name) {
            return metas[i].getAttribute("content");
        }
    }

    return "";
};

let config = {
    apiRoot: meta("crowdcontrol:api:url"),
    authentication: meta("crowdcontrol:api:auth") === "true"
};

export default config;