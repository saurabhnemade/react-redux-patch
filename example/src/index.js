import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'
import App from './App'

//ReactDOM.render(<App />, document.getElementById('root'))


import { MicroModule } from 'react-redux-saga-micro-frontend-module';
import routes from './routes';
import reducers from './reducers/index';


const microModule = new MicroModule('micromodule', routes, reducers, null, 'root');

if (module.hot) {
  module.hot.accept("./routes", () => {
    microModule._render(); // Pass updated routes to render or reload the whole application
  })
}
