# react-redux-patch

> 

[![NPM](https://img.shields.io/npm/v/react-redux-patch.svg)](https://www.npmjs.com/package/react-redux-patch) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## What is react-redux-patch?
react-redux-patch is just another library which tries to simplify the web application development for react applications.
From various ideas I came across past few years and a few implementations which I think are founding ground for this project, I decided to write this library to abstract the general setup of react-redux application. 
It specifically focuses and solves the problem of registering dynamic reducers. It also provides shorthand syntax for connect, mapStateToProps and mapDispatchToProps

## Install

```bash
npm install --save react-redux-patch
```

```bash
yarn add react-redux-patch
```

## Usage

### Creating a module
index.js
```jsx
import { MicroModule } from 'react-redux-patch';
import AppContainer from '@AppContainer/index.js';
import routes from '@routes/index.js';
import reducers from '@reducers/index.js';

const microModule = new MicroModule('TheCoolKids', routes, reducers, AppContainer, 'root');

if (module.hot) {
  module.hot.accept("@routes/index", () => {
    microModule._render("@routes/index");
  })
}
```

### Creating App Container
@AppContainer/index.js
```jsx
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class AppContainer extends Component {
    static propTypes = {
        cleanRoutes: PropTypes.array.isRequired,
        history: PropTypes.object.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ]).isRequired
    }

    render() {
        return (
            <div>
                {children}
            </div>
        );
    }
}
```

### Creating Root Reducers
@reducers/index.js
```jsx
const common = (state = {}, action) => {
    switch (action.type) {
      default:
        return state;
    }
};

export default {
  common
}
```

### Creating Routes
@routes/index.js

```jsx
import DashboardPage from '@pages/dashboard/index.js'

const routes = [{
    path: '/',
    key: 'root',
    component: Dashboard,
    children: [{
      path: '/dashboard',
      key: 'dashboard',
      component: DashboardPage
    }]
}]
```


### StatefulComponent: connect, mapStateToProps and mapDispatchToProps Abstraction
@pages/dashboard/index.js

```jsx
import React, { Component } from "react";
import PropTypes from "prop-types";

const Actions = {
    initialize: () => dispatch => {
        dispatch({ type: "DASHBOARD/INITIALIZE" });
    }
};

const INITIAL_STATE = {
    name: "A sample Dashboard Page"
    productName: "Macbook Pro",
    discount: 0,
    matches: []
};

const Reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        default:
          return state;
    }
}


class DashboardPage extends Component {
  static propTypes = {
    /** Map prop with same name as 
      *  propName i.e. state.dashboard.name 
      **/
    @Prop
    name: PropTypes.string
    
    /** Map Prop with differnt name in state
      * i.e. state.dashboard.product
    @PropMap("productName")
    itemName: PropTypes.string
    
    /** Map prop with same name as propName
      * but update its initial value in store
      * in this case state.dashboard.discount will be mapped.
      * Before mapping it will update passed value in state.
      **/
    @PropInit
    discount: PropTypes.number
    
    /** Map prop with different name in state
      * but update its initial value in store
      * in this case state.dashboard.matches will be mapped.
      * Before mapping it will update passed value in state
      **/
    @PropMapInit("interests")
    matches: PropTypes.array
    
    
    /** Map prop with absolute given key path in state 
      * i.e. state outside of this component
      * Its usage is to access the global state objects that created in root reducers.
      * In this case state.application.name will be mapped.
      **/  
    @PropMapGlobal("state.application.name")
    applicationName: PropTypes.string
    
    /** All actions from Actions object will be available here!!
      * no need to map them
      **/
     initialize: PropTypes.func.isRequired 
  }
  
  render() {
    return (
      <>
        <div>Sample Dashboard Page</div>
        <pre>{JSON.stringify(this.props)}</pre>
      </>
    );
  }
}

/** Returns a connected component 
  * and dynamically attaches reducer at state."dashboard" key 
  ** /
export default StatefulComponent(DashboardPage, Actions, Reducer, "dashboard", false)
```

## API

### MicroModule(name, routes, reducers, appContainer, containerId , userSpecifiedMiddleWares)
| Argument Name | Sample value| Description | Optional |
|---------------|:-------------|:------------|:---------|
|name|```"Slack"```| Name of module | No |
|routes| `const routes = [{```                             | Routes for application | No |
|      |  `            path: '/',   `                       |||
|      |   `                  key: 'root',`                  |||
|      |    `                 component: Dashboard, `        |||
|      |     `                children: [{           `       |||
|      |     `                  path: '/dashboard', `        ||| 
|      |     `                  key: 'dashboard',   `        |||
|      |     `                  component: DashboardPage `   |||
|      |     `                }]                        `    |||
|      |     `            }]`|||
|reducers| ```const rootReducers = { };```| Global root reducers if you want to abstract stuff like notifications | No |
|appContainer| ```const appContainer=({props,cleanRoutes}) => (<>{this.props.children</>)```| App Container where your routes will render. You can customise things like custom header before routes. | No|
|containerId| ```root``` |Dom element id in which app will be render|Yes. Defaults to ```root```|
|userSpecifiedMiddleWares||Additional redux middlewares that you need added | Yes. Defaults to ```[]````| 

### StatefulComponent(ReactComponent, Actions, Reducer, DynamicStateName, Inherit?)
  | Argument Name | Default value| Description | Optional |
  |---------------|:-------------|:------------|:---------|
  | **ReactComponent** | (<></>) | A react component which needs to be connected | No |
  | **Actions** | {} | Actions object that will be used in dynamically created mapDispatchToProps | No |
  | **Reducer** | (state) => { return state } | Reducer that needs to be dynamically registered against _DynamicStateName_ | No |
  | **DynamicStateName** | `'\_' + Math.random().toString(36).substr(2, 9)` | A dynamic state key where reducer will be attached | No |
  | **Inherit** | false | Whether to create the state dynamically inside another state key generated by StatefulComponent | Yes|
   

## License

MIT © [saurabhnemade](https://github.com/saurabhnemade)
