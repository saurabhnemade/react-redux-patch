const parameterLessDecorator = function (propType, key, descriptor, mapping) {
    const newDescriptor = Object.assign({}, descriptor);
  if (descriptor.initializer)  {
    newDescriptor.initializer = function (...args) {
      let value = descriptor.initializer(...args);
      value = value.bind(this);
      value.isMapped = true;
      value.stateKey = mapping || key;
      value.initStateFromProp = false;
      value.initStateFromGlobalPath = false;
      return value;
    };
    return newDescriptor;
  } else {
    descriptor.value.isMapped = true;
    descriptor.value.stateKey = mapping || key;
    descriptor.value.initStateFromProp = false;
    descriptor.value.initStateFromGlobalPath = false;
  }
};

const decorator = (mapping) => (propType, key, descriptor) =>
  parameterLessDecorator(propType, key, descriptor, mapping);

const PropMap = (...args) => typeof args[0] === 'object'
    ? parameterLessDecorator(...args) : decorator(args[0]);

export default PropMap;
