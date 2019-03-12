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
        <p>
          <strong>Case Caption</strong>
        </p>
        <textarea value={this.caseDetail.caseTitle} />
      </div>
    );
  }
}

export const UpdateCaseCaptionModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    caseDetail: state.formattedCaseDetail,
    confirmSequence: sequences.startACaseConfirmCancelSequence,
  },
  UpdateCaseCaptionModalDialogComponent,
);
