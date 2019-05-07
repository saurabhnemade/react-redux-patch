import React, { Component } from 'react';
import Reducer from './reducer';
import Actions from './actions';
import { StatefulComponent, WithSaga } from "react-redux-patch";
import Sagas from './saga';

import NewPage from './new/NewPage';

class SamplePage extends Component {
  componentDidMount() {
    console.log('component did mount called')
    this.props.appInitialized();
  }

  render() {
    const { history } = this.props;
    console.log(history);
    return (
      <div>
        This is samplePage
        <NewPage />
      </div>
    );
  }
}

const WithSagaSimplePage = WithSaga(SamplePage, Sagas);

export default StatefulComponent(WithSagaSimplePage, Actions, Reducer, 'SamplePage');
