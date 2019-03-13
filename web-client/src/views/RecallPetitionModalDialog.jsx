import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';

import { ModalDialog } from './ModalDialog';

class RecallPetitionModalDialogComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      title: 'Are you sure you want to recall this Petition?',
      message:
        'Recalling this Petition will remove it from the IRS service batch and return it to your work queue.',
      confirmLabel: 'Yes, recall',
      cancelLabel: 'No, keep in batch',
      classNames: '',
    };
  }
}

export const RecallPetitionModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.submitRecallPetitionFromIRSHoldingQueueSequence,
  },
  RecallPetitionModalDialogComponent,
);
