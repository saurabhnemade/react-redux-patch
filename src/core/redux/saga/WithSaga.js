import React, {PureComponent} from 'react';
import sagaMiddleware from './SagaMiddleware';

/**
 * HOC for registering saga dynamically
 * @param BaseComponent
 * @param Sagas
 * @returns {WithSaga}
 */
const withSagaDecorator = (BaseComponent,
                                    Sagas) => {
  class WithSaga extends PureComponent {
    static getBasePropTypes() {
      return BaseComponent.propTypes || {};
    }

    constructor(props, context) {
      super(props, context);
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

  return WithSaga;

};

const StatefulComponent = (...args) => {
  if (typeof args[0] === 'function') {
    return withSagaDecorator(...args);
  }
  return (BaseComponent) => withSagaDecorator(BaseComponent, ...args);
};
/* eslint-enable new-cap */

export default StatefulComponent;
