import "../core/Dispatcher";
import "../constants/ExperimentConstants";
import EventEmitter from "events";

const CHANGE_EVENT = "change";

var _experiments = {};

function destroy(id) {
    delete _experiments[id];
}

class ExperimentStore extends EventEmitter {
    static getAll() {
        return _experiments;
    }

    static emitChange() {
        this.emit(CHANGE_EVENT);
    }

    static addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    static removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
}

Dispatcher.register((action) => {
    switch(action.actionType) {
        case ExperimentConstants.EXPERIMENT_DESTROY:
            destroy(action.id);
            ExperimentStore.emitChange();
            break;

        default:
            // no op
    }
});

export default ExperimentStore;