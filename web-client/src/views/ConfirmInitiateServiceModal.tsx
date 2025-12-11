import { ConsolidatedCasesCheckboxes } from './ConsolidatedCasesCheckboxes';
import { Hint } from '../ustc-ui/Hint/Hint';
import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props as cerebralProps } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const props = cerebralProps as unknown as {
  confirmSequence: unknown;
  documentTitle: unknown;
};

export const ConfirmInitiateServiceModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmInitiateServiceModalHelper: state.confirmInitiateServiceModalHelper,
    confirmSequence: props.confirmSequence,
    documentTitle: props.documentTitle,
    waitingForResponse: state.progressIndicator.waitingForResponse,
  },
  function ConfirmInitiateServiceModal({
    cancelSequence,
    confirmInitiateServiceModalHelper,
    confirmSequence,
    documentTitle,
    waitingForResponse,
  }: {
    cancelSequence: () => void;
    confirmInitiateServiceModalHelper: {
      confirmationText: string;
      showPaperAlert: boolean;
      caseOrGroup: string;
      contactsNeedingPaperService: Array<{ name: string }>;
      showConsolidatedCasesForService: boolean;
    };
    confirmSequence: () => void;
    documentTitle: string;
    waitingForResponse: boolean;
  }) {
    let isSubmitDebounced = false;

    const debounceSubmit = timeout => {
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
          confirmSequence();
        }}
        dataTestId="confirm-initiate-service-modal"
        disableSubmit={waitingForResponse || isSubmitDebounced}
        title="Are You Ready to Initiate Service?"
      >
        <p className="margin-bottom-1">
          {confirmInitiateServiceModalHelper.confirmationText}
        </p>
        <p className="margin-top-0 margin-bottom-2">
          <strong data-testid="confirm-modal-document-title">
            {documentTitle}
          </strong>
        </p>
        {confirmInitiateServiceModalHelper.showPaperAlert && (
          <Hint fullWidth className="block">
            <div className="margin-bottom-1">
              This {confirmInitiateServiceModalHelper.caseOrGroup} has parties
              receiving paper service:
            </div>
            {confirmInitiateServiceModalHelper.contactsNeedingPaperService.map(
              contact => (
                <div className="margin-bottom-1" key={contact.name}>
                  {contact.name}
                </div>
              ),
            )}
          </Hint>
        )}
        {confirmInitiateServiceModalHelper.showConsolidatedCasesForService && (
          <ConsolidatedCasesCheckboxes />
        )}
      </ModalDialog>
    );
  },
);

ConfirmInitiateServiceModal.displayName = 'ConfirmInitiateServiceModal';
