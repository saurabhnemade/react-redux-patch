import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Reducer from './reducer';
import Actions from './actions';
import { StatefulComponent, WithSaga, Prop, PropMap } from "redux-endgame";
import Sagas from './saga';

@StatefulComponent(Actions, Reducer, 'newPage', true)
class NewPage extends Component {

  static propTypes = {
    @Prop
    name: PropTypes.string,

    @PropMap("anotherProp")
    name2: PropTypes.string,

    @Prop
    test: PropTypes.string,

    _appInitialized: PropTypes.func.isRequired
  }

  componentDidMount() {
    console.log('new page componentDidMount called')
    this.props._appInitialized();
  }

  render() {
    const { history } = this.props;
    console.log(history);
    console.log(this.props);
    return (
      <div>
        This is New Page
      </div>
    );
  }
}


export default WithSaga(NewPage, Sagas);

//export default StatefulComponent(WithSagaNewPage, Actions, Reducer, 'newPage', true);
