import Dashboard from './pages/Dashboard/Dashboard';
import SamplePage from "./pages/samplePage/SamplePage";
import NewPage from "./pages/samplePage/new/NewPage";
import Installations from './pages/Installations/Installations';

const routes = [{
  path: '/',
  key: 'root',
  component: Dashboard,
  children: [{
    path: '/dashboard',
    key: 'dashboard',
    component: Dashboard
  },{
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
  }, {
    path: "/installations",
    key: "installations",
    component: Installations
  }]
}];

export default routes;
