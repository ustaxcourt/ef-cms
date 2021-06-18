import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const CancelDraftDocumentModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.cancelAddDraftDocumentSequence,
  },
  function CancelDraftDocumentModal({ cancelSequence, confirmSequence }) {
    return (
      <ModalDialog
        cancelLabel="No, Take Me Back"
        cancelSequence={cancelSequence}
        confirmLabel="Yes, Cancel"
        confirmSequence={confirmSequence}
        message="If you cancel, this document will be returned to Draft Documents."
        title="Are You Sure You Want to Cancel?"
      />
    );
  },
);
