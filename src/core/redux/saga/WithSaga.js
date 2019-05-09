import React, {PureComponent} from 'react';
import sagaMiddleware from './SagaMiddleware';
import isArray from "lodash/isArray";

/**
 * HOC for registering saga dynamically
 * @param BaseComponent
 * @param Sagas
 * @returns {WithSaga}
 */
const withSagaDecorator = (BaseComponent, Sagas = []) => {
  class WithSagaComponent extends PureComponent {
    static getBasePropTypes() {
      return BaseComponent.propTypes || {};
    }

    constructor(props) {
      super(props);
      this.registerSaga();
    }

    registerSaga() {
        if(isArray(Sagas)) {
          Sagas.forEach(saga => {
            sagaMiddleware.run(saga);
          });
        } else {
          sagaMiddleware.run(Sagas);
        }
    }

    render() {
      return (
        <BaseComponent {...this.props}/>
      )
    }
  }

  return WithSagaComponent;
};

const WithSaga = (...args) => {
  if (typeof args[0] === 'function') {
    return withSagaDecorator(...args);
  }
  return (BaseComponent) => withSagaDecorator(BaseComponent, ...args);
};
/* eslint-enable new-cap */

export default WithSaga;
