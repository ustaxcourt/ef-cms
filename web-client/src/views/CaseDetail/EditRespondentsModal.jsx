import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

class EditRespondentsModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: '',
      confirmLabel: 'Apply Changes',
      title: 'Edit Respondent Counsel',
    };
  }
  renderBody() {
    return <div className="ustc-create-order-modal">Edit Respondents!</div>;
  }
}

export const EditRespondentsModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    //confirmSequence: sequences.updateCaseDeadlineSequence, //TODO
    constants: state.constants,
    form: state.form,
    modal: state.modal,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  EditRespondentsModalComponent,
);
