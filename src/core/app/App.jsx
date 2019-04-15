import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Reducer from './app-reducer';
import Actions from './app-actions';
import StatefulComponent from '../redux/StatefulComponent.js';

@StatefulComponent(Actions, Reducer, 'application')
export default class App extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        routes: PropTypes.object,
        history: PropTypes.object,
        headerComponent: PropTypes.any,

        /** App Actions */
        appInitialized: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.appInitialized();
    }

    render() {
        const HeaderComponent = this.props.headerComponent;
        return (
              <div style={{ height: '100%' }}>
                {this.props.name}
                  <HeaderComponent {...this.props} />
                  {this.props.children}
              </div>
        );
    }
}
