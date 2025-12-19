import { ConsolidatedCasesCheckboxes } from './ConsolidatedCasesCheckboxes';
import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props as cerebralProps } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useState } from 'react';

const props = cerebralProps as unknown as {
  documentTitle: unknown;
};

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
  }: {
    cancelSequence: () => void;
    documentTitle: string;
    submitCourtIssuedDocketEntrySequence: () => void;
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
        dataTestId="confirm-initiate-save-modal"
        disableSubmit={isSubmitting}
        title="Are You Ready to Save This Document to the Docket Record?"
      >
        <p className="margin-bottom-1">
          The following document will be saved to selected cases:
        </p>
        <p className="margin-top-0 margin-bottom-2">
          <strong>{documentTitle}</strong>
        </p>
        <ConsolidatedCasesCheckboxes />
      </ModalDialog>
    );
  },
);

ConfirmInitiateSaveModal.displayName = 'ConfirmInitiateSaveModal';
