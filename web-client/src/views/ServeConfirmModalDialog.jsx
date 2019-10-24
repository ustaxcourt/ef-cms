import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const ServeConfirmModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.serveDocumentSequence,
  },
  ({ cancelSequence, confirmSequence, documentType }) => {
    return (
      <ModalDialog
        cancelLabel="No, take me back"
        cancelSequence={cancelSequence}
        className="serve-confirm-modal"
        confirmLabel="Yes, serve"
        confirmSequence={confirmSequence}
        title="Are you ready to initiate service?"
      >
        <>
          <div>The following document will be served on all parties:</div>
          <p className="semi-bold">{documentType}</p>
        </>
      </ModalDialog>
    );
  },
);
