import React from "react";
import history from "../../history";
import Backend from "../../core/Backend";
import Loader from "../../core/Loader";
import ResourceList from "./../base/ResourceList";

class NotificationList extends ResourceList {
    getDataUri() {
        return "notifications";
    }

    getInfo() {
        return {
            headline: "Notifications",
            description: "Info about notifications …"
        }
    }
}

export default NotificationList;