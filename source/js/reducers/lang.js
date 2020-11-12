import update from 'immutability-helper';

import LanguageActions, { EnumLanguageActions } from "../ui/LanguageActions.js";

import langAl from '../../stubs/lang-al.json';
import langEn from '../../stubs/lang-en.json';

const initialState = {
    language: "en",
    labels: langEn.labels,
};

const app = (state, action) => {

    if (typeof state === 'undefined') {
        return initialState;
    }

    let newState = null;

    //console.log('[Reducer app] action: ' + action.type);
    switch (action.type) {
        case "INIT":
            console.warn('INIT');
        case EnumLanguageActions.CHANGE_LANG:
            console.warn('CHANGE LANGUAGE');
            return update(state, action.result);

        default:
            return state
    }
}

export default app