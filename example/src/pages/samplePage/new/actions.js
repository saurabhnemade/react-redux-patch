const Actions = {
    _appInitialized: () => dispatch => {
    dispatch({
        type: 'NEW_PAGE_REDUCER',
    });
    dispatch({
      type: 'INCREMENT_ASYNC_2'
    });
  },
};

export default Actions;
