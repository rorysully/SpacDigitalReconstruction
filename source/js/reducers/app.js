import update from 'immutability-helper';
import { EnumModelActions } from '../ui/modelViewer/ModelActions';

const initialState = {
    showModel: false,
    showModalOpen: false,
    showModal: true,
};

const app = (state, action) => {

    if (typeof state === 'undefined') {
        return initialState
    }

    let newState = null;

    //console.log('[Reducer app] action: ' + action.type);
    switch (action.type) {
        case "INIT":
            console.warn('INIT');
        case EnumModelActions.APP_CHANGE_MODEL:
            console.log('APP_CHANGE_MODEL');
            return update(state, action.result);
        case EnumModelActions.APP_CHANGE_SHOW_MODAL:
            console.log("APP_CHANGE_SHOW_MODAL");
            return update(state, action.result);

        default:
            return state
    }
}

export default app