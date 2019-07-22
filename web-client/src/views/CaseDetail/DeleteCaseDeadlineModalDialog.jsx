import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

class DeleteCaseDeadlineModalDialogComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'No, cancel',
      classNames: '',
      confirmLabel: 'Yes, remove',
      title: 'Are you sure you want to delete this deadline?',
    };
  }
  renderBody() {
    return (
      <>
        <label className="margin-right-2" htmlFor="deadline-to-delete">
          {this.props.form.month}/{this.props.form.day}/{this.props.form.year}
        </label>
        <span id="deadline-to-delete">{this.props.form.description}</span>
      </>
    );
  }
}

export const DeleteCaseDeadlineModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.deleteCaseDeadlineSequence,
    form: state.form,
  },
  DeleteCaseDeadlineModalDialogComponent,
);
