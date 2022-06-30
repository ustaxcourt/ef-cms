import { ConsolidatedCasesCheckboxes } from './ConfirmInitiateServiceModal';
import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React, { useState } from 'react';

export const ConfirmInitiateSaveModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    consolidatedCaseAllCheckbox: state.consolidatedCaseAllCheckbox,
    consolidatedCaseCheckboxAllChange:
      sequences.consolidatedCaseCheckboxAllChangeSequence,
    documentTitle: props.documentTitle,
    formattedCaseDetail: state.formattedCaseDetail,
    serveCourtIssuedDocumentFromDocketEntrySequence:
      sequences.serveCourtIssuedDocumentFromDocketEntrySequence,
    submitCourtIssuedDocketEntrySequence:
      sequences.submitCourtIssuedDocketEntrySequence,
    updateCaseCheckbox: sequences.updateCaseCheckboxSequence,
    waitingForResponse: state.progressIndicator.waitingForResponse,
  },
  function ConfirmInitiateSaveModal({
    cancelSequence,
    consolidatedCaseAllCheckbox,
    consolidatedCaseCheckboxAllChange,
    documentTitle,
    formattedCaseDetail,
    submitCourtIssuedDocketEntrySequence,
    updateCaseCheckbox,
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
        <p className="margin-bottom-1" tabIndex="0">
          The following document will be saved to selected cases:
        </p>
        <p className="margin-top-0 margin-bottom-2" tabIndex="0">
          <strong>{documentTitle}</strong>
        </p>
        <ConsolidatedCasesCheckboxes
          consolidatedCaseAllCheckbox={consolidatedCaseAllCheckbox}
          consolidatedCaseCheckboxAllChange={consolidatedCaseCheckboxAllChange}
          formattedCaseDetail={formattedCaseDetail}
          updateCaseCheckbox={updateCaseCheckbox}
        />
      </ModalDialog>
    );
  },
);
