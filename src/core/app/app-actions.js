import Constants from './constant';

const Actions = {
    appInitialized: name => dispatch => {
      dispatch({
          type: Constants.APP_INITIALIZE_NAME,
          name
      });
    },
};

export default Actions;
