const parameterLessDecorator = (propType, key, descriptor, mapping) => {
    const newDescriptor = Object.assign({}, descriptor);
    newDescriptor.initializer = (...args) => {
        let value = descriptor.initializer(...args);
        value = value.bind(this);
        value.isMapped = true;
        value.stateKey = mapping || key;
        value.initStateFromProp = false;
        value.initStateFromGlobalPath = true;
        return value;
    };
    return newDescriptor;
};

const decorator = (mapping) => (propType, key, descriptor) =>
  parameterLessDecorator(propType, key, descriptor, mapping);


const PropMapGlobal = (...args) => typeof args[0] === 'object'
    ? parameterLessDecorator(...args) : decorator(args[0]);

/* eslint-enable no-confusing-arrow */

export default PropMapGlobal;
