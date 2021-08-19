import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const PDFPreviewErrorModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.dismissModalSequence,
  },
  function PDFPreviewErrorModal({ cancelSequence, confirmSequence, title }) {
    return (
      <ModalDialog
        cancelSequence={cancelSequence}
        confirmLabel="OK"
        confirmSequence={confirmSequence}
        title={title}
      >
        <span>
          There was an error loading the document preview. Please try again.
        </span>
      </ModalDialog>
    );
  },
);
