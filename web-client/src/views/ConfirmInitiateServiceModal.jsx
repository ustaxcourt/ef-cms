import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const ConfirmInitiateServiceModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.clearModalSequence,
  },
  ({ cancelSequence, confirmSequence, documentTitle }) => {
    return (
      <ModalDialog
        cancelLabel="No, take me back"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Yes, serve"
        confirmSequence={confirmSequence}
        message="The following document will be served on all parties:"
        title="Are you ready to initiate service?"
      >
        {documentTitle}
      </ModalDialog>
    );
  },
);
