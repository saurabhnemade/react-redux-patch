import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Reducer from './app-reducer';
import Actions from './app-actions';
import StatefulComponent from '../redux/StatefulComponent.jsx';

@StatefulComponent(Actions, Reducer, 'application')
export default class App extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        routes: PropTypes.object,
        history: PropTypes.object,
        headerComponent: PropTypes.any,

        /** App Actions */
        appInitialized: PropTypes.func.isRequired,
    }

    static childContextTypes = {
        routes: PropTypes.object,
        history: PropTypes.object,
    }

    getChildContext() {
        return {
            history: this.props.history,
            routes: this.props.routes,
        };
    }

    componentDidMount() {
        this.props.appInitialized();
    }

    render() {
        const HeaderComponent = this.props.headerComponent;
        return (
            <div style={{ height: '100%' }}>
                <HeaderComponent {...this.props} />
                {this.props.children}
            </div>
        );
    }
}