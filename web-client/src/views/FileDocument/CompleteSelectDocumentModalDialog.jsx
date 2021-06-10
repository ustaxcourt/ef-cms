import { CompleteDocumentTypeSectionRemainder } from './CompleteDocumentTypeSectionRemainder';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const CompleteSelectDocumentModalDialog = connect(
  {
    cancelSequence: sequences.dismissCreateMessageModalSequence,
    confirmSequence: sequences.completeDocumentSelectSequence,
  },
  function CompleteSelectDocumentModalDialog({
    cancelSequence,
    confirmSequence,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Continue"
        confirmSequence={confirmSequence}
        title={`You selected: ${this.props.form.documentType}`}
      >
        <CompleteDocumentTypeSectionRemainder />
      </ModalDialog>
    );
  },
);
