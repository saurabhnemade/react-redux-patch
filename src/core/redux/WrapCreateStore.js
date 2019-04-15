import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

export default function WrapCreateStore(moduleName,
                                        reducers,
                                        initialState,
                                        userSpecifiedMiddleWares) {
    const appName = `MODULE_${moduleName}`;
    /* eslint-disable no-underscore-dangle */
    const composeEnhancers = typeof window === 'object'
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            name: appName,
            shouldHotReload: false,
            shouldRecordChanges: true,
            pauseActionType: '@@MODULE_PAUSE_DEVTOOLS',
            autoPause: false,
            shouldCatchErrors: true,
        }) : compose;
    /* eslint-enable no-underscore-dangle */

    /* eslint-disable global-require */
    let middleware = [thunk];
    /* eslint-enable global-require */
    middleware = middleware.concat(userSpecifiedMiddleWares);
    const enhancer = composeEnhancers(
        applyMiddleware(...middleware),
        // other store enhancers if any
    );

    const store = createStore(combineReducers(reducers), initialState, enhancer);
    store.initialReducers = reducers;
    store.asyncReducers = {};
    return store;
}
