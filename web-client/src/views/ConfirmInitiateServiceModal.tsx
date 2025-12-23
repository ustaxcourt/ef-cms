import { ConsolidatedCasesCheckboxes } from './ConsolidatedCasesCheckboxes';
import { InfoNotificationComponent } from './InfoNotification';
import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props as cerebralProps } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { ContactsNeedingPaperService } from '@web-client/presenter/computeds/confirmInitiateServiceModalHelper';

const props = cerebralProps as unknown as {
  confirmSequence: () => void;
  documentTitle: string;
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
    cancelSequence: Function;
    confirmInitiateServiceModalHelper: {
      additionalServedCases: { docketNumber: string; caseTitle: string }[];
      canMultiDocket: boolean;
      canShowCheckboxes: boolean;
      confirmationText: string;
      contactsNeedingPaperService?: ContactsNeedingPaperService;
      paperFilingText: string;
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
        <p className="margin-0">
          {confirmInitiateServiceModalHelper.confirmationText}
        </p>
        <p className="margin-top-0 margin-bottom-2">
          <strong data-testid="confirm-modal-document-title">
            {documentTitle}
          </strong>
        </p>
        {confirmInitiateServiceModalHelper.additionalServedCases &&
          confirmInitiateServiceModalHelper.additionalServedCases.length >
            0 && (
            <div>
              <div>This document will also be served for:</div>
              <ul className="padding-left-3 margin-top-1">
                {confirmInitiateServiceModalHelper.additionalServedCases.map(
                  c => (
                    <li key={c.docketNumber}>
                      {c.docketNumber} - {c.caseTitle}
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}

        {confirmInitiateServiceModalHelper.contactsNeedingPaperService && (
          <InfoNotificationComponent
            alertInfo={{
              message: (
                <>
                  <strong>
                    {confirmInitiateServiceModalHelper.paperFilingText}
                  </strong>
                  <br />
                  {confirmInitiateServiceModalHelper.contactsNeedingPaperService.map(
                    contact => (
                      <span key={`${contact.docketNumber}-${contact.name}`}>
                        {confirmInitiateServiceModalHelper.canMultiDocket &&
                          `${contact.docketNumber} - `}
                        {contact.name}, {contact.formattedContactType}
                        <br />
                      </span>
                    ),
                  )}
                </>
              ),
            }}
            dismissible={false}
            scrollToTop={false}
          />
        )}
        {confirmInitiateServiceModalHelper.canShowCheckboxes && (
          <ConsolidatedCasesCheckboxes />
        )}
      </ModalDialog>
    );
  },
);

ConfirmInitiateServiceModal.displayName = 'ConfirmInitiateServiceModal';
