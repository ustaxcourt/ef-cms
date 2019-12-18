import { CompleteDocumentTypeSectionRemainder } from './CompleteDocumentTypeSectionRemainder';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CompleteSelectDocumentModalDialog = connect(
  {
    cancelSequence: sequences.dismissCreateMessageModalSequence,
    confirmSequence: sequences.completeDocumentSelectSequence,
    form: state.form,
    modal: state.modal,
  },
  ({ cancelSequence, confirmSequence }) => {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Continue"
        confirmSequence={confirmSequence}
        title={`You selected: ${this.props.form.documentType}`}
      >
        <CompleteDocumentTypeSectionRemainder />
      </ModalDialog>
    );
  },
);
