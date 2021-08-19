import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const OpenPractitionerCaseListPdfModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    pdfPreviewUrl: state.pdfPreviewUrl,
  },
  function OpenPractitionerCaseListPdfModal({ cancelSequence, pdfPreviewUrl }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className=""
        confirmHref={pdfPreviewUrl}
        confirmLabel="Open"
        confirmSequence={cancelSequence}
        confirmTarget="_blank"
        message="Your printable case list is ready to be viewed."
        title="Printable Case List"
      ></ModalDialog>
    );
  },
);
