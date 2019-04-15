import React, { Component } from 'react';
import Reducer from './reducer';
import Actions from './actions';
import { StatefulComponent } from "react-redux-saga-micro-frontend-module";

class SamplePage extends Component {
  render() {
    return (
      <div>
        This is samplePage
      </div>
    );
  }
}

export default StatefulComponent(SamplePage, Actions, Reducer, 'SamplePage');
