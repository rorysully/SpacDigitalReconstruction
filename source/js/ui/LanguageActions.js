import langEn from '../../stubs/lang-en.json';
import langAl from '../../stubs/lang-al.json';

const EnumLanguageActions = Object.freeze({
    CHANGE_LANG: "CHANGE_LANG",
});

export { EnumLanguageActions };

export function i18nlabels(labels, code, def) {
    let ret = labels[code];
    if (ret) {
        return ret;
    } else {
        return def + '*';
    }
}

class LanguageActions {
    constructor() {
    }

    i18n(code, def) {
        return function (dispatch, getState) {
            let ret = getState().lang.labels[code];
            if (ret) {
                return ret;
            } else {
                return def + '*';
            }
        }
    }

    changeLang(lang) {
        return function (dispatch, getState) {
            let labels = [];
            if (lang === 'en') {
                labels = langEn.labels;
            } else if (lang === 'al') {
                labels = langAl.labels;
            } else {
                throw 'Error no language specified';
            }

            let langChange = {
                language: { $set: lang },
                labels: { $set: labels }
            }

            dispatch({ type: EnumLanguageActions.CHANGE_LANG, result: langChange });
            return lang;
        }
    }

}

export default LanguageActions = new LanguageActions;