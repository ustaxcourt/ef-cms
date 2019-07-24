import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

class UpdateCaseCaptionModalDialogComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: '',
      confirmLabel: 'Save',
      title: 'Edit Case Caption',
    };
  }
  renderBody() {
    return (
      <div>
        <label className="usa-label" htmlFor="caption">
          Case Caption
        </label>
        <textarea
          aria-labelledby="caption-label"
          className="caption usa-textarea"
          defaultValue={this.props.caseCaption}
          id="caption"
          onChange={e =>
            this.props.setCaseCaptionSequence({ caseCaption: e.target.value })
          }
        />
        v. Commissioner of Internal Revenue, Respondent
      </div>
    );
  }
}

export const UpdateCaseCaptionModalDialog = connect(
  {
    cancelSequence: sequences.dismissCaseCaptionModalSequence,
    caseCaption: state.caseCaption,
    confirmSequence: sequences.updateCaseDetailSequence,
    setCaseCaptionSequence: sequences.setCaseCaptionSequence,
  },
  UpdateCaseCaptionModalDialogComponent,
);
