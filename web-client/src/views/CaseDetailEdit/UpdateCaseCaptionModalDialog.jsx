import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const UpdateCaseCaptionModalDialog = connect(
  {
    cancelSequence: sequences.dismissCaseCaptionModalSequence,
    caseCaption: state.caseCaption,
    confirmSequence: sequences.updateCaseDetailSequence,
    setCaseCaptionSequence: sequences.setCaseCaptionSequence,
  },
  ({
    cancelSequence,
    caseCaption,
    confirmSequence,
    setCaseCaptionSequence,
  }) => {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Save"
        confirmSequence={confirmSequence}
        title="Edit Case Caption"
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
            onChange={e =>
              setCaseCaptionSequence({ caseCaption: e.target.value })
            }
          />
          v. Commissioner of Internal Revenue, Respondent
        </div>
      </ModalDialog>
    );
  },
);
