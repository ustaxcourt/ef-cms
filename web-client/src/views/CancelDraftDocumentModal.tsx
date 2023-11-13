import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
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

CancelDraftDocumentModal.displayName = 'CancelDraftDocumentModal';
