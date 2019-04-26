import React, {PureComponent} from 'react';
import sagaMiddleware from './SagaMiddleware';

/**
 * HOC for registering saga dynamically
 * @param BaseComponent
 * @param Sagas
 * @returns {WithSaga}
 */
const withSagaDecorator = (BaseComponent, Sagas) => {
  class WithSagaComponent extends PureComponent {
    static getBasePropTypes() {
      return BaseComponent.propTypes || {};
    }

    constructor(props) {
      super(props);
      this.registerSaga();
    }

    registerSaga() {
        sagaMiddleware.run(Sagas);
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
