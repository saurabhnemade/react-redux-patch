import Constant from './constant';
const INITIAL_STATE = { name: 'Unknown' };

const Reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case Constant.APP_INITIALIZE_NAME:
            return {
              ...state,
              name: action.name
            };
        default:
            return state;
    }
};

export default Reducer;
