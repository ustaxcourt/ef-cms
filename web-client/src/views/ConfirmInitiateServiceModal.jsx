import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const ConfirmInitiateServiceModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.initiateServiceSequence,
  },
  ({ cancelSequence, confirmSequence, documentTitle }) => {
    return (
      <ModalDialog
        cancelLabel="No, take me back"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Yes, serve"
        confirmSequence={confirmSequence}
        message=""
        title="Are you ready to initiate service?"
      >
        <p className="margin-bottom-1">
          The following document will be served on all parties:
        </p>
        <p className="margin-top-0 margin-bottom-5">
          <strong>{documentTitle}</strong>
        </p>
      </ModalDialog>
    );
  },
);
