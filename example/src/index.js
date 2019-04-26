import './index.css'
import { MicroModule } from 'redux-endgame';
import routes from './routes';
import reducers from './reducers/index';


const microModule = new MicroModule('SampleApplication', routes, reducers, null, 'root');

if (module.hot) {
  module.hot.accept("./routes", () => {
    microModule._render(); // Pass updated routes to render or reload the whole application
  })
}
