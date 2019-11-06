import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const UpdateCaseModalDialog = connect(
  {
    cancelSequence: sequences.dismissCaseCaptionModalSequence,
    caseCaption: state.caseCaption,
    confirmSequence: sequences.updateCaseDetailSequence,
    constants: state.constants,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  ({
    cancelSequence,
    caseCaption,
    confirmSequence,
    constants,
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
            defaultValue={caseCaption}
            id="caption"
            name="caseCaption"
            onChange={e =>
              updateModalValueSequence({
                key: e.target.name,
                value: e.target.value,
              })
            }
          />
        </div>
        <div className="margin-bottom-4">
          <label className="usa-label" htmlFor="caseStatusType">
            Case Status
          </label>
          <select
            className="case-status usa-select"
            id="caseStatusType"
            name="caseStatusType"
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
      </ModalDialog>
    );
  },
);
