import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';

import { ModalDialog } from './ModalDialog';

class ServeToIrsModalDialogComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'No, take me back',
      classNames: '',
      confirmLabel: 'Yes, serve',
      message:
        'This Petition will be added to the batch to serve to the IRS at 3pm.',
      title: 'Are you sure you want to serve this Petition to the IRS?',
    };
  }
}

export const ServeToIrsModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.submitPetitionToIRSHoldingQueueSequence,
  },
  ServeToIrsModalDialogComponent,
);
