import { INIT_STATEFUL_COMPONENT_STATE_FROM_PROPS, INIT_STATEFUL_COMPONENT } from "./action-constant";

/**
 *
 * @param reducer
 * @param stateSelector
 * @returns {Function}
 */

const reusableReducer = (reducer, stateSelector) => (state, action) => {
  if (action.stateSelector === stateSelector) {
    if (action.type === INIT_STATEFUL_COMPONENT) {
      return reducer(state, action);
    } else if (action.type === INIT_STATEFUL_COMPONENT_STATE_FROM_PROPS) {
      return reducer({ ...state, ...action.defaultState }, action);
    }
    return reducer(state, action);
  }
  return reducer(state, action);
};

export { reusableReducer };
