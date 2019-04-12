import PropTypes from 'prop-types';
import React from 'react';

const focusableChildren =
  'h1[tabindex], h2[tabindex], h3[tabindex], .focusable[tabindex]';

// first child of Focus component matching above selector will receive focus
class FocusComponent extends React.Component {
  componentDidMount() {
    this.setFocus();
  }

  componentDidUpdate() {
    this.setFocus();
  }

  setFocus(e) {
    e && e.preventDefault();
    const focusEl = this.node.querySelector(focusableChildren);
    if (focusEl && focusEl.focus) focusEl.focus();
    return false;
  }

  render() {
    const child = (
      <div className="focus-component" ref={el => (this.node = el)}>
        {this.props.children}
      </div>
    );
    return child;
  }
}

FocusComponent.propTypes = {
  children: PropTypes.node,
};

export const Focus = FocusComponent;
