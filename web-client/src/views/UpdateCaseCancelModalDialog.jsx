import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';

import { ModalDialog } from './ModalDialog';

class UpdateCaseCancelModalDialogComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      title: 'Are you sure you want to exit?',
      message:
        'You have unsaved changes. If you exit this screen without saving, your changes will be lost.',
      confirmLabel: 'Yes, exit without saving',
      cancelLabel: 'No, take me back',
      classNames: '',
    };
  }
}

export const UpdateCaseCancelModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.startACaseConfirmCancelSequence,
  },
  UpdateCaseCancelModalDialogComponent,
);
