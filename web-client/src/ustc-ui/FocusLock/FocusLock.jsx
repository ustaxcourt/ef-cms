import 'wicg-inert';
import PropTypes from 'prop-types';
import React from 'react';

const appRoot = document.getElementById('app');

export class FocusLock extends React.Component {
  componentDidMount() {
    appRoot.inert = true; // leverages wicg-inert polyfill
    appRoot.setAttribute('aria-hidden', 'true');
  }

  componentWillUnmount() {
    appRoot.inert = false;
    appRoot.setAttribute('aria-hidden', 'false');
  }

  render() {
    return this.props.children;
  }
}

FocusLock.propTypes = {
  children: PropTypes.node,
};
