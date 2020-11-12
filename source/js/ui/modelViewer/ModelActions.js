
const EnumModelActions = Object.freeze({
    APP_CHANGE_MODEL: "APP_CHANGE_MODEL",
    APP_CHANGE_SHOW_MODAL: "APP_CHANGE_SHOW_MODAL",
});

export { EnumModelActions };

class ModelActions {
    constructor() {
    }

    terminateModal() {
        return function (dispatch, getState) {
            dispatch({
                type: EnumModelActions.APP_CHANGE_SHOW_MODAL,
                result: {
                    showModal: { $set: false }
                }
            })
        }
    }

    onModelLoad() {
        return function (dispatch, getState) {
            dispatch({
                type: EnumModelActions.APP_CHANGE_MODEL,
                result: {
                    showModalOpen: { $set: true },
                    showModel: { $set: true }
                }
            });
        }
    }

    onModelUnmount() {
        return function (dispatch, getState) {
            dispatch({
                type: EnumModelActions.APP_CHANGE_MODEL,
                result: {
                    showModel: { $set: false },
                }
            })
        }
    }

}

export default ModelActions = new ModelActions;