import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';

class ConfirmEditModalComponent extends ModalDialog {
  constructor(props) {
    super(props);

    this.modal = {
      cancelLabel: 'No, take me back',
      classNames: '',
      confirmLabel: 'Yes, continue',
      message: 'Are you sure you want to edit this document?',
      title: 'Editing This Document Will Remove Signature',
    };
  }
}

export const ConfirmEditModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.navigateToEditOrderSequence,
  },
  ConfirmEditModalComponent,
);
