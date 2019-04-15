const parameterlessDecorator = (propType, key, descriptor, mapping) => {
    const newDescriptor = Object.assign({}, descriptor);
    newDescriptor.initializer = (...args) => {
        let value = descriptor.initializer(...args);
        value = value.bind(this);
        value.isMapped = true;
        value.stateKey = mapping || key;
        value.initStateFromProp = false;
        value.initStateFromGlobalPath = false;
        return value;
    };
    return newDescriptor;
};

const decorator = (mapping) => (propType, key, descriptor) =>
    parameterlessDecorator(propType, key, descriptor, mapping);

const PropMap = (...args) => typeof args[0] === 'object'
    ? parameterlessDecorator(...args) : decorator(args[0]);

/* eslint-enable no-confusing-arrow */

export default PropMap;