import { sequences, state } from 'cerebral';

import { ModalDialog } from '../ModalDialog';
import React from 'react';
import { connect } from '@cerebral/react';

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
        <label htmlFor="caption">Case Caption</label>
        <textarea
          id="caption"
          className="caption"
          defaultValue={this.props.caseCaption}
          aria-labelledby="caption-label"
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
