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
        <p className="semi-bold">Case Caption</p>
        <textarea
          className="caption"
          defaultValue={this.props.caseCaption}
          onChange={e =>
            this.props.setCaseCaptionSequence({ caseCaption: e.target.value })
          }
        />
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
