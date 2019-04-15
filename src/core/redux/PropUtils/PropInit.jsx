const parameterlessDecorator = (propType, key, descriptor) => {
    const newDescriptor = Object.assign({}, descriptor);
    newDescriptor.initializer = (...args) => {
        let value = descriptor.initializer(...args);
        value = value.bind(this);
        value.isMapped = true;
        value.stateKey = key;
        value.initStateFromProp = true;
        value.initStateFromGlobalPath = false;
        return value;
    };
    return newDescriptor;
};

const decorator = () => (propType, key, descriptor) =>
    parameterlessDecorator(propType, key, descriptor);

const PropInit = (...args) => typeof args[0] === 'object'
    ? parameterlessDecorator(...args) : decorator();

/* eslint-enable no-confusing-arrow */

export default PropInit;