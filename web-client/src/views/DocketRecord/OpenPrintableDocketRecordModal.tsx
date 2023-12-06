import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const OpenPrintableDocketRecordModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    pdfPreviewUrl: state.pdfPreviewUrl,
  },
  function OpenPrintableDocketRecordModal({ cancelSequence, pdfPreviewUrl }) {
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

OpenPrintableDocketRecordModal.displayName = 'OpenPrintableDocketRecordModal';
