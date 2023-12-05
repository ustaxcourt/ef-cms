import { ConsolidatedCasesCheckboxes } from './ConsolidatedCasesCheckboxes';
import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useState } from 'react';

export const ConfirmInitiateSaveModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    documentTitle: props.documentTitle,
    submitCourtIssuedDocketEntrySequence:
      sequences.submitCourtIssuedDocketEntrySequence,
    waitingForResponse: state.progressIndicator.waitingForResponse,
  },
  function ConfirmInitiateSaveModal({
    cancelSequence,
    documentTitle,
    submitCourtIssuedDocketEntrySequence,
  }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    return (
      <ModalDialog
        cancelLabel="No, Take Me Back"
        cancelSequence={cancelSequence}
        className="confirm-initiate-save-modal"
        confirmLabel="Yes, Save"
        confirmSequence={() => {
          setIsSubmitting(true);
          submitCourtIssuedDocketEntrySequence();
        }}
        disableSubmit={isSubmitting}
        title="Are You Ready to Save This Document to the Docket Record?"
      >
        <p className="margin-bottom-1" tabIndex={0}>
          The following document will be saved to selected cases:
        </p>
        <p className="margin-top-0 margin-bottom-2" tabIndex={0}>
          <strong>{documentTitle}</strong>
        </p>
        <ConsolidatedCasesCheckboxes />
      </ModalDialog>
    );
  },
);

ConfirmInitiateSaveModal.displayName = 'ConfirmInitiateSaveModal';
