import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const OpenPrintableDocketRecordModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    pdfPreviewUrl: state.pdfPreviewUrl,
  },
  function ConfirmEditModal({ cancelSequence, pdfPreviewUrl }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        confirmHref={pdfPreviewUrl}
        confirmLabel="Open"
        confirmSequence={cancelSequence}
        confirmTarget="_blank"
        message="Your printable docket record is ready to be viewed."
        title="Printable Docket Record"
      ></ModalDialog>
    );
  },
);
