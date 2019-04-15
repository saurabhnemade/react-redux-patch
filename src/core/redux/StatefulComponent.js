import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, combineReducers } from 'redux';
import { connect } from 'react-redux';
import { get, assign, unset, keys, forEach, memoize, pick /* , filter, cloneDeep*/ } from 'lodash';
import { pathMapReducer, composeReducers } from './ReducerUtils';

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
    class StatefulComponent extends PureComponent {
        static contextTypes = {
            store: PropTypes.object,
            parentStateSelector: PropTypes.string,
            history: PropTypes.object,
        }

        static childContextTypes = {
            parentStateSelector: PropTypes.string,
            history: PropTypes.object,
        };


        static getBasePropTypes() {
            return BaseComponent.propTypes || {};
        }


        constructor(props, context) {
            super(props, context);
            this.connectRedux();
        }


        getChildContext() {
            return {
                parentStateSelector: this.getStateSelector(),
                history: this.context.history,
            };
        }


        componentWillUnmount() {
            // this.disconnectRedux();
        }


        getStateSelector() {
            if (!stateSelector) {
                if (!inheritStateSelector) {
                    return BaseComponent.name;
                }
                return `${this.context.parentStateSelector}.${BaseComponent.name}`;
            }
            if (!inheritStateSelector) {
                return stateSelector;
            }
            return `${this.context.parentStateSelector}.${stateSelector}`;
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
            keys(this.context.store.asyncReducers).forEach((key) => {
                t.push(pathMapReducer(key, this.context.store.asyncReducers[key]));
            });

            t.unshift(combineReducers(this.context.store.initialReducers));
            return composeReducers(t);
        }

        disconnectRedux() {
            unset(this.context.stroe.asyncReducers, this.getStateSelector());
            this.context.store.replaceReducer(combineReducers({
                ...this.context.store.initialReducers,
                ...this.context.store.asyncReducers,
            }));
        }

        combineDynamicReducers(path, reducer) {
            this.context.store.asyncReducers = {
                ...this.context.store.asyncReducers,
                [path]: reusableReducer(reducer, path),
            };
            return this.getComposedReducers();
        }

        /**
         * This is for initializing the stateful Component
         * @param {string} fullSelector
         */
        postConnect(fullSelector) {
            this.context.store.dispatch({
                stateSelector: fullSelector,
                type: INIT_STATEFUL_COMPONENT,
            });
            const propsWithDefaultState = this.getInitProps().map(prop => prop.key.stateKey);
            if (propsWithDefaultState.length) {
                this.context.store.dispatch({
                    stateSelector: fullSelector,
                    type: INIT_STATEFUL_COMPONENT_STATE_FROM_PROPS,
                    defaultState: pick(this.props, propsWithDefaultState),
                });
            }
        }

        connectRedux() {
            const fullSelector = this.getStateSelector(stateSelector);
            const combinedReducers = this.combineDynamicReducers(this.getStateSelector(), Reducer);
            this.context.store.replaceReducer(combinedReducers);
            this.Component = connect(mapStateToProps(fullSelector, this.getConnectedProps()),
                (dispatch) => bindActionCreators(Actions, wrapDispatch(dispatch, fullSelector))
            )(BaseComponent);
            this.postConnect(fullSelector);
        }

        render() {
            const Component = this.Component;
            return <Component {...this.props} />;
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
