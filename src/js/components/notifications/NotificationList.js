import React from "react";
import history from "../../history";
import ResourceList from "./../base/ResourceList";

class NotificationList extends ResourceList {
    getCollectionUri(query) {
        if (typeof query !== "undefined") {
            return "notifications?" + query;
        }

        return "notifications";
    }

    getInfo() {
        return {
            icon: "bell-o",
            headline: "Notifications",
            description: "Create your own notifications to receive e-mails whenever something interesting happens. " +
            "No need to log into any control panel. Use the full power of SQL."
        }
    }
}

export default NotificationList;