import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const UpdateCaseModalDialog = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.submitUpdateCaseModalSequence,
    constants: state.constants,
    modal: state.modal,
    newStatus: state.constants.STATUS_TYPES.new,
    updateCaseModalHelper: state.updateCaseModalHelper,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateUpdateCaseModalSequence: sequences.validateUpdateCaseModalSequence,
    validationErrors: state.validationErrors,
  },
  function UpdateCaseModalDialog({
    cancelSequence,
    confirmSequence,
    constants,
    modal,
    newStatus,
    updateCaseModalHelper,
    updateModalValueSequence,
    validateUpdateCaseModalSequence,
    validationErrors,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
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
            <span className="display-inline-block margin-top-1">
              {constants.CASE_CAPTION_POSTFIX}
            </span>
          </FormGroup>
        </div>
        {updateCaseModalHelper.showCalendaredAlert && (
          <Hint>
            This case is Calendared for trial. Remove the case from its trial
            session to update the case status.
          </Hint>
        )}
        {updateCaseModalHelper.showCaseStatusDropdown && (
          <div className="margin-bottom-4">
            <FormGroup errorText={validationErrors.caseStatus}>
              <label className="usa-label" htmlFor="caseStatus">
                Case status
              </label>
              <select
                className="case-status usa-select"
                data-testid="case-status-select"
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
                {updateCaseModalHelper.showNewStatusOption && (
                  <option value={newStatus}>{newStatus}</option>
                )}
                {updateCaseModalHelper.caseStatusOptions.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </FormGroup>
          </div>
        )}
        {updateCaseModalHelper.showAssociatedJudgeOptions && (
          <div className="margin-bottom-4">
            <FormGroup errorText={validationErrors.associatedJudge}>
              <label className="usa-label" htmlFor="associated-judge">
                Associated Judge
              </label>
              <select
                className="case-status usa-select"
                data-testid="associated-judge-select"
                id="associated-judge"
                name="associatedJudge"
                value={modal.associatedJudgeId}
                onChange={e => {
                  const selectedJudgeid = e.target.value;
                  const selectedJudge =
                    modal.judges.find(
                      judge => judge.userId === selectedJudgeid,
                    ) || {};
                  updateModalValueSequence({
                    key: e.target.name,
                    value: selectedJudge.name,
                  });
                  updateModalValueSequence({
                    key: 'associatedJudgeId',
                    value: selectedJudge.userId,
                  });
                  validateUpdateCaseModalSequence();
                }}
              >
                <option value="">- Select -</option>
                <option value="Chief Judge">Chief Judge</option>
                {modal.judges.map(judgeUser => (
                  <option key={judgeUser.userId} value={judgeUser.userId}>
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

UpdateCaseModalDialog.displayName = 'UpdateCaseModalDialog';
