import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

class UnprioritizeCaseModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'No, cancel',
      classNames: '',
      confirmLabel: 'Yes, remove high priority',
      title: 'Are You Sure You Want to Remove the High Priority on This Case?',
    };
  }

  renderBody() {
    return (
      <div className="margin-bottom-4" id="unprioritize-modal">
        <div className="margin-bottom-2">
          This case will be set for trial according to standard priority.{' '}
        </div>
      </div>
    );
  }
}

export const UnprioritizeCaseModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.unprioritizeCaseSequence,
  },
  UnprioritizeCaseModalComponent,
);
