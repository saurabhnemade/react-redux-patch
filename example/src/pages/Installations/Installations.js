import React, { Component } from 'react';
import Reducer from './reducer';
import Actions from './actions';
import { StatefulComponent, WithSaga } from "redux-endgame";
import Sagas from './saga';

class Installtion extends Component {
  componentDidMount() {
    console.log('component did mount called')
    this.props.appInitialized();
  }

  render() {
    const { history } = this.props;
    console.log(history);
    return (
      <div>
        This is Installation page
      </div>
    );
  }
}

const WithSagaSimplePage = WithSaga(Installtion, Sagas);

export default StatefulComponent(WithSagaSimplePage, Actions, Reducer, 'installations');
