import { ConsolidatedCasesCheckboxes } from './ConsolidatedCasesCheckboxes';
import { Hint } from '../ustc-ui/Hint/Hint';
import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const ConfirmInitiateCourtIssuedFilingServiceModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmInitiateCourtIssuedFilingServiceModalHelper:
      state.confirmInitiateCourtIssuedFilingServiceModalHelper,
    confirmSequence: props.confirmSequence,
    documentTitle: props.documentTitle,
    fileAndServeCourtIssuedDocumentFromDocketEntrySequence:
      sequences.fileAndServeCourtIssuedDocumentFromDocketEntrySequence,
    waitingForResponse: state.progressIndicator.waitingForResponse,
  },
  function ConfirmInitiateCourtIssuedFilingServiceModal({
    cancelSequence,
    confirmInitiateCourtIssuedFilingServiceModalHelper,
    confirmSequence,
    documentTitle,
    fileAndServeCourtIssuedDocumentFromDocketEntrySequence,
    waitingForResponse,
  }) {
    let isSubmitDebounced = false;

    const debounceSubmit = (timeout = 100) => {
      isSubmitDebounced = true;

      setTimeout(() => {
        isSubmitDebounced = false;
      }, timeout);
    };

    return (
      <ModalDialog
        cancelLabel="No, Take Me Back"
        cancelSequence={cancelSequence}
        className="confirm-initiate-service-modal"
        confirmLabel="Yes, Serve"
        confirmSequence={() => {
          debounceSubmit(200);
          confirmSequence
            ? confirmSequence()
            : fileAndServeCourtIssuedDocumentFromDocketEntrySequence();
        }}
        disableSubmit={waitingForResponse || isSubmitDebounced}
        title="Are You Ready to Initiate Service?"
      >
        <p className="margin-bottom-1">
          {confirmInitiateCourtIssuedFilingServiceModalHelper.confirmationText}
        </p>
        <p className="margin-top-0 margin-bottom-2">
          <strong>{documentTitle}</strong>
        </p>
        {confirmInitiateCourtIssuedFilingServiceModalHelper.showPaperAlert && (
          <Hint exclamation fullWidth className="block">
            <div className="margin-bottom-1">
              This{' '}
              {confirmInitiateCourtIssuedFilingServiceModalHelper.caseOrGroup}{' '}
              has parties receiving paper service:
            </div>
            {confirmInitiateCourtIssuedFilingServiceModalHelper.contactsNeedingPaperService.map(
              contact => (
                <div className="margin-bottom-1" key={contact.name}>
                  {contact.name}
                </div>
              ),
            )}
          </Hint>
        )}
        {confirmInitiateCourtIssuedFilingServiceModalHelper.showConsolidatedCasesForService && (
          <ConsolidatedCasesCheckboxes />
        )}
      </ModalDialog>
    );
  },
);
