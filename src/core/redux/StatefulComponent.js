import React, { Fragment, PureComponent } from 'react';
import { bindActionCreators, combineReducers } from 'redux';
import { connect } from 'react-redux';
import unset from 'lodash/unset';
import keys from 'lodash/keys';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import {pathMapReducer, composeReducers, isValidReducer, defaultReducer} from './ReducerUtils';
import withAllContext from "../Context/withAllContext";
import ParentStateSelectorContext from "../Context/ParentStateSelectorContext";

import { INIT_STATEFUL_COMPONENT, INIT_STATEFUL_COMPONENT_STATE_FROM_PROPS } from "./action-constant";
import { mapStateToProps } from "./MapStateToPropBuilder";
import { mapDispatchToProps } from "./MapDispatchToPropsBuilder";
import { reusableReducer } from "./ReusableReducer";

const StatefulComponentDecorator = (BaseComponent,
                                    Actions,
                                    Reducer,
                                    stateSelector,
                                    inheritStateSelector) => {
    //TODO: Need to check if component is valid react component
    if(!BaseComponent) {
      BaseComponent=(<Fragment/>);
    }

    Actions = isEmpty(Actions) ? {} : Actions;
    Reducer = isValidReducer(Reducer) ? Reducer : defaultReducer;

    if(!isString(stateSelector) || isEmpty(stateSelector)) {
      stateSelector = '_' + Math.random().toString(36).substr(2, 9);
    }

    @withAllContext
    class StatefulComponent extends PureComponent {
        static getBasePropTypes() {
            return BaseComponent.propTypes || {};
        }


        constructor(props) {
            super(props);
            this.connectRedux();
        }

        /** This is intentionally left untouched
         *  Even though we can disconnect reducer,
         *  I am uncertain at the moment whether
         *  we have a valid use case around this.
         */
        componentWillUnmount() {
            //this.disconnectRedux();
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
            const reducers = [];
            keys(this.props.store.initialReducers).forEach((key) => {
              reducers.push(pathMapReducer(key, this.props.store.initialReducers[key]));
            });
            keys(this.props.store.asyncReducers).forEach((key) => {
              reducers.push(pathMapReducer(key, this.props.store.asyncReducers[key]));
            });
            return composeReducers(reducers);
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

        getMapStateToProps() {
          if (BaseComponent.mapStateToProps) {
            return BaseComponent.mapStateToProps;
          } else {
            return mapStateToProps(this.getStateSelector(stateSelector), this.getConnectedProps());
          }
        }

        connectRedux() {
            const fullSelector = this.getStateSelector(stateSelector);
            const combinedReducers = this.combineDynamicReducers(this.getStateSelector(), Reducer);
            this.props.store.replaceReducer(combinedReducers);
            this.Component = connect(this.getMapStateToProps(),
                (dispatch) => bindActionCreators(Actions, mapDispatchToProps(dispatch))
            )(BaseComponent);
            this.postConnect(fullSelector);
        }

        render() {
            const Component = this.Component;
            return (
              <ParentStateSelectorContext.Provider value={this.getStateSelector()}>
                <Component {...omit(this.props, ["store", "parentStateSelector"])} />
              </ParentStateSelectorContext.Provider>
            );
        }
    }

    return StatefulComponent;
};

/* eslint-disable new-cap */
/**
 * A wrapper function to support ES6 decorations
 * Please see: https://github.com/tc39/proposal-decorators for more information
 * @param args
 * @returns {*}
 * @constructor
 */
const StatefulComponent = (...args) => {
    if (typeof args[0] === 'function') {
        return StatefulComponentDecorator(...args);
    }
    return (BaseComponent) => StatefulComponentDecorator(BaseComponent, ...args);
};

export default StatefulComponent;
