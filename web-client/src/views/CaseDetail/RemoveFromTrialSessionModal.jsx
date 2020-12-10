import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const RemoveFromTrialSessionModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.removeCaseFromTrialSequence,
    modal: state.modal,
    removeFromTrialSessionModalHelper: state.removeFromTrialSessionModalHelper,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateRemoveFromTrialSessionSequence:
      sequences.validateRemoveFromTrialSessionSequence,
    validationErrors: state.validationErrors,
  },
  function RemoveFromTrialSessionModal({
    cancelSequence,
    confirmSequence,
    modal,
    removeFromTrialSessionModalHelper,
    updateModalValueSequence,
    validateRemoveFromTrialSessionSequence,
    validationErrors,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Remove Case"
        confirmSequence={confirmSequence}
        title="Remove From Trial Session"
      >
        <div className="margin-bottom-4" id="remove-from-trial-session-modal">
          <div className="margin-bottom-2">
            This case will be removed from this trial session.{' '}
          </div>

          <FormGroup errorText={validationErrors.disposition}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="display-block" id="disposition-legend">
                Disposition
              </legend>
              <textarea
                aria-label="remove from trial session"
                className="usa-textarea"
                id="disposition"
                maxLength="120"
                name="disposition"
                type="text"
                value={modal.disposition}
                onChange={e => {
                  updateModalValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateRemoveFromTrialSessionSequence();
                }}
              />
            </fieldset>
          </FormGroup>
        </div>

        <div className="margin-bottom-4">
          <FormGroup errorText={validationErrors.caseStatus}>
            <label className="usa-label" htmlFor="caseStatus">
              Case status{' '}
            </label>
            <BindedSelect
              bind="modal.caseStatus"
              className="case-status"
              id="case-status"
              name="caseStatus"
              onChange={() => {
                validateRemoveFromTrialSessionSequence();
              }}
            >
              {removeFromTrialSessionModalHelper.caseStatusOptions.map(
                status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ),
              )}
            </BindedSelect>
          </FormGroup>
        </div>

        <div className="margin-bottom-4">
          <FormGroup errorText={validationErrors.associatedJudge}>
            <label className="usa-label" htmlFor="caseStatus">
              Associated Judge{' '}
              {!removeFromTrialSessionModalHelper.associatedJudgeRequired && (
                <span className="usa-hint">(optional)</span>
              )}
            </label>
            <input
              className="usa-input"
              id="associatedJudge"
              name="associatedJudge"
              required={
                removeFromTrialSessionModalHelper.associatedJudgeRequired
              }
              type="text"
              value={modal.documentTitle || ''}
              onChange={e => {
                updateModalValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
                validateRemoveFromTrialSessionSequence();
              }}
            />
          </FormGroup>
        </div>
      </ModalDialog>
    );
  },
);
