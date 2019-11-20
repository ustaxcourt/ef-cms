import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const CancelDraftDocumentModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.cancelAddDraftDocumentSequence,
  },
  ({ cancelSequence, confirmSequence }) => {
    return (
      <ModalDialog
        cancelLabel="No, take me back"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Yes, cancel"
        confirmSequence={confirmSequence}
        message="If you cancel, this document will be returned to Draft Documents."
        title="Are you sure you want to cancel?"
      />
    );
  },
);
