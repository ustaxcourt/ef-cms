import { ConsolidatedCasesCheckboxes } from './ConsolidatedCasesCheckboxes';
import { Hint } from '../ustc-ui/Hint/Hint';
import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const ConfirmInitiatePaperFilingServiceModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmInitiatePaperFilingServiceModalHelper:
      state.confirmInitiatePaperFilingServiceModalHelper,
    confirmSequence: props.confirmSequence,
    consolidatedCasesPaperFilingDocketEntriesFlag: state.featureFlagHelper,
    documentTitle: props.documentTitle,
    fileAndServeCourtIssuedDocumentFromDocketEntrySequence:
      sequences.fileAndServeCourtIssuedDocumentFromDocketEntrySequence,
    waitingForResponse: state.progressIndicator.waitingForResponse,
  },
  function ConfirmInitiatePaperFilingServiceModal({
    cancelSequence,
    confirmInitiatePaperFilingServiceModalHelper,
    confirmSequence,
    documentTitle,
    fileAndServeCourtIssuedDocumentFromDocketEntrySequence,
    isPaper,
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
          {confirmInitiatePaperFilingServiceModalHelper.confirmationText}
        </p>
        <p className="margin-top-0 margin-bottom-2">
          <strong>{documentTitle}</strong>
        </p>
        {confirmInitiatePaperFilingServiceModalHelper.showPaperAlert && (
          <Hint exclamation fullWidth className="block">
            <div className="margin-bottom-1">
              This {confirmInitiatePaperFilingServiceModalHelper.caseOrGroup}{' '}
              has parties receiving paper service:
            </div>
            {confirmInitiatePaperFilingServiceModalHelper.contactsNeedingPaperService.map(
              contact => (
                <div className="margin-bottom-1" key={contact.name}>
                  {contact.name}
                </div>
              ),
            )}
          </Hint>
        )}
        {confirmInitiatePaperFilingServiceModalHelper.showConsolidatedCasesForService &&
          (!isPaper ||
            (isPaper &&
              confirmInitiatePaperFilingServiceModalHelper.consolidatedCasesPaperFilingDocketEntriesFlag)) && (
            <ConsolidatedCasesCheckboxes />
          )}
      </ModalDialog>
    );
  },
);
