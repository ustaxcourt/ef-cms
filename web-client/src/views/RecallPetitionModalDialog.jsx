import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';

class RecallPetitionModalDialogComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'No, keep in batch',
      classNames: '',
      confirmLabel: 'Yes, recall',
      message:
        'Recalling this Petition will remove it from the IRS service batch and return it to your work queue.',
      title: 'Are you sure you want to recall this Petition?',
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
