import App from './App';
import SamplePage from "./pages/SamplePage";

const routes = [{
  path: '/',
  key: 'root',
  component: App,
  children: [{
    path: '/sample',
    key: 'sample',
    component: SamplePage
  }]
}];

export default routes;
