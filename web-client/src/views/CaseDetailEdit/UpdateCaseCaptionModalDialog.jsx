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
        <textarea className="caption" value={this.caseCaption} />
      </div>
    );
  }
}

export const UpdateCaseCaptionModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    caseCaption: state.caseCaption,
    confirmSequence: sequences.startACaseConfirmCancelSequence,
  },
  UpdateCaseCaptionModalDialogComponent,
);
