import { ConsolidatedCasesCheckboxes } from './ConsolidatedCasesCheckboxes';
import { Hint } from '../ustc-ui/Hint/Hint';
import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ConfirmInitiateServiceModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmInitiateServiceModalHelper: state.confirmInitiateServiceModalHelper,
    additionalServedCases:
      state.confirmInitiateServiceModalHelper.additionalServedCases,
    waitingForResponse: state.progressIndicator.waitingForResponse,
  },
  function ConfirmInitiateServiceModal(props: any) {
    const {
      cancelSequence,
      confirmInitiateServiceModalHelper,
      waitingForResponse,
      additionalServedCases,
    } = props;

    const confirmSequence = props.confirmSequence as any;
    const documentTitle = props.documentTitle as any;
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
          <strong>{documentTitle}</strong>
        </p>
        {additionalServedCases && additionalServedCases.length > 0 && (
          <div className="margin-bottom-2">
            <div>This document will also be served for:</div>
            <ul className="padding-left-2">
              {additionalServedCases.map(c => (
                <li key={c.docketNumber}>
                  {c.docketNumber} - {c.petitioners}
                </li>
              ))}
            </ul>
          </div>
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
