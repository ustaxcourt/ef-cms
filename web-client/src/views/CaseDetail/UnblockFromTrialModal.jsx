import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

class UnblockFromTrialModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'No, cancel',
      classNames: '',
      confirmLabel: 'Yes, remove block',
      title: 'Are You Sure You Want to Remove This Block?',
    };
  }

  renderBody() {
    return (
      <div className="margin-bottom-4">
        This case will be eligible to be set for the next available trial
        session.{' '}
      </div>
    );
  }
}

export const UnblockFromTrialModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.unblockFromTrialSequence,
  },
  UnblockFromTrialModalComponent,
);
