import App from './App';
import SamplePage from "./pages/samplePage/SamplePage";
import NewPage from "./pages/samplePage/new/NewPage";

const routes = [{
  path: '/',
  key: 'root',
  component: App,
  children: [{
    path: '/sample',
    key: 'sample',
    component: SamplePage
  }, {
    path: '/sample/new',
    key: 'sample/new',
    component: NewPage
  }, {
    path: "/example",
    key: "example",
    component: NewPage
  }]
}];

export default routes;
