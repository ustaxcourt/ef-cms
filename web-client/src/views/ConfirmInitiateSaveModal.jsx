import { ConsolidatedCasesCheckboxes } from './ConfirmInitiateServiceModal';
import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React, { useState } from 'react';

// TODO: CS this was copy + pasted from ConfirmInitiateServiceModal, find ways to dry this up
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
  function ConfirmInitiateServiceModal({
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
        className="confirm-initiate-service-modal"
        confirmLabel="Yes, Save"
        confirmSequence={() => {
          setIsSubmitting(true);
          submitCourtIssuedDocketEntrySequence();
        }}
        disableSubmit={isSubmitting}
        title="Are You Ready to Save this Document to the Docket Record?"
      >
        <p className="margin-bottom-1">
          The following document will be saved to selected cases:
        </p>
        <p className="margin-top-0 margin-bottom-2">
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
