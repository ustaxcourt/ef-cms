import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';

import { ModalDialog } from './ModalDialog';

class StartCaseCancelModalDialogComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'No, continue',
      classNames: '',
      confirmLabel: 'Yes, cancel',
      message: 'If you cancel, your form selections will be lost.',
      title: 'Are you sure you want to cancel?',
    };
  }
}

export const StartCaseCancelModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.startACaseConfirmCancelSequence,
  },
  StartCaseCancelModalDialogComponent,
);
