import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const focusableChildren =
  'h1[tabindex], h2[tabindex], h3[tabindex], .focusable[tabindex]';

// first child of Focus component matching above selector will receive focus
class FocusComponent extends React.Component {
  componentDidMount() {
    this.focused || this.setFocus();
  }

  setFocus(e) {
    e && e.preventDefault();
    const focusEl = this.node.querySelector(focusableChildren);
    if (focusEl && focusEl.focus) focusEl.focus();
    this.focused = true;
    return false;
  }

  render() {
    const className = classNames('focus-component', this.props.className);
    const child = (
      <div className={className} ref={el => (this.node = el)}>
        {this.props.children}
      </div>
    );
    return child;
  }
}

FocusComponent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export const Focus = FocusComponent;
