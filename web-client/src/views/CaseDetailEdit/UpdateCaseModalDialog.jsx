import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const UpdateCaseModalDialog = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.submitUpdateCaseModalSequence,
    modal: state.modal,
    updateCaseModalHelper: state.updateCaseModalHelper,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateUpdateCaseModalSequence: sequences.validateUpdateCaseModalSequence,
    validationErrors: state.validationErrors,
  },
  ({
    cancelSequence,
    confirmSequence,
    modal,
    updateCaseModalHelper,
    updateModalValueSequence,
    validateUpdateCaseModalSequence,
    validationErrors,
  }) => {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Save"
        confirmSequence={confirmSequence}
        title="Edit Case"
      >
        <div className="margin-bottom-2">
          <FormGroup errorText={validationErrors.caseCaption}>
            <label className="usa-label" htmlFor="caption">
              Case caption
            </label>
            <textarea
              aria-labelledby="caption-label"
              className="caption usa-textarea"
              id="caption"
              name="caseCaption"
              value={modal.caseCaption}
              onChange={e => {
                updateModalValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
                validateUpdateCaseModalSequence();
              }}
            />
          </FormGroup>
        </div>
        {updateCaseModalHelper.showCalendaredAlert && (
          <Hint>
            This case is Calendared for trial. Changing the case status will
            remove this case from the current trial session.
          </Hint>
        )}
        <div className="margin-bottom-4">
          <FormGroup errorText={validationErrors.caseStatus}>
            <label className="usa-label" htmlFor="caseStatus">
              Case Status
            </label>
            <select
              className="case-status usa-select"
              id="caseStatus"
              name="caseStatus"
              value={modal.caseStatus}
              onChange={e => {
                updateModalValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
                validateUpdateCaseModalSequence();
              }}
            >
              <option value="">- Select -</option>
              {updateCaseModalHelper.caseStatusOptions.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </FormGroup>
        </div>
        {updateCaseModalHelper.showAssociatedJudgeOptions && (
          <div className="margin-bottom-4">
            <FormGroup errorText={validationErrors.associatedJudge}>
              <label className="usa-label" htmlFor="associated-judge">
                Associated Judge
              </label>
              <select
                className="case-status usa-select"
                id="associated-judge"
                name="associatedJudge"
                value={modal.associatedJudge}
                onChange={e => {
                  updateModalValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateUpdateCaseModalSequence();
                }}
              >
                <option value="">- Select -</option>
                <option value="Chief Judge">Chief Judge</option>
                {modal.judgeUsers.map(judgeUser => (
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
