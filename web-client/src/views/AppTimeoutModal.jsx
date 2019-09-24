import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

class AppTimeoutModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      classNames: 'app-timeout-modal',
      confirmLabel: 'Yes!',
    };
  }

  componentDidUpdate() {
    if (this.props.shouldIdleLogout === true) {
      this.props.idleLogoutSequence();
    }
  }

  renderBody() {
    return <div>Are you still there?</div>;
  }
}

export const AppTimeoutModal = connect(
  {
    confirmSequence: sequences.confirmStayLoggedInSequence,
    idleLogoutSequence: sequences.gotoIdleLogoutSequence,
    shouldIdleLogout: state.shouldIdleLogout,
  },
  AppTimeoutModalComponent,
);
