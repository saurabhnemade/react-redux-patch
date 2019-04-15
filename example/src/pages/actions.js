const Actions = {
    appInitialized: () => dispatch => {
    dispatch({
        type: 'APP_INITIALIZED_SUCCESS',
    });
},
};

export default Actions;