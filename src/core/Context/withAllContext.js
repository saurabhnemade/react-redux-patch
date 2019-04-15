import RouteContext from './RouteContext';
import StoreContext from './StoreContext';
import ParentStateSelectorContext from './ParentStateSelectorContext';
import { withMultiContext } from 'with-context';

const withAllContext = withMultiContext({
  route: RouteContext,
  store: StoreContext,
  parentStateSelector: ParentStateSelectorContext
});

export default withAllContext;
