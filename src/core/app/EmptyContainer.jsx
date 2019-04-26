import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/**
 * A default Header for application
 * */
export default class EmptyHeader extends PureComponent {
    static propTypes = {
      children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
      ]).isRequired
    };

    render() {
        return (
            <div>
              {this.props.children}
            </div>
        );
    }
}
