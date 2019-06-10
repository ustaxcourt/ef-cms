import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { props, sequences } from 'cerebral';

class FormCancelModalDialogComponent extends ModalDialog {
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

export const FormCancelModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences[props.onCancelSequence],
  },
  FormCancelModalDialogComponent,
);
