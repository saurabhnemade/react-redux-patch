/**
 * Utility function to create function returning dynamic mapDispatchToProps function based on actions passed
 * @param dispatch
 * @returns {function(*=): *}
 */
const mapDispatchToProps = (dispatch) => {
  const wrappedDispatch = (action) => {
    let wrappedAction;
    wrappedAction = (_dispatch, getState) => action(wrappedDispatch, getState);
    if (typeof action === 'function') {
      wrappedAction = (_dispatch, getState) => action(wrappedDispatch, getState);
    } else if (typeof action === 'object') {
      wrappedAction = Object.assign({}, { ...action });
    }
    return dispatch(wrappedAction);
  };

  return wrappedDispatch;
};


export { mapDispatchToProps };
