import React, { PureComponent } from 'react';
import { bindActionCreators, combineReducers } from 'redux';
import { connect } from 'react-redux';
import memoize from 'lodash/memoize';
import get from 'lodash/get';
import assign from 'lodash/assign';
import unset from 'lodash/unset';
import keys from 'lodash/keys';
import omit from 'lodash/omit';
import forEach from 'lodash/forEach';
import { pathMapReducer, composeReducers } from './ReducerUtils';
import StoreContext from "../Context/StoreContext";
import withAllContext from "../Context/withAllContext";
import RouteContext from "../Context/RouteContext";
import ParentStateSelectorContext from "../Context/ParentStateSelectorContext";

const INIT_STATEFUL_COMPONENT = '@@INIT_STATEFUL_COMPONENT';
const INIT_STATEFUL_COMPONENT_STATE_FROM_PROPS = '@@INIT_STATEFUL_COMPONENT_STATE_FROM_PROPS';


const getMeorizedStatePath = memoize(stateSelector => {
    if (stateSelector.indexOf('|') === -1) {
        return stateSelector;
    }
    const path = stateSelector.split('|');
    return path[0].split('.').concat(path[1]);
});

const mapStateToProps = (stateSelector, props) => (state, ownProps) => {
    const subState = get(state, getMeorizedStatePath(stateSelector));
    const mappedProps = {};

    forEach(props, (descriptor) => {
        if (descriptor.key.initStateFromGlobalPath) {
            mappedProps[descriptor.name] = get(state, descriptor.key.stateKey);
        } else {
            mappedProps[descriptor.name] = get(subState, descriptor.key.stateKey);
        }
    });
    return assign({}, ownProps, mappedProps);
};

const wrapDispatch = (dispatch, stateSelector) => {
    const wrappedDispatch = (action) => {
        let wrappedAction;
        wrappedAction = (_dispatch, getState) => action(wrappedDispatch, getState);
        if (typeof action === 'function') {
            wrappedAction = (_dispatch, getState) => action(wrappedDispatch, getState);
        } else if (typeof action === 'object') {
            /* Not yet confortable with messing up with other stateselectors
            * Need to take decision whether to implement it
            * as it would make strict reducers which may be a good thing?
            if (typeof action.stateSelectorOverride !== 'undefined') {
                wrappedAction = { ...action, stateSelector: action.stateSelectorOverride };
            } */
            wrappedAction = Object.assign({}, { ...action, stateSelector });
        }
        return dispatch(wrappedAction);
    };

    return wrappedDispatch;
};

/**
 * Write once, use multiple times!!!
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

const StatefulComponentDecorator = (BaseComponent,
                                    Actions,
                                    Reducer,
                                    stateSelector,
                                    inheritStateSelector) => {
    @withAllContext
    class StatefulComponent extends PureComponent {
        static getBasePropTypes() {
            return BaseComponent.propTypes || {};
        }


        constructor(props) {
            super(props);
            this.connectRedux();
        }

        componentWillUnmount() {
            // this.disconnectRedux();
        }


        getStateSelector() {
            if (!stateSelector) {
                if (!inheritStateSelector) {
                    return BaseComponent.name;
                }
                return `${this.props.parentStateSelector}.${BaseComponent.name}`;
            }
            if (!inheritStateSelector) {
                return stateSelector;
            }
            return `${this.props.parentStateSelector}.${stateSelector}`;
        }

        getConnectedProps() {
            const props = [];
            Object.entries(StatefulComponent.getBasePropTypes()).forEach(prop => {
                if (prop[1].isMapped) {
                    props.push({
                        name: prop[0],
                        key: prop[1],
                    });
                }
            });
            return props;
        }

        getInitProps() {
            const props = [];
            Object.entries(StatefulComponent.getBasePropTypes()).forEach(prop => {
                if (prop[1].isMapped && (prop[1].initStateFromProp || prop[1].initStateFromGlobalPath)) {
                    props.push({
                        name: prop[0],
                        key: prop[1],
                    });
                }
            });
            return props;
        }

        getComposedReducers() {
            const t = [];

            keys(this.props.store.initialReducers).forEach((key) => {
              t.push(pathMapReducer(key, this.props.store.initialReducers[key]));
            });

            keys(this.props.store.asyncReducers).forEach((key) => {
                t.push(pathMapReducer(key, this.props.store.asyncReducers[key]));
            });

            //t.unshift(combineReducers(this.props.store.initialReducers));
            //TODO: Convert these to pathMapReducers, each one with keys. Reduce-Reducer does not take combineReducers
           //t.unshift(this.props.store.initialReducers);
            return composeReducers(t);
        }

        disconnectRedux() {
            unset(this.props.stroe.asyncReducers, this.getStateSelector());
            this.props.store.replaceReducer(combineReducers({
                ...this.props.store.initialReducers,
                ...this.props.store.asyncReducers,
            }));
        }

        combineDynamicReducers(path, reducer) {
            this.props.store.asyncReducers = {
                ...this.props.store.asyncReducers,
                [path]: reusableReducer(reducer, path),
            };
            return this.getComposedReducers();
        }

        /**
         * This is for initializing the stateful Component
         * @param {string} fullSelector
         */
        postConnect(fullSelector) {
            this.props.store.dispatch({
                stateSelector: fullSelector,
                type: INIT_STATEFUL_COMPONENT,
            });
            const propsWithDefaultState = this.getInitProps().map(prop => prop.key.stateKey);
            if (propsWithDefaultState.length) {
                this.props.store.dispatch({
                    stateSelector: fullSelector,
                    type: INIT_STATEFUL_COMPONENT_STATE_FROM_PROPS,
                    defaultState: pick(this.props, propsWithDefaultState),
                });
            }
        }

        connectRedux() {
            const fullSelector = this.getStateSelector(stateSelector);
            const combinedReducers = this.combineDynamicReducers(this.getStateSelector(), Reducer);
            this.props.store.replaceReducer(combinedReducers);
            this.Component = connect(mapStateToProps(fullSelector, this.getConnectedProps()),
                (dispatch) => bindActionCreators(Actions, wrapDispatch(dispatch, fullSelector))
            )(BaseComponent);
            this.postConnect(fullSelector);
        }

        render() {
            const Component = this.Component;
            return (
              <RouteContext.Provider value={this.props.routes}>
                <StoreContext.Provider value={this.props.store}>
                  <ParentStateSelectorContext.Provider value={this.getStateSelector()}>
                    <Component {...omit(this.props, ["router", "store", "parentStateSelector"])} />
                  </ParentStateSelectorContext.Provider>
                </StoreContext.Provider>
              </RouteContext.Provider>
            );
        }
    }

    return StatefulComponent;
};

/* eslint-disable new-cap */
const StatefulComponent = (...args) => {
    if (typeof args[0] === 'function') {
        return StatefulComponentDecorator(...args);
    }
    return (BaseComponent) => StatefulComponentDecorator(BaseComponent, ...args);
};
/* eslint-enable new-cap */

export default StatefulComponent;
