import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const newMinuteSheetModalDeps = {
  clearModalFormSequence: sequences.clearModalFormSequence,
  form: state.modal.form,
  newMinuteSheetModalHelper: state.newMinuteSheetModalHelper,
  submitNewMinuteSheetSequence: sequences.submitNewMinuteSheetSequence,
  updateModalFormValueSequence: sequences.updateModalFormValueSequence,
  validateNewMinuteSheetModalSequence:
    sequences.validateNewMinuteSheetModalSequence,
  validationErrors: state.validationErrors,
};

export const NewMinuteSheetModal = connect(
  newMinuteSheetModalDeps,
  function NewMinuteSheetModal({
    clearModalFormSequence,
    form,
    newMinuteSheetModalHelper,
    submitNewMinuteSheetSequence,
    updateModalFormValueSequence,
    validateNewMinuteSheetModalSequence,
    validationErrors,
  }: {
    clearModalFormSequence: Function;
    form: { docketNumber?: string };
    newMinuteSheetModalHelper: {
      caseDetailLink: string | undefined;
      caseInfo: {
        docketNumber: string;
        docketNumberWithSuffix?: string;
        caseCaption?: string;
      } | null;
      consolidatedCaseMessage: string | undefined;
      hasValidationError: boolean;
      isConsolidatedCase: boolean;
      minuteSheetDocketNumber: string | undefined;
      showCaseLink: boolean;
    };
    submitNewMinuteSheetSequence: Function;
    updateModalFormValueSequence: Function;
    validateNewMinuteSheetModalSequence: Function;
    validationErrors: { docketNumber?: string };
  }) {
    return (
      <ConfirmModal
        cancelLabel="Close"
        className="new-minute-sheet-modal"
        confirmLabel="Add"
        showModalWhen="NewMinuteSheetModal"
        title="New Minutes Sheet"
        onCancelSequence={clearModalFormSequence}
        onConfirmSequence={submitNewMinuteSheetSequence}
      >
        <FormGroup
          errorMessageId="docket-number-error-message"
          errorText={validationErrors.docketNumber}
        >
          <label className="usa-label" htmlFor="docket-number">
            Docket Number
          </label>
          <input
            className="usa-input"
            data-testid="new-minute-sheet-docket-number-input"
            id="docket-number"
            name="docketNumber"
            type="text"
            value={form?.docketNumber || ''}
            onBlur={() => {
              validateNewMinuteSheetModalSequence();
            }}
            onChange={e => {
              updateModalFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>

        {newMinuteSheetModalHelper.showCaseLink &&
          newMinuteSheetModalHelper.caseInfo && (
            <div
              className="margin-top-2"
              data-testid="new-minute-sheet-case-link"
            >
              <CaseLink
                formattedCase={{
                  docketNumber:
                    newMinuteSheetModalHelper.caseInfo.docketNumber,
                  docketNumberWithSuffix:
                    newMinuteSheetModalHelper.caseInfo.docketNumberWithSuffix,
                }}
                target="_blank"
              />
            </div>
          )}

        {newMinuteSheetModalHelper.isConsolidatedCase &&
          newMinuteSheetModalHelper.consolidatedCaseMessage && (
            <div
              className="usa-alert usa-alert--info margin-top-2"
              data-testid="new-minute-sheet-consolidated-message"
            >
              <div className="usa-alert__body">
                <p className="usa-alert__text">
                  {newMinuteSheetModalHelper.consolidatedCaseMessage}
                </p>
              </div>
            </div>
          )}
      </ConfirmModal>
    );
  },
);

NewMinuteSheetModal.displayName = 'NewMinuteSheetModal';
