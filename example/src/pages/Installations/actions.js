const Actions = {
    appInitialized: () => dispatch => {
    dispatch({
        type: 'APP_INITIALIZED_SUCCESS2',
    });
    dispatch({
      type: 'INCREMENT_ASYNC'
    });
  },
};

export default Actions;
