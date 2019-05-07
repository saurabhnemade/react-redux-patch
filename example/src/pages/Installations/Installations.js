import React, { Component } from 'react';
import PropTypes from "prop-types";
import Reducer from './reducer';
import Actions from './actions';
import { StatefulComponent, WithSaga, mapPropTypes, Prop } from "react-redux-patch";
import Sagas from './saga';

class Installtion extends Component {
  static propTypes = {
    name2: PropTypes.string
  }

  componentDidMount() {
    console.log('component did mount called')
    this.props.appInitialized();
  }

  render() {
    return (
      <div>
        This is Installation page
        <pre>
          {JSON.stringify(this.props, null, 2)}
        </pre>
      </div>
    );
  }
}

mapPropTypes(Installtion, {
    name2: [Prop]
});

const connectedInstallation = StatefulComponent(Installtion, Actions, Reducer, 'installations');

export default WithSaga(connectedInstallation, Sagas);
