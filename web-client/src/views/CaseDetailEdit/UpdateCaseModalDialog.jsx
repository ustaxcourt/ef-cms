import { Hint } from '../../ustc-ui/Hint/Hint';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const UpdateCaseModalDialog = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.submitUpdateCaseModalSequence,
    constants: state.constants,
    modal: state.modal,
    updateCaseModalHelper: state.updateCaseModalHelper,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  ({
    cancelSequence,
    confirmSequence,
    constants,
    modal,
    updateCaseModalHelper,
    updateModalValueSequence,
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
          <label className="usa-label" htmlFor="caption">
            Case caption
          </label>
          <textarea
            aria-labelledby="caption-label"
            className="caption usa-textarea"
            id="caption"
            name="caseCaption"
            value={modal.caseCaption}
            onChange={e =>
              updateModalValueSequence({
                key: e.target.name,
                value: e.target.value,
              })
            }
          />
        </div>
        {updateCaseModalHelper.showCalendaredAlert && (
          <Hint>
            This case is Calendared for trial. Changing the case status will
            remove this case from the current trial session.
          </Hint>
        )}
        <div className="margin-bottom-4">
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
            }}
          >
            <option value="">- Select -</option>
            {Object.keys(constants.STATUS_TYPES).map(key => (
              <option key={key} value={constants.STATUS_TYPES[key]}>
                {constants.STATUS_TYPES[key]}
              </option>
            ))}
          </select>
        </div>
        {updateCaseModalHelper.showAssociatedJudgeOptions && (
          <div className="margin-bottom-4">
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
          </div>
        )}
      </ModalDialog>
    );
  },
);
