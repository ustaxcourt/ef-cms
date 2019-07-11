import { CompleteDocumentTypeSectionRemainder } from './CompleteDocumentTypeSectionRemainder';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

class CompleteSelectDocumentModalDialogComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.preventCancelOnBlur = true;
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: '',
      confirmLabel: 'Continue',
      title: `You selected: ${this.props.form.documentType}`,
    };
  }
  renderBody() {
    return <CompleteDocumentTypeSectionRemainder />;
  }
}

export const CompleteSelectDocumentModalDialog = connect(
  {
    cancelSequence: sequences.dismissCreateMessageModalSequence,
    confirmSequence: sequences.completeDocumentSelectSequence,
    modal: state.modal,
  },
  CompleteSelectDocumentModalDialogComponent,
);
