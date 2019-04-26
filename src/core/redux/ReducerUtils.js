import get from 'lodash/get';
import set from 'lodash/set';


/**
 * Default reducer in case user does not pass reducer
 * @param state
 * @returns {{[p: string]: *}}
 */
const defaultReducer = (state) => {
  return {
    ...state,
    "__name__": "defaultReducer",
  };
};

/**
 * To create dynamic action creator
 */
function dynamicActionGenerator() {
    return `@@TEST-REDUCER-VALIDITY/${Math.random().toString(36).substring(7).split('')
        .join('\\')}`;
}
/**
 * To check validity of a given reducer
 *
 * @param {function} reducer
 * @param {boolean} throwError
 */
function isValidReducer(reducer, throwError = false) {
    if (typeof reducer !== 'function') {
        if (throwError) {
            throw new Error('You did not passed a valid reducer. ' +
                'A reducer must be a function with two parameters state and action');
        } else {
            return false;
        }
    }

    const initialState = reducer(undefined, { type: dynamicActionGenerator() });
    if (typeof initialState === 'undefined') {
        if (throwError) {
            throw new Error('Reducer must return state!!!.');
        } else {
            return false;
        }
    }

    return true;
}

/**
 * Wrapper for reducer at given path
 * @param {path} key
 * @param {function} reducer
 */
const pathMapReducer = (key, reducer) => (state, action) => {
    const newSubState = { ...reducer(get(state, key), action) };
    if (typeof newSubState === 'undefined') {
        throw new Error(`The '${key}' reducer must not return undefined.`);
    }

    /**
     * Be careful about mutation!!!
     */

    Object.assign({}, state);
    let initialState = Object.assign({}, state);
    initialState = set(initialState, key, newSubState);
    return initialState;
};

/**
 * Wrapper for combining pathMapReducers to return single reducer
 * @param {[function, function]} reducers
 */
const composeReducers = (...reducers) => (state, action) => {
    let nextState = Object.assign({}, state);
    reducers.forEach((reducer) => {
        if (typeof reducer === 'function') {
          nextState = reducer(nextState, action);
        } else {
            reducer.forEach((pathMapReducer) => {
                nextState = pathMapReducer(nextState, action);
            });
        }
    });
    return nextState;
};
/* eslint-disable no-param-reassign, new-cap, no-shadow */

export { isValidReducer, composeReducers, pathMapReducer, defaultReducer };
