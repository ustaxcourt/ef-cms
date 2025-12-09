import { ConsolidatedCasesCheckboxes } from './ConsolidatedCasesCheckboxes';
import { Hint } from '../ustc-ui/Hint/Hint';
import { InfoNotificationComponent } from './InfoNotification';
import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { JSX } from 'react';

type ConfirmInitiateServiceModalProps = {
  confirmSequence: Function;
  documentTitle?: string;
}

export const ConfirmInitiateServiceModal: React.FC<ConfirmInitiateServiceModalProps> = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmInitiateServiceModalHelper: state.confirmInitiateServiceModalHelper,
    confirmSequence: props`confirmSequence`,
    documentTitle: props`documentTitle`,
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
      confirmationText: string;
      showPaperAlert: boolean;
      caseOrGroup: string;
      contactsNeedingPaperService: Array<{ name: string }>;
      showConsolidatedCasesForService: boolean;
      additionalServedCases?: Array<{
        docketNumber: string;
        caseTitle: string;
      }>;
      paperPartiesConsolidated?: Array<{
        name: string;
        docketNumber: string;
        contactType?: string;
      }>;
    };
    confirmSequence: Function;
    documentTitle: string;
    waitingForResponse: boolean;
  }): JSX.Element {
    let isSubmitDebounced = false;

    const debounceSubmit = (timeout: number): void => {
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
        confirmSequence={(): void => {
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
        {confirmInitiateServiceModalHelper.paperPartiesConsolidated && (
          <InfoNotificationComponent
            alertInfo={{
              message: (
                <>
                  <div>
                    <strong>
                      Paper service is required for these parties:
                    </strong>
                  </div>
                  {confirmInitiateServiceModalHelper.paperPartiesConsolidated.map(
                    contact => (
                      <div key={`${contact.docketNumber}-${contact.name}`}>
                        {contact.docketNumber} - {contact.name},{' '}
                        {contact.contactType}
                      </div>
                    ),
                  )}
                </>
              ),
            }}
            dismissible={false}
            scrollToTop={false}
          />
        )}
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
