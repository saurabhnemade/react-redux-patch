import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Reducer from './app-reducer';
import Actions from './app-actions';
import { flattenMyTree } from './../router/RouteUtils';
import StatefulComponent from '../redux/StatefulComponent.js';

@StatefulComponent(Actions, Reducer, 'application')
export default class App extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        routes: PropTypes.array,
        history: PropTypes.object,
        appContainer: PropTypes.any,
        name: PropTypes.string,

        /** App Actions */
        appInitialized: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.appInitialized(this.props.name);
    }

    render() {
        const AppComponent = this.props.appContainer;
        return (
              <div style={{ height: '100%' }}>
                <AppComponent {...this.props} cleanRoutes={flattenMyTree(this.props.routes)}>
                  {this.props.children}
                </AppComponent>
              </div>
        );
    }
}
