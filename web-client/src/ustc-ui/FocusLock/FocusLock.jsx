import 'wicg-inert';
import PropTypes from 'prop-types';
import React from 'react';

const appRoot = document.getElementById('app');
const tabbableSelector =
  'a:enabled,button:enabled,input:enabled,select:enabled,textarea:enabled';
export class FocusLock extends React.Component {
  constructor() {
    super();
    this.el = React.createRef();
    this.lastFocused = this.componentWithFocus();
    this.onKey = this.onKey.bind(this);
  }

  onKey(event) {
    if (event.keyCode != 9 || !this.el.current.contains(event.target)) {
      // not tab key on element within this component
      return;
    }
    const lockedElements = this.gatherTabbables();
    const [firstTabbable, lastTabbable] = [
      lockedElements.item(0),
      lockedElements.item(lockedElements.length - 1),
    ];
    if (event.target == firstTabbable && event.shiftKey) {
      // shift-tab when on firstTabbable: move focus to lastTabbable
      lastTabbable.focus();
      event.preventDefault();
      return false;
    }
    if (event.target == lastTabbable && !event.shiftKey) {
      // tab (withotu shift) when on lastTabbable: move focus to firstTabbable
      firstTabbable.focus();
      event.preventDefault();
      return false;
    }
    return true;
  }

  gatherTabbables() {
    return this.el.current.querySelectorAll(tabbableSelector);
  }

  componentWithFocus() {
    const focusedElement =
      (document.hasFocus() &&
        document.activeElement !== document.body &&
        document.activeElement !== document.documentElement &&
        document.activeElement) ||
      {};
    return focusedElement;
  }

  componentDidMount() {
    appRoot.inert = true; // leverages wicg-inert polyfill
    appRoot.setAttribute('aria-hidden', 'true');
    document.addEventListener('keydown', this.onKey);
  }

  componentWillUnmount() {
    appRoot.inert = false;
    appRoot.setAttribute('aria-hidden', 'false');
    document.removeEventListener('keydown', this.onKey);
    this.restoreFocus();
  }

  restoreFocus() {
    this.lastFocused.focus && this.lastFocused.focus();
  }

  render() {
    return (
      <div className="ustc-focus-lock" ref={this.el}>
        {this.props.children}
      </div>
    );
  }
}

FocusLock.propTypes = {
  children: PropTypes.node,
};
