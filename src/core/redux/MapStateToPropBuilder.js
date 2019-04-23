import memoize from "lodash/memoize";
import get from "lodash/get";
import forEach from "lodash/forEach";
import assign from "lodash/assign";


/**
 * Memorized state selector for faster resolution
 * @type {memoized}
 */
const getMemorisedStatePath = memoize(stateSelector => {
  if (stateSelector.indexOf('|') === -1) {
    return stateSelector;
  }
  const path = stateSelector.split('|');
  return path[0].split('.').concat(path[1]);
});


/**
 * Abstraction over mapStateToProps of redux to provide dynamic function based on descriptor assigned values
 *
 * @param stateSelector
 * @param props
 * @returns {function(*=, *=)}
 */
const mapStateToProps = (stateSelector, props) => (state, ownProps) => {
  const subState = get(state, getMemorisedStatePath(stateSelector));
  const mappedProps = {};

  forEach(props, (descriptor) => {
    if (descriptor.key.initStateFromGlobalPath) {
      mappedProps[descriptor.name] = get(state, descriptor.key.stateKey);
    } else {
      mappedProps[descriptor.name] = get(subState, descriptor.key.stateKey);
    }
  });
  return assign({}, ownProps, mappedProps);
};


export { mapStateToProps };
