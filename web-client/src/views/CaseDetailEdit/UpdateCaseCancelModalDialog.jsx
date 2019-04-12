import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';

class UpdateCaseCancelModalDialogComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'No, take me back',
      classNames: '',
      confirmLabel: 'Yes, exit without saving',
      message:
        'You have unsaved changes. If you exit this screen without saving, your changes will be lost.',
      title: 'Are you sure you want to exit?',
    };
  }
}

export const UpdateCaseCancelModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.closeModalAndReturnToDashboardSequence,
  },
  UpdateCaseCancelModalDialogComponent,
);
