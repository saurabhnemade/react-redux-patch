import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './styles.css'

/*
export default class ExampleComponent extends Component {
  static propTypes = {
    text: PropTypes.string
  }

  render() {
    const {
      text
    } = this.props

    return (
      <div className={styles.test}>
        Example Component: {text}
      </div>
    )
  }
}

*/
import MicroModule from './core/MicroModule.js';
import StatefulComponent from './core/redux/StatefulComponent.js';
import { Prop,
  PropInit,
  PropMap,
  PropMapGlobal,
  PropMapInit,
} from './core/redux/PropUtils/index.js';
import WithSaga from './core/redux/saga/WithSaga';
import { mapPropTypes, mapStateProps } from './core/redux/DecorateHelper';

export {
  MicroModule,
  StatefulComponent,
  Prop,
  PropInit,
  PropMap,
  PropMapGlobal,
  PropMapInit,
  WithSaga,
  mapPropTypes,
  mapStateProps
};
