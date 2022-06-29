import { Hint } from '../ustc-ui/Hint/Hint';
import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const ConsolidatedCasesCheckboxes = ({
  consolidatedCaseAllCheckbox,
  consolidatedCaseCheckboxAllChange,
  formattedCaseDetail,
  updateCaseCheckbox,
}) => {
  return (
    <>
      <div className="usa-checkbox">
        <input
          checked={consolidatedCaseAllCheckbox}
          className="usa-checkbox__input"
          id="consolidated-case-checkbox-all"
          name="consolidated-case"
          type="checkbox"
          value="consolidated-case-checkbox-all"
          onChange={() => consolidatedCaseCheckboxAllChange()}
        />
        <label
          className="usa-checkbox__label"
          htmlFor="consolidated-case-checkbox-all"
        >
          All in the consolidated group
        </label>
      </div>

      {formattedCaseDetail.consolidatedCases.map(consolidatedCase => (
        <div
          className="usa-checkbox"
          key={consolidatedCase.docketNumber}
          title={consolidatedCase.tooltip}
        >
          <input
            checked={consolidatedCase.checked}
            className="usa-checkbox__input"
            disabled={consolidatedCase.checkboxDisabled}
            id={'consolidated-case-checkbox-' + consolidatedCase.docketNumber}
            name="consolidated-case"
            type="checkbox"
            value={consolidatedCase.docketNumber}
            onChange={event =>
              updateCaseCheckbox({
                docketNumber: event.target.value,
              })
            }
          />
          <label
            className="usa-checkbox__label"
            htmlFor={
              'consolidated-case-checkbox-' + consolidatedCase.docketNumber
            }
          >
            {consolidatedCase.docketNumber}{' '}
            {consolidatedCase.formattedPetitioners}
          </label>
        </div>
      ))}
    </>
  );
};

export const ConfirmInitiateServiceModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmInitiateServiceModalHelper: state.confirmInitiateServiceModalHelper,
    confirmSequence: props.confirmSequence,
    consolidatedCaseAllCheckbox: state.consolidatedCaseAllCheckbox,
    consolidatedCaseCheckboxAllChange:
      sequences.consolidatedCaseCheckboxAllChangeSequence,
    documentTitle: props.documentTitle,
    formattedCaseDetail: state.formattedCaseDetail,
    serveCourtIssuedDocumentFromDocketEntrySequence:
      sequences.serveCourtIssuedDocumentFromDocketEntrySequence,
    updateCaseCheckbox: sequences.updateCaseCheckboxSequence,
    waitingForResponse: state.progressIndicator.waitingForResponse,
  },
  function ConfirmInitiateServiceModal({
    cancelSequence,
    confirmInitiateServiceModalHelper,
    confirmSequence,
    consolidatedCaseAllCheckbox,
    consolidatedCaseCheckboxAllChange,
    documentTitle,
    formattedCaseDetail,
    serveCourtIssuedDocumentFromDocketEntrySequence,
    updateCaseCheckbox,
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
            : serveCourtIssuedDocumentFromDocketEntrySequence();
        }}
        disableSubmit={waitingForResponse || isSubmitDebounced}
        title="Are You Ready to Initiate Service?"
      >
        <p className="margin-bottom-1">
          The following document will be served on all parties in selected
          cases:
        </p>
        <p className="margin-top-0 margin-bottom-2">
          <strong>{documentTitle}</strong>
        </p>
        {confirmInitiateServiceModalHelper.showPaperAlert && (
          <Hint exclamation fullWidth className="block">
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
        {confirmInitiateServiceModalHelper.showConsolidatedCasesFlag && (
          <ConsolidatedCasesCheckboxes
            consolidatedCaseAllCheckbox={consolidatedCaseAllCheckbox}
            consolidatedCaseCheckboxAllChange={
              consolidatedCaseCheckboxAllChange
            }
            formattedCaseDetail={formattedCaseDetail}
            updateCaseCheckbox={updateCaseCheckbox}
          />
        )}
      </ModalDialog>
    );
  },
);
