import React, { Component } from 'react';
import Reducer from './reducer';
import Actions from './actions';
import { StatefulComponent, WithSaga } from "react-redux-saga-micro-frontend-module";
import Sagas from './saga';

class NewPage extends Component {
  componentDidMount() {
    console.log('new page componentDidMount called')
    this.props.appInitialized();
  }

  render() {
    const { history } = this.props;
    console.log(history);
    return (
      <div>
        This is New Page
      </div>
    );
  }
}

const WithSagaNewPage = WithSaga(NewPage, Sagas);

export default StatefulComponent(WithSagaNewPage, Actions, Reducer, 'newPage', true);
