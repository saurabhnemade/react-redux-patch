import isEmpty from "lodash/isEmpty";
import isArray from "lodash/isArray";
import drop from "lodash/drop";
import PropTypes from "prop-types";

const mapPropTypes = function(Target, props) {
  if (isEmpty(Target.propTypes)) {
      Target.propTypes = {};
  }

  for (const key in props) {
    if (!isArray(props[key]) || props[key].length < 1) {
      console.warn("Warning: At least one decorator prop is required");
      continue;
    }

    const propInfo = props[key];
    const decorator = propInfo[0];
    const args = drop(propInfo, 1);
    if (!Target.propTypes[key]) {
      Target.propTypes[key] = PropTypes.any
    }
    decorator(Target.propTypes, key, Object.getOwnPropertyDescriptor(Target.propTypes, key), args);
  }
};

const mapStateProps = (Target, mapStateToProps) => {
    Target.mapStateToProps = mapStateToProps;
};

export { mapPropTypes, mapStateProps };
