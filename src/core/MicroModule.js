
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, withRouter } from 'react-router-dom';
import WrapCreateStore from './redux/WrapCreateStore';
import history  from './router/History';
import { getRoutes } from './router/RouteUtils';
import App from './app/App.jsx';
import EmptyContainer from './app/EmptyContainer.jsx';
import StoreContext from "./Context/StoreContext";
import ParentStateSelectorContext from "./Context/ParentStateSelectorContext";

export default class MicroModule {
  constructor(module, routes, reducers, appContainer = null, containerId = 'app', userSpecifiedMiddleWares) {
    this.module = module;
    this.routes = routes;
    this.reducers = {
      ...reducers
    };
    if (appContainer == null) {
      appContainer = EmptyContainer;
    }
    this.appContainer = appContainer;
    this.containerId = document.getElementById(containerId);
    this.userSpecifiedMiddleWares = userSpecifiedMiddleWares || [];
    this._initialize();
  }

  _initialize() {
    let INITIAL_STATE = {};
    this.store = WrapCreateStore(this.module, this.reducers, INITIAL_STATE, this.userSpecifiedMiddleWares);
    this.history = history;
    this._render();
  }

  _getRoutes(routes) {
    return getRoutes(routes || this.routes);
  }

  _render() {
    const AppWithRouter = withRouter(App);
    ReactDOM.render((
      <Provider store={this.store}>
        <Router history={this.history}>
            <StoreContext.Provider value={this.store}>
              <ParentStateSelectorContext.Provider value={""}>
                <AppWithRouter appContainer={this.appContainer} routes={this.routes} name={this.module}>
                  {this._getRoutes()}
                </AppWithRouter>
              </ParentStateSelectorContext.Provider>
            </StoreContext.Provider>
        </Router>
      </Provider>
    ), this.containerId);
  }
}
