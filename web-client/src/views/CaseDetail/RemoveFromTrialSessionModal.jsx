import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

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

        {removeFromTrialSessionModalHelper.showCaseStatusDropdown && (
          <div className="margin-bottom-4">
            <FormGroup errorText={validationErrors.caseStatus}>
              <label
                className="usa-label"
                htmlFor="caseStatus"
                id="case-status"
              >
                Case status{' '}
              </label>
              <select
                aria-labelledby="case-status"
                className={classNames(
                  'usa-select',
                  validationErrors.caseStatus && 'usa-select--error',
                )}
                id="Status"
                name="caseStatus"
                value={modal.caseStatus}
                onChange={e => {
                  updateModalValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
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
              </select>
            </FormGroup>
          </div>
        )}

        {removeFromTrialSessionModalHelper.showAssociatedJudgeDropdown && (
          <div className="margin-bottom-4">
            <FormGroup errorText={validationErrors.associatedJudge}>
              <label className="usa-label" htmlFor="associated-judge">
                Associated Judge
              </label>
              <select
                className={classNames(
                  'usa-select',
                  validationErrors.associatedJudge && 'usa-select--error',
                )}
                id="associated-judge"
                name="associatedJudge"
                value={modal.associatedJudge}
                onChange={e => {
                  updateModalValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateRemoveFromTrialSessionSequence();
                }}
              >
                <option value="">- Select -</option>
                <option value="Chief Judge">Chief Judge</option>
                {modal.judges.map(judgeUser => (
                  <option key={judgeUser.userId} value={judgeUser.name}>
                    {judgeUser.name}
                  </option>
                ))}
              </select>
            </FormGroup>
          </div>
        )}
      </ModalDialog>
    );
  },
);
