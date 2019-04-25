import { sequences, state } from 'cerebral';

import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import React from 'react';

class AppTimeoutModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      classNames: 'app-timeout-modal',
      confirmLabel: 'Yes!',
    };
  }

  renderBody() {
    return <div>Are you still there?</div>;
  }
}

export const AppTimeoutModal = connect(
  {
    cancelSequence: null,
    confirmSequence: sequences.confirmStayLoggedInSequence,
  },
  AppTimeoutModalComponent,
);
