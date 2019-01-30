import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import ModalDialog from './ModalDialog';

class ServeToIrsModalDialog extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      title: 'Are you sure you want to serve this Petition to the IRS?',
      message:
        'This Petition will be added to the batch to serve to the IRS at 3pm.',
      confirmLabel: 'Yes, serve',
      cancelLabel: 'No, take me back',
      classNames: '',
    };
  }
}

export default connect(
  {
    cancelSequence: sequences.toggleShowModalSequence,
    confirmSequence: sequences.submitPetitionToIRSHoldingQueueSequence,
  },
  ServeToIrsModalDialog,
);
